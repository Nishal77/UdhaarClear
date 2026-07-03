import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'
import { getRazorpay } from '@/lib/razorpay/client'

/**
 * POST /api/subscriptions/cancel
 *
 * Cancels the business's active Razorpay subscription immediately and
 * downgrades to FREE right away — we don't wait for the webhook here since
 * the user is actively watching this action complete, unlike checkout where
 * we wait for payment confirmation. The webhook's `subscription.cancelled`
 * handler is still there as a safety net for cancellations triggered
 * directly from the Razorpay dashboard instead of this button.
 */
export async function POST() {
  try {
    const session = await getBusinessFromSession()
    if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        user: { ownedBusiness: { id: session.businessId } },
        status: 'ACTIVE',
      },
    })

    if (!activeSubscription?.razorpaySubId) {
      return apiError('NOT_FOUND', 'No active subscription to cancel', 404)
    }

    try {
      const razorpay = getRazorpay()
      await razorpay.subscriptions.cancel(activeSubscription.razorpaySubId)
    } catch (err) {
      return apiError('CANCEL_FAILED', err instanceof Error ? err.message : 'Failed to cancel with Razorpay', 500)
    }

    await prisma.$transaction([
      prisma.subscription.update({
        where: { id: activeSubscription.id },
        data: { status: 'CANCELLED', cancelledAt: new Date() },
      }),
      prisma.business.update({
        where: { id: session.businessId },
        data: { planTier: 'FREE' },
      }),
    ])

    return apiSuccess({ ok: true })
  } catch (err) {
    console.error('Subscription cancel error:', err)
    return apiError('INTERNAL_SERVER_ERROR', err instanceof Error ? err.message : 'Something went wrong', 500)
  }
}
