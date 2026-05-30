'use client'

import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'

export interface OverdueInvoice {
  id: string
  customerId: string
  customerName: string
  invoiceNumber: string
  amount: number
  dueDate: Date
  overdueDays: number
  tone: 'GENTLE' | 'FIRM' | 'LEGAL'
}

export function TopDefaulters({
  invoices,
  noBorder = false,
}: {
  invoices?: OverdueInvoice[]
  noBorder?: boolean
}) {
  return (
    <div className={noBorder ? "w-full" : "rounded-3xl bg-white border border-[#EBEAE6]/60 shadow-xs overflow-hidden"}>
      {/* Header - Identical to the original layout */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/20">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-[17px] font-extrabold text-gray-950 tracking-tight">Needs Your Attention Today</h2>
            <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 ring-1 ring-inset ring-rose-600/10">
              Action Required
            </span>
          </div>
          <p className="text-[12.5px] text-gray-500 mt-1 font-medium">
            3 critical cases require instant tracking or escalation
          </p>
        </div>
        <Link
          href="/invoices?status=overdue"
          className="group flex items-center gap-1 text-[13px] font-bold text-blue-600 hover:text-blue-700 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <span>See all</span>
          <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* ── Feed Rows Stack inside the card ── */}
      <div className="divide-y divide-gray-100 select-none">
        {/* Row 1: Reddy Enterprises (High Risk Notice) */}
        <div className="px-8 py-5.5 flex items-center justify-between hover:bg-gray-50/30 transition-all duration-200">
          <div className="flex items-center gap-4">
            {/* Soft Red Circle Badge */}
            <div className="w-11 h-11 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <span className="relative flex h-4.5 w-4.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-30"></span>
                {/* Glossy 3D Red sphere */}
                <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-gradient-to-tr from-red-600 via-red-500 to-rose-400 shadow-sm border border-red-700/10"></span>
              </span>
            </div>
            {/* Title & Meta info */}
            <div className="text-left">
              <h3 className="text-[14.5px] font-bold text-gray-900 leading-snug tracking-tight">
                Reddy Enterprises has ignored 3 legal notices — ₹3,38,000 at risk
              </h3>
              <p className="text-[12.5px] text-gray-500 font-medium mt-0.5">
                <span className="text-red-600 font-semibold">28 days overdue</span> · File MSME Samadhaan now to claim compound interest
              </p>
            </div>
          </div>
          {/* Action */}
          <Link
            href="/legal-notice/reddy"
            className="group flex items-center gap-1 text-[13.5px] font-bold text-[#FF6A39] hover:text-[#E05B2E] active:scale-95 transition-all shrink-0 ml-4"
          >
            <span>File Now</span>
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* Row 2: Mehta & Sons (High Intent But Unpaid) */}
        <div className="px-8 py-5.5 flex items-center justify-between hover:bg-gray-50/30 transition-all duration-200">
          <div className="flex items-center gap-4">
            {/* Soft Orange Circle Badge */}
            <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              {/* Clock/Alarm Alarm Vector Icon */}
              <svg className="w-5 h-5 text-amber-600 animate-swing" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {/* Title & Meta info */}
            <div className="text-left">
              <h3 className="text-[14.5px] font-bold text-gray-900 leading-snug tracking-tight">
                Mehta & Sons tapped the UPI link 3 times — hasn't paid yet
              </h3>
              <p className="text-[12.5px] text-gray-500 font-medium mt-0.5">
                <span className="text-amber-600 font-semibold">₹67,200</span> · Invoice due today · Send a gentle follow-up nudge
              </p>
            </div>
          </div>
          {/* Action */}
          <Link
            href="/reminders?customer=mehta"
            className="group flex items-center gap-1 text-[13.5px] font-bold text-[#FF6A39] hover:text-[#E05B2E] active:scale-95 transition-all shrink-0 ml-4"
          >
            <span>Send Nudge</span>
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* Row 3: Patel Wholesale (Recent Payment Success) */}
        <div className="px-8 py-5.5 flex items-center justify-between hover:bg-gray-50/30 transition-all duration-200">
          <div className="flex items-center gap-4">
            {/* Soft Green Circle Badge */}
            <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              {/* Checkmark Check Icon */}
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {/* Title & Meta info */}
            <div className="text-left">
              <h3 className="text-[14.5px] font-bold text-gray-900 leading-snug tracking-tight">
                Patel Wholesale paid ₹2,34,000 via PhonePe 2 minutes ago
              </h3>
              <p className="text-[12.5px] text-gray-500 font-medium mt-0.5">
                Invoice #INV-1045 cleared · Auto-receipt sent to customer
              </p>
            </div>
          </div>
          {/* Action */}
          <Link
            href="/receipts/inv-1045"
            className="group flex items-center gap-1 text-[13.5px] font-bold text-[#FF6A39] hover:text-[#E05B2E] active:scale-95 transition-all shrink-0 ml-4"
          >
            <span>View Receipt</span>
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
