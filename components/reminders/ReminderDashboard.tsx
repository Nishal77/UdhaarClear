'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatINRCompact } from '@/lib/utils/currency'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight02Icon,
  Search01Icon,
  CheckmarkSquare01Icon,
  WhatsappIcon,
  Tick01Icon,
  TickDouble01Icon,
} from '@hugeicons/core-free-icons'

export interface ReminderDashboardItem {
  id: string
  invoiceNumber: string
  amount: number
  customerName: string
  customerPhone: string
  customerCity: string | null
  channel: 'WHATSAPP' | 'SMS' | 'EMAIL'
  tone: 'GENTLE' | 'FIRM' | 'LEGAL'
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'REPLIED'
  dayOverdue: number
  outcome: string
  createdAt: Date
  readAt?: Date | null
}

const TONE_CLASSES: Record<string, string> = {
  GENTLE: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  FIRM: 'bg-orange-50 text-orange-700 ring-orange-600/10',
  LEGAL: 'bg-red-50 text-red-700 ring-red-600/10',
}

const CHANNEL_CLASSES: Record<string, string> = {
  WHATSAPP: 'bg-[#E8F8F0] text-[#075E54]',
  SMS: 'bg-sky-50 text-sky-700',
  EMAIL: 'bg-purple-50 text-purple-700',
}

export function ReminderDashboard({
  initialReminders,
  isSample = false,
}: {
  initialReminders: ReminderDashboardItem[]
  isSample?: boolean
}) {
  const [filter, setFilter] = useState<'all' | 'read' | 'delivered' | 'sent' | 'failed'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const placeholders = [
    "Search by customer, invoice reference...",
    "Try searching 'INV-2026'...",
    "Search by WhatsApp or phone number...",
    "Search 'Ramesh Gupta'..."
  ]

  const [placeholder, setPlaceholder] = useState(placeholders[0])
  const [slideState, setSlideState] = useState<'idle' | 'slide-out' | 'reset'>('idle')

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setSlideState('slide-out')
      setTimeout(() => {
        index = (index + 1) % placeholders.length
        setPlaceholder(placeholders[index])
        setSlideState('reset')
        setTimeout(() => {
          setSlideState('idle')
        }, 30)
      }, 300)
    }, 3800)

    return () => clearInterval(interval)
  }, [])

  // 1. Calculate statistics dynamically from the source dataset
  const totalSent = initialReminders.length
  const whatsappCount = initialReminders.filter((r) => r.channel === 'WHATSAPP').length
  const emailCount = initialReminders.filter((r) => r.channel === 'EMAIL').length

  const deliveredCount = initialReminders.filter((r) =>
    ['DELIVERED', 'READ', 'REPLIED'].includes(r.status)
  ).length
  const readCount = initialReminders.filter((r) =>
    ['READ', 'REPLIED'].includes(r.status)
  ).length
  const openRate = deliveredCount > 0 ? (readCount / deliveredCount) * 100 : 0

  const resolvedCount = initialReminders.filter((r) => r.status === 'REPLIED').length
  const resolvedRate = readCount > 0 ? (resolvedCount / readCount) * 100 : 0

  const failedCount = initialReminders.filter((r) => r.status === 'FAILED').length

  // 2. Filter list based on search and selected tabs
  const filteredByTab = initialReminders.filter((r) => {
    if (filter === 'all') return true
    if (filter === 'read') return ['READ', 'REPLIED'].includes(r.status)
    if (filter === 'delivered') return r.status === 'DELIVERED'
    if (filter === 'sent') return r.status === 'SENT'
    if (filter === 'failed') return r.status === 'FAILED'
    return true
  })

  const filtered = filteredByTab.filter((r) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      r.customerName.toLowerCase().includes(q) ||
      r.invoiceNumber.toLowerCase().includes(q) ||
      r.customerPhone.toLowerCase().includes(q) ||
      (r.customerCity && r.customerCity.toLowerCase().includes(q))
    )
  })

  let transitionClass = 'transition-all duration-300 ease-out'
  if (slideState === 'idle') {
    transitionClass += ' opacity-100 translate-y-0'
  } else if (slideState === 'slide-out') {
    transitionClass += ' opacity-0 -translate-y-3'
  } else if (slideState === 'reset') {
    transitionClass += ' opacity-0 translate-y-3 transition-none'
  }

  // Delivery status badge and WhatsApp ticks
  const renderDeliveryStatus = (status: string) => {
    switch (status) {
      case 'QUEUED':
        return (
          <div className="flex items-center gap-1.5 text-gray-400 select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-pulse" />
            <span className="text-[12.5px] font-medium">Queued</span>
          </div>
        )
      case 'SENT':
        return (
          <div className="flex items-center gap-1.5 text-gray-400 select-none">
            <HugeiconsIcon icon={Tick01Icon} size={16} className="text-gray-400 shrink-0" />
            <span className="text-[12.5px] font-medium">Sent</span>
          </div>
        )
      case 'DELIVERED':
        return (
          <div className="flex items-center gap-1.5 text-gray-500 select-none">
            <HugeiconsIcon icon={TickDouble01Icon} size={16} className="text-gray-400 shrink-0" />
            <span className="text-[12.5px] font-medium">Delivered</span>
          </div>
        )
      case 'READ':
        return (
          <div className="flex items-center gap-1.5 text-[#34B7F1] select-none">
            <HugeiconsIcon icon={TickDouble01Icon} size={16} className="text-[#34B7F1] shrink-0" />
            <span className="text-[12.5px] font-medium">Read</span>
          </div>
        )
      case 'REPLIED':
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 select-none">
            <HugeiconsIcon icon={Tick01Icon} size={16} className="text-emerald-600 shrink-0" />
            <span className="text-[12.5px] font-semibold">Replied</span>
          </div>
        )
      case 'FAILED':
        return (
          <div className="flex items-center gap-2 select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-[12.5px] font-semibold text-red-600">Failed</span>
          </div>
        )
      default:
        return <span className="text-[12.5px] text-gray-500 font-medium">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      
      {/* ── Stat Cards (Unified Premium Row) ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] overflow-hidden select-none">
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x">

          {/* Column 1: Total Reminders Sent */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Reminders Sent</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                {totalSent}
              </span>
              <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                WhatsApp ({whatsappCount}) · Email ({emailCount})
              </span>
            </div>
          </div>

          {/* Column 2: Open / Read Rate */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Open / Read Rate</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-emerald-600 tracking-tight leading-none">
                {openRate.toFixed(1)}%
              </span>
              <span className="text-[11px] text-emerald-600 font-medium whitespace-nowrap">
                {readCount} read of {deliveredCount} delivered
              </span>
            </div>
          </div>

          {/* Column 3: Payment Conversion */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Conversion Rate</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-[#FF8C42] tracking-tight leading-none">
                {resolvedRate.toFixed(1)}%
              </span>
              <span className="text-[11px] text-[#FF8C42] font-medium whitespace-nowrap">
                {resolvedCount} promises / payments
              </span>
            </div>
          </div>

          {/* Column 4: Delivery Failures */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Delivery Failures</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className={`text-[26px] font-bold tracking-tight leading-none ${failedCount > 0 ? 'text-[#FF0000]' : 'text-gray-900'}`}>
                {failedCount}
              </span>
              <span className={`text-[11px] font-medium whitespace-nowrap ${failedCount > 0 ? 'text-[#FF0000]' : 'text-gray-400'}`}>
                {failedCount > 0 ? 'Action required' : 'All channels active'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Table Card Panel ── */}
      <div className="rounded-2xl bg-white border border-[#EBEAE6]/60 overflow-hidden">
        
        {/* Table Header inside the white card */}
        <div className="border-b border-gray-100 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 select-none bg-white">
          
          {/* Left Start: Search input box */}
          <div className="relative flex-1 max-w-[340px] w-full">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <HugeiconsIcon icon={Search01Icon} size={16} className="text-gray-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-[#F1F1F1] rounded-full pl-11 pr-10 text-[13px] text-gray-800 focus:outline-none focus:bg-[#EBEBEB] focus:ring-2 focus:ring-[#FF6A39]/20 transition-all duration-200 border-0"
            />
            {searchQuery === '' && (
              <div className="absolute left-11 right-10 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] text-gray-400 overflow-hidden h-5 flex items-center">
                <span className={transitionClass}>
                  {placeholder}
                </span>
              </div>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 text-xs font-semibold transition-colors z-10"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right End: Status Filters */}
          <div className="flex items-center gap-1 rounded-xl bg-gray-100/70 p-1 flex-shrink-0 w-full md:w-auto overflow-x-auto select-none">
            
            {/* Tab: All */}
            <button
              onClick={() => setFilter('all')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all whitespace-nowrap ${
                filter === 'all' ? 'bg-white text-gray-900' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0" />
              <span>All</span>
              <span className={`text-[11px] font-semibold tabular-nums ${filter === 'all' ? 'text-[#FF6A39]' : 'text-gray-600'}`}>
                ({totalSent})
              </span>
            </button>

            {/* Tab: Read */}
            <button
              onClick={() => setFilter('read')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all whitespace-nowrap ${
                filter === 'read' ? 'bg-white text-gray-900' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <HugeiconsIcon icon={TickDouble01Icon} size={13} className="text-[#34B7F1] shrink-0" />
              <span>Read</span>
              <span className={`text-[11px] font-semibold tabular-nums ${filter === 'read' ? 'text-[#FF6A39]' : 'text-gray-600'}`}>
                ({initialReminders.filter((r) => ['READ', 'REPLIED'].includes(r.status)).length})
              </span>
            </button>

            {/* Tab: Delivered */}
            <button
              onClick={() => setFilter('delivered')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all whitespace-nowrap ${
                filter === 'delivered' ? 'bg-white text-gray-900' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <HugeiconsIcon icon={TickDouble01Icon} size={13} className="text-gray-400 shrink-0" />
              <span>Delivered</span>
              <span className={`text-[11px] font-semibold tabular-nums ${filter === 'delivered' ? 'text-[#FF6A39]' : 'text-gray-600'}`}>
                ({initialReminders.filter((r) => r.status === 'DELIVERED').length})
              </span>
            </button>

            {/* Tab: Sent */}
            <button
              onClick={() => setFilter('sent')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all whitespace-nowrap ${
                filter === 'sent' ? 'bg-white text-gray-900' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <HugeiconsIcon icon={Tick01Icon} size={13} className="text-gray-400 shrink-0" />
              <span>Sent</span>
              <span className={`text-[11px] font-semibold tabular-nums ${filter === 'sent' ? 'text-[#FF6A39]' : 'text-gray-600'}`}>
                ({initialReminders.filter((r) => r.status === 'SENT').length})
              </span>
            </button>

            {/* Tab: Failed */}
            <button
              onClick={() => setFilter('failed')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all whitespace-nowrap ${
                filter === 'failed' ? 'bg-white text-gray-900' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
              <span>Failed</span>
              <span className={`text-[11px] font-semibold tabular-nums ${filter === 'failed' ? 'text-[#FF6A39]' : 'text-gray-600'}`}>
                ({initialReminders.filter((r) => r.status === 'FAILED').length})
              </span>
            </button>

          </div>
        </div>

        {/* ── Table Grid Layout ── */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 select-none">
                <th className="px-6 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Invoice Ref</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Channel & Tone</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Delivery Status</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Sent Date</th>
                <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Outcome</th>
                <th className="px-6 py-3 text-right text-[14px] font-semibold tracking-tight text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[13px] text-gray-400 font-medium select-none">
                    No reminders match this filter
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const dateStr = item.createdAt.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })
                  const timeStr = item.createdAt.toLocaleTimeString('en-IN', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })

                  return (
                    <tr key={item.id} className="group transition-colors hover:bg-gray-50/40">
                      
                      {/* Index */}
                      <td className="px-6 py-4 text-[12px] font-medium text-gray-400 select-none whitespace-nowrap">
                        {String(idx + 1).padStart(2, '0')}
                      </td>

                      {/* Customer Info */}
                      <td className="px-4 py-4">
                        <div>
                          <span className="text-[14px] font-semibold text-gray-900 block leading-tight">
                            {item.customerName}
                          </span>
                          <p className="text-[11.5px] text-gray-400 mt-1 font-medium whitespace-nowrap">
                            {item.customerPhone}
                            {item.customerCity && <span className="text-gray-300 mx-1.5">·</span>}
                            {item.customerCity && <span>{item.customerCity}</span>}
                          </p>
                        </div>
                      </td>

                      {/* Invoice Info */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-gray-700 mb-0.5">
                            {item.invoiceNumber}
                          </span>
                          <span className="text-[13.5px] font-semibold text-gray-900 block mt-0.5">
                            {formatINRCompact(item.amount)}
                          </span>
                        </div>
                      </td>

                      {/* Channel & Tone Badges */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <div>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold whitespace-nowrap ${CHANNEL_CLASSES[item.channel]}`}>
                              {item.channel === 'WHATSAPP' && (
                                <HugeiconsIcon icon={WhatsappIcon} size={11} className="mr-1 inline text-[#075E54]" />
                              )}
                              {item.channel}
                            </span>
                          </div>
                          <div>
                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-semibold whitespace-nowrap ring-1 ring-inset ${TONE_CLASSES[item.tone]}`}>
                              {item.tone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Delivery Status Indicator */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {renderDeliveryStatus(item.status)}
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <span className="text-[13px] text-gray-700 font-semibold block leading-tight">
                            {dateStr}
                          </span>
                          <span className="text-[11px] text-gray-400 font-medium block mt-1">
                            {timeStr}
                          </span>
                        </div>
                      </td>

                      {/* Outcome Description */}
                      <td className="px-4 py-4">
                        <span className={`text-[12.5px] font-medium leading-tight block ${
                          item.status === 'REPLIED'
                            ? 'text-emerald-700 font-semibold'
                            : item.status === 'FAILED'
                              ? 'text-red-600'
                              : 'text-gray-500'
                        }`}>
                          {item.outcome}
                        </span>
                      </td>

                      {/* Action Links */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link
                          href={`/invoices?search=${item.invoiceNumber}`}
                          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 hover:text-[#FF6A39] transition-all justify-end select-none group/btn"
                        >
                          <span>Track</span>
                          <HugeiconsIcon 
                            icon={ArrowRight02Icon} 
                            size={14} 
                            className="text-gray-400 group-hover/btn:translate-x-0.5 transition-transform duration-200" 
                          />
                        </Link>
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
  )
}
