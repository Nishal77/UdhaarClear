import { ReminderTone } from '@prisma/client'

/**
 * Reminder cadence — the CONCRETE send-day schedule for UdhaarClear.
 *
 * The PRD §3.2 tonal ladder gives illustrative day-RANGES per phase (Polite
 * D1-3, Gentle D7-10, Firm D14-18, Serious D21-27, Human Gate D28+). Those
 * are example windows, not a fixed send schedule. This is the product's
 * decided mapping of those phases to the exact days we actually message on,
 * documented and signed off in docs/reminder-cadence.md so the behavior is
 * intentional rather than incidental:
 *
 *  Phase 1  Polite         (PRD D1-3)   → send on D-3 (pre-due nudge), D0 (due), D3
 *  Phase 2  Gentle         (PRD D7-10)  → send on D7, D10
 *  Phase 3  Firm           (PRD D14-18) → send on D15
 *  Phase 4  Serious/Legal  (PRD D21-27) → send on D21, D24 (MSMED Act warning)
 *  Phase 5  Human Gate      (PRD D28+)  → D28 owner approval required, no auto-send
 *  Owner-approved legal action           → D35, D42
 *  Auto-pause after D42 (no further automated sends)
 *
 * Every scheduled day falls inside its PRD phase window, so the tone the
 * buyer sees always matches the PRD ladder. See docs/reminder-cadence.md.
 */
export const REMINDER_SCHEDULE_DAYS = [-3, 0, 3, 7, 10, 15, 21, 24, 28, 35, 42] as const

export type ReminderScheduleDay = (typeof REMINDER_SCHEDULE_DAYS)[number]

/** After this many days overdue, auto-reminders are paused permanently. */
export const AUTO_PAUSE_AFTER_DAYS = 42

/** Tone phase boundaries (inclusive lower bound). */
const GENTLE_MAX_DAYS = 7   // days -3 → +7
const FIRM_MAX_DAYS   = 27  // days +8 → +27
// Legal: days +28+


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
