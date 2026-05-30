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
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/razorpay`,
    callback_method: 'get',
  } as Parameters<typeof razorpay.paymentLink.create>[0])

  return link as { id: string; short_url: string }
}

export async function expirePaymentLink(linkId: string): Promise<void> {
  const razorpay = getRazorpay()
  await razorpay.paymentLink.cancel(linkId)
}
