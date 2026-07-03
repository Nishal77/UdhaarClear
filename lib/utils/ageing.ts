/**
 * Shared invoice ageing buckets — the standard 0-30 / 31-60 / 61-90 / 90+
 * days-overdue split used for reporting (dashboard stats, auditor PDF).
 *
 * Note this is a different, purpose-built scheme from the "Invoice Aging
 * Distribution" widget on the invoices list page (app/(dashboard)/invoices/page.tsx),
 * which buckets by days-since-invoice-issued (0-7/8-21/22+) for an at-a-glance
 * freshness indicator. Both are intentional — this file is for the
 * days-past-due-date buckets used in financial reporting.
 */

export type AgeingBucketKey = 'current' | '0-30' | '31-60' | '61-90' | '90+'

export const AGEING_BUCKET_LABELS: Record<AgeingBucketKey, string> = {
  current: 'Not yet due',
  '0-30': '0-30 days overdue',
  '31-60': '31-60 days overdue',
  '61-90': '61-90 days overdue',
  '90+': '90+ days overdue',
}

/** Classifies a `daysOverdue` value (see lib/utils/date.ts) into a bucket. */
export function getAgeingBucket(daysOverdue: number): AgeingBucketKey {
  if (daysOverdue <= 0) return 'current'
  if (daysOverdue <= 30) return '0-30'
  if (daysOverdue <= 60) return '31-60'
  if (daysOverdue <= 90) return '61-90'
  return '90+'
}

export interface AgeingBucketTotals {
  count: number
  amount: number
}

export type AgeingBreakdown = Record<AgeingBucketKey, AgeingBucketTotals>

function emptyBreakdown(): AgeingBreakdown {
  return {
    current: { count: 0, amount: 0 },
    '0-30': { count: 0, amount: 0 },
    '31-60': { count: 0, amount: 0 },
    '61-90': { count: 0, amount: 0 },
    '90+': { count: 0, amount: 0 },
  }
}

/**
 * Buckets a list of outstanding invoices by days-overdue and sums the
 * remaining balance (amount - paidAmount) per bucket. Pass only unpaid /
 * partially-paid invoices — paid and written-off invoices don't belong in
 * an ageing report.
 */
export function buildAgeingBreakdown(
  invoices: Array<{ dueDate: Date; amount: number; paidAmount?: number | null }>,
  daysOverdueFn: (dueDate: Date) => number
): AgeingBreakdown {
  const breakdown = emptyBreakdown()

  for (const invoice of invoices) {
    const bucket = getAgeingBucket(daysOverdueFn(invoice.dueDate))
    const remainingBalance = invoice.amount - Number(invoice.paidAmount ?? 0)

    breakdown[bucket].count += 1
    breakdown[bucket].amount += remainingBalance
  }

  return breakdown
}
