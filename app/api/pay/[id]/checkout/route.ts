import { prisma } from '@/lib/prisma/client'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { createPaymentLink } from '@/lib/razorpay/payment-link'

/**
 * POST /api/pay/[id]/checkout
 *
 * Public endpoint. Returns a Razorpay hosted payment-link URL for the invoice
 * so the buyer can pay by Card / UPI / Net-banking in one tap. Reconciliation
 * happens via the `payment_link.paid` webhook (idempotent, marks invoice paid,
 * sends confirmations) — this route only mints/returns the link.
 *
 * The generated link is cached on the invoice (razorpayLinkId/razorpayLinkUrl)
 * and reused on repeat clicks, so we never create duplicate links for the same
 * unpaid invoice.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return apiError('NOT_CONFIGURED', 'Online payment is not available right now', 503)
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: { select: { name: true, contactName: true, phone: true, email: true } },
      business: { select: { id: true } },
    },
  })

  if (!invoice) return apiError('NOT_FOUND', 'Invoice not found', 404)
  if (invoice.status === 'PAID') return apiError('ALREADY_PAID', 'Invoice is already fully paid', 400)
  if (invoice.status === 'WRITTEN_OFF') return apiError('INVALID', 'Invoice has been written off', 400)

  // Reuse an existing link for this unpaid invoice rather than minting a new
  // one on every click.
  if (invoice.razorpayLinkUrl) {
    return apiSuccess({ url: invoice.razorpayLinkUrl })
  }

  try {
    const link = await createPaymentLink({
      invoiceId: invoice.id,
      businessId: invoice.business.id,
      invoiceNumber: invoice.invoiceNumber,
      amount: Number(invoice.amount) - Number(invoice.paidAmount ?? 0),
      customerName: invoice.customer.contactName ?? invoice.customer.name,
      customerPhone: invoice.customer.phone,
      customerEmail: invoice.customer.email,
    })

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { razorpayLinkId: link.id, razorpayLinkUrl: link.short_url },
    })

    return apiSuccess({ url: link.short_url })
  } catch (err) {
    console.error('Failed to create Razorpay payment link:', err)
    return apiError('CHECKOUT_FAILED', 'Could not start online payment. Please try another method.', 502)
  }
}
