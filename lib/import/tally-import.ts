import * as XLSX from 'xlsx'
import { parseFlexibleDate, addDays } from '@/lib/utils/date'
import { normalizeIndianPhone, isValidIndianPhone } from '@/lib/utils/phone'

export interface ParsedInvoiceRow {
  rowNumber: number // 1-indexed spreadsheet row, for error messages (header = row 1)
  customerName: string
  phone: string
  amount: number
  invoiceNumber: string | null
  invoiceDate: Date
  dueDate: Date
}

export interface RowError {
  rowNumber: number
  reason: string
}

export interface ParseResult {
  rows: ParsedInvoiceRow[]
  errors: RowError[]
}

type RequiredField = 'customerName' | 'phone' | 'amount'
type OptionalField = 'invoiceNumber' | 'invoiceDate' | 'dueDate'
type ImportField = RequiredField | OptionalField

// Column header aliases — Tally's own export naming varies by report type,
// and plain Excel sheets use whatever the business owner typed. We match
// loosely (lowercased, punctuation stripped) against every known alias
// instead of requiring one exact header name.
const HEADER_ALIASES: Record<ImportField, string[]> = {
  customerName: ['partyname', 'customername', 'name', 'buyername', 'ledgername'],
  phone: ['phone', 'mobile', 'mobileno', 'contactnumber', 'phonenumber', 'contact'],
  amount: ['amount', 'billamount', 'invoiceamount', 'value', 'grandtotal'],
  invoiceNumber: ['voucherno', 'invoiceno', 'invoicenumber', 'billno', 'voucher'],
  invoiceDate: ['date', 'invoicedate', 'voucherdate', 'billdate'],
  dueDate: ['duedate', 'dueon', 'paymentduedate'],
}

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/** Maps each known field to whichever exact header string this file uses for it, if any. */
function matchHeaders(headers: string[]): Partial<Record<ImportField, string>> {
  const normalizedHeaders = headers.map((h) => ({ original: h, normalized: normalizeHeader(h) }))
  const matched: Partial<Record<ImportField, string>> = {}

  for (const field of Object.keys(HEADER_ALIASES) as ImportField[]) {
    const found = normalizedHeaders.find((h) => HEADER_ALIASES[field].includes(h.normalized))
    if (found) matched[field] = found.original
  }

  return matched
}

function readCell(row: Record<string, unknown>, header: string | undefined): string {
  if (!header) return ''
  const value = row[header]
  return value === null || value === undefined ? '' : String(value).trim()
}

/**
 * Parses a Tally or Excel invoice export (.xlsx, .xls, or .csv) into rows
 * ready to create as customers + invoices.
 *
 * Phone number is mandatory, even though many Tally ledger exports omit it:
 * a customer UdhaarClear can't message on WhatsApp can never be chased
 * automatically, which is the entire point of the product. Rows missing a
 * valid phone are reported as errors instead of silently imported with no
 * way to ever remind them.
 */
export function parseTallyImportFile(buffer: Buffer): ParseResult {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null, raw: false })

  if (rawRows.length === 0) {
    return { rows: [], errors: [{ rowNumber: 0, reason: 'File has no data rows' }] }
  }

  const columns = matchHeaders(Object.keys(rawRows[0]))
  const missingColumnErrors = validateRequiredColumns(columns)
  if (missingColumnErrors.length > 0) {
    return { rows: [], errors: missingColumnErrors }
  }

  const rows: ParsedInvoiceRow[] = []
  const errors: RowError[] = []

  rawRows.forEach((row, index) => {
    const rowNumber = index + 2 // +1 for the header row, +1 to make it 1-indexed
    const parsed = parseRow(row, columns, rowNumber)
    if ('error' in parsed) {
      errors.push(parsed.error)
    } else {
      rows.push(parsed.row)
    }
  })

  return { rows, errors }
}

function validateRequiredColumns(columns: Partial<Record<ImportField, string>>): RowError[] {
  const errors: RowError[] = []
  if (!columns.customerName) {
    errors.push({ rowNumber: 0, reason: 'Could not find a customer name column (expected "Party Name" or similar)' })
  }
  if (!columns.phone) {
    errors.push({ rowNumber: 0, reason: 'Could not find a phone number column (expected "Mobile" or similar) — required so reminders can be sent' })
  }
  if (!columns.amount) {
    errors.push({ rowNumber: 0, reason: 'Could not find an amount column (expected "Amount" or similar)' })
  }
  return errors
}

function parseRow(
  row: Record<string, unknown>,
  columns: Partial<Record<ImportField, string>>,
  rowNumber: number
): { row: ParsedInvoiceRow } | { error: RowError } {
  const customerName = readCell(row, columns.customerName)
  if (!customerName) {
    return { error: { rowNumber, reason: 'Missing customer name' } }
  }

  const phoneRaw = readCell(row, columns.phone)
  if (!phoneRaw) {
    return { error: { rowNumber, reason: `Missing phone number for "${customerName}"` } }
  }
  if (!isValidIndianPhone(phoneRaw)) {
    return { error: { rowNumber, reason: `Invalid phone number "${phoneRaw}" for "${customerName}"` } }
  }
  const phone = normalizeIndianPhone(phoneRaw)

  const amountText = readCell(row, columns.amount).replace(/[^0-9.]/g, '')
  const amount = parseFloat(amountText)
  if (!amount || amount <= 0) {
    return { error: { rowNumber, reason: `Invalid or missing amount for "${customerName}"` } }
  }

  // Invoice date defaults to today if not given; due date defaults to
  // 30 days after the invoice date (Tally's standard credit period) if not
  // given, rather than 30 days from today — otherwise a backdated import
  // would always look artificially "not yet due".
  const invoiceDateText = readCell(row, columns.invoiceDate)
  const invoiceDate = invoiceDateText ? parseFlexibleDate(invoiceDateText, 0) : new Date()

  const dueDateText = readCell(row, columns.dueDate)
  const dueDate = dueDateText ? parseFlexibleDate(dueDateText, 30) : addDays(invoiceDate, 30)

  const invoiceNumber = readCell(row, columns.invoiceNumber) || null

  return {
    row: { rowNumber, customerName, phone, amount, invoiceNumber, invoiceDate, dueDate },
  }
}
