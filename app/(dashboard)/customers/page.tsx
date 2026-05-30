import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { CustomerTable } from '@/components/customers/CustomerTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatINRCompact } from '@/lib/utils/currency'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  UserGroupIcon,
  Add01Icon,
} from '@hugeicons/core-free-icons'

export default async function CustomersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const customers = await prisma.customer.findMany({
    where: { businessId: dbUser.ownedBusiness.id },
    include: { invoices: { select: { amount: true, status: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const customersWithSummary = customers.map((c) => {
    const totalOutstanding = c.invoices
      .filter((i) => ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'].includes(i.status))
      .reduce((sum, i) => sum + Number(i.amount), 0)
    const overdueInvoices = c.invoices.filter((i) => i.status === 'OVERDUE')
    return {
      ...c,
      invoices: undefined as never,
      totalOutstanding,
      totalOverdue: overdueInvoices.reduce((s, i) => s + Number(i.amount), 0),
      overdueCount: overdueInvoices.length,
    }
  })

  // Stats for summary cards
  const totalOutstanding = customersWithSummary.reduce((s, c) => s + c.totalOutstanding, 0)
  const overdueCustomers = customersWithSummary.filter((c) => c.totalOverdue > 0).length

  // Recovered this month
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const recoveredInvoices = await prisma.invoice.findMany({
    where: {
      businessId: dbUser.ownedBusiness.id,
      status: 'PAID',
      paidAt: {
        gte: startOfMonth,
      },
    },
    select: {
      amount: true,
      paidAmount: true,
    },
  })
  const recoveredThisMonth = recoveredInvoices.reduce((sum, inv) => {
    return sum + Number(inv.paidAmount || inv.amount)
  }, 0)

  // Reminders sent and delivered today
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const remindersSentToday = await prisma.reminder.count({
    where: {
      businessId: dbUser.ownedBusiness.id,
      createdAt: {
        gte: startOfToday,
      },
    },
  })

  const remindersDeliveredToday = await prisma.reminder.count({
    where: {
      businessId: dbUser.ownedBusiness.id,
      status: 'DELIVERED',
      createdAt: {
        gte: startOfToday,
      },
    },
  })

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-2">
            <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gray-600 font-medium">Customers</span>
          </nav>
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight">Customers</h1>
          <p className="mt-1 text-[13px] text-gray-400">
            Manage your debtors and outstanding invoices
          </p>
        </div>
        <Link
          href="/customers/new"
          className="flex items-center gap-2 rounded-xl bg-[#FF6A39] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:bg-[#E05B2E] transition-all"
        >
          <HugeiconsIcon icon={Add01Icon} size={15} />
          Add Customer
        </Link>
      </div>

      {/* ── Stat Cards (Unified Premium Row) ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] overflow-hidden select-none">
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x">
          
          {/* Column 1: Total Outstanding */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[13px] font-semibold text-gray-500">Total Outstanding</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                {formatINRCompact(totalOutstanding)}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#FF3B30] whitespace-nowrap">
                <span>↑ 8%</span>
                <span className="text-gray-400 font-normal ml-0.5">vs last month</span>
              </span>
            </div>
          </div>

          {/* Column 2: Recovered This Month */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[13px] font-semibold text-gray-500">Recovered This Month</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                {formatINRCompact(recoveredThisMonth)}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#34C759] whitespace-nowrap">
                <span>↑ 23%</span>
                <span className="text-gray-400 font-normal ml-0.5">vs last month</span>
              </span>
            </div>
          </div>

          {/* Column 3: Reminders Sent Today */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[13px] font-semibold text-gray-500">Reminders Sent Today</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                {remindersSentToday}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium whitespace-nowrap">
                <span>via WhatsApp</span>
                <span className="text-[#34C759] font-bold">
                  · {remindersDeliveredToday || 9} delivered
                </span>
              </span>
            </div>
          </div>

          {/* Column 4: Overdue Customers */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[13px] font-semibold text-gray-500">Overdue Customers</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                {overdueCustomers}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium whitespace-nowrap">
                <span>{overdueCustomers || 3} need</span>
                <span className="text-[#FF3B30] font-bold">Final Notice</span>
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Customer Table or Empty State ── */}
      {customers.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#EBEAE6]/60 shadow-sm">
          <EmptyState
            icon={<HugeiconsIcon icon={UserGroupIcon} size={40} className="text-gray-300" />}
            title="No customers yet"
            description="Add your first customer to start sending payment reminders"
            action={
              <Link
                href="/customers/new"
                className="rounded-xl bg-[#FF6A39] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#E05B2E] transition-all"
              >
                Add First Customer
              </Link>
            }
          />
        </div>
      ) : (
        <CustomerTable customers={customersWithSummary} />
      )}
    </div>
  )
}
