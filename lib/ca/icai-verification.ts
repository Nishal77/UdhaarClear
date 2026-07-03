export type ICAIVerificationStatus = 'VERIFIED' | 'MANUAL_REVIEW'

export interface ICAIVerificationResult {
  status: ICAIVerificationStatus
  reason: string
}

/**
 * Checks a CA's membership number against the ICAI directory.
 *
 * HONEST LIMITATION: ICAI (icai.org) does not publish a documented, stable
 * public API for programmatic membership verification. Building a scraper
 * against their member-search page without ever having tested it live would
 * be guesswork dressed up as a real integration — it could silently reject
 * valid CAs or (worse) approve invalid ones the moment the site's HTML
 * changes, a rate limit kicks in, or a CAPTCHA appears.
 *
 * So this always returns MANUAL_REVIEW for now: registration still
 * succeeds, but a human (support/ops) confirms the membership number
 * against ICAI's directory before flipping verificationStatus to VERIFIED
 * via an admin action. That's a deliberate, safer default — not a stub left
 * by accident. Swap this out once a real verification path (an official
 * ICAI API, or a paid KYC provider that already handles ICAI lookups) is
 * chosen and tested against the live service.
 */
export async function verifyICAIMembership(
  membershipNumber: string,
  copNumber?: string | null
): Promise<ICAIVerificationResult> {
  void copNumber // kept in the signature for when a real check is wired in

  if (!membershipNumber.trim()) {
    return { status: 'MANUAL_REVIEW', reason: 'No membership number provided' }
  }

  return {
    status: 'MANUAL_REVIEW',
    reason: 'Automatic ICAI directory verification is not wired up yet — queued for manual review',
  }
}
