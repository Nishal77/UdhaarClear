import { getRazorpay } from './client'

interface CreatePaymentLinkParams {
  invoiceId: string
  businessId: string
  invoiceNumber: string
  amount: number
  customerName: string
  customerPhone: string
  customerEmail?: string | null
}

/**
 * Creates a Razorpay hosted payment link for a buyer invoice. The hosted page
 * gives the buyer Card, UPI, Net-banking and wallet options in one tap.
 *
 * Reconciliation is webhook-driven, NOT via the browser redirect: Razorpay
 * fires `payment_link.paid` to /api/webhooks/razorpay, which is signature-
 * verified, idempotent, marks the invoice PAID and sends both confirmations.
 * The `callback_url` below is ONLY where the buyer's browser lands after
 * paying — so it must be the human-facing pay page (which then shows the
 * "already paid" state once the webhook has run), never the webhook endpoint.
 */
export async function createPaymentLink(params: CreatePaymentLinkParams): Promise<{
  id: string
  short_url: string
}> {
  const razorpay = getRazorpay()

  const link = await razorpay.paymentLink.create({
    amount: Math.round(params.amount * 100),
    currency: 'INR',
    description: `Payment for Invoice ${params.invoiceNumber}`,
    customer: {
      name: params.customerName,
      contact: params.customerPhone,
      email: params.customerEmail || undefined,
    },
    notify: { sms: false, email: false },
    reminder_enable: false,
    notes: {
      invoiceId: params.invoiceId,
      businessId: params.businessId,
    },
    // Where the BUYER's browser returns after paying — the human pay page,
    // not the webhook. Razorpay appends its own status params to this URL.
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${params.invoiceId}`,
    callback_method: 'get',
  } as Parameters<typeof razorpay.paymentLink.create>[0])

  return link as { id: string; short_url: string }
}

export async function expirePaymentLink(linkId: string): Promise<void> {
  const razorpay = getRazorpay()
  await razorpay.paymentLink.cancel(linkId)
}
