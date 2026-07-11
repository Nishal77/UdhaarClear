import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'
import { confirmInvoicePayment } from '@/lib/services/payment-confirmation'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { id } = await params

  const invoice = await prisma.invoice.findFirst({
    where: { id, businessId: session.businessId },
  })
  if (!invoice) return apiError('NOT_FOUND', 'Invoice not found', 404)
  if (invoice.status !== 'PENDING_CONFIRMATION') {
    return apiError('BAD_STATE', 'Invoice is not awaiting confirmation', 422)
  }

  const result = await confirmInvoicePayment({ invoiceId: id, expectedBusinessId: session.businessId })

  if (result.notFound) return apiError('NOT_FOUND', 'Invoice not found', 404)

  return apiSuccess({ message: 'Payment confirmed', alreadyPaid: result.alreadyPaid })
}
