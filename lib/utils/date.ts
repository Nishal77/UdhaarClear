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
  return hour >= 9 && hour < 19
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
