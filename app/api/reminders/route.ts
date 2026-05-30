import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'

export async function GET(request: Request) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { searchParams } = new URL(request.url)
  const invoiceId = searchParams.get('invoiceId')
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') ?? '50')

  const reminders = await prisma.reminder.findMany({
    where: {
      businessId: session.businessId,
      ...(invoiceId && { invoiceId }),
      ...(status && { status: status as never }),
    },
    include: {
      invoice: { include: { customer: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return apiSuccess({ reminders })
}
