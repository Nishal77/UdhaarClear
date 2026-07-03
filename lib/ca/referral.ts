import { randomBytes } from 'crypto'

/** Cookie that carries a CA's referral code from `?ref=` through to signup. Set by proxy.ts. */
export const REFERRAL_COOKIE_NAME = 'uc_ref'

/** 30 days — plenty of time between clicking a CA's link and finishing signup. */
export const REFERRAL_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I — easy to read aloud over a phone call
const CODE_LENGTH = 8

/**
 * Generates a referral code for a new CA. Collisions are astronomically
 * unlikely at this alphabet/length (32^8 combinations), but the caller
 * should still rely on the database's unique constraint on
 * CAProfile.referralCode as the real guarantee, not this function alone.
 */
export function generateReferralCode(): string {
  const bytes = randomBytes(CODE_LENGTH)
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length]
  }
  return code
}

export function buildReferralLink(referralCode: string, appUrl: string): string {
  return `${appUrl}/signup?ref=${referralCode}`
}
