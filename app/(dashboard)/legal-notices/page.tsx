import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { NotificationSquareIcon, ArrowRight02Icon } from '@hugeicons/core-free-icons'

export default async function LegalNoticesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  // Mock static statistics for legal notices
  const stats = {
    activeDisputes: 3,
    noticesSent: 7,
    recoveredAmount: 420000,
    successRate: 78
  }

  const noticesLog = [
    {
      id: 'not-1',
      customerName: 'Bharat Steel Works',
      invoiceNumber: 'INV-2026-002',
      amount: 640000,
      stage: 'MSME demand notice dispatched',
      dispatchDate: '28 May, 11:30 AM',
      noticeType: 'Official Demand Notice',
      status: 'SENT'
    },
    {
      id: 'not-2',
      customerName: 'Tara Decoratives',
      invoiceNumber: 'INV-2026-007',
      amount: 120000,
      stage: 'Draft review in progress',
      dispatchDate: 'Pending signature',
      noticeType: 'Pre-litigation Warning',
      status: 'DRAFT'
    }
  ]

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col select-none">
        <nav className="flex items-center gap-1.5 text-[12px] text-gray-400">
          <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">Legal Notices</span>
        </nav>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight">Legal Demand Notices</h1>
          <button
            className="flex items-center gap-2 rounded-xl bg-[#FF6A39] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#E05B2E] transition-all cursor-not-allowed opacity-90"
            disabled
          >
            <HugeiconsIcon icon={NotificationSquareIcon} size={15} />
            File New MSME Notice
          </button>
        </div>
        <p className="mt-1 text-[13px] text-gray-400">
          Draft and generate official demand notices for chronic defaulters under MSME Samadhaan
        </p>
      </div>

      {/* ── Stat Cards (Unified split card) ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] overflow-hidden select-none">
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x">

          {/* Column 1: Active Disputes */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Active Disputes</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-red-600 tracking-tight leading-none">
                {stats.activeDisputes}
              </span>
              <span className="text-[11px] text-red-600 font-medium whitespace-nowrap">
                In pre-litigation
              </span>
            </div>
          </div>

          {/* Column 2: Notices Dispatched */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Notices Dispatched</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                {stats.noticesSent}
              </span>
              <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                Demand drafts sent
              </span>
            </div>
          </div>

          {/* Column 3: MSME Recovery */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">MSME Recovery</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-emerald-600 tracking-tight leading-none">
                ₹4.20L
              </span>
              <span className="text-[11px] text-emerald-600 font-medium whitespace-nowrap">
                Recovered via legal demands
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
                Resolution without courts
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Active Notices Table ── */}
      <div className="rounded-2xl bg-white border border-[#EBEAE6]/60 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-[16px] font-bold text-gray-900 select-none">Dispatched Demand Notices</h2>
          <p className="text-[12.5px] text-gray-400 mt-1 select-none">Official legal alerts logged against major outstanding commercial invoices.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 select-none">
                <th className="px-6 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Invoice Ref</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Amount Due</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Notice Category</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Notice Stage</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Sent Date</th>
                <th className="px-6 py-3 text-right text-[14px] font-semibold tracking-tight text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {noticesLog.map((log, idx) => (
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

                  {/* Invoice reference */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-gray-700">
                      {log.invoiceNumber}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-[14px] font-semibold text-red-600 block">
                      ₹{(log.amount / 100000).toFixed(2)}L
                    </span>
                  </td>

                  {/* Notice Type */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-[13px] text-gray-600 font-semibold">
                      {log.noticeType}
                    </span>
                  </td>

                  {/* Notice Stage */}
                  <td className="px-4 py-4">
                    <span className="text-[12.5px] text-gray-500 font-medium block">
                      {log.stage}
                    </span>
                  </td>

                  {/* Sent Date */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-[13px] text-gray-500 font-medium">
                      {log.dispatchDate}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold select-none ${
                      log.status === 'SENT' ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600'
                    }`}>
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
