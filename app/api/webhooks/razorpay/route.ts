import { verifyRazorpaySignature } from '@/lib/razorpay/webhook'
import { prisma } from '@/lib/prisma/client'
import { sendTemplateMessage } from '@/lib/whatsapp/client'
import { TEMPLATE_NAMES, buildPaymentConfirmedComponents } from '@/lib/whatsapp/templates'
import { sendEmail } from '@/lib/email/client'
import { paymentReceivedEmail } from '@/lib/email/templates/payment-received'
import { formatINR } from '@/lib/utils/currency'
import { PlanTier } from '@prisma/client'
import type { RazorpayPaymentLinkPaidEvent, RazorpaySubscriptionEvent } from '@/types/razorpay'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-razorpay-signature') ?? ''

  const isValid = verifyRazorpaySignature(body, signature, process.env.RAZORPAY_WEBHOOK_SECRET ?? '')
  if (!isValid) return new Response('Forbidden', { status: 403 })

  const rawEvent = JSON.parse(body) as { event: string }

  if (rawEvent.event.startsWith('subscription.')) {
    return handleSubscriptionEvent(JSON.parse(body) as RazorpaySubscriptionEvent)
  }

  const event = JSON.parse(body) as RazorpayPaymentLinkPaidEvent

  if (event.event === 'payment_link.paid') {
    const { invoiceId } = event.payload.payment_link.entity.notes
    const payment = event.payload.payment.entity

    // Idempotency guard: Razorpay retries webhooks on any network hiccup,
    // and payment.entity.id is unique per payment, so it doubles as the
    // natural dedupe key. The unique constraint on the insert is what
    // actually blocks a duplicate — if another request already inserted
    // this event id, this insert throws and we stop here.
    try {
      await prisma.webhookEvent.create({
        data: { provider: 'razorpay', eventId: payment.id, eventType: event.event },
      })
    } catch {
      // Already processed this exact payment — acknowledge and exit.
      return new Response('OK', { status: 200 })
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { customer: true, business: { include: { owner: true } } },
    })
    if (!invoice) return new Response('OK', { status: 200 })

    // Normalise Razorpay method string → human-readable label
    const methodLabel: Record<string, string> = {
      upi: 'UPI',
      card: 'Card',
      netbanking: 'Netbanking',
      wallet: 'Wallet',
      emi: 'EMI',
      paylater: 'Pay Later',
    }
    const paymentMethod = methodLabel[payment.method] ?? payment.method.toUpperCase()

    // Mark invoice paid + stop all future reminders
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        paidAmount: payment.amount / 100,
        paymentMethod,
        paymentRef: payment.id,
        autoReminder: false,
      },
    })

    // Send WhatsApp confirmation to customer
    try {
      await sendTemplateMessage({
        to: invoice.customer.phone,
        templateName: TEMPLATE_NAMES.PAYMENT_CONFIRMED,
        components: buildPaymentConfirmedComponents({
          customerName: invoice.customer.contactName ?? invoice.customer.name,
          amount: formatINR(payment.amount / 100),
          invoiceNumber: invoice.invoiceNumber,
          businessName: invoice.business.name,
        }),
      })
    } catch {
      // Non-critical — log but don't fail
    }

    // Send email to business owner
    if (invoice.business.owner.email) {
      try {
        await sendEmail({
          to: invoice.business.owner.email,
          subject: `Payment received — ₹${payment.amount / 100} from ${invoice.customer.name}`,
          html: paymentReceivedEmail({
            ownerName: invoice.business.owner.name,
            customerName: invoice.customer.name,
            invoiceNumber: invoice.invoiceNumber,
            amount: payment.amount / 100,
            paidAt: new Date(),
          }),
        })
      } catch {
        // Non-critical
      }
    }
  }

  return new Response('OK', { status: 200 })
}

/** Statuses that mean "still paying" — plan tier should reflect the subscription's plan. */
const ACTIVE_LIKE_STATUSES = new Set(['authenticated', 'active'])
/** Statuses that mean "no longer paying" — downgrade to FREE. `halted` (payment failed, may recover) is deliberately excluded — no instant downgrade during Razorpay's own retry grace period. */
const ENDED_STATUSES = new Set(['cancelled', 'completed', 'expired'])

async function handleSubscriptionEvent(event: RazorpaySubscriptionEvent): Promise<Response> {
  const subscription = event.payload.subscription.entity

  // Idempotency key: subscription.charged fires once per billing cycle and
  // includes a payment entity with a unique id, so that's the natural key
  // (mirrors payment_link.paid above). Other subscription events don't
  // carry a payment, but are single-fire state transitions — Razorpay only
  // resends the SAME event as a retry, so (event type + subscription id)
  // correctly catches that case too.
  const eventId = event.payload.payment?.entity.id ?? `${event.event}:${subscription.id}`

  try {
    await prisma.webhookEvent.create({
      data: { provider: 'razorpay', eventId, eventType: event.event },
    })
  } catch {
    return new Response('OK', { status: 200 }) // already processed
  }

  const { businessId, planTier } = subscription.notes
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { ownerId: true },
  })
  if (!business) return new Response('OK', { status: 200 })

  const periodStart = subscription.current_start ? new Date(subscription.current_start * 1000) : new Date()
  const periodEnd = subscription.current_end ? new Date(subscription.current_end * 1000) : new Date()

  if (ACTIVE_LIKE_STATUSES.has(subscription.status)) {
    await prisma.$transaction([
      prisma.subscription.upsert({
        where: { razorpaySubId: subscription.id },
        update: { status: 'ACTIVE', currentPeriodStart: periodStart, currentPeriodEnd: periodEnd },
        create: {
          userId: business.ownerId,
          planTier: planTier as PlanTier,
          razorpaySubId: subscription.id,
          status: 'ACTIVE',
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
        },
      }),
      prisma.business.update({
        where: { id: businessId },
        data: { planTier: planTier as PlanTier },
      }),
    ])
  } else if (ENDED_STATUSES.has(subscription.status)) {
    await prisma.$transaction([
      prisma.subscription.updateMany({
        where: { razorpaySubId: subscription.id },
        data: { status: 'CANCELLED', cancelledAt: new Date() },
      }),
      prisma.business.update({
        where: { id: businessId },
        data: { planTier: 'FREE' },
      }),
    ])
  }
  // 'halted' status: intentionally no action — Razorpay is still retrying
  // the charge. Plan tier stays as-is during that grace window.

  return new Response('OK', { status: 200 })
}
