import { format, differenceInDays, parseISO, isValid } from 'date-fns'

export const IST_OFFSET = 5.5 * 60 * 60 * 1000

export function toIST(date: Date): Date {
  return new Date(date.getTime() + IST_OFFSET)
}

export function nowIST(): Date {
  return toIST(new Date())
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return ''
  return format(d, 'dd/MM/yyyy')
}

export function formatDateLong(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return ''
  return format(d, 'd MMM yyyy')
}

export function daysOverdue(dueDate: Date | string): number {
  const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  return differenceInDays(today, due)
}

export function isSunday(date: Date = new Date()): boolean {
  return date.getDay() === 0
}

export function isWithinBusinessHours(date: Date = new Date()): boolean {
  const istDate = toIST(date)
  const hour = istDate.getUTCHours()
  return hour >= 8 && hour < 19
}

// Major Indian national holidays/festivals — RBI recovery-conduct framework
// (product.md §3.2) requires suppressing automated contact on these days.
// ponytail: static per-year list, not a full calendar API. Add next year's
// dates each December; state-level variation not handled (national only).
const INDIAN_HOLIDAYS: Record<string, string[]> = {
  '2026': [
    '2026-01-01', '2026-01-14', '2026-01-26', '2026-03-04', '2026-03-21',
    '2026-04-03', '2026-04-14', '2026-05-01', '2026-08-15', '2026-08-28',
    '2026-10-02', '2026-10-20', '2026-11-08', '2026-12-25',
  ],
  '2027': [
    '2027-01-01', '2027-01-26', '2027-08-15', '2027-10-02', '2027-12-25',
  ],
}

export function isIndianHoliday(date: Date = new Date()): boolean {
  const istDate = toIST(date)
  const iso = istDate.toISOString().slice(0, 10)
  const year = iso.slice(0, 4)
  return (INDIAN_HOLIDAYS[year] ?? []).includes(iso)
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Parses a date string in whatever format a human (or Tally/Excel export)
 * throws at it — DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD, or anything the native
 * JS Date parser understands. Falls back to `daysFromNow` days in the future
 * if the string is missing or unparseable, so a bad date never crashes an
 * invoice creation — used by both the WhatsApp bot's "New invoice" command
 * and the Tally/Excel bulk importer.
 */
export function parseFlexibleDate(dateStr: string | undefined | null, daysFromNow = 30): Date {
  const fallback = addDays(new Date(), daysFromNow)

  if (!dateStr || !dateStr.trim()) return fallback

  const cleaned = dateStr.trim()

  // DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = cleaned.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    if (!isNaN(date.getTime())) return date
  }

  // YYYY-MM-DD or YYYY/MM/DD
  const ymdMatch = cleaned.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
  if (ymdMatch) {
    const [, year, month, day] = ymdMatch
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    if (!isNaN(date.getTime())) return date
  }

  // Fallback to native JS parser (e.g. "15 Jul 2026", ISO with time, etc.)
  const nativeDate = new Date(cleaned)
  if (!isNaN(nativeDate.getTime())) return nativeDate

  return fallback
}
