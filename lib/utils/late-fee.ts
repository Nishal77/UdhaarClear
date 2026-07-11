/**
 * MSMED Act §16 late-fee calculation.
 *
 * The Act entitles MSME suppliers to interest on overdue payments at
 * 3× the RBI bank rate (repo rate), compounded monthly, from the day
 * after the agreed payment date (dueDate). Only full months count — a
 * 45-day overdue period → 1 full month of interest.
 *
 * RBI_REPO_RATE_PERCENT defaults to 6.50 (current as of 2026-07).
 * Override via env var `RBI_REPO_RATE_PERCENT` when RBI changes the rate,
 * so no deployment is required for a rate update.
 */

const DEFAULT_RBI_REPO_RATE_PERCENT = 6.5

function getRbiRate(): number {
  const env = process.env.RBI_REPO_RATE_PERCENT
  const parsed = env ? parseFloat(env) : NaN
  return isNaN(parsed) || parsed <= 0 ? DEFAULT_RBI_REPO_RATE_PERCENT : parsed
}

export interface LateFeeResult {
  lateFeeAmount: number      // accrued late fee in INR
  monthsOverdue: number      // full months past dueDate
  annualRatePercent: number  // 3 × RBI repo rate used
  principalUsed: number
}

/**
 * Calculates the MSMED Act late fee on an overdue invoice.
 *
 * Returns zero (not an error) when:
 *  - principal ≤ 0
 *  - asOf is on or before dueDate (not yet overdue)
 *  - fewer than 30 days have passed (no full month yet)
 */
export function calculateLateFee(params: {
  principalOutstanding: number
  dueDate: Date
  asOf?: Date
  rbiRepoRatePercent?: number
}): LateFeeResult {
  const {
    principalOutstanding,
    dueDate,
    asOf = new Date(),
    rbiRepoRatePercent = getRbiRate(),
  } = params

  const annualRatePercent = 3 * rbiRepoRatePercent

  if (principalOutstanding <= 0) {
    return { lateFeeAmount: 0, monthsOverdue: 0, annualRatePercent, principalUsed: principalOutstanding }
  }

  // Interest accrues from the day AFTER the due date
  const msOverdue = asOf.getTime() - dueDate.getTime() - 24 * 60 * 60 * 1000
  if (msOverdue <= 0) {
    return { lateFeeAmount: 0, monthsOverdue: 0, annualRatePercent, principalUsed: principalOutstanding }
  }

  const daysOverdue = Math.floor(msOverdue / (1000 * 60 * 60 * 24))
  const monthsOverdue = Math.floor(daysOverdue / 30)

  if (monthsOverdue === 0) {
    return { lateFeeAmount: 0, monthsOverdue: 0, annualRatePercent, principalUsed: principalOutstanding }
  }

  const monthlyRate = annualRatePercent / 100 / 12
  const lateFeeAmount = Math.round(
    principalOutstanding * (Math.pow(1 + monthlyRate, monthsOverdue) - 1) * 100
  ) / 100

  return { lateFeeAmount, monthsOverdue, annualRatePercent, principalUsed: principalOutstanding }
}

/** Convenience wrapper — returns just the INR amount (0 if not applicable). */
export function getLateFeeAmount(params: {
  principalOutstanding: number
  dueDate: Date
  asOf?: Date
}): number {
  return calculateLateFee(params).lateFeeAmount
}
