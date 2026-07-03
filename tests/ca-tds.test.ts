import { describe, it, expect } from 'vitest'
import { calculateTDS, getFinancialYearStart } from '@/lib/ca/tds'

describe('calculateTDS', () => {
  it('deducts nothing while cumulative stays under the 30,000 threshold', () => {
    const result = calculateTDS(0, 10_000)
    expect(result).toEqual({ tdsAmount: 0, netAmount: 10_000 })
  })

  it('deducts nothing exactly at the threshold (boundary is inclusive of no-TDS)', () => {
    const result = calculateTDS(20_000, 10_000) // cumulative after = exactly 30,000
    expect(result).toEqual({ tdsAmount: 0, netAmount: 10_000 })
  })

  it('taxes only the portion that crosses the threshold, not the whole payout', () => {
    // cumulative before = 25,000; this payout = 10,000 -> cumulative after = 35,000
    // only 5,000 of this payout is above the 30,000 line
    const result = calculateTDS(25_000, 10_000)
    expect(result.tdsAmount).toBe(500) // 10% of 5,000
    expect(result.netAmount).toBe(9_500)
  })

  it('taxes the full payout once cumulative was already past the threshold', () => {
    const result = calculateTDS(50_000, 2_000)
    expect(result.tdsAmount).toBe(200) // 10% of the full 2,000
    expect(result.netAmount).toBe(1_800)
  })

  it('rounds the TDS amount to the nearest rupee', () => {
    // cumulative before = 29,999; payout = 10 -> only 9 rupees taxable -> 0.9 rounds to 1
    const result = calculateTDS(29_999, 10)
    expect(result.tdsAmount).toBe(1)
    expect(result.netAmount).toBe(9)
  })
})

describe('getFinancialYearStart', () => {
  it('maps a January date to April 1 of the previous calendar year', () => {
    const start = getFinancialYearStart(new Date(2026, 0, 15)) // 15 Jan 2026
    expect(start).toEqual(new Date(2025, 3, 1))
  })

  it('maps a March date to April 1 of the previous calendar year', () => {
    const start = getFinancialYearStart(new Date(2026, 2, 31)) // 31 Mar 2026
    expect(start).toEqual(new Date(2025, 3, 1))
  })

  it('maps an April date to April 1 of the same calendar year', () => {
    const start = getFinancialYearStart(new Date(2026, 3, 1)) // 1 Apr 2026
    expect(start).toEqual(new Date(2026, 3, 1))
  })

  it('maps a December date to April 1 of the same calendar year', () => {
    const start = getFinancialYearStart(new Date(2026, 11, 25)) // 25 Dec 2026
    expect(start).toEqual(new Date(2026, 3, 1))
  })
})
