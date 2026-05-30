import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { TopDefaulters } from '@/components/dashboard/TopDefaulters'
import Link from 'next/link'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { formatINRCompact } from '@/lib/utils/currency'
import { TrackerRow } from '@/components/dashboard/TrackerRow'
import { RecoveryTrend } from '@/components/dashboard/RecoveryTrend'
import { HugeiconsIcon } from '@hugeicons/react'
import { SentIcon, Share03Icon } from '@hugeicons/core-free-icons'

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
        _count: true,
      }),
      prisma.invoice.aggregate({
        where: { businessId, status: 'OVERDUE' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.invoice.aggregate({
        where: { businessId, status: 'PAID', paidAt: { gte: startOfThisMonth } },
        _sum: { paidAmount: true },
        _count: true,
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
    .slice(0, 5)

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
      outstandingCount: outstandingAgg._count,
      totalOverdue: Number(overdueAgg._sum.amount ?? 0),
      overdueCount: overdueAgg._count,
      collectedThisMonth: Number(collectedAgg._sum.paidAmount ?? 0),
      collectedCount: collectedAgg._count,
      remindersSentToday: reminderCount,
    },
    topDefaulters,
    activities,
    chartData,
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })

  if (!dbUser?.ownedBusiness) redirect('/onboarding')

  const { stats, topDefaulters, activities, chartData } = await getDashboardData(
    dbUser.ownedBusiness.id
  )

  const recoveryRate =
    stats.totalOutstanding > 0
      ? Math.round((stats.collectedThisMonth / (stats.collectedThisMonth + stats.totalOutstanding)) * 100)
      : 0

  const outstandingTrackerData = [
    { color: 'bg-red-500', tooltip: 'Overdue' },
    { color: 'bg-red-500', tooltip: 'Overdue' },
    { color: 'bg-red-500', tooltip: 'Overdue' },
    { color: 'bg-red-500', tooltip: 'Overdue' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-orange-500', tooltip: 'Pending' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
    { color: 'bg-amber-300', tooltip: 'Future' },
  ]

  const collectedTrackerData = [
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-red-600', tooltip: 'Error' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-red-600', tooltip: 'Error' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-yellow-600', tooltip: 'Partial' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { tooltip: 'Pending' },
    { tooltip: 'Pending' },
    { tooltip: 'Pending' },
    { tooltip: 'Pending' },
    { tooltip: 'Pending' },
    { tooltip: 'Pending' },
    { tooltip: 'Pending' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-yellow-600', tooltip: 'Partial' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-red-600', tooltip: 'Error' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
    { color: 'bg-emerald-600', tooltip: 'Recovered' },
  ]

  // Monthly tracker data (30 blocks representing the last 30 days)
  const outstandingMonthlyData = Array.from({ length: 30 }, (_, i) => {
    let color = 'bg-amber-300'
    let status = 'Future'
    if (i < 4) {
      color = 'bg-red-500'
      status = 'Overdue'
    } else if (i < 15) {
      color = 'bg-orange-500'
      status = 'Pending'
    }
    return { color, tooltip: `Day ${i + 1} — ${status}` }
  })

  const collectedMonthlyData = Array.from({ length: 30 }, (_, i) => {
    let color: string | undefined = 'bg-emerald-600'
    let status = 'Recovered'
    if (i === 12 || i === 24) {
      color = 'bg-red-600'
      status = 'Error'
    } else if (i === 8 || i === 18) {
      color = 'bg-yellow-500'
      status = 'Partial'
    } else if (i > 25) {
      color = undefined
      status = 'Pending'
    }
    return { color, tooltip: `Day ${i + 1} — ${status}` }
  })

  const hour = new Date().getHours()
  let greeting = 'Welcome back'
  if (hour < 12) greeting = 'Good morning'
  else if (hour < 17) greeting = 'Good afternoon'
  else greeting = 'Good evening'

  return (
    <div className="space-y-8 px-2 select-none">
      {/* ── Heading Section ── */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-[26px] font-medium text-gray-900 leading-none flex items-center gap-2.5">
            <span>{greeting}, {dbUser.name.split(' ')[0]}</span>
            <span>👋</span>
          </h1>
          <div className="flex items-center gap-1.5 mt-3.5 text-[12px] text-gray-700 font-medium tracking-tight">
            <span>Home</span>
            <svg className="w-2.5 h-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900">Overview</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-3">
          <Link
            href="/invoices/new"
            className="flex items-center gap-2 rounded-full border border-[#EBEAE6] bg-white px-5 py-2.5 text-[14px] font-medium text-black hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shadow-3xs"
          >
            <svg className="w-3.5 h-3.5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Invoice
          </Link>
          
          <Link
            href="/reminders"
            className="flex items-center gap-2 rounded-full bg-[#FF6A39] hover:bg-[#E05B2E] px-5 py-2.5 text-[14px] font-medium text-white active:scale-95 transition-all cursor-pointer shadow-3xs"
          >
            <HugeiconsIcon icon={SentIcon} className="w-3.5 h-3.5 text-white"  />
            Send Reminders
          </Link>

          {/* Share Button Mockup */}
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#EBEAE6]/60  hover:bg-gray-50 active:scale-95 transition-all cursor-pointer">
           <HugeiconsIcon icon={Share03Icon} />
          </button>
        </div>
      </div>

      {/* ── Unified Dashboard Stats & Trackers Panel ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[32px] overflow-hidden flex flex-col">
        {/* Row A: Quick Stats */}
        <div className="p-6 flex flex-col md:flex-row items-stretch justify-between gap-5 md:gap-0 md:divide-x divide-y md:divide-y-0 divide-gray-200/85">
          {/* Col 1: Total Outstanding */}
          <div className="flex flex-col text-left md:pr-6 pb-4 md:pb-0 flex-1 justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Total Outstanding</span>
            <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
              <span className="text-[24px] font-black text-gray-900 leading-none">{formatINRCompact(stats.totalOutstanding)}</span>
              <span className="text-[11.5px] font-bold text-rose-600 flex items-center gap-0.5">
                <span>↑ 8%</span>
                <span className="text-gray-400 font-medium">vs last month</span>
              </span>
            </div>
          </div>

          {/* Col 2: Recovered This Month */}
          <div className="flex flex-col text-left pt-4 md:pt-0 md:px-6 pb-4 md:pb-0 flex-1 justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Recovered This Month</span>
            <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
              <span className="text-[24px] font-black text-gray-900 leading-none">{formatINRCompact(stats.collectedThisMonth)}</span>
              <span className="text-[11.5px] font-bold text-emerald-600 flex items-center gap-0.5">
                <span>↑ 23%</span>
                <span className="text-gray-400 font-medium">vs last month</span>
              </span>
            </div>
          </div>

          {/* Col 3: Reminders Sent Today */}
          <div className="flex flex-col text-left pt-4 md:pt-0 md:px-6 pb-4 md:pb-0 flex-1 justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Reminders Sent Today</span>
            <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
              <span className="text-[24px] font-bold text-gray-900 leading-none">{stats.remindersSentToday}</span>
              <span className="text-[11.5px] font-medium text-gray-500 flex items-center gap-1">
                <span>via WhatsApp</span>
                <span className="text-emerald-600 font-medium">· 9 delivered</span>
              </span>
            </div>
          </div>

          {/* Col 4: Overdue Customers */}
          <div className="flex flex-col text-left pt-4 md:pt-0 md:pl-6 flex-1 justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Overdue Customers</span>
            <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
              <span className="text-[24px] font-black text-gray-900 leading-none">{stats.overdueCount}</span>
              <span className="text-[11.5px] font-medium text-gray-500 flex items-center gap-1 flex-wrap">
                <span>3 need</span>
                <span className="text-rose-600 font-medium">Final Notice</span>
              </span>
            </div>
          </div>
        </div>

        {/* Row B: Tracker Weekly Cards */}
        <TrackerRow
          outstandingWeekly={outstandingTrackerData}
          collectedWeekly={collectedTrackerData}
          outstandingMonthly={outstandingMonthlyData}
          collectedMonthly={collectedMonthlyData}
          outstandingCount={stats.outstandingCount}
          totalOutstanding={formatINRCompact(stats.totalOutstanding)}
          collectedThisMonth={formatINRCompact(stats.collectedThisMonth)}
        />
      </div>
      {/* End of unified stats + trackers card */}

      {/* ── Secondary Insights Row ── */}
      <div className="mt-6 bg-white border border-[#EBEAE6]/60 rounded-[28px] shadow-2xs overflow-hidden">
        {/* Row C: Secondary Dashboard Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200/85">
          {/* ROW 2 LEFT COLUMN: (spans 6 of 12 columns) */}
          <div className="lg:col-span-6 p-6 flex flex-col justify-between">
            <RecoveryTrend />
          </div>

          {/* ROW 2 RIGHT COLUMN: Activity Manager card (spans 6 of 12 columns) */}
          <div className="lg:col-span-6 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-black text-gray-950">Activity manager</span>
              <div className="flex items-center gap-3">
                {/* Option toggle buttons */}
                <button className="p-1 hover:bg-gray-50 rounded-full transition-colors cursor-pointer text-gray-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-50 rounded-full transition-colors cursor-pointer text-gray-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
                  </svg>
                </button>
                <button className="flex items-center gap-1.5 bg-white border border-[#EBEAE6]/60 rounded-full py-1 px-3 text-[10px] font-bold text-gray-500 hover:bg-gray-50 shadow-3xs cursor-pointer">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Activity inner card layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-6 items-start">
              {/* Column A: Activity list (5 of 12) */}
              <div className="md:col-span-5 flex flex-col gap-4 h-64 overflow-y-auto no-scrollbar pr-1">
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search in activities ..."
                    className="w-full bg-[#EBEAE6]/40 border border-[#EBEAE6]/20 rounded-full pl-9 pr-3 py-1.5 text-[11px] text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#EBEAE6] transition-colors"
                  />
                </div>

                {/* Dynamic activity cards */}
                {!activities.length ? (
                  <p className="text-[11px] text-gray-400 font-semibold mt-4 text-center">No recent activities</p>
                ) : (
                  activities.map((act) => (
                    <div key={act.id} className="flex flex-col gap-1 border border-gray-100 rounded-xl p-2.5 shadow-3xs bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {act.type === 'reminder_sent' ? (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#128C7E]/10 shrink-0">
                              <svg className="w-2.5 h-2.5 text-[#128C7E] fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.449 5.4 0 9.792-4.386 9.795-9.779.002-2.612-1.01-5.069-2.852-6.912C16.37 2.069 13.92 1.05 11.298 1.05c-5.4 0-9.792 4.386-9.794 9.78-.001 2.024.52 4.001 1.51 5.725l-.99 3.613 3.73-.978z" />
                              </svg>
                            </div>
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 shrink-0">
                              <svg className="w-2.5 h-2.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                          )}
                          <span className="text-[10px] font-bold text-gray-900 truncate max-w-[70px]">{act.customerName}</span>
                        </div>
                        <span className="text-[11px] font-black text-gray-800">{formatINRCompact(act.amount)}</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-semibold self-start mt-0.5">
                        {format(act.createdAt, 'd MMM, h:mm a')}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Column B: Workflow steps (3 of 12) */}
              <div className="md:col-span-3 border border-gray-100 rounded-[24px] p-4 bg-white shadow-3xs flex flex-col justify-between h-64">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-gray-950 uppercase leading-none">Workflow</span>
                  <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                </div>

                {/* Vertical timeline dots */}
                <div className="flex flex-col gap-5 mt-4 relative pl-4.5 border-l-2 border-dashed border-[#ECEAE6] ml-2 my-auto">
                  <div className="relative">
                    <span className="absolute -left-6.5 top-0.5 w-3.5 h-3.5 rounded-full bg-[#FF6A39] border border-white shadow-2xs" />
                    <span className="text-[10px] font-black text-gray-900 block leading-tight">Polite WhatsApp</span>
                    <span className="text-[8px] text-gray-400 font-semibold block mt-0.5">Automated</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-6.5 top-0.5 w-3.5 h-3.5 rounded-full bg-[#FF6A39] border border-white shadow-2xs" />
                    <span className="text-[10px] font-black text-gray-900 block leading-tight">Escalation text</span>
                    <span className="text-[8px] text-gray-400 font-semibold block mt-0.5">Automated</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-6.5 top-0.5 w-3.5 h-3.5 rounded-full bg-[#FF6A39] border border-white shadow-2xs" />
                    <span className="text-[10px] font-black text-gray-900 block leading-tight">Final Notice</span>
                    <span className="text-[8px] text-gray-400 font-semibold block mt-0.5">Legal drafting</span>
                  </div>
                </div>
              </div>

              {/* Column C: WhatsApp setup card (4 of 12) */}
              <div className="md:col-span-4 border border-gray-100 rounded-[24px] p-5 bg-white shadow-3xs flex flex-col justify-between h-64">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF5EE]/60 border border-[#FFF5EE] shadow-2xs">
                  {/* Stylized Sun/Verification graphic */}
                  <svg className="w-5.5 h-5.5 text-[#FF6A39]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                </div>

                <div className="my-3">
                  <span className="text-[11.5px] font-black text-gray-950 leading-tight block">WhatsApp API</span>
                  <span className="text-[9px] text-gray-400 font-semibold block mt-1 leading-normal">
                    Verify business profile to automate collections.
                  </span>
                </div>

                <Link
                  href="/settings/whatsapp"
                  className="w-full text-center bg-[#FF6A39] hover:bg-[#E05B2E] text-white rounded-full py-2 text-[10px] font-black tracking-wider uppercase transition-colors"
                >
                  Enable
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End of secondary insights card */}

      {/* ── Overdue Debtor Table ── */}
      <div className="mt-6 mb-8 bg-white border border-[#EBEAE6]/60 rounded-[28px] shadow-2xs overflow-hidden">
        <TopDefaulters defaulters={topDefaulters} noBorder={true} />
      </div>
    </div>
  )
}
