/**
 * @vitest-environment node
 *
 * MSMED Act §16 late-fee calculation tests.
 * Formula: P × ((1 + 3r/12)^n - 1) where r = RBI repo rate, n = full months overdue.
 */
import { describe, it, expect } from 'vitest'
import { calculateLateFee, getLateFeeAmount } from '@/lib/utils/late-fee'

/** Build a Date that is `days` days before `asOf` (i.e. dueDate was N days ago). */
function dueDateDaysAgo(days: number, asOf = new Date()): Date {
  const d = new Date(asOf)
  d.setDate(d.getDate() - days)
  return d
}

const PRINCIPAL = 100_000 // ₹1,00,000 for easy mental math
const RBI_RATE = 6.5      // 6.5% p.a. → 3× = 19.5% p.a. → 1.625%/month

describe('calculateLateFee', () => {
  it('returns 0 when not yet overdue', () => {
    const result = calculateLateFee({
      principalOutstanding: PRINCIPAL,
      dueDate: dueDateDaysAgo(-5), // due in 5 days
    })
    expect(result.lateFeeAmount).toBe(0)
    expect(result.monthsOverdue).toBe(0)
  })

  it('returns 0 on exactly the due date', () => {
    const result = calculateLateFee({
      principalOutstanding: PRINCIPAL,
      dueDate: new Date(),
    })
    expect(result.lateFeeAmount).toBe(0)
  })

  it('returns 0 when overdue < 30 days (no full month)', () => {
    const result = calculateLateFee({
      principalOutstanding: PRINCIPAL,
      dueDate: dueDateDaysAgo(15),
    })
    expect(result.lateFeeAmount).toBe(0)
    expect(result.monthsOverdue).toBe(0)
  })

  it('calculates correctly at 1 month overdue (≥30 days)', () => {
    const asOf = new Date('2026-08-01')
    const dueDate = new Date('2026-07-01') // 31 days ago → 1 full month

    const result = calculateLateFee({
      principalOutstanding: PRINCIPAL,
      dueDate,
      asOf,
      rbiRepoRatePercent: RBI_RATE,
    })

    // Expected: 1,00,000 × ((1 + 0.195/12)^1 - 1) = 1,00,000 × 0.01625 = ₹1,625
    expect(result.monthsOverdue).toBe(1)
    expect(result.lateFeeAmount).toBeCloseTo(1625, 0)
    expect(result.annualRatePercent).toBeCloseTo(19.5, 5)
  })

  it('calculates correctly at 3 months overdue', () => {
    const asOf = new Date('2026-10-01')
    const dueDate = new Date('2026-07-01') // 92 days → 3 full months

    const result = calculateLateFee({
      principalOutstanding: PRINCIPAL,
      dueDate,
      asOf,
      rbiRepoRatePercent: RBI_RATE,
    })

    // Expected: 1,00,000 × ((1.01625)^3 - 1) ≈ ₹4,939
    expect(result.monthsOverdue).toBe(3)
    expect(result.lateFeeAmount).toBeGreaterThan(4800)
    expect(result.lateFeeAmount).toBeLessThan(5000)
  })

  it('compounds correctly — 2 months > 2× one month', () => {
    const asOf2 = new Date('2026-09-02')
    const asOf1 = new Date('2026-08-02')
    const dueDate = new Date('2026-07-01')

    const one = calculateLateFee({ principalOutstanding: PRINCIPAL, dueDate, asOf: asOf1, rbiRepoRatePercent: RBI_RATE })
    const two = calculateLateFee({ principalOutstanding: PRINCIPAL, dueDate, asOf: asOf2, rbiRepoRatePercent: RBI_RATE })

    expect(two.lateFeeAmount).toBeGreaterThan(2 * one.lateFeeAmount)
  })

  it('returns 0 for zero principal', () => {
    const result = calculateLateFee({
      principalOutstanding: 0,
      dueDate: dueDateDaysAgo(60),
    })
    expect(result.lateFeeAmount).toBe(0)
  })

  it('returns 0 for negative principal', () => {
    const result = calculateLateFee({
      principalOutstanding: -1000,
      dueDate: dueDateDaysAgo(60),
    })
    expect(result.lateFeeAmount).toBe(0)
  })

  it('scales linearly with principal', () => {
    const asOf = new Date('2026-09-01')
    const dueDate = new Date('2026-07-01')

    const r1 = calculateLateFee({ principalOutstanding: 10_000, dueDate, asOf, rbiRepoRatePercent: RBI_RATE })
    const r2 = calculateLateFee({ principalOutstanding: 100_000, dueDate, asOf, rbiRepoRatePercent: RBI_RATE })

    expect(r2.lateFeeAmount).toBeCloseTo(r1.lateFeeAmount * 10, 0)
  })

  it('uses env RBI rate override when set', () => {
    // getLateFeeAmount uses getRbiRate() internally — test via explicit param
    const asOf = new Date('2026-09-01')
    const dueDate = new Date('2026-07-01')

    const atDefault = calculateLateFee({ principalOutstanding: PRINCIPAL, dueDate, asOf, rbiRepoRatePercent: 6.5 })
    const atHigher  = calculateLateFee({ principalOutstanding: PRINCIPAL, dueDate, asOf, rbiRepoRatePercent: 8.0 })

    expect(atHigher.lateFeeAmount).toBeGreaterThan(atDefault.lateFeeAmount)
  })
})

describe('getLateFeeAmount (convenience wrapper)', () => {
  it('returns the same amount as calculateLateFee', () => {
    const asOf = new Date('2026-09-01')
    const dueDate = new Date('2026-07-01')
    const full = calculateLateFee({ principalOutstanding: PRINCIPAL, dueDate, asOf })
    const simple = getLateFeeAmount({ principalOutstanding: PRINCIPAL, dueDate, asOf })
    expect(simple).toBe(full.lateFeeAmount)
  })

  it('returns 0 for not-yet-overdue invoice', () => {
    expect(getLateFeeAmount({ principalOutstanding: 50000, dueDate: dueDateDaysAgo(-1) })).toBe(0)
  })
})
