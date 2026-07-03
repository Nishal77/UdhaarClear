import { z } from 'zod'
import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { getRazorpay } from '@/lib/razorpay/client'
import { getOrCreateMonthlyPlanId, isPaidPlanTier } from '@/lib/razorpay/plans'
import { PlanTier } from '@prisma/client'

const checkoutSchema = z.object({
  planTier: z.enum(['STARTER', 'GROWTH', 'CA_PRO']),
})

/**
 * POST /api/subscriptions/checkout
 *
 * Creates a real Razorpay Subscription and returns its id for the frontend
 * to open with Razorpay's Checkout.js widget. Nothing here changes
 * Business.planTier — that only happens once the webhook confirms the
 * authorization payment actually went through (see
 * app/api/webhooks/razorpay/route.ts), same pattern as invoice payments.
 */
export async function POST(request: Request) {
  try {
    const session = await getBusinessFromSession()
    if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

    const body = await request.json()
    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) return apiError('VALIDATION_ERROR', 'Invalid plan selected', 400)

    const planTier = parsed.data.planTier as PlanTier
    if (!isPaidPlanTier(planTier)) {
      return apiError('VALIDATION_ERROR', 'Not a paid plan', 400)
    }

    const planId = await getOrCreateMonthlyPlanId(planTier)
    const razorpay = getRazorpay()

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      // Effectively "until cancelled" — 120 monthly cycles is 10 years,
      // Razorpay requires a finite count but this is long enough that no
      // real customer will hit it; cancellation is a separate explicit action.
      total_count: 120,
      customer_notify: 1,
      notes: {
        businessId: session.businessId,
        planTier,
      },
    })

    return apiSuccess({
      subscriptionId: subscription.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('Subscription checkout error:', err)
    return apiError('CHECKOUT_FAILED', err instanceof Error ? err.message : 'Failed to start checkout', 500)
  }
}
