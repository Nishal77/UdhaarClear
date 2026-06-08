/**
 * Amount-based payment routing — single source of truth.
 *
 * Indian B2B payment behaviour splits sharply by invoice size:
 *
 *  Under ₹50,000   → UPI / Razorpay link (zero friction, instant)
 *  ₹50K – ₹2L     → Show both UPI and bank transfer (customer chooses)
 *  Above ₹2L       → Bank transfer only (NEFT/RTGS) — finance teams will
 *                    never click a Razorpay link for amounts this large
 *
 * UPI per-transaction limit is ₹1L for most banks/apps.
 * RTGS minimum is ₹2L; below that NEFT is used.
 * These thresholds are enforced here so pay page + email templates stay in sync.
 */

/** Payment UI mode shown to the customer on the /pay/[id] page */
export type PayMode = 'upi' | 'hybrid' | 'bank'

/**
 * Amount thresholds in rupees (raw number, not paise).
 *
 * Keep these constants here — never hardcode them in individual files.
 */
export const PAYMENT_THRESHOLDS = {
  /** Under this → pure UPI/Razorpay path */
  UPI_MAX: 50_000,

  /** Under this (and above UPI_MAX) → hybrid: show both UPI and bank transfer */
  HYBRID_MAX: 200_000,

  /** UPI apps enforce a per-transaction limit — split required above this */
  UPI_PER_TX_LIMIT: 99_000,
} as const

/**
 * Returns the correct payment UI mode for a given invoice amount.
 *
 * @example
 * getPayMode(45_000)   // → 'upi'
 * getPayMode(75_000)   // → 'hybrid'
 * getPayMode(300_000)  // → 'bank'
 */
export function getPayMode(amount: number): PayMode {
  if (amount < PAYMENT_THRESHOLDS.UPI_MAX)   return 'upi'
  if (amount < PAYMENT_THRESHOLDS.HYBRID_MAX) return 'hybrid'
  return 'bank'
}

/**
 * Whether to show the 2-term installment option in reminder emails.
 * Only shown for amounts where UPI or hybrid payment is appropriate.
 * Hiding it for large invoices avoids looking flexible when tone is FIRM/LEGAL.
 */
export function showInstallmentOption(amount: number): boolean {
  return amount < PAYMENT_THRESHOLDS.HYBRID_MAX
}

/**
 * Splits an amount into UPI-safe parts (each ≤ UPI_PER_TX_LIMIT).
 * Used on the /pay/[id] page for the hybrid mode UPI step-by-step flow.
 *
 * @example
 * splitIntoParts(150_000) // → [99_000, 51_000]
 * splitIntoParts(45_000)  // → [45_000]
 */
export function splitIntoParts(amount: number): number[] {
  const limit = PAYMENT_THRESHOLDS.UPI_PER_TX_LIMIT
  const count = Math.ceil(amount / limit)
  const base = Math.floor(amount / count)
  return Array.from({ length: count }, (_, i) =>
    i === count - 1 ? amount - base * (count - 1) : base
  )
}

/**
 * Human-readable label for the bank transfer type based on amount.
 * RTGS minimum is ₹2L; below that NEFT/IMPS applies.
 */
export function transferTypeLabel(amount: number): 'NEFT/IMPS' | 'RTGS' {
  return amount >= PAYMENT_THRESHOLDS.HYBRID_MAX ? 'RTGS' : 'NEFT/IMPS'
}
