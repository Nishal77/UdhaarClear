import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { InvoiceTable } from '@/components/invoices/InvoiceTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatINRCompact } from '@/lib/utils/currency'
import Link from 'next/link'
import { startOfMonth } from 'date-fns'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  InvoiceIcon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  RupeeCircleIcon,
  Clock01Icon,
  Add01Icon,
} from '@hugeicons/core-free-icons'

const STATUS_TABS = [
  { label: 'All',      value: undefined },
  { label: 'Overdue',  value: 'OVERDUE' },
  { label: 'Due',      value: 'DUE' },
  { label: 'Pending',  value: 'PENDING' },
  { label: 'Paid',     value: 'PAID' },
] as const

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const { status } = await searchParams
  const businessId = dbUser.ownedBusiness.id

  // Fetch filtered invoices
  const invoices = await prisma.invoice.findMany({
    where: {
      businessId,
      ...(status ? { status: status as never } : {}),
    },
    include: { customer: true },
    orderBy: { dueDate: 'asc' },
  })

  // Aggregate stats (always across ALL invoices)
  const [overdueAgg, paidAgg, pendingAgg, totalAgg] = await Promise.all([
    prisma.invoice.aggregate({
      where: { businessId, status: 'OVERDUE' },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: { businessId, status: 'PAID', paidAt: { gte: startOfMonth(new Date()) } },
      _sum: { paidAmount: true },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: { businessId, status: { in: ['PENDING', 'DUE'] } },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: { businessId, status: { in: ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'] } },
      _sum: { amount: true },
    }),
  ])

  const stats = [
    {
      label: 'Total Outstanding',
      value: formatINRCompact(Number(totalAgg._sum.amount ?? 0)),
      sub: 'Pending + Overdue',
      accentBar: 'bg-brand-500',
      iconBg: 'bg-brand-500',
      icon: RupeeCircleIcon,
    },
    {
      label: 'Overdue Invoices',
      value: overdueAgg._count.toString(),
      sub: formatINRCompact(Number(overdueAgg._sum.amount ?? 0)) + ' at risk',
      accentBar: 'bg-red-500',
      iconBg: 'bg-red-500',
      icon: AlertCircleIcon,
    },
    {
      label: 'Pending / Due',
      value: pendingAgg._count.toString(),
      sub: formatINRCompact(Number(pendingAgg._sum.amount ?? 0)),
      accentBar: 'bg-amber-500',
      iconBg: 'bg-amber-500',
      icon: Clock01Icon,
    },
    {
      label: 'Recovered This Month',
      value: formatINRCompact(Number(paidAgg._sum.paidAmount ?? 0)),
      sub: `${paidAgg._count} paid this month`,
      accentBar: 'bg-emerald-500',
      iconBg: 'bg-emerald-500',
      icon: CheckmarkCircle01Icon,
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-2">
            <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gray-600 font-medium">Invoices</span>
          </nav>
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight">Invoices</h1>
          <p className="mt-1 text-[13px] text-gray-400">
            Track, manage, and collect on all your outstanding invoices
          </p>
        </div>
        <Link
          href="/invoices/new"
          className="flex items-center gap-2 rounded-xl bg-[#FF6A39] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:bg-[#E05B2E] transition-all"
        >
          <HugeiconsIcon icon={Add01Icon} size={15} />
          Add Invoice
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-2xl bg-white border border-[#EBEAE6]/60 shadow-sm"
          >
            <div className={`absolute top-0 left-0 right-0 h-[3px] ${s.accentBar}`} />
            <div className="p-5 pt-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-[12px] font-semibold text-gray-500">{s.label}</p>
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${s.iconBg}`}>
                  <HugeiconsIcon icon={s.icon} size={15} className="text-white" />
                </div>
              </div>
              <p className="text-[26px] font-bold text-gray-900 leading-none tracking-tight">
                {s.value}
              </p>
              <p className="mt-2 text-[11px] text-gray-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-1 rounded-xl bg-white border border-[#EBEAE6]/60 p-1.5 w-fit shadow-sm">
        {STATUS_TABS.map((tab) => {
          const isActive = tab.value === status || (!tab.value && !status)
          return (
            <Link
              key={tab.label}
              href={tab.value ? `/invoices?status=${tab.value}` : '/invoices'}
              className={`rounded-lg px-4 py-2 text-[13px] font-semibold transition-all ${
                isActive
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* ── Invoice Table or Empty State ── */}
      {invoices.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#EBEAE6]/60 shadow-sm">
          <EmptyState
            icon={<HugeiconsIcon icon={InvoiceIcon} size={40} className="text-gray-300" />}
            title={status ? `No ${status.toLowerCase()} invoices` : 'No invoices yet'}
            description={
              status
                ? `No invoices with status "${status.toLowerCase()}" found`
                : 'Add your first invoice and start recovering payments'
            }
            action={
              !status ? (
                <Link
                  href="/invoices/new"
                  className="rounded-xl bg-[#FF6A39] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#E05B2E] transition-all"
                >
                  Add First Invoice
                </Link>
              ) : undefined
            }
          />
        </div>
      ) : (
        <InvoiceTable invoices={invoices} />
      )}
    </div>
  )
}
