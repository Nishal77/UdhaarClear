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

  it('returns FIRM for days 8 through 27', () => {
    expect(selectTone(8, 'GENTLE')).toBe('FIRM')
    expect(selectTone(10, 'GENTLE')).toBe('FIRM')
    expect(selectTone(15, 'GENTLE')).toBe('FIRM')
    expect(selectTone(21, 'GENTLE')).toBe('FIRM')
    expect(selectTone(27, 'GENTLE')).toBe('FIRM')
  })

  it('returns LEGAL for days 28+', () => {
    expect(selectTone(28, 'GENTLE')).toBe('LEGAL')
    expect(selectTone(35, 'GENTLE')).toBe('LEGAL')
    expect(selectTone(42, 'GENTLE')).toBe('LEGAL')
    expect(selectTone(60, 'GENTLE')).toBe('LEGAL')
  })

  it('FIRM configured escalates to LEGAL at 28+ days', () => {
    expect(selectTone(27, 'FIRM')).toBe('FIRM')
    expect(selectTone(28, 'FIRM')).toBe('LEGAL')
  })
})

// ─── isReminderDay ──────────────────────────────────────────────────────────

describe('isReminderDay', () => {
  it('returns true for all 10 scheduled days', () => {
    const scheduled = [-3, 0, 3, 7, 10, 15, 21, 28, 35, 42]
    scheduled.forEach((d) => expect(isReminderDay(d)).toBe(true))
  })

  it('returns false for non-scheduled days', () => {
    const nonScheduled = [1, 4, 8, 9, 30, 45, 67]
    nonScheduled.forEach((d) => expect(isReminderDay(d)).toBe(false))
  })
})

// ─── shouldAutoPause ────────────────────────────────────────────────────────

describe('shouldAutoPause', () => {
  it('returns false at or below the threshold', () => {
    expect(shouldAutoPause(AUTO_PAUSE_AFTER_DAYS)).toBe(false)
    expect(shouldAutoPause(30)).toBe(false)
    expect(shouldAutoPause(0)).toBe(false)
  })

  it('returns true after the threshold', () => {
    expect(shouldAutoPause(AUTO_PAUSE_AFTER_DAYS + 1)).toBe(true)
    expect(shouldAutoPause(45)).toBe(true)
  })
})

// ─── getReminderPhase ───────────────────────────────────────────────────────

describe('getReminderPhase', () => {
  it('GENTLE for days -3 to +7', () => {
    expect(getReminderPhase(-3)).toBe('GENTLE')
    expect(getReminderPhase(7)).toBe('GENTLE')
  })

  it('FIRM for days 8 to 27', () => {
    expect(getReminderPhase(8)).toBe('FIRM')
    expect(getReminderPhase(27)).toBe('FIRM')
  })

  it('LEGAL for days 28 to 42', () => {
    expect(getReminderPhase(28)).toBe('LEGAL')
    expect(getReminderPhase(42)).toBe('LEGAL')
  })

  it('PAUSED after AUTO_PAUSE_AFTER_DAYS', () => {
    expect(getReminderPhase(43)).toBe('PAUSED')
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
    expect(getNextReminderDay(21)).toBe(28)
    expect(getNextReminderDay(28)).toBe(35)
    expect(getNextReminderDay(35)).toBe(42)
  })

  it('returns null when no further reminders are scheduled', () => {
    expect(getNextReminderDay(42)).toBeNull()
    expect(getNextReminderDay(90)).toBeNull()
  })
})
