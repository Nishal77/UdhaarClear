import { prisma } from '@/lib/prisma/client'

// Plan pricing, limits, names, and tier helpers now live in a single
// server+client-safe source of truth (lib/pricing.ts). Re-exported here so
// existing imports (`@/lib/plans`) keep working, while the actual numbers
// are defined once and can't drift between the landing page, the in-app
// upgrade cards, and the amount Razorpay actually charges.
export {
  PLAN_LIMITS,
  PLAN_PRICING,
  PLAN_DISPLAY_NAMES,
  PLAN_ORDER,
  isPaidPlanTier,
  monthlyPriceInPaise,
} from '@/lib/pricing'
export type { PaidPlanTier, PlanLimits, PlanPricing } from '@/lib/pricing'

import { PLAN_LIMITS } from '@/lib/pricing'

export async function checkCustomerLimit(businessId: string): Promise<boolean> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { planTier: true },
  })
  if (!business) return false
  const count = await prisma.customer.count({ where: { businessId } })
  const limit = PLAN_LIMITS[business.planTier].customers
  return count < limit
}

export async function checkInvoiceLimit(businessId: string): Promise<boolean> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { planTier: true },
  })
  if (!business) return false
  const count = await prisma.invoice.count({ where: { businessId } })
  const limit = PLAN_LIMITS[business.planTier].invoices
  return count < limit
}
