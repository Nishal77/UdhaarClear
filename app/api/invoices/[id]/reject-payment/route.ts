import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'
import { sendTextMessage } from '@/lib/whatsapp/client'
import { formatPhoneForWhatsApp } from '@/lib/services/reminder-service'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { id } = await params

  const invoice = await prisma.invoice.findFirst({
    where: { id, businessId: session.businessId },
    include: { customer: true },
  })
  if (!invoice) return apiError('NOT_FOUND', 'Invoice not found', 404)
  if (invoice.status !== 'PENDING_CONFIRMATION') {
    return apiError('BAD_STATE', 'Invoice is not awaiting confirmation', 422)
  }

  await prisma.invoice.update({
    where: { id },
    data: { status: 'OVERDUE', paymentRef: null, autoReminder: true },
  })

  // Notify buyer
  await sendTextMessage({
    to: formatPhoneForWhatsApp(invoice.customer.phone),
    body: `⚠️ We couldn't verify your payment for invoice ${invoice.invoiceNumber}. Please check your transaction details and resubmit, or contact the business directly.`,
  }).catch(() => {})

  return apiSuccess({ message: 'Payment rejected, buyer notified' })
}
