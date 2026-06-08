import { verifyRazorpaySignature } from '@/lib/razorpay/webhook'
import { prisma } from '@/lib/prisma/client'
import { sendTemplateMessage } from '@/lib/whatsapp/client'
import { TEMPLATE_NAMES, buildPaymentConfirmedComponents } from '@/lib/whatsapp/templates'
import { sendEmail } from '@/lib/email/client'
import { paymentReceivedEmail } from '@/lib/email/templates/payment-received'
import { formatINR } from '@/lib/utils/currency'
import type { RazorpayPaymentLinkPaidEvent } from '@/types/razorpay'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-razorpay-signature') ?? ''

  const isValid = verifyRazorpaySignature(body, signature, process.env.RAZORPAY_WEBHOOK_SECRET ?? '')
  if (!isValid) return new Response('Forbidden', { status: 403 })

  const event = JSON.parse(body) as RazorpayPaymentLinkPaidEvent

  if (event.event === 'payment_link.paid') {
    const { invoiceId } = event.payload.payment_link.entity.notes
    const payment = event.payload.payment.entity

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
