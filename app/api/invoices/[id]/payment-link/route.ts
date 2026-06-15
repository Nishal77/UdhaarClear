import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { id } = await params
  const invoice = await prisma.invoice.findFirst({
    where: { id, businessId: session.businessId },
  })
  if (!invoice) return apiError('NOT_FOUND', 'Invoice not found', 404)

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${id}`
  return apiSuccess({ url })
}
