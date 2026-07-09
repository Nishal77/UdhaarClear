import { getRazorpay } from '@/lib/razorpay/client'
import { PLAN_PRICING, monthlyPriceInPaise, isPaidPlanTier } from '@/lib/pricing'
import type { PaidPlanTier } from '@/lib/pricing'

// Re-export so existing importers of `@/lib/razorpay/plans` keep working.
export { isPaidPlanTier }

const PLAN_NAMES: Record<PaidPlanTier, string> = {
  STARTER: 'UdhaarClear Chota Vyaapar (Starter)',
  GROWTH: 'UdhaarClear Vyaapaar Pro',
  CA_PRO: 'UdhaarClear Udyog (Enterprise)',
}

/**
 * Returns the Razorpay Plan id for a tier's monthly billing cycle, creating
 * it once if it doesn't exist yet.
 *
 * WHY PRICE-AWARE MATCHING: a Razorpay Plan's amount is IMMUTABLE once
 * created — you can't edit the price of an existing plan. So a naive "find a
 * plan tagged with this tier and reuse it" would keep charging the OLD price
 * forever after a price change, which is exactly the bug this replaces
 * (plans were created at ₹1999 and never updated to ₹999). We therefore
 * match on BOTH the tier tag AND the current expected amount. If the price
 * changes, no stale-priced plan matches, so a fresh correctly-priced plan is
 * created automatically — no manual dashboard cleanup, no stale charges.
 *
 * "Just works on real keys": with valid RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET
 * this creates/reuses the plan on first checkout. To pin a specific, manually
 * created plan instead, set RAZORPAY_PLAN_ID_<TIER> and it's used verbatim.
 */
export async function getOrCreateMonthlyPlanId(tier: PaidPlanTier): Promise<string> {
  const envOverride = process.env[`RAZORPAY_PLAN_ID_${tier}`]
  if (envOverride) return envOverride

  const razorpay = getRazorpay()
  const expectedAmount = monthlyPriceInPaise(tier)

  // Reuse only a plan that matches this tier AND today's price. A stale plan
  // left at an old amount won't match, so we never re-charge the old price.
  const existing = await razorpay.plans.all({ count: 100 })
  const match = existing.items.find(
    (p) => p.notes?.udhaarclear_tier === tier && Number(p.item?.amount) === expectedAmount
  )
  if (match) return match.id

  const created = await razorpay.plans.create({
    period: 'monthly',
    interval: 1,
    item: {
      name: `${PLAN_NAMES[tier]} — ₹${PLAN_PRICING[tier].monthly}/mo`,
      amount: expectedAmount, // paise, from the single source of truth
      currency: 'INR',
    },
    notes: { udhaarclear_tier: tier, udhaarclear_amount: String(expectedAmount) },
  })

  return created.id
}
