import { describe, it, expect } from 'vitest'
import { selectTone, isReminderDay } from '@/lib/whatsapp/tone-engine'

describe('selectTone', () => {
  it('returns LEGAL when configured as LEGAL regardless of days', () => {
    expect(selectTone(0, 'LEGAL')).toBe('LEGAL')
    expect(selectTone(5, 'LEGAL')).toBe('LEGAL')
    expect(selectTone(50, 'LEGAL')).toBe('LEGAL')
  })

  it('returns GENTLE for 0-7 days overdue', () => {
    expect(selectTone(-3, 'GENTLE')).toBe('GENTLE')
    expect(selectTone(0, 'GENTLE')).toBe('GENTLE')
    expect(selectTone(3, 'GENTLE')).toBe('GENTLE')
    expect(selectTone(7, 'GENTLE')).toBe('GENTLE')
  })

  it('returns FIRM for 8-21 days overdue', () => {
    expect(selectTone(8, 'GENTLE')).toBe('FIRM')
    expect(selectTone(15, 'GENTLE')).toBe('FIRM')
    expect(selectTone(21, 'GENTLE')).toBe('FIRM')
  })

  it('returns LEGAL for 22+ days overdue', () => {
    expect(selectTone(22, 'GENTLE')).toBe('LEGAL')
    expect(selectTone(30, 'GENTLE')).toBe('LEGAL')
    expect(selectTone(45, 'GENTLE')).toBe('LEGAL')
  })

  it('FIRM configured still escalates to LEGAL after 21 days', () => {
    expect(selectTone(22, 'FIRM')).toBe('LEGAL')
  })
})

describe('isReminderDay', () => {
  it('returns true for scheduled reminder days', () => {
    expect(isReminderDay(-3)).toBe(true)
    expect(isReminderDay(0)).toBe(true)
    expect(isReminderDay(3)).toBe(true)
    expect(isReminderDay(7)).toBe(true)
    expect(isReminderDay(15)).toBe(true)
    expect(isReminderDay(30)).toBe(true)
    expect(isReminderDay(45)).toBe(true)
  })

  it('returns false for non-scheduled days', () => {
    expect(isReminderDay(1)).toBe(false)
    expect(isReminderDay(10)).toBe(false)
    expect(isReminderDay(20)).toBe(false)
    expect(isReminderDay(60)).toBe(false)
  })
})
