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
