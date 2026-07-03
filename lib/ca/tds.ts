/**
 * TDS (Tax Deducted at Source) on CA commission payouts.
 *
 * This mirrors the product rule specified for the CA partner program: 10%
 * deducted once a CA's cumulative payouts in an Indian financial year
 * (April 1 - March 31) exceed Rs 30,000. This is a PRODUCT rule, not tax
 * advice — the exact rate/threshold for real commission TDS (Section 194H)
 * can change and should be confirmed with an actual tax advisor before
 * relying on this for real payouts.
 */

const TDS_THRESHOLD_RUPEES = 30_000
const TDS_RATE = 0.10

export interface TDSCalculation {
  tdsAmount: number
  netAmount: number
}

/**
 * Once cumulative payouts in the financial year cross the threshold, TDS
 * applies going forward. For the specific payout that crosses the line, only
 * the portion above the threshold is taxed — everything before it was
 * genuinely under the exemption. Every payout after that point is taxed in
 * full, since cumulative is already past the threshold.
 */
export function calculateTDS(cumulativeBeforeThisPayout: number, thisPayoutGross: number): TDSCalculation {
  const cumulativeAfter = cumulativeBeforeThisPayout + thisPayoutGross

  if (cumulativeAfter <= TDS_THRESHOLD_RUPEES) {
    return { tdsAmount: 0, netAmount: thisPayoutGross }
  }

  const taxablePortion =
    cumulativeBeforeThisPayout >= TDS_THRESHOLD_RUPEES
      ? thisPayoutGross
      : cumulativeAfter - TDS_THRESHOLD_RUPEES

  const tdsAmount = Math.round(taxablePortion * TDS_RATE)
  return { tdsAmount, netAmount: thisPayoutGross - tdsAmount }
}

/** Returns the start of the Indian financial year (April 1) that `date` falls within. */
export function getFinancialYearStart(date: Date): Date {
  const isBeforeApril = date.getMonth() < 3 // Jan(0)-Mar(2) belong to the FY that started last April
  const fyStartYear = isBeforeApril ? date.getFullYear() - 1 : date.getFullYear()
  return new Date(fyStartYear, 3, 1)
}
