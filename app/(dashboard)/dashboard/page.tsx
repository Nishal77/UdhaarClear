import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import Link from 'next/link'
import { TopDefaulters } from '@/components/dashboard/TopDefaulters'
import { RecoveryWidget } from '@/components/dashboard/RecoveryWidget'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { formatINRCompact } from '@/lib/utils/currency'
import { TrackerRow } from '@/components/dashboard/TrackerRow'
import { RecoveryTrend } from '@/components/dashboard/RecoveryTrend'
import { HugeiconsIcon } from '@hugeicons/react'
import { SentIcon, Share03Icon } from '@hugeicons/core-free-icons'
import { Dot } from 'lucide-react'

async function getDashboardData(businessId: string) {
  const now = new Date()
  const startOfThisMonth = startOfMonth(now)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  const [outstandingAgg, overdueAgg, collectedAgg, reminderCount, topDefaultersRaw, recentReminders, recentPaid, overdueInvoicesRaw] =
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
        where: { businessId },
        include: { invoice: { include: { customer: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.invoice.findMany({
        where: { businessId, status: 'PAID' },
        include: { customer: true },
        orderBy: { paidAt: 'desc' },
        take: 5,
      }),
      prisma.invoice.findMany({
        where: { businessId, status: 'OVERDUE' },
        include: { customer: true },
        orderBy: { dueDate: 'asc' },
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

  const overdueInvoices = overdueInvoicesRaw.map((inv) => {
    let tone: 'GENTLE' | 'FIRM' | 'LEGAL' = 'GENTLE'
    if (inv.reminderTone === 'LEGAL') tone = 'LEGAL'
    else if (inv.reminderTone === 'FIRM') tone = 'FIRM'

    return {
      id: inv.id,
      customerId: inv.customerId,
      customerName: inv.customer?.name ?? 'Unknown',
      invoiceNumber: inv.invoiceNumber,
      amount: Number(inv.amount),
      dueDate: inv.dueDate,
      overdueDays: Math.max(0, Math.floor((now.getTime() - inv.dueDate.getTime()) / 86400000)),
      tone,
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
    overdueInvoices,
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

  const { stats, overdueInvoices, activities, chartData } = await getDashboardData(
    dbUser.ownedBusiness.id
  )

  const getCustomerInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const formatRelativeTime = (date: Date) => {
    const diffMs = Date.now() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHrs = Math.floor(diffMins / 60)
    if (diffHrs < 24) return `${diffHrs} hr ago`
    const diffDays = Math.floor(diffHrs / 24)
    if (diffDays === 1) return "Yesterday"
    return format(date, "d MMM")
  }

  const formattedDbActivities = activities.map((act) => {
    const isReminder = act.type === 'reminder_sent'
    const status = isReminder ? 'Sent' : 'Paid'
    const actionText = isReminder ? 'reminder sent' : `paid ${formatINRCompact(act.amount)}`
    const detailsText = isReminder ? 'WhatsApp Automated' : 'via Gateway'
    const timeText = formatRelativeTime(act.createdAt)

    return {
      id: act.id,
      type: isReminder ? ('reminder_sent' as const) : ('payment_received' as const),
      customerName: act.customerName,
      actionText,
      timeText,
      detailsText,
      status: status as 'Sent' | 'Paid',
    }
  })

  const sampleActivities = [
    {
      id: 'sample-1',
      type: 'payment_received' as const,
      customerName: 'Mehta Textiles',
      actionText: 'paid ₹45,000',
      timeText: '10 min ago',
      detailsText: 'via UPI',
      status: 'Paid' as const,
    },
    {
      id: 'sample-2',
      type: 'reminder_sent' as const,
      customerName: 'Sharma Electronics',
      actionText: 'reminder sent',
      timeText: '32 min ago',
      detailsText: 'Day 8 Assertive',
      status: 'Sent' as const,
    },
    {
      id: 'sample-3',
      type: 'escalation' as const,
      customerName: 'Gupta Traders',
      actionText: 'escalated to Final Notice',
      timeText: '1 hr ago',
      detailsText: 'Day 22 — Legal tone',
      status: 'Legal' as const,
    },
    {
      id: 'sample-4',
      type: 'reminder_sent' as const,
      customerName: 'Patel Pharma',
      actionText: 'reminder sent',
      timeText: '2 hr ago',
      detailsText: 'Day 3 Courteous',
      status: 'Sent' as const,
    },
    {
      id: 'sample-5',
      type: 'partial_payment' as const,
      customerName: 'Kapoor Metals',
      actionText: 'partial ₹20,000',
      timeText: 'Yesterday',
      detailsText: 'Balance ₹30,000',
      status: 'Partial' as const,
    },
  ]

  const displayActivities = formattedDbActivities.length > 0 ? formattedDbActivities : sampleActivities

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
            <HugeiconsIcon icon={SentIcon} className="w-3.5 h-3.5 text-white" />
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
              <span className="text-[24px] font-semibold text-gray-900 leading-none">{formatINRCompact(stats.totalOutstanding)}100</span>
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
              <span className="text-[24px] font-semibold text-gray-900 leading-none">{formatINRCompact(stats.collectedThisMonth)}</span>
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
              <span className="text-[24px] font-semibold text-gray-900 leading-none">{stats.remindersSentToday}</span>
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
              <span className="text-[24px] font-semibold text-gray-900 leading-none">{stats.overdueCount}</span>
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
      <div className="mt-6 bg-white border border-[#EBEAE6]/60 rounded-[28px] overflow-hidden">
        {/* Row C: Secondary Dashboard Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200/85">
          {/* ROW 2 LEFT COLUMN: (spans 6 of 12 columns) */}
          <div className="lg:col-span-6 p-6 flex flex-col justify-between">
            <RecoveryTrend />
          </div>

          {/* ROW 2 RIGHT COLUMN: Activity Manager card (spans 6 of 12 columns) */}
          <div className="lg:col-span-6 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className=''>
                <span className="text-[15px] font-black text-gray-950">Live Activity Manager</span>
                <p className="text-[13px] font-medium text-gray-500">Track recent activity in real-time</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-[#EBEAE6]/60 rounded-full py-1 px-3 text-[12px] font-semibold text-black cursor-default">

                  {/* Realistic Live Dot Container */}
                  <span className="relative flex h-2 w-2">
                    {/* Expanding outer ring */}
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    {/* Solid inner dot */}
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>

                  <span>Live</span>
                </div>
              </div>

            </div>

            {/* Activity Table */}
            <div className="mt-4 overflow-x-auto w-full flex-1 min-h-[180px] max-h-[220px]">
              <table className="w-full text-left border-collapse min-w-[400px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[14px] font-medium text-gray-900 tracking-tight">
                    <th className="pb-2.5 font-semibold">Customer</th>
                    <th className="pb-2.5 font-semibold">Activity</th>
                    <th className="pb-2.5 font-semibold text-right pr-6">Time</th>
                    <th className="pb-2.5 font-semibold text-right pr-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/70">
                  {!displayActivities.length ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs text-gray-400 font-medium">
                        No recent activities
                      </td>
                    </tr>
                  ) : (
                    displayActivities.map((act) => {
                      let badgeColor = ''

                      if (act.type === 'payment_received') {
                        badgeColor = 'text-[#12B76A]'
                      } else if (act.type === 'partial_payment') {
                        badgeColor = 'text-[#854D0E]'
                      } else if (act.type === 'escalation') {
                        badgeColor = 'text-[#B91C1C]'
                      } else {
                        // reminder_sent
                        const isYellow = act.customerName === 'Patel Pharma'
                        if (isYellow) {
                          badgeColor = 'text-[#B45309]'
                        } else {
                          badgeColor = 'text-[#1D4ED8]'
                        }
                      }

                      return (
                        <tr key={act.id} className="text-xs hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 pr-2">
                            <span className="font-semibold text-gray-900 truncate block max-w-[130px]">{act.customerName}</span>
                          </td>
                          <td className="py-3 text-gray-700 text-[13px] pr-2">
                            <span>{act.actionText}</span>
                            {act.detailsText && (
                              <span className="text-[11.5px] text-gray-400 font-medium ml-1">
                                ({act.detailsText})
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right text-gray-500 font-medium text-[12.5px] pr-6 whitespace-nowrap">
                            {act.timeText}
                          </td>
                          <td className="py-3 text-right pr-2">
                            <span className={`text-[12.5px] font-medium ${badgeColor}`}>
                              {act.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* End of secondary insights card */}

      {/* ── Needs Your Attention Today ── */}
      <div className="mt-6 bg-white border border-[#EBEAE6]/60 rounded-[28px] overflow-hidden">
        <TopDefaulters invoices={overdueInvoices} noBorder={true} />
      </div>

      {/* ── Smart Cashflow Analytics / Two-Column Card ── */}
      <div className="mt-6 mb-4 bg-white border border-[#EBEAE6]/60 rounded-[28px] overflow-hidden select-none relative group">
        {/* Soft Radial Gradient Background for premium glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(255,106,57,0.025),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_-20%,rgba(59,130,246,0.015),transparent_50%)] pointer-events-none" />

        {/* Master Premium Header for the entire module */}
        <div className="px-8 py-5 border-b border-gray-100/80 bg-gradient-to-r from-white to-gray-50/10 flex flex-col gap-1 relative z-20">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[17px] font-black text-gray-950 tracking-tight">Recovery & Collection Telemetry</h2>
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
              Live Cashflow Diagnostics
            </span>
          </div>
          <p className="text-[13px] text-gray-500 font-medium">
            Analyze outstanding invoice distribution by communication tone severity and monitor recovery performance across automated payment corridors.
          </p>
        </div>

        {/* Content Area with RecoveryWidget */}
        <div className="p-8 relative z-10">
          <RecoveryWidget />
        </div>
      </div>
    </div>
  )
}
