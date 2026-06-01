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
  Add01Icon,
} from '@hugeicons/core-free-icons'
import { CategoryBar } from '@/components/ui/CategoryBar'

const STATUS_TABS = [
  { label: 'All',      value: undefined },
  { label: 'Overdue',  value: 'OVERDUE' },
  { label: 'Due',      value: 'DUE' },
  { label: 'Pending',  value: 'PENDING' },
  { label: 'Paid',     value: 'PAID' },
] as const

// ─── Sample data shown when no real invoices exist ────────────────────────────
const SAMPLE_INVOICES = [
  {
    id: 'sample-inv-1',
    businessId: 'demo',
    customerId: 'sample-cust-1',
    invoiceNumber: 'INV-2026-001',
    amount: 185000.00,
    paidAmount: 0.00,
    description: 'Bulk cotton shipment delivery',
    invoiceDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days outstanding (0-7 days, green)
    dueDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000), 
    creditDays: 30,
    status: 'PENDING',
    customer: {
      id: 'sample-cust-1',
      name: 'Ramesh Traders Pvt. Ltd.',
      phone: '+91 98200 11223',
      city: 'Mumbai',
    },
  },
  {
    id: 'sample-inv-2',
    businessId: 'demo',
    customerId: 'sample-cust-3',
    invoiceNumber: 'INV-2026-002',
    amount: 640000.00,
    paidAmount: 200000.00,
    description: 'Steel structural framing parts',
    invoiceDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days outstanding (22+ days, red)
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days overdue
    creditDays: 30,
    status: 'OVERDUE',
    customer: {
      id: 'sample-cust-3',
      name: 'Bharat Steel Works',
      phone: '+91 99000 77811',
      city: 'Pune',
    },
  },
  {
    id: 'sample-inv-3',
    businessId: 'demo',
    customerId: 'sample-cust-2',
    invoiceNumber: 'INV-2026-003',
    amount: 88500.00,
    paidAmount: 0.00,
    description: 'Custom silk weaves batch 4',
    invoiceDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days outstanding (8-21 days, orange)
    dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), 
    creditDays: 30,
    status: 'PENDING',
    customer: {
      id: 'sample-cust-2',
      name: 'Sunita Fabrics',
      phone: '+91 87321 54210',
      city: 'Surat',
    },
  },
  {
    id: 'sample-inv-4',
    businessId: 'demo',
    customerId: 'sample-cust-4',
    invoiceNumber: 'INV-2026-004',
    amount: 215000.00,
    paidAmount: 0.00,
    description: 'OEM brake discs & caliper sets',
    invoiceDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days outstanding (0-7 days, green)
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), 
    creditDays: 15,
    status: 'PENDING',
    customer: {
      id: 'sample-cust-4',
      name: 'Kaveri Auto Parts',
      phone: '+91 93456 22890',
      city: 'Bengaluru',
    },
  },
  {
    id: 'sample-inv-5',
    businessId: 'demo',
    customerId: 'sample-cust-5',
    invoiceNumber: 'INV-2026-005',
    amount: 47000.00,
    paidAmount: 47000.00,
    description: 'High-grade handicraft exports',
    invoiceDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    creditDays: 10,
    status: 'PAID',
    customer: {
      id: 'sample-cust-5',
      name: 'Priya Exports & Co.',
      phone: '+91 82200 65432',
      city: 'Delhi',
    },
  },
]

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

  // Fetch real invoices
  const realInvoices = await prisma.invoice.findMany({
    where: {
      businessId,
    },
    include: { customer: true },
    orderBy: { dueDate: 'asc' },
  })

  const isSampleData = realInvoices.length === 0

  // Filter sample invoices client-side if status filter is active
  const filteredSampleInvoices = status
    ? SAMPLE_INVOICES.filter(i => i.status === status)
    : SAMPLE_INVOICES

  const displayInvoices = isSampleData
    ? (filteredSampleInvoices as unknown as typeof realInvoices)
    : realInvoices.filter(i => !status || i.status === status)

  // Aggregate stats (always across ALL invoices)
  let overdueSum = 0
  let paidSum = 0
  let pendingSum = 0
  let totalOutstanding = 0

  let allCount = 0
  let overdueCount = 0
  let dueCount = 0
  let pendingCount = 0
  let paidCount = 0

  if (isSampleData) {
    allCount = SAMPLE_INVOICES.length
    overdueCount = SAMPLE_INVOICES.filter(i => i.status === 'OVERDUE').length
    dueCount = SAMPLE_INVOICES.filter(i => i.status === 'DUE').length
    pendingCount = SAMPLE_INVOICES.filter(i => i.status === 'PENDING').length
    paidCount = SAMPLE_INVOICES.filter(i => i.status === 'PAID').length

    totalOutstanding = SAMPLE_INVOICES
      .filter((i) => ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'].includes(i.status))
      .reduce((sum, i) => sum + i.amount, 0)

    overdueSum = SAMPLE_INVOICES
      .filter((i) => i.status === 'OVERDUE')
      .reduce((sum, i) => sum + i.amount, 0)

    pendingSum = SAMPLE_INVOICES
      .filter((i) => ['PENDING', 'DUE'].includes(i.status))
      .reduce((sum, i) => sum + i.amount, 0)

    paidSum = SAMPLE_INVOICES
      .filter((i) => i.status === 'PAID')
      .reduce((sum, i) => sum + i.paidAmount, 0)
  } else {
    const [
      overdueAgg,
      paidAgg,
      pendingAgg,
      totalAgg,
      dbAllCount,
      dbOverdueCount,
      dbDueCount,
      dbPendingCount,
      dbPaidCount
    ] = await Promise.all([
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
      prisma.invoice.count({ where: { businessId } }),
      prisma.invoice.count({ where: { businessId, status: 'OVERDUE' } }),
      prisma.invoice.count({ where: { businessId, status: 'DUE' } }),
      prisma.invoice.count({ where: { businessId, status: 'PENDING' } }),
      prisma.invoice.count({ where: { businessId, status: 'PAID' } }),
    ])

    allCount = dbAllCount
    overdueCount = dbOverdueCount
    dueCount = dbDueCount
    pendingCount = dbPendingCount
    paidCount = dbPaidCount

    totalOutstanding = Number(totalAgg._sum.amount ?? 0)
    overdueSum = Number(overdueAgg._sum.amount ?? 0)
    pendingSum = Number(pendingAgg._sum.amount ?? 0)
    paidSum = Number(paidAgg._sum.paidAmount ?? 0)
  }

  // Aging calculations (for unpaid/outstanding invoices: PENDING, DUE, OVERDUE)
  const unpaidInvoicesForAging = isSampleData
    ? SAMPLE_INVOICES.filter(i => ['PENDING', 'DUE', 'OVERDUE'].includes(i.status))
    : realInvoices.filter(i => ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'].includes(i.status))

  let onTrackCount = 0     // 0-7 days
  let watchingCount = 0    // 8-21 days
  let criticalCount = 0    // 22+ days

  const nowMs = Date.now()

  unpaidInvoicesForAging.forEach(inv => {
    const invDate = new Date(inv.invoiceDate)
    const diffMs = nowMs - invDate.getTime()
    const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))

    if (diffDays <= 7) {
      onTrackCount++
    } else if (diffDays <= 21) {
      watchingCount++
    } else {
      criticalCount++
    }
  })

  const totalUnpaidForAging = onTrackCount + watchingCount + criticalCount
  
  // Percentages (fallback to 0 if total is 0)
  const onTrackPercent = totalUnpaidForAging > 0 ? Math.round((onTrackCount / totalUnpaidForAging) * 100) : 0
  const watchingPercent = totalUnpaidForAging > 0 ? Math.round((watchingCount / totalUnpaidForAging) * 100) : 0
  const criticalPercent = totalUnpaidForAging > 0 ? Math.max(0, 100 - onTrackPercent - watchingPercent) : 0

  return (
    <div className="space-y-4">
      {/* ── Page Header ── */}
      <div className="flex flex-col select-none">
        <nav className="flex items-center gap-1.5 text-[12px] text-gray-400">
          <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">Invoices</span>
        </nav>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight">Invoices</h1>
          <Link
            href="/invoices/new"
            className="flex items-center gap-2 rounded-xl bg-[#FF6A39] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:bg-[#E05B2E] transition-all"
          >
            <HugeiconsIcon icon={Add01Icon} size={15} />
            Add Invoice
          </Link>
        </div>
        <p className="mt-1 text-[13px] text-gray-400">
          Track, manage, and collect on all your outstanding invoices
        </p>
      </div>

      {/* ── Stat Cards (Unified Premium Row) ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] overflow-hidden select-none">
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x">

          {/* Column 1: Total Outstanding */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Total Outstanding</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                {formatINRCompact(totalOutstanding)}
              </span>
              <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                Pending + Overdue
              </span>
            </div>
          </div>

          {/* Column 2: Overdue Invoices */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Overdue Invoices</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className={`text-[26px] font-bold tracking-tight leading-none ${overdueCount > 0 ? 'text-[#FF0000]' : 'text-gray-900'}`}>
                {overdueCount}
              </span>
              <span className={`text-[11px] font-medium whitespace-nowrap ${overdueCount > 0 ? 'text-[#FF0000]' : 'text-gray-400'}`}>
                {formatINRCompact(overdueSum)} at risk
              </span>
            </div>
          </div>

          {/* Column 3: Pending / Due */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Pending / Due</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                {pendingCount + dueCount}
              </span>
              <span className="text-[11px] text-[#FF8C42] font-medium whitespace-nowrap">
                {formatINRCompact(pendingSum)} pending
              </span>
            </div>
          </div>

          {/* Column 4: Recovered This Month */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Recovered This Month</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                {formatINRCompact(paidSum)}
              </span>
              <span className="text-[11px] text-[#34C759] font-medium whitespace-nowrap">
                {paidCount} paid this month
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Invoice Aging Distribution Card ── */}
      {totalUnpaidForAging > 0 && (
        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 select-none">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="text-[15px] font-bold text-gray-900 font-outfit">
              Invoice Aging Distribution
            </h3>
            <div className="flex items-center gap-4 flex-wrap text-[11px] md:text-[12px] text-gray-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#52BA84] shrink-0" />
                0-7 days ({onTrackCount} {onTrackCount === 1 ? "invoice" : "invoices"})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D9791D] shrink-0" />
                8-21 days ({watchingCount} {watchingCount === 1 ? "invoice" : "invoices"})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E14F4B] shrink-0" />
                22+ days ({criticalCount} {criticalCount === 1 ? "invoice" : "invoices"})
              </span>
            </div>
          </div>

          <CategoryBar 
            values={[onTrackPercent, watchingPercent, criticalPercent]} 
            colors={["emerald", "amber", "red"]} 
            showLabels={false} 
          />

          <div className="mt-3 flex justify-between items-center w-full text-[11px] md:text-[12px] font-bold font-outfit leading-none">
            {onTrackPercent > 0 ? (
              <span className="text-[#3B8F64]">
                {onTrackCount} on track ({onTrackPercent}%)
              </span>
            ) : (
              <span />
            )}
            {watchingPercent > 0 ? (
              <span className="text-[#C06514]">
                {watchingCount} watching ({watchingPercent}%)
              </span>
            ) : (
              <span />
            )}
            {criticalPercent > 0 ? (
              <span className="text-[#C93B37]">
                {criticalCount} critical ({criticalPercent}%)
              </span>
            ) : (
              <span />
            )}
          </div>
        </div>
      )}

      {/* ── Invoice Table Panel ── */}
      <InvoiceTable
        invoices={displayInvoices}
        counts={{
          ALL: allCount,
          OVERDUE: overdueCount,
          DUE: dueCount,
          PENDING: pendingCount,
          PAID: paidCount,
        }}
        activeStatus={status}
      />
    </div>
  )
}
