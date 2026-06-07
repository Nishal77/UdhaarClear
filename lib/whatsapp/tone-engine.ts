import { ReminderTone } from '@prisma/client'

/**
 * 11-touch reminder cadence:
 *
 *  Gentle   (days -3 → +7) :  -3, 0, +3, +7
 *  Firm     (days +8 → +44):  +10, +15, +21, +30
 *  Legal    (days +45 → +60): +45, +60
 *  Auto-pause after day +67  (no further automated sends)
 */
export const REMINDER_SCHEDULE_DAYS = [-3, 0, 3, 7, 10, 15, 21, 30, 45, 60] as const

export type ReminderScheduleDay = (typeof REMINDER_SCHEDULE_DAYS)[number]

/** After this many days overdue, auto-reminders are paused permanently. */
export const AUTO_PAUSE_AFTER_DAYS = 67

/** Tone phase boundaries (inclusive lower bound). */
const GENTLE_MAX_DAYS = 7   // days -3 → +7
const FIRM_MAX_DAYS   = 44  // days +8 → +44
// Legal: days +45+

/** Visual phase label — used by UI and analytics. */
export type ReminderPhase = 'GENTLE' | 'FIRM' | 'LEGAL' | 'PAUSED'

/**
 * Returns the automated tone for a given daysOverdue value.
 *
 * Rules (in priority order):
 * 1. If the invoice-level `configuredTone` is LEGAL → always LEGAL.
 * 2. If `daysOverdue > AUTO_PAUSE_AFTER_DAYS` → no reminder should fire;
 *    callers should call `shouldAutoPause()` first.
 * 3. Gentle  ≤ 7 days
 * 4. Firm    8–44 days
 * 5. Legal   45+ days
 */
export function selectTone(daysOverdue: number, configuredTone: ReminderTone): ReminderTone {
  if (configuredTone === 'LEGAL') return 'LEGAL'
  if (daysOverdue <= GENTLE_MAX_DAYS) return 'GENTLE'
  if (daysOverdue <= FIRM_MAX_DAYS)   return 'FIRM'
  return 'LEGAL'
}

/**
 * Returns true if today is a scheduled reminder day.
 */
export function isReminderDay(daysOverdue: number): boolean {
  return (REMINDER_SCHEDULE_DAYS as readonly number[]).includes(daysOverdue)
}

/**
 * Returns true when the invoice has passed the auto-pause threshold.
 * The cron job must call this before dispatching any automated reminder.
 */
export function shouldAutoPause(daysOverdue: number): boolean {
  return daysOverdue > AUTO_PAUSE_AFTER_DAYS
}

/**
 * Returns the human-readable phase for a given overdue count.
 * Used by the UI timeline and the reminder log.
 */
export function getReminderPhase(daysOverdue: number): ReminderPhase {
  if (daysOverdue > AUTO_PAUSE_AFTER_DAYS) return 'PAUSED'
  if (daysOverdue <= GENTLE_MAX_DAYS)      return 'GENTLE'
  if (daysOverdue <= FIRM_MAX_DAYS)        return 'FIRM'
  return 'LEGAL'
}

/**
 * Returns the next scheduled reminder day from the current day,
 * or `null` if no further reminders are scheduled.
 */
export function getNextReminderDay(daysOverdue: number): number | null {
  const next = (REMINDER_SCHEDULE_DAYS as readonly number[]).find((d) => d > daysOverdue)
  if (next === undefined || next > AUTO_PAUSE_AFTER_DAYS) return null
  return next
}
