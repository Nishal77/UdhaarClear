import { PlanTier } from '@prisma/client'
import { getRazorpay } from '@/lib/razorpay/client'
import { PLAN_PRICES } from '@/lib/plans'

type PaidPlanTier = 'STARTER' | 'GROWTH' | 'CA_PRO'

const PLAN_NAMES: Record<PaidPlanTier, string> = {
  STARTER: 'UdhaarClear Starter',
  GROWTH: 'UdhaarClear Growth',
  CA_PRO: 'UdhaarClear CA Pro',
}

/**
 * Returns the Razorpay Plan id for a tier's monthly billing cycle, creating
 * it once if it doesn't exist yet.
 *
 * Razorpay Plans are meant to be created once and reused for every customer
 * on that tier — recreating one per checkout would leave dozens of
 * duplicate Plan entities cluttering the Razorpay dashboard. Instead of
 * requiring a manual one-time setup script, this tags each plan with
 * `notes.udhaarclear_tier` and checks for an existing match first, so the
 * "create once" behavior happens automatically on first use per tier.
 */
export async function getOrCreateMonthlyPlanId(tier: PaidPlanTier): Promise<string> {
  const envOverride = process.env[`RAZORPAY_PLAN_ID_${tier}`]
  if (envOverride) return envOverride

  const razorpay = getRazorpay()

  const existing = await razorpay.plans.all({ count: 100 })
  const match = existing.items.find((p) => p.notes?.udhaarclear_tier === tier)
  if (match) return match.id

  const created = await razorpay.plans.create({
    period: 'monthly',
    interval: 1,
    item: {
      name: PLAN_NAMES[tier],
      amount: PLAN_PRICES[tier].monthly * 100, // paise
      currency: 'INR',
    },
    notes: { udhaarclear_tier: tier },
  })

  return created.id
}

export function isPaidPlanTier(tier: PlanTier): tier is PaidPlanTier {
  return tier === 'STARTER' || tier === 'GROWTH' || tier === 'CA_PRO'
}
