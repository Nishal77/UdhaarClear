import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { CustomerTable } from '@/components/customers/CustomerTable'
import { CustomerBarLists } from '@/components/customers/CustomerBarLists'
import { formatINRCompact } from '@/lib/utils/currency'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { Add01Icon } from '@hugeicons/core-free-icons'

// ─── Sample data shown when no real customers exist ────────────────────────────
const SAMPLE_CUSTOMERS = [
  {
    id: 'sample-1', businessId: 'demo', name: 'Ramesh Traders Pvt. Ltd.',
    contactName: 'Ramesh Gupta', phone: '+91 98200 11223', email: 'ramesh@rtraders.in',
    gstin: '27AABCR1234M1Z5', city: 'Mumbai', address: null, notes: null,
    defaultTone: 'ASSERTIVE', isBlocked: false,
    createdAt: new Date('2024-09-12'), updatedAt: new Date(),
    totalOutstanding: 425000, totalOverdue: 175000, overdueCount: 2,
    nextDueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // Overdue since 15 days ago
  },
  {
    id: 'sample-2', businessId: 'demo', name: 'Sunita Fabrics',
    contactName: 'Sunita Mehta', phone: '+91 87321 54210', email: null,
    gstin: null, city: 'Surat', address: null, notes: 'Prefers WhatsApp reminders',
    defaultTone: 'GENTLE', isBlocked: false,
    createdAt: new Date('2024-11-01'), updatedAt: new Date(),
    totalOutstanding: 88500, totalOverdue: 0, overdueCount: 0,
    nextDueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // Due in 8 days
  },
  {
    id: 'sample-3', businessId: 'demo', name: 'Bharat Steel Works',
    contactName: 'Arun Nair', phone: '+91 99000 77811', email: 'arun.nair@bsworks.com',
    gstin: '32AADCB5678K1ZF', city: 'Pune', address: null, notes: null,
    defaultTone: 'LEGAL', isBlocked: false,
    createdAt: new Date('2024-07-05'), updatedAt: new Date(),
    totalOutstanding: 960000, totalOverdue: 640000, overdueCount: 3,
    nextDueDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // Overdue since 28 days ago
  },
  {
    id: 'sample-4', businessId: 'demo', name: 'Kaveri Auto Parts',
    contactName: 'Kaveri Reddy', phone: '+91 93456 22890', email: 'kaveri@autoparts.in',
    gstin: '29AABCK4321N1Z2', city: 'Bengaluru', address: null, notes: null,
    defaultTone: 'FIRM', isBlocked: false,
    createdAt: new Date('2025-01-18'), updatedAt: new Date(),
    totalOutstanding: 215000, totalOverdue: 85000, overdueCount: 1,
    nextDueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Overdue since 10 days ago
  },
  {
    id: 'sample-5', businessId: 'demo', name: 'Priya Exports & Co.',
    contactName: 'Priya Sharma', phone: '+91 82200 65432', email: 'priya@priyaexports.com',
    gstin: null, city: 'Delhi', address: null, notes: null,
    defaultTone: 'GENTLE', isBlocked: false,
    createdAt: new Date('2025-03-02'), updatedAt: new Date(),
    totalOutstanding: 47000, totalOverdue: 0, overdueCount: 0,
    nextDueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // Due in 12 days
  },
  {
    id: 'sample-6', businessId: 'demo', name: 'MegaVision Electronics',
    contactName: 'Vikram Joshi', phone: '+91 97700 33145', email: 'vikram@megavision.in',
    gstin: '27AADCM8899P1ZQ', city: 'Hyderabad', address: null, notes: 'High-value account',
    defaultTone: 'ASSERTIVE', isBlocked: false,
    createdAt: new Date('2024-06-20'), updatedAt: new Date(),
    totalOutstanding: 1850000, totalOverdue: 1200000, overdueCount: 4,
    nextDueDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // Overdue since 35 days ago
  },
  {
    id: 'sample-7', businessId: 'demo', name: 'Tara Decoratives',
    contactName: null, phone: '+91 88800 12345', email: null,
    gstin: null, city: 'Jaipur', address: null, notes: null,
    defaultTone: 'GENTLE', isBlocked: true,
    createdAt: new Date('2024-12-10'), updatedAt: new Date(),
    totalOutstanding: 120000, totalOverdue: 120000, overdueCount: 2,
    nextDueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // Overdue since 45 days ago
  },
  {
    id: 'sample-8', businessId: 'demo', name: 'Rajlaxmi Pharmaceuticals',
    contactName: 'Dr. Rajesh Laxmi', phone: '+91 96600 98760', email: 'r.laxmi@rajpharma.com',
    gstin: '24AABCR7711J1ZD', city: 'Ahmedabad', address: null, notes: null,
    defaultTone: 'FIRM', isBlocked: false,
    createdAt: new Date('2025-02-14'), updatedAt: new Date(),
    totalOutstanding: 335000, totalOverdue: 0, overdueCount: 0,
    nextDueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // Due in 4 days
  },
]

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
      .filter((i) => ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'].includes(i.status))
      .reduce((sum, i) => sum + Number(i.amount), 0)
    const overdueInvoices = c.invoices.filter((i) => i.status === 'OVERDUE')
    const activeInvoices = c.invoices.filter((i) => ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'].includes(i.status))

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
    }
  })

  // Use sample data when no real customers exist (for UI preview)
  const isSampleData = customers.length === 0
  const displayCustomers = isSampleData
    ? (SAMPLE_CUSTOMERS as typeof customersWithSummary)
    : customersWithSummary

  // Stats — compute from whichever set we display
  const totalOutstanding = displayCustomers.reduce((s, c) => s + c.totalOutstanding, 0)
  const totalOverdue = displayCustomers.reduce((s, c) => s + c.totalOverdue, 0)
  const overdueCustomers = displayCustomers.filter((c) => c.totalOverdue > 0).length
  const activeCount = displayCustomers.filter((c) => !c.isBlocked).length

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

          {/* Column 1: Total Customers */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Total Customers</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                {displayCustomers.length}
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
                {displayCustomers.filter((c) => c.totalOverdue === 0 && !c.isBlocked).length}
              </span>
              <span className="text-[11px] text-[#34C759] font-medium whitespace-nowrap">
                No action needed
              </span>
            </div>
          </div>

        </div>

        {/* Divider line and embedded Analytics & Spotlight panel */}
        <div className="border-t border-[#EBEAE6]/60 bg-white">
          <CustomerBarLists customers={displayCustomers} />
        </div>
      </div>

      {/* ── Customer Table (always rendered — uses sample data if no real customers) ── */}
      <CustomerTable customers={displayCustomers} isSampleData={isSampleData} />
    </div>
  )
}
