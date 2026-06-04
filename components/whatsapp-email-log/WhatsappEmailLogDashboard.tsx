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
  MailAtSign01Icon,
} from '@hugeicons/core-free-icons'

export interface WhatsappEmailLogItem {
  id: string
  invoiceNumber: string
  amount: number
  customerName: string
  customerPhone: string
  customerCity: string | null
  customerEmail?: string | null
  channel: 'WHATSAPP' | 'SMS' | 'EMAIL'
  tone: 'GENTLE' | 'FIRM' | 'LEGAL'
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'REPLIED'
  dayOverdue: number
  outcome: string
  createdAt: Date
  readAt?: Date | null
  messageBody: string
  templateName: string
  splitPayment?: {
    totalAmount: number
    paidAmount: number
    paidAt: Date
    nextDueAmount: number
    nextDueDate: Date
    nextRemindDate: Date
    status: 'ACTIVE' | 'COMPLETED'
  }
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

export function WhatsappEmailLogDashboard({
  initialLogs,
  isSample = false,
}: {
  initialLogs: WhatsappEmailLogItem[]
  isSample?: boolean
}) {
  const [filter, setFilter] = useState<'all' | 'read' | 'delivered' | 'sent' | 'failed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLog, setSelectedLog] = useState<WhatsappEmailLogItem | null>(null)

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

  // Stat metrics
  const totalSent = initialLogs.length
  const whatsappCount = initialLogs.filter((r) => r.channel === 'WHATSAPP').length
  const emailCount = initialLogs.filter((r) => r.channel === 'EMAIL').length

  const deliveredCount = initialLogs.filter((r) =>
    ['DELIVERED', 'READ', 'REPLIED'].includes(r.status)
  ).length
  const readCount = initialLogs.filter((r) =>
    ['READ', 'REPLIED'].includes(r.status)
  ).length
  const openRate = deliveredCount > 0 ? (readCount / deliveredCount) * 100 : 0

  const resolvedCount = initialLogs.filter((r) => r.status === 'REPLIED').length
  const resolvedRate = readCount > 0 ? (resolvedCount / readCount) * 100 : 0

  const failedCount = initialLogs.filter((r) => r.status === 'FAILED').length

  // Filter & Search
  const filteredByTab = initialLogs.filter((r) => {
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

  // Format Whatsapp message body with bold tokens
  const formatWhatsappMessage = (body: string) => {
    if (!body) return ''
    // Convert *text* to strong HTML elements
    return body.split('*').map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-extrabold text-gray-900">{part}</strong>
      }
      return part
    })
  }

  return (
    <div className="space-y-6">
      {/* ── Unified Dashboard Control Panel ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] overflow-hidden select-none">

        {/* Stat Cards (Top Row) */}
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x">

          {/* Column 1: Total Logs Sent */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Total Logs Sent</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                {totalSent}
              </span>
              <span className="text-[11px] text-gray-500 font-medium whitespace-nowrap">
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
              <span className={`text-[26px] font-bold tracking-tight leading-none ${failedCount > 0 ? 'text-[#FF0000]' : 'text-gray-955'}`}>
                {failedCount}
              </span>
              <span className={`text-[11px] font-medium whitespace-nowrap ${failedCount > 0 ? 'text-[#FF0000]' : 'text-gray-400'}`}>
                {failedCount > 0 ? 'Action required' : 'All channels active'}
              </span>
            </div>
          </div>

        </div>



        {/* Active Negotiations Footer Bar */}
        <div className="bg-[#FAF9F6] border-t border-[#EBEAE6]/60 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[12.5px] select-none">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-150 shrink-0">
              i
            </span>
            <span className="font-semibold text-gray-700">Active Split-Payment Negotiations</span>

            {/* Improved Ping Indicator */}
            <div className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-indigo-700 font-bold">
            <span>Karan Synthetics (INV-2026-009)</span>
            <span className="text-gray-300 font-normal">·</span>
            <span className="text-gray-500 font-medium">₹75,000 paid (50%) · Next auto-reminder: 14 Jun</span>
          </div>
        </div>
      </div>

      {/* ── Table Card Panel ── */}
      <div className="rounded-[22px] bg-white border border-[#EBEAE6]/60 shadow-xs overflow-hidden">

        {/* Table Header */}
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
              className="w-full h-10 bg-gray-50 border border-gray-200/80 rounded-full pl-11 pr-10 text-[13.5px] text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#FF6A39] focus:ring-4 focus:ring-[#FF6A39]/10 transition-all duration-250"
            />
            {searchQuery === '' && (
              <div className="absolute left-11 right-10 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13.5px] text-gray-400/90 overflow-hidden h-5 flex items-center">
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
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all whitespace-nowrap ${filter === 'all' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-700 hover:text-gray-900'
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
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all whitespace-nowrap ${filter === 'read' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              <HugeiconsIcon icon={TickDouble01Icon} size={13} className="text-[#34B7F1] shrink-0" />
              <span>Read</span>
              <span className={`text-[11px] font-semibold tabular-nums ${filter === 'read' ? 'text-[#FF6A39]' : 'text-gray-600'}`}>
                ({initialLogs.filter((r) => ['READ', 'REPLIED'].includes(r.status)).length})
              </span>
            </button>

            {/* Tab: Delivered */}
            <button
              onClick={() => setFilter('delivered')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all whitespace-nowrap ${filter === 'delivered' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              <HugeiconsIcon icon={TickDouble01Icon} size={13} className="text-gray-400 shrink-0" />
              <span>Delivered</span>
              <span className={`text-[11px] font-semibold tabular-nums ${filter === 'delivered' ? 'text-[#FF6A39]' : 'text-gray-600'}`}>
                ({initialLogs.filter((r) => r.status === 'DELIVERED').length})
              </span>
            </button>

            {/* Tab: Sent */}
            <button
              onClick={() => setFilter('sent')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all whitespace-nowrap ${filter === 'sent' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              <HugeiconsIcon icon={Tick01Icon} size={13} className="text-gray-400 shrink-0" />
              <span>Sent</span>
              <span className={`text-[11px] font-semibold tabular-nums ${filter === 'sent' ? 'text-[#FF6A39]' : 'text-gray-600'}`}>
                ({initialLogs.filter((r) => r.status === 'SENT').length})
              </span>
            </button>

            {/* Tab: Failed */}
            <button
              onClick={() => setFilter('failed')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all whitespace-nowrap ${filter === 'failed' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
              <span>Failed</span>
              <span className={`text-[11px] font-semibold tabular-nums ${filter === 'failed' ? 'text-[#FF6A39]' : 'text-gray-600'}`}>
                ({initialLogs.filter((r) => r.status === 'FAILED').length})
              </span>
            </button>

          </div>
        </div>

        {/* Table Grid Layout */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 select-none bg-gray-50/50">
                <th className="px-6 py-3.5 text-left text-[13px] font-semibold tracking-tight text-gray-700">#</th>
                <th className="px-4 py-3.5 text-left text-[13px] font-semibold tracking-tight text-gray-700">Customer</th>
                <th className="px-4 py-3.5 text-left text-[13px] font-semibold tracking-tight text-gray-700">Invoice Ref</th>
                <th className="px-4 py-3.5 text-left text-[13px] font-semibold tracking-tight text-gray-700">Channel & Tone</th>
                <th className="px-4 py-3.5 text-left text-[13px] font-semibold tracking-tight text-gray-700">Delivery Status</th>
                <th className="px-4 py-3.5 text-left text-[13px] font-semibold tracking-tight text-gray-700">Sent Date</th>
                <th className="px-4 py-3.5 text-left text-[13px] font-semibold tracking-tight text-gray-700">Outcome</th>
                <th className="px-6 py-3.5 text-right text-[13px] font-semibold tracking-tight text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[13px] text-gray-400 font-medium select-none">
                    No logs match this filter
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
                    <tr
                      key={item.id}
                      onClick={() => setSelectedLog(item)}
                      className="group transition-colors hover:bg-gray-50/80 cursor-pointer"
                    >

                      {/* Index */}
                      <td className="px-6 py-4 text-[12px] font-medium text-gray-400 select-none whitespace-nowrap">
                        {String(idx + 1).padStart(2, '0')}
                      </td>

                      {/* Customer Info */}
                      <td className="px-4 py-4">
                        <div>
                          <span className="text-[14px] font-semibold text-gray-900 block leading-tight group-hover:text-[#FF6A39] transition-colors">
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
                        <div className="flex flex-col">
                          <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-gray-700 mb-0.5 self-start">
                            {item.invoiceNumber}
                          </span>
                          <span className="text-[13.5px] font-semibold text-gray-900 block mt-0.5">
                            {formatINRCompact(item.amount)}
                          </span>
                          {item.splitPayment && (
                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9.5px] font-bold text-indigo-700 mt-1 border border-indigo-200/30 self-start">
                              Split Plan Active
                            </span>
                          )}
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
                        <span className={`text-[12.5px] font-medium leading-tight block truncate max-w-[220px] ${item.splitPayment
                            ? 'text-indigo-700 font-semibold'
                            : item.status === 'REPLIED'
                              ? 'text-emerald-700 font-semibold'
                              : item.status === 'FAILED'
                                ? 'text-red-600 font-semibold'
                                : 'text-gray-500'
                          }`}>
                          {item.outcome}
                        </span>
                      </td>

                      {/* Action Link */}
                      <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedLog(item)}
                          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 hover:text-[#FF6A39] transition-all justify-end select-none group/btn"
                        >
                          <span>Inspect</span>
                          <HugeiconsIcon
                            icon={ArrowRight02Icon}
                            size={14}
                            className="text-gray-400 group-hover/btn:translate-x-0.5 transition-transform duration-200"
                          />
                        </button>
                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Slide-over Drawer simulating mobile chat or email inbox ── */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setSelectedLog(null)}
          />

          {/* Drawer container (Creative Dark/Light Gray panel) */}
          <div className="relative z-10 w-full max-w-lg bg-[#FAF9F6] shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-in-out border-l border-[#EBEAE6]">

            {/* Header info */}
            <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Communication Log Inspector
                </span>
                <h3 className="text-[18px] font-bold text-gray-900 mt-1 leading-tight">
                  {selectedLog.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-800"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Metadata Panel */}
              <div className="bg-white rounded-2xl p-4 border border-[#EBEAE6]/60 shadow-xs grid grid-cols-2 gap-y-3.5 gap-x-4 text-[12.5px]">
                <div>
                  <span className="text-gray-400 block font-medium">Channel</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{selectedLog.channel}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Tone Severity</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{selectedLog.tone}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Invoice Number</span>
                  <span className="font-semibold text-[#FF6A39] mt-0.5 block">{selectedLog.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Outstanding Balance</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{formatINRCompact(selectedLog.amount)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Sent Timestamp</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">
                    {selectedLog.createdAt.toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Delivery Status</span>
                  <div className="mt-0.5 flex items-center">
                    {renderDeliveryStatus(selectedLog.status)}
                  </div>
                </div>
              </div>

              {/* Split Payment Stepper Card (Only for negotiated split items) */}
              {selectedLog.splitPayment && (
                <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs space-y-4 text-[12.5px] select-none">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                      </span>
                      <span className="font-bold text-gray-900">Split Payment Plan</span>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200/20">
                      Active
                    </span>
                  </div>

                  {/* Stepper Steps */}
                  <div className="relative pl-6 space-y-6 border-l-2 border-indigo-100 ml-2 pt-1 pb-1">

                    {/* Step 1: Paid Term */}
                    <div className="relative">
                      {/* Active indicator dot */}
                      <span className="absolute -left-[31px] top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                      </span>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">1st Installment (50%)</span>
                          <span className="font-bold text-emerald-600">{formatINRCompact(selectedLog.splitPayment.paidAmount)}</span>
                        </div>
                        <p className="text-[11.5px] text-gray-400 mt-1 font-medium">
                          Paid via WhatsApp UPI · {selectedLog.splitPayment.paidAt.toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Next Term */}
                    <div className="relative">
                      {/* Future indicator dot */}
                      <span className="absolute -left-[31px] top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-50 border border-indigo-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse" />
                      </span>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">2nd Installment (50%)</span>
                          <span className="font-bold text-indigo-600">{formatINRCompact(selectedLog.splitPayment.nextDueAmount)}</span>
                        </div>
                        <div className="text-[11.5px] text-gray-455 mt-1 font-medium space-y-1">
                          <p className="flex items-center gap-1">
                            <span className="font-bold text-gray-700">Due Date:</span> {selectedLog.splitPayment.nextDueDate.toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="flex items-center gap-1 text-orange-600 font-bold">
                            <span>Auto-Reminder:</span> {selectedLog.splitPayment.nextRemindDate.toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short'
                            })} at 10:00 AM (via WhatsApp)
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Creative Visual Simulation */}
              <div className="space-y-3">
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider block">
                  Simulated Customer View
                </span>

                {selectedLog.channel === 'WHATSAPP' && (
                  /* smartphone Bezel Container */
                  <div className="relative mx-auto w-full max-w-[340px] rounded-[36px] border-[8px] border-gray-800 bg-[#E5DDD5] shadow-xl overflow-hidden aspect-[9/16] flex flex-col">

                    {/* Phone Header */}
                    <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-2.5 shrink-0 shadow-sm pt-4">
                      {/* Avatar */}
                      <div className="h-7 w-7 rounded-full bg-emerald-700/50 flex items-center justify-center font-bold text-xs text-white border border-emerald-300/25">
                        UC
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[12.5px] font-bold truncate leading-tight">UdhaarClear Alerts</span>
                          {/* Verified Badge */}
                          <span className="h-3 w-3 bg-[#25D366] rounded-full flex items-center justify-center text-[8px] font-black text-white shrink-0">
                            ✓
                          </span>
                        </div>
                        <span className="text-[9.5px] text-emerald-100 block mt-0.5 leading-none">Official Account</span>
                      </div>
                    </div>

                    {/* Chat Wallpaper Body */}
                    <div className="flex-1 p-3 space-y-3 overflow-y-auto flex flex-col justify-end pb-4 bg-[#efeae2]">

                      {/* Encryption Disclaimer */}
                      <div className="mx-auto bg-[#FCEFCE] text-[#594d2e] text-[9.5px] rounded-lg p-2 text-center max-w-[260px] shadow-3xs leading-relaxed font-medium">
                        🔒 Messages are end-to-end encrypted. No one outside of this chat can read them.
                      </div>

                      {/* WhatsApp Outbound Message Bubble */}
                      <div className="relative self-end bg-[#DCF8C6] text-[12.5px] text-gray-800 p-3 rounded-lg shadow-3xs max-w-[85%] border-b border-black/5">
                        <div className="whitespace-pre-line leading-relaxed pb-3">
                          {formatWhatsappMessage(selectedLog.messageBody)}
                        </div>

                        {/* Interactive CTA Link Bubble inside WhatsApp */}
                        <div className="border-t border-[#c6dfb1] pt-2 mt-1 flex flex-col items-center">
                          <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="bg-white hover:bg-gray-50 border border-gray-200 text-[#007aff] font-semibold text-center py-1.5 px-3 rounded-full text-[11px] w-full block shadow-3xs transition-colors"
                          >
                            💳 Pay Online Now
                          </a>
                        </div>

                        {/* Message status indicators */}
                        <div className="flex items-center justify-end gap-1 mt-1.5 text-[9px] text-gray-400 select-none">
                          <span>
                            {selectedLog.createdAt.toLocaleTimeString('en-IN', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </span>
                          {selectedLog.status === 'READ' || selectedLog.status === 'REPLIED' ? (
                            <span className="text-[#34B7F1] font-bold text-[10px]">✓✓</span>
                          ) : selectedLog.status === 'DELIVERED' ? (
                            <span className="text-gray-400 font-bold text-[10px]">✓✓</span>
                          ) : selectedLog.status === 'SENT' ? (
                            <span className="text-gray-400 font-bold text-[10px]">✓</span>
                          ) : selectedLog.status === 'FAILED' ? (
                            <span className="text-red-500 font-bold text-xs leading-none">!</span>
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-pulse" />
                          )}
                        </div>
                      </div>

                      {/* Customer Reply Message Bubble (if Replied) */}
                      {selectedLog.status === 'REPLIED' && (
                        <div className="relative self-start bg-white text-[12.5px] text-gray-800 p-3 rounded-lg shadow-3xs max-w-[85%] border-b border-black/5">
                          <p className="leading-relaxed">
                            {selectedLog.outcome.replace('Replied: ', '')}
                          </p>
                          <div className="text-right mt-1.5 text-[9px] text-gray-400">
                            {selectedLog.readAt ? new Date(selectedLog.readAt).toLocaleTimeString('en-IN', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            }) : '6:42 am'}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {selectedLog.channel === 'EMAIL' && (
                  /* Browser Window Email client simulation */
                  <div className="w-full border border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden flex flex-col text-[12px]">

                    {/* Window Control Chrome */}
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">invoice-reminder.eml</span>
                      <div className="w-8" />
                    </div>

                    {/* Email Headers */}
                    <div className="p-4 border-b border-gray-100 space-y-2 bg-gray-50/50">
                      <div>
                        <span className="text-gray-400 font-medium">From:</span>{' '}
                        <span className="font-semibold text-gray-700">alerts@udhaarclear.com</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">To:</span>{' '}
                        <span className="font-semibold text-gray-700">
                          {selectedLog.customerEmail || 'customer@example.com'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Subject:</span>{' '}
                        <span className="font-bold text-gray-900">
                          Urgent: Payment Reminder for Invoice {selectedLog.invoiceNumber}
                        </span>
                      </div>
                    </div>

                    {/* Styled HTML Email Body Preview */}
                    <div className="p-6 bg-slate-50 overflow-y-auto max-h-[320px]">
                      <div className="max-w-md mx-auto bg-white border border-gray-100 rounded-xl p-5 shadow-3xs text-left">

                        {/* Company branding */}
                        <div className="flex items-center gap-1.5 pb-4 border-b border-gray-100 mb-4 justify-between">
                          <span className="text-sm font-bold text-gray-900">UdhaarClear Alerts</span>
                          <span className="text-[10px] font-semibold text-gray-400">Payment Request</span>
                        </div>

                        {/* Email Content */}
                        <h4 className="font-bold text-gray-900 text-sm mb-2.5">
                          Pending Payment Request
                        </h4>

                        <p className="text-gray-600 leading-relaxed mb-4">
                          {selectedLog.messageBody}
                        </p>

                        {/* Invoice Summary Card */}
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-4 space-y-1.5">
                          <div className="flex justify-between font-semibold text-gray-800">
                            <span>Invoice Number:</span>
                            <span className="font-mono">{selectedLog.invoiceNumber}</span>
                          </div>
                          <div className="flex justify-between font-bold text-gray-900 text-sm">
                            <span>Amount Due:</span>
                            <span>{formatINRCompact(selectedLog.amount)}</span>
                          </div>
                          <div className="flex justify-between text-gray-500 text-[11px]">
                            <span>Overdue Duration:</span>
                            <span className="text-red-500 font-bold">{selectedLog.dayOverdue} days</span>
                          </div>
                        </div>

                        {/* Call to Action Button */}
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="block text-center bg-[#FF6A39] hover:bg-[#E05B2E] text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors text-[13px] mb-4"
                        >
                          Review & Pay Invoice
                        </a>

                        {/* Footer */}
                        <p className="text-[10.5px] text-gray-400 text-center leading-relaxed">
                          This is an automated notice sent via UdhaarClear collections engine on behalf of your vendor.
                        </p>
                      </div>
                    </div>

                  </div>
                )}

                {selectedLog.channel === 'SMS' && (
                  /* simple SMS bubble style */
                  <div className="border border-gray-200 rounded-2xl bg-gray-50 p-4 max-w-sm mx-auto shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold">
                        UC
                      </div>
                      <span className="text-xs font-bold text-gray-700">BP-UDHAAR</span>
                      <span className="text-[10px] text-gray-400 ml-auto">SMS Alert</span>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-3xs relative text-left">
                      <p className="text-xs text-gray-800 leading-relaxed">
                        {selectedLog.messageBody}
                      </p>
                      <span className="text-[9px] text-gray-400 block mt-2 text-right">
                        {selectedLog.createdAt.toLocaleTimeString('en-IN', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Footer actions */}
            <div className="p-6 bg-white border-t border-gray-100 flex items-center gap-3">
              <Link
                href={`/invoices?search=${selectedLog.invoiceNumber}`}
                className="flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm"
              >
                Go to Invoice Details
              </Link>
              <button
                onClick={() => setSelectedLog(null)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                Close Logs Panel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
