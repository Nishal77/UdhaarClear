import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'

export async function GET() {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const businessId = session.businessId
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  const [outstandingResult, overdueResult, collectedResult, reminderCount] = await Promise.all([
    prisma.invoice.aggregate({
      where: { businessId, status: { in: ['PENDING', 'DUE', 'OVERDUE', 'PENDING_CONFIRMATION', 'PARTIALLY_PAID'] } },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { businessId, status: 'OVERDUE' },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: { businessId, status: 'PAID', paidAt: { gte: startOfMonth } },
      _sum: { paidAmount: true },
    }),
    prisma.reminder.count({
      where: { businessId, createdAt: { gte: today } },
    }),
  ])

  return apiSuccess({
    totalOutstanding: Number(outstandingResult._sum.amount ?? 0),
    totalOverdue: Number(overdueResult._sum.amount ?? 0),
    overdueCount: overdueResult._count,
    collectedThisMonth: Number(collectedResult._sum.paidAmount ?? 0),
    remindersSentToday: reminderCount,
  })
}
