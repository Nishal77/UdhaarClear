import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'
import { parseTallyImportFile, type ParsedInvoiceRow, type RowError } from '@/lib/import/tally-import'
import { PLAN_LIMITS } from '@/lib/plans'

export interface BulkImportResult {
  invoicesCreated: number
  customersCreated: number
  skipped: number
  rowErrors: RowError[]
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB — plenty for a spreadsheet, not for accidental huge uploads

/**
 * POST /api/invoices/bulk-import
 *
 * Accepts a Tally or Excel export (.xlsx, .xls, .csv) as multipart form data
 * under the "file" field, and bulk-creates customers + invoices from it.
 * This is the "every Tally user can migrate instantly" distribution hook
 * from the PRD — available on Growth/CA_PRO plans only (see PLAN_LIMITS).
 */
export async function POST(request: Request) {
  try {
    const session = await getBusinessFromSession()
    if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

    const planTier = session.planTier as keyof typeof PLAN_LIMITS
    if (!PLAN_LIMITS[planTier].tallyImport) {
      return apiError('PLAN_LIMIT_REACHED', 'Tally/Excel import is available on Growth and Enterprise plans', 402)
    }

    const formData = await request.formData()
    const file = formData.get('file')
    if (!file || !(file instanceof File)) {
      return apiError('VALIDATION_ERROR', 'No file uploaded — expected a "file" field', 400)
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return apiError('VALIDATION_ERROR', 'File too large — maximum size is 5MB', 400)
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    let parsed: ReturnType<typeof parseTallyImportFile>
    try {
      parsed = parseTallyImportFile(buffer)
    } catch {
      return apiError('VALIDATION_ERROR', 'Could not read this file — is it a valid .xlsx, .xls, or .csv export?', 400)
    }

    // A parse-level error (e.g. missing required column) applies to the whole
    // file, not a specific row — nothing to import, report it directly.
    if (parsed.rows.length === 0 && parsed.errors.length > 0 && parsed.errors[0].rowNumber === 0) {
      return apiError('VALIDATION_ERROR', parsed.errors[0].reason, 400)
    }

    const existingInvoiceCount = await prisma.invoice.count({ where: { businessId: session.businessId } })
    const invoiceLimit = PLAN_LIMITS[planTier].invoices
    const remainingCapacity = invoiceLimit - existingInvoiceCount

    if (remainingCapacity <= 0) {
      return apiError('PLAN_LIMIT_REACHED', 'Invoice limit reached for your plan — upgrade to import more', 402)
    }

    const rowsToImport = parsed.rows.slice(0, remainingCapacity)
    const rowsOverLimit = parsed.rows.slice(remainingCapacity)

    const result: BulkImportResult = {
      invoicesCreated: 0,
      customersCreated: 0,
      skipped: 0,
      rowErrors: [...parsed.errors],
    }

    for (const overLimitRow of rowsOverLimit) {
      result.skipped++
      result.rowErrors.push({ rowNumber: overLimitRow.rowNumber, reason: 'Skipped — plan invoice limit reached' })
    }

    for (const row of rowsToImport) {
      try {
        const wasNewCustomer = await importRow(session.businessId, row)
        result.invoicesCreated++
        if (wasNewCustomer) result.customersCreated++
      } catch (err) {
        result.skipped++
        result.rowErrors.push({
          rowNumber: row.rowNumber,
          reason: err instanceof Error ? err.message : 'Failed to create invoice',
        })
      }
    }

    return apiSuccess(result)
  } catch (err) {
    console.error('Bulk import error:', err)
    return apiError('INTERNAL_SERVER_ERROR', err instanceof Error ? err.message : 'Something went wrong', 500)
  }
}

/** Creates (or reuses) the customer and creates the invoice for one parsed row. Returns whether a new customer was created. */
async function importRow(businessId: string, row: ParsedInvoiceRow): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const existingCustomer = await tx.customer.findUnique({
      where: { businessId_phone: { businessId, phone: row.phone } },
    })

    const customer =
      existingCustomer ??
      (await tx.customer.create({
        data: { businessId, name: row.customerName, phone: row.phone },
      }))

    await tx.invoice.create({
      data: {
        businessId,
        customerId: customer.id,
        invoiceNumber: row.invoiceNumber ?? `TALLY-${Date.now()}-${row.rowNumber}`,
        amount: row.amount,
        invoiceDate: row.invoiceDate,
        dueDate: row.dueDate,
        status: 'PENDING',
        autoReminder: true,
      },
    })

    return !existingCustomer
  })
}
