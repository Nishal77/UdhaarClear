/**
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest'
import * as XLSX from 'xlsx'
import { parseTallyImportFile } from '@/lib/import/tally-import'

/** Builds an in-memory .xlsx buffer from plain row objects, just like a real Tally/Excel export. */
function buildWorkbookBuffer(rows: Record<string, unknown>[]): Buffer {
  const sheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1')
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

describe('parseTallyImportFile', () => {
  it('parses a well-formed export with standard Tally-style headers', () => {
    const buffer = buildWorkbookBuffer([
      { 'Party Name': 'Ramesh Traders', Mobile: '9876543210', Amount: '15000', Date: '01-06-2026', 'Due Date': '01-07-2026' },
    ])

    const { rows, errors } = parseTallyImportFile(buffer)

    expect(errors).toHaveLength(0)
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      customerName: 'Ramesh Traders',
      phone: '+919876543210',
      amount: 15000,
    })
  })

  it('matches alternate column header names (aliases)', () => {
    const buffer = buildWorkbookBuffer([
      { 'Customer Name': 'Sunita Fabrics', 'Contact Number': '9123456780', 'Bill Amount': '8500' },
    ])

    const { rows, errors } = parseTallyImportFile(buffer)

    expect(errors).toHaveLength(0)
    expect(rows[0].customerName).toBe('Sunita Fabrics')
    expect(rows[0].phone).toBe('+919123456780')
    expect(rows[0].amount).toBe(8500)
  })

  it('defaults due date to 30 days after invoice date when no due date column is given', () => {
    const buffer = buildWorkbookBuffer([
      { 'Party Name': 'Bharat Steel', Mobile: '9988776655', Amount: '20000', Date: '01-01-2026' },
    ])

    const { rows } = parseTallyImportFile(buffer)

    const expectedDue = new Date(2026, 0, 31) // 01 Jan 2026 + 30 days
    expect(rows[0].dueDate.toDateString()).toBe(expectedDue.toDateString())
  })

  it('reports a file-level error when the phone column is entirely missing', () => {
    const buffer = buildWorkbookBuffer([
      { 'Party Name': 'Ramesh Traders', Amount: '15000' },
    ])

    const { rows, errors } = parseTallyImportFile(buffer)

    expect(rows).toHaveLength(0)
    expect(errors[0].reason).toContain('phone number column')
  })

  it('skips only the bad row and keeps importing valid ones', () => {
    const buffer = buildWorkbookBuffer([
      { 'Party Name': 'Good Customer', Mobile: '9876543210', Amount: '15000' },
      { 'Party Name': 'Bad Customer', Mobile: '', Amount: '5000' }, // missing phone
      { 'Party Name': 'Another Good One', Mobile: '9123456789', Amount: '7000' },
    ])

    const { rows, errors } = parseTallyImportFile(buffer)

    expect(rows).toHaveLength(2)
    expect(rows.map((r) => r.customerName)).toEqual(['Good Customer', 'Another Good One'])
    expect(errors).toHaveLength(1)
    expect(errors[0].reason).toContain('Missing phone number for "Bad Customer"')
    // Row 3 in the spreadsheet (header=1, first data row=2) — confirms the
    // bad row didn't shift row numbering for rows after it.
    expect(errors[0].rowNumber).toBe(3)
  })

  it('rejects an invalid amount without dropping the whole file', () => {
    const buffer = buildWorkbookBuffer([
      { 'Party Name': 'Ramesh Traders', Mobile: '9876543210', Amount: 'not-a-number' },
    ])

    const { rows, errors } = parseTallyImportFile(buffer)

    expect(rows).toHaveLength(0)
    expect(errors[0].reason).toContain('Invalid or missing amount')
  })
})
