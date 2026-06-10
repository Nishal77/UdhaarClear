import { describe, it, expect } from 'vitest'
import { formatINR, formatINRCompact } from '@/lib/utils/currency'

describe('formatINR', () => {
  it('formats lakhs correctly', () => {
    expect(formatINR(100000)).toContain('1,00,000')
  })

  it('formats crores correctly', () => {
    expect(formatINR(10000000)).toContain('1,00,00,000')
  })

  it('includes rupee symbol', () => {
    expect(formatINR(1000)).toContain('₹')
  })
})

describe('formatINRCompact', () => {
  it('formats in crores', () => {
    expect(formatINRCompact(10000000)).toBe('₹1cr')
  })

  it('formats in lakhs', () => {
    expect(formatINRCompact(500000)).toBe('₹5L')
  })

  it('formats thousands in k', () => {
    expect(formatINRCompact(5000)).toBe('₹5k')
  })
})

