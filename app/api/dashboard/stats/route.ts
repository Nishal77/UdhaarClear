import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'
import { daysOverdue } from '@/lib/utils/date'
import { buildAgeingBreakdown } from '@/lib/utils/ageing'

const OUTSTANDING_STATUSES = ['PENDING', 'DUE', 'OVERDUE', 'PENDING_CONFIRMATION', 'PARTIALLY_PAID'] as const

export async function GET() {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const businessId = session.businessId
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  const [outstandingResult, overdueResult, collectedResult, reminderCount, outstandingInvoices] = await Promise.all([
    prisma.invoice.aggregate({
      where: { businessId, status: { in: [...OUTSTANDING_STATUSES] } },
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
    // Fetched separately (not aggregated) because ageing buckets need each
    // invoice's own days-overdue value — Prisma can't bucket-and-sum in one
    // query, so we do it in JS via buildAgeingBreakdown().
    prisma.invoice.findMany({
      where: { businessId, status: { in: [...OUTSTANDING_STATUSES] } },
      select: { dueDate: true, amount: true, paidAmount: true },
    }),
  ])

  const ageingBuckets = buildAgeingBreakdown(
    outstandingInvoices.map((inv) => ({
      dueDate: inv.dueDate,
      amount: Number(inv.amount),
      paidAmount: inv.paidAmount ? Number(inv.paidAmount) : null,
    })),
    daysOverdue
  )

  return apiSuccess({
    totalOutstanding: Number(outstandingResult._sum.amount ?? 0),
    totalOverdue: Number(overdueResult._sum.amount ?? 0),
    overdueCount: overdueResult._count,
    collectedThisMonth: Number(collectedResult._sum.paidAmount ?? 0),
    remindersSentToday: reminderCount,
    ageingBuckets,
  })
}
