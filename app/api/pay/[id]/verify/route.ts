/**
 * POST /api/pay/[id]/verify
 * Public endpoint — called when a customer clicks "I've made the transfer".
 * Marks the invoice as PARTIALLY_PAID with a pending manual verification note.
 * A cron/admin flow later confirms the bank credit and upgrades to PAID.
 */
import { prisma } from '@/lib/prisma/client'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { z } from 'zod'

const verifySchema = z.object({
  transferRef: z.string().optional(),   // UTR number / transaction ref
  transferredAmount: z.number().positive(),
  payerName: z.string().optional(),
  payerBank: z.string().optional(),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    select: { id: true, status: true, amount: true, businessId: true },
  })

  if (!invoice) return apiError('NOT_FOUND', 'Invoice not found', 404)
  if (invoice.status === 'PAID') return apiError('ALREADY_PAID', 'Invoice is already fully paid', 400)
  if (invoice.status === 'WRITTEN_OFF') return apiError('INVALID', 'Invoice has been written off', 400)

  const body = await request.json()
  const parsed = verifySchema.safeParse(body)
  if (!parsed.success) return apiError('VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten())

  const { transferRef, transferredAmount, payerName, payerBank } = parsed.data

  // Mark as PARTIALLY_PAID — admin/cron confirms later via bank statement.
  // autoReminder: false stops the reminder engine from firing while the
  // transfer is sitting in PENDING_VERIFICATION state. Without this, the
  // customer gets chased for an invoice they've already paid.
  await prisma.invoice.update({
    where: { id },
    data: {
      status: 'PARTIALLY_PAID',
      paidAmount: transferredAmount,
      paymentMethod: payerBank ? `NEFT/RTGS via ${payerBank}` : 'NEFT/RTGS',
      paymentRef: transferRef ?? 'PENDING_VERIFICATION',
      autoReminder: false,
    },
  })

  // Log a reminder record so the activity feed shows the transfer attempt
  await prisma.reminder.create({
    data: {
      businessId: invoice.businessId,
      invoiceId: invoice.id,
      channel: 'WHATSAPP',
      tone: 'GENTLE',
      templateName: 'transfer_verification_pending',
      messageBody: `Customer self-reported bank transfer of ₹${transferredAmount.toLocaleString('en-IN')}${transferRef ? ` (Ref: ${transferRef})` : ''}${payerName ? ` from ${payerName}` : ''}. Awaiting confirmation.`,
      dayOverdue: 0,
      status: 'SENT',
      triggeredBy: 'MANUAL',
    },
  })

  return apiSuccess({ message: 'Transfer recorded. We will confirm within 1 business day.' })
}
