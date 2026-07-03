import { describe, it, expect } from 'vitest'
import { generateReferralCode, buildReferralLink } from '@/lib/ca/referral'

describe('generateReferralCode', () => {
  it('produces an 8-character uppercase alphanumeric code', () => {
    const code = generateReferralCode()
    expect(code).toHaveLength(8)
    expect(code).toMatch(/^[A-Z0-9]+$/)
  })

  it('excludes visually ambiguous characters (0/O, 1/I) so it reads cleanly over a phone call', () => {
    const codes = Array.from({ length: 200 }, () => generateReferralCode())
    const combined = codes.join('')
    expect(combined).not.toMatch(/[01OI]/)
  })

  it('generates distinct codes across calls', () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateReferralCode()))
    expect(codes.size).toBe(50)
  })
})

describe('buildReferralLink', () => {
  it('builds a signup link carrying the referral code as a query param', () => {
    const link = buildReferralLink('ABCD1234', 'https://udhaarclear.in')
    expect(link).toBe('https://udhaarclear.in/signup?ref=ABCD1234')
  })
})
