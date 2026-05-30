import { ReminderTone } from '@prisma/client'

export const REMINDER_SCHEDULE_DAYS = [-3, 0, 3, 7, 15, 30, 45]

export function selectTone(daysOverdue: number, configuredTone: ReminderTone): ReminderTone {
  if (configuredTone === 'LEGAL') return 'LEGAL'
  if (daysOverdue <= 7) return 'GENTLE'
  if (daysOverdue <= 21) return 'FIRM'
  return 'LEGAL'
}

export function isReminderDay(daysOverdue: number): boolean {
  return REMINDER_SCHEDULE_DAYS.includes(daysOverdue)
}
