import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { CreditCardIcon } from '@hugeicons/core-free-icons'
import { formatINRCompact } from '@/lib/utils/currency'

function formatSettledDate(date: Date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const d = new Date(date)
  const day = d.getDate()
  const month = months[d.getMonth()]
  
  let hours = d.getHours()
  const minutes = d.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // 12-hour formatting
  
  return `${day} ${month}, ${hours}:${minutes} ${ampm}`
}

export default async function PaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const business = dbUser.ownedBusiness

  // 1. Total Collected
  const allInvoices = await prisma.invoice.findMany({
    where: {
      businessId: business.id,
      paidAmount: { not: null }
    },
    select: {
      paidAmount: true
    }
  })
  const totalCollected = allInvoices.reduce((sum, inv) => sum + Number(inv.paidAmount ?? 0), 0)

  // 2. Gateway Configuration
  const gatewayName = business.wabaId || business.waConnected ? 'Razorpay' : 'UPI Link'
  const gatewayDesc = business.wabaId || business.waConnected ? 'Smart Collect VA' : 'Direct Settlement'

  // 3. Settled Invoices log
  const settledInvoices = await prisma.invoice.findMany({
    where: {
      businessId: business.id,
      status: { in: ['PAID', 'PARTIALLY_PAID'] },
      paidAmount: { gt: 0 }
    },
    include: {
      customer: true
    },
    orderBy: [
      { paidAt: 'desc' },
      { updatedAt: 'desc' }
    ]
  })

  // Format the payments list to match the visual layout structure
  const paymentsLog = settledInvoices.map((inv) => ({
    id: inv.id,
    customerName: inv.customer.name,
    invoiceNumber: inv.invoiceNumber,
    amount: Number(inv.paidAmount ?? 0),
    method: inv.paymentMethod || 'UPI · Smart Collect',
    reference: inv.paymentRef || '—',
    settledAt: inv.paidAt ? formatSettledDate(inv.paidAt) : formatSettledDate(inv.updatedAt),
    status: inv.status === 'PAID' ? 'SETTLED' : 'PARTIAL'
  }))

  const stats = {
    totalCollected,
    gateway: gatewayName,
    gatewayDescription: gatewayDesc,
    speed: 'Instant UPI',
    successRate: 99.4
  }

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col select-none">
        <nav className="flex items-center gap-1.5 text-[12px] text-gray-400">
          <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">Payments</span>
        </nav>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight">Payments</h1>
          <button
            className="flex items-center gap-2 rounded-xl bg-[#FF6A39] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#E05B2E] transition-all cursor-not-allowed opacity-90"
            disabled
          >
            <HugeiconsIcon icon={CreditCardIcon} size={15} />
            Configure Smart Collect
          </button>
        </div>
        <p className="mt-1 text-[13px] text-gray-400">
          Monitor UPI links, digital collections, and bank transfer settlements
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] overflow-hidden select-none">
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x">

          {/* Column 1: Total Collected */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Total Collected</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                {formatINRCompact(stats.totalCollected)}
              </span>
              <span className="text-[11px] text-[#34C759] font-medium whitespace-nowrap">
                All time recovered
              </span>
            </div>
          </div>

          {/* Column 2: Active Gateway */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Active Gateway</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[21px] font-bold text-gray-900 tracking-tight leading-none">
                {stats.gateway}
              </span>
              <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                {stats.gatewayDescription}
              </span>
            </div>
          </div>

          {/* Column 3: Payout Speed */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Payout Speed</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                T+0
              </span>
              <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                {stats.speed} settlement
              </span>
            </div>
          </div>

          {/* Column 4: Success Rate */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Success Rate</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-emerald-600 tracking-tight leading-none">
                {stats.successRate}%
              </span>
              <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                Successful digital payments
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Settlements Table ── */}
      <div className="rounded-2xl bg-white border border-[#EBEAE6]/60 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-[16px] font-bold text-gray-900 select-none">Recent Settlements Log</h2>
          <p className="text-[12.5px] text-gray-400 mt-1 select-none">UPI payments automatically reconciled against outstanding invoices.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 select-none">
                <th className="px-6 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Invoice</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Payment Handle</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Reference ID</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Settled Date</th>
                <th className="px-6 py-3 text-right text-[14px] font-semibold tracking-tight text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paymentsLog.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[13px] text-gray-400 font-medium select-none">
                    No settled payments recorded yet.
                  </td>
                </tr>
              ) : (
                paymentsLog.map((log, idx) => (
                  <tr key={log.id} className="group transition-colors hover:bg-gray-50/40">
                    
                    {/* Index */}
                    <td className="px-6 py-4 text-[12px] font-medium text-gray-400 select-none whitespace-nowrap">
                      {String(idx + 1).padStart(2, '0')}
                    </td>

                    {/* Customer Info */}
                    <td className="px-4 py-4">
                      <span className="text-[14px] font-semibold text-gray-900 block leading-tight">
                        {log.customerName}
                      </span>
                    </td>

                    {/* Invoice badge */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-gray-700">
                        {log.invoiceNumber}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-[14px] font-semibold text-gray-900 block">
                        {formatINRCompact(log.amount)}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-[13px] text-gray-600 font-semibold">
                        {log.method}
                      </span>
                    </td>

                    {/* UPI Ref */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-[12px] text-gray-400 font-mono font-semibold">
                        {log.reference}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-[13px] text-gray-500 font-medium">
                        {log.settledAt}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold select-none ${
                        log.status === 'SETTLED'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {log.status === 'SETTLED' ? 'SETTLED' : 'PARTIAL'}
                      </span>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
