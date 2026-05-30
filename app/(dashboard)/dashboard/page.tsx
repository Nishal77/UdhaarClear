import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { TopDefaulters } from '@/components/dashboard/TopDefaulters'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { CollectionChart } from '@/components/dashboard/CollectionChart'
import { PageHeader } from '@/components/layout/PageHeader'
import Link from 'next/link'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

async function getDashboardData(businessId: string) {
  const now = new Date()
  const startOfThisMonth = startOfMonth(now)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  const [outstandingAgg, overdueAgg, collectedAgg, reminderCount, topDefaultersRaw, recentReminders, recentPaid] =
    await Promise.all([
      prisma.invoice.aggregate({
        where: { businessId, status: { in: ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'] } },
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { businessId, status: 'OVERDUE' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.invoice.aggregate({
        where: { businessId, status: 'PAID', paidAt: { gte: startOfThisMonth } },
        _sum: { paidAmount: true },
      }),
      prisma.reminder.count({ where: { businessId, createdAt: { gte: today } } }),
      prisma.invoice.groupBy({
        by: ['customerId'],
        where: { businessId, status: 'OVERDUE' },
        _sum: { amount: true },
        _max: { dueDate: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 5,
      }),
      prisma.reminder.findMany({
        where: { businessId, createdAt: { gte: today } },
        include: { invoice: { include: { customer: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.invoice.findMany({
        where: { businessId, status: 'PAID', paidAt: { gte: startOfThisMonth } },
        include: { customer: true },
        orderBy: { paidAt: 'desc' },
        take: 5,
      }),
    ])

  // Enrich defaulters with customer info
  const customerIds = topDefaultersRaw.map((d) => d.customerId)
  const [customers, lastReminders] = await Promise.all([
    prisma.customer.findMany({ where: { id: { in: customerIds } } }),
    prisma.reminder.findMany({
      where: { invoice: { customerId: { in: customerIds } } },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true, invoice: { select: { customerId: true } } },
      distinct: ['invoiceId'],
    }),
  ])

  const topDefaulters = topDefaultersRaw.map((d) => {
    const customer = customers.find((c) => c.id === d.customerId)!
    const lastReminder = lastReminders.find((r) => r.invoice.customerId === d.customerId)
    return {
      customerId: d.customerId,
      customerName: customer?.name ?? 'Unknown',
      totalOverdue: Number(d._sum.amount ?? 0),
      oldestDaysOverdue: d._max.dueDate
        ? Math.max(0, Math.floor((now.getTime() - d._max.dueDate.getTime()) / 86400000))
        : 0,
      lastReminderAt: lastReminder?.createdAt ?? null,
    }
  })

  // Build activities
  const activities = [
    ...recentReminders.map((r) => ({
      id: r.id,
      type: 'reminder_sent' as const,
      customerName: r.invoice.customer.name,
      amount: Number(r.invoice.amount),
      createdAt: r.createdAt,
    })),
    ...recentPaid.map((inv) => ({
      id: inv.id,
      type: 'payment_received' as const,
      customerName: inv.customer.name,
      amount: Number(inv.paidAmount ?? inv.amount),
      createdAt: inv.paidAt ?? inv.updatedAt,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)

  // Last 6 months chart data
  const chartData = await Promise.all(
    Array.from({ length: 6 }, async (_, i) => {
      const monthDate = subMonths(now, 5 - i)
      const start = startOfMonth(monthDate)
      const end = endOfMonth(monthDate)
      const [inv, col] = await Promise.all([
        prisma.invoice.aggregate({
          where: { businessId, invoiceDate: { gte: start, lte: end } },
          _sum: { amount: true },
        }),
        prisma.invoice.aggregate({
          where: { businessId, status: 'PAID', paidAt: { gte: start, lte: end } },
          _sum: { paidAmount: true },
        }),
      ])
      return {
        month: format(monthDate, 'MMM yy'),
        invoiced: Number(inv._sum.amount ?? 0),
        collected: Number(col._sum.paidAmount ?? 0),
      }
    })
  )

  return {
    stats: {
      totalOutstanding: Number(outstandingAgg._sum.amount ?? 0),
      totalOverdue: Number(overdueAgg._sum.amount ?? 0),
      overdueCount: overdueAgg._count,
      collectedThisMonth: Number(collectedAgg._sum.paidAmount ?? 0),
      remindersSentToday: reminderCount,
    },
    topDefaulters,
    activities,
    chartData,
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })

  if (!dbUser?.ownedBusiness) redirect('/onboarding')

  const { stats, topDefaulters, activities, chartData } = await getDashboardData(dbUser.ownedBusiness.id)

  return (
    <div className="space-y-6">
      <PageHeader
        title={`नमस्ते, ${dbUser.name.split(' ')[0]} 👋`}
        description="Here's your outstanding payment overview"
        action={
          <Link
            href="/invoices/new"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            + Add Invoice
          </Link>
        }
      />

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopDefaulters defaulters={topDefaulters} />
        <RecentActivity activities={activities} />
      </div>

      <CollectionChart data={chartData} />
    </div>
  )
}
