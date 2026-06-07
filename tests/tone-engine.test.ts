import { describe, it, expect } from 'vitest'
import {
  selectTone,
  isReminderDay,
  shouldAutoPause,
  getReminderPhase,
  getNextReminderDay,
  AUTO_PAUSE_AFTER_DAYS,
} from '@/lib/whatsapp/tone-engine'

// ─── selectTone ─────────────────────────────────────────────────────────────

describe('selectTone', () => {
  it('returns LEGAL when configured as LEGAL regardless of days', () => {
    expect(selectTone(0, 'LEGAL')).toBe('LEGAL')
    expect(selectTone(5, 'LEGAL')).toBe('LEGAL')
    expect(selectTone(50, 'LEGAL')).toBe('LEGAL')
  })

  it('returns GENTLE for days -3 through +7', () => {
    expect(selectTone(-3, 'GENTLE')).toBe('GENTLE')
    expect(selectTone(0, 'GENTLE')).toBe('GENTLE')
    expect(selectTone(3, 'GENTLE')).toBe('GENTLE')
    expect(selectTone(7, 'GENTLE')).toBe('GENTLE')
  })

  it('returns FIRM for days 8 through 44', () => {
    expect(selectTone(8, 'GENTLE')).toBe('FIRM')
    expect(selectTone(10, 'GENTLE')).toBe('FIRM')
    expect(selectTone(15, 'GENTLE')).toBe('FIRM')
    expect(selectTone(21, 'GENTLE')).toBe('FIRM')
    expect(selectTone(30, 'GENTLE')).toBe('FIRM')
    expect(selectTone(44, 'GENTLE')).toBe('FIRM')
  })

  it('returns LEGAL for days 45+', () => {
    expect(selectTone(45, 'GENTLE')).toBe('LEGAL')
    expect(selectTone(60, 'GENTLE')).toBe('LEGAL')
    expect(selectTone(90, 'GENTLE')).toBe('LEGAL')
  })

  it('FIRM configured escalates to LEGAL at 45+ days', () => {
    expect(selectTone(44, 'FIRM')).toBe('FIRM')
    expect(selectTone(45, 'FIRM')).toBe('LEGAL')
  })
})

// ─── isReminderDay ──────────────────────────────────────────────────────────

describe('isReminderDay', () => {
  it('returns true for all 10 scheduled days', () => {
    const scheduled = [-3, 0, 3, 7, 10, 15, 21, 30, 45, 60]
    scheduled.forEach((d) => expect(isReminderDay(d)).toBe(true))
  })

  it('returns false for non-scheduled days', () => {
    const nonScheduled = [1, 2, 4, 5, 6, 8, 9, 11, 20, 25, 31, 46, 67, 90]
    nonScheduled.forEach((d) => expect(isReminderDay(d)).toBe(false))
  })
})

// ─── shouldAutoPause ────────────────────────────────────────────────────────

describe('shouldAutoPause', () => {
  it('returns false at or below the threshold', () => {
    expect(shouldAutoPause(AUTO_PAUSE_AFTER_DAYS)).toBe(false)
    expect(shouldAutoPause(60)).toBe(false)
    expect(shouldAutoPause(0)).toBe(false)
  })

  it('returns true after the threshold', () => {
    expect(shouldAutoPause(AUTO_PAUSE_AFTER_DAYS + 1)).toBe(true)
    expect(shouldAutoPause(90)).toBe(true)
  })
})

// ─── getReminderPhase ───────────────────────────────────────────────────────

describe('getReminderPhase', () => {
  it('GENTLE for days -3 to +7', () => {
    expect(getReminderPhase(-3)).toBe('GENTLE')
    expect(getReminderPhase(7)).toBe('GENTLE')
  })

  it('FIRM for days 8 to 44', () => {
    expect(getReminderPhase(8)).toBe('FIRM')
    expect(getReminderPhase(44)).toBe('FIRM')
  })

  it('LEGAL for days 45+', () => {
    expect(getReminderPhase(45)).toBe('LEGAL')
    expect(getReminderPhase(67)).toBe('LEGAL')
  })

  it('PAUSED after AUTO_PAUSE_AFTER_DAYS', () => {
    expect(getReminderPhase(68)).toBe('PAUSED')
    expect(getReminderPhase(100)).toBe('PAUSED')
  })
})

// ─── getNextReminderDay ─────────────────────────────────────────────────────

describe('getNextReminderDay', () => {
  it('returns the next scheduled day', () => {
    expect(getNextReminderDay(-5)).toBe(-3)
    expect(getNextReminderDay(-3)).toBe(0)
    expect(getNextReminderDay(0)).toBe(3)
    expect(getNextReminderDay(7)).toBe(10)
    expect(getNextReminderDay(30)).toBe(45)
    expect(getNextReminderDay(45)).toBe(60)
  })

  it('returns null when no further reminders are scheduled', () => {
    expect(getNextReminderDay(60)).toBeNull()
    expect(getNextReminderDay(90)).toBeNull()
  })
})
