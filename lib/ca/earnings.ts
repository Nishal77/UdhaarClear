import { PlanTier } from '@prisma/client'

/**
 * Monthly commission a CA earns per referred client, by the client's plan.
 * Free-plan clients earn nothing — a CA is only paid for clients who are
 * actually paying UdhaarClear. Used by both the CA dashboard (to preview
 * "what am I earning right now") and the monthly cron that actually creates
 * CAEarning rows (lib/cron/ca-monthly-payout.ts).
 */
export const CA_EARNING_RATE_CARD: Record<PlanTier, number> = {
  FREE: 0,
  STARTER: 100,
  GROWTH: 300,
  CA_PRO: 2000,
}

export function getMonthlyEarningRate(planTier: PlanTier): number {
  return CA_EARNING_RATE_CARD[planTier]
}
