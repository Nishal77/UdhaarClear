import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'
import { createPaymentLink } from '@/lib/razorpay/payment-link'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { id } = await params
  const invoice = await prisma.invoice.findFirst({
    where: { id, businessId: session.businessId },
    include: { customer: true },
  })
  if (!invoice) return apiError('NOT_FOUND', 'Invoice not found', 404)

  const link = await createPaymentLink({
    invoiceId: id,
    businessId: session.businessId,
    invoiceNumber: invoice.invoiceNumber,
    amount: Number(invoice.amount),
    customerName: invoice.customer.contactName ?? invoice.customer.name,
    customerPhone: invoice.customer.phone,
    customerEmail: invoice.customer.email,
  })

  await prisma.invoice.update({
    where: { id },
    data: { razorpayLinkId: link.id, razorpayLinkUrl: link.short_url },
  })

  return apiSuccess({ url: link.short_url, linkId: link.id })
}
