import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { CustomerTable } from '@/components/customers/CustomerTable'
import { CustomerBarLists } from '@/components/customers/CustomerBarLists'
import { formatINRCompact } from '@/lib/utils/currency'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { Add01Icon, UserAdd01Icon } from '@hugeicons/core-free-icons'

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
    include: { invoices: { select: { amount: true, status: true, dueDate: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const customersWithSummary = customers.map((c) => {
    const totalOutstanding = c.invoices
      .filter((i) => ['PENDING', 'DUE', 'OVERDUE', 'PENDING_CONFIRMATION', 'PARTIALLY_PAID'].includes(i.status))
      .reduce((sum, i) => sum + Number(i.amount), 0)
    const overdueInvoices = c.invoices.filter((i) => i.status === 'OVERDUE')
    const activeInvoices = c.invoices.filter((i) => ['PENDING', 'DUE', 'OVERDUE', 'PENDING_CONFIRMATION', 'PARTIALLY_PAID'].includes(i.status))

    let nextDueDate: Date | null = null
    if (overdueInvoices.length > 0) {
      const dates = overdueInvoices.map((i) => new Date(i.dueDate)).filter((d) => !isNaN(d.getTime()))
      if (dates.length > 0) {
        nextDueDate = new Date(Math.min(...dates.map((d) => d.getTime())))
      }
    } else if (activeInvoices.length > 0) {
      const dates = activeInvoices.map((i) => new Date(i.dueDate)).filter((d) => !isNaN(d.getTime()))
      if (dates.length > 0) {
        nextDueDate = new Date(Math.min(...dates.map((d) => d.getTime())))
      }
    }

    return {
      ...c,
      invoices: undefined as never,
      totalOutstanding,
      totalOverdue: overdueInvoices.reduce((s, i) => s + Number(i.amount), 0),
      overdueCount: overdueInvoices.length,
      nextDueDate,
      invoiceCount: c.invoices.length,
    }
  })

  const totalOutstanding = customersWithSummary.reduce((s, c) => s + c.totalOutstanding, 0)
  const totalOverdue = customersWithSummary.reduce((s, c) => s + c.totalOverdue, 0)
  const overdueCustomers = customersWithSummary.filter((c) => c.totalOverdue > 0).length

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col select-none">
        <nav className="flex items-center gap-1.5 text-[12px] text-gray-400">
          <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">Customers</span>
        </nav>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight">Customers</h1>
          {customers.length > 0 && (
            <Link
              href="/customers/new"
              className="flex items-center gap-2 rounded-xl bg-[#FF6A39] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:bg-[#E05B2E] transition-all"
            >
              <HugeiconsIcon icon={Add01Icon} size={15} />
              Add Customer
            </Link>
          )}
        </div>
        <p className="mt-1 text-[13px] text-gray-400">
          Manage your debtors and outstanding invoices
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-[#EBEAE6]/60 rounded-[22px] bg-white p-16 text-center shadow-sm select-none">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF7F4] border border-[#FF6A39]/20 flex items-center justify-center mb-5">
            <HugeiconsIcon icon={UserAdd01Icon} size={28} className="text-[#FF6A39]" />
          </div>
          <h2 className="text-[16px] font-bold text-gray-900 tracking-tight font-outfit">No customers added yet</h2>
          <p className="mt-2 text-[13px] text-gray-500 max-w-sm leading-relaxed">
            Add your debtors to start tracking their outstanding invoices and automating WhatsApp reminder notifications.
          </p>
          <Link
            href="/customers/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FF6A39] hover:bg-[#E05B2E] px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all"
          >
            <HugeiconsIcon icon={Add01Icon} size={15} />
            Add Customer
          </Link>
        </div>
      ) : (
        <>
          {/* ── Stat Cards (Unified Premium Row) ── */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] overflow-hidden select-none">
            <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x">
              {/* Column 1: Total Customers */}
              <div className="px-6 py-5 flex flex-col justify-center">
                <span className="text-[14px] font-medium text-black tracking-tight">Total Customers</span>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                    {customersWithSummary.length}
                  </span>
                  <span className="text-[11px] text-[#34C759] font-medium whitespace-nowrap">
                    All Active
                  </span>
                </div>
              </div>

              {/* Column 2: Need Urgent Action */}
              <div className="px-6 py-5 flex flex-col justify-center">
                <span className="text-[14px] font-medium text-black tracking-tight">Need Urgent Action</span>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="text-[26px] font-bold text-[#FF0000] tracking-tight leading-none">
                    {formatINRCompact(totalOutstanding)}
                  </span>
                  <span className="text-[11px] text-[#FF0000] font-medium whitespace-nowrap">
                    Overdue payers
                  </span>
                </div>
              </div>

              {/* Column 3: In Recovery */}
              <div className="px-6 py-5 flex flex-col justify-center">
                <span className="text-[14px] font-medium text-black tracking-tight">In Recovery</span>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="text-[26px] font-bold text-black tracking-tight leading-none">
                    {overdueCustomers}
                  </span>
                  <span className="text-[11px] text-[#FF8C42] font-medium whitespace-nowrap">
                    Reminders active
                  </span>
                </div>
              </div>

              {/* Column 4: All Paid Up */}
              <div className="px-6 py-5 flex flex-col justify-center">
                <span className="text-[14px] font-medium text-black tracking-tight">All Paid Up</span>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                    {customersWithSummary.filter((c) => c.totalOverdue === 0 && !c.isBlocked && c.invoiceCount > 0).length}
                  </span>
                  <span className="text-[11px] text-[#34C759] font-medium whitespace-nowrap">
                    No action needed
                  </span>
                </div>
              </div>
            </div>

            {/* Divider line and embedded Analytics & Spotlight panel */}
            <div className="border-t border-[#EBEAE6]/60 bg-white">
              <CustomerBarLists customers={customersWithSummary} />
            </div>
          </div>

          {/* ── Customer Table ── */}
          <CustomerTable customers={customersWithSummary} />
        </>
      )}
    </div>
  )
}
