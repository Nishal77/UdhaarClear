import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { CreditCardIcon, ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { formatINRCompact } from '@/lib/utils/currency'

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

  // Mock static statistics for payments
  const stats = {
    totalCollected: 1842000,
    gateway: 'Razorpay Smart Collect',
    speed: 'Instant UPI',
    successRate: 99.4
  }

  const paymentsLog = [
    {
      id: 'tx-1',
      customerName: 'Ramesh Traders Pvt. Ltd.',
      invoiceNumber: 'INV-2026-001',
      amount: 185000,
      method: 'UPI · PhonePe',
      reference: 'UPI88920194883',
      settledAt: '31 May, 2:14 PM',
      status: 'SETTLED'
    },
    {
      id: 'tx-2',
      customerName: 'Sunita Fabrics',
      invoiceNumber: 'INV-2026-003',
      amount: 88500,
      method: 'UPI · GooglePay',
      reference: 'UPI77218394882',
      settledAt: '31 May, 10:45 AM',
      status: 'SETTLED'
    },
    {
      id: 'tx-3',
      customerName: 'Priya Exports & Co.',
      invoiceNumber: 'INV-2026-005',
      amount: 47000,
      method: 'UPI · PayTM',
      reference: 'UPI44291884021',
      settledAt: '29 May, 4:30 PM',
      status: 'SETTLED'
    }
  ]

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

      {/* ── Stat Cards (Unified split card) ── */}
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
                Razorpay
              </span>
              <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                Smart Collect VA
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
              {paymentsLog.map((log, idx) => (
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
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 select-none">
                      {log.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
