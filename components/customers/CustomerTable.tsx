'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Customer } from '@prisma/client'
import { formatINRCompact } from '@/lib/utils/currency'
import { HugeiconsIcon } from '@hugeicons/react'
import { PencilEdit01Icon, ArrowRight02Icon, WhatsappIcon, Search01Icon, CheckmarkSquare01Icon } from '@hugeicons/core-free-icons'
import { formatDate } from '@/lib/utils/date'

interface CustomerWithSummary extends Customer {
  totalOutstanding: number
  totalOverdue: number
  overdueCount: number
  nextDueDate: Date | null
}

type FilterKey = 'all' | 'overdue' | 'due' | 'paid'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'overdue', label: 'Urgent' },
  { key: 'due', label: 'Pending' },
  { key: 'paid', label: 'All Paid' },
]



const TONE_BADGE: Record<string, string> = {
  GENTLE: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  ASSERTIVE: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  FIRM: 'bg-orange-50 text-orange-700 ring-orange-600/10',
  LEGAL: 'bg-red-50 text-red-700 ring-red-600/10',
}

function applyFilter(customers: CustomerWithSummary[], filter: FilterKey): CustomerWithSummary[] {
  switch (filter) {
    case 'overdue': return customers.filter((c) => c.totalOverdue > 0)
    case 'due': return customers.filter((c) => c.totalOutstanding > 0 && c.totalOverdue === 0)
    case 'paid': return customers.filter((c) => c.totalOutstanding === 0 && !c.isBlocked)
    default: return customers
  }
}


function getTonePhaseBadge(c: CustomerWithSummary) {
  if (c.totalOutstanding === 0) {
    return (
      <div className="flex flex-col text-left">
        <span className="text-[13.5px] font-medium text-gray-500">
          Paid
        </span>
        <span className="text-[11px] text-gray-400 mt-0.5 font-medium">
          {c.name.charCodeAt(0) % 2 === 0 ? '4-day cycle · PhonePe' : '7-day cycle · GPay'}
        </span>
      </div>
    )
  }

  if (c.totalOverdue > 0) {
    if (c.defaultTone === 'LEGAL') {
      return (
        <div className="flex flex-col text-left">
          <span className="text-[13.5px] font-semibold text-red-600">
            Legal Notice
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5 font-medium">Since Day 28</span>
        </div>
      )
    }
    if (c.defaultTone === 'FIRM') {
      return (
        <div className="flex flex-col text-left">
          <span className="text-[13.5px] font-semibold text-amber-600">
            Assertive
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5 font-medium">Day 14 overdue</span>
        </div>
      )
    }
    return (
      <div className="flex flex-col text-left">
        <span className="text-[13.5px] font-semibold text-gray-600">
          Courteous
        </span>
        <span className="text-[11px] text-gray-400 mt-0.5 font-medium">Day 2 overdue</span>
      </div>
    )
  }

  // Pending
  return (
    <div className="flex flex-col text-left">
      <span className="text-[13.5px] font-semibold text-gray-600">
        Link Tapped
      </span>
      <span className="text-[11px] text-gray-400 mt-0.5 font-medium">Day 1 · Due today</span>
    </div>
  )
}

function getWhatsAppStatus(c: CustomerWithSummary) {
  if (c.totalOutstanding === 0) {
    return (
      <div className="flex flex-col text-left">
        <span className="text-[12.5px] font-medium text-gray-500">Auto-receipt sent</span>
        <span className="text-[11px] text-gray-400 mt-0.5 font-medium">
          {c.name.charCodeAt(0) % 2 === 0 ? '6 consecutive months on time' : 'Top paying customer'}
        </span>
      </div>
    )
  }

  if (c.totalOverdue > 0) {
    if (c.defaultTone === 'LEGAL') {
      return (
        <div className="flex flex-col text-left">
          <span className="text-[12.5px] font-medium text-gray-500">Delivered</span>
          <span className="text-[11px] text-gray-400 mt-0.5 font-medium">Ignored · Day 28</span>
        </div>
      )
    }
    if (c.defaultTone === 'FIRM') {
      return (
        <div className="flex flex-col text-left">
          <span className="text-[12.5px] font-medium text-gray-500">Read</span>
          <span className="text-[11px] text-gray-400 mt-0.5 font-medium">Assertive sent 2h ago</span>
        </div>
      )
    }
    return (
      <div className="flex flex-col text-left">
        <span className="text-[12.5px] font-medium text-gray-500">Read</span>
        <span className="text-[11px] text-gray-400 mt-0.5 font-medium">Opened 45m ago</span>
      </div>
    )
  }

  // Pending
  return (
    <div className="flex flex-col text-left">
      <span className="text-[12.5px] font-medium text-gray-500">Tapped 3x</span>
      <span className="text-[11px] text-gray-400 mt-0.5 font-medium">UPI link opened today</span>
    </div>
  )
}

function getLastActivity(c: CustomerWithSummary) {
  if (c.totalOutstanding === 0) {
    return (
      <span className="text-[12.5px] font-medium text-gray-500 leading-tight">
        {c.name.charCodeAt(0) % 2 === 0 ? 'Paid today · 2:14 PM' : 'Paid 3 hours ago'}
      </span>
    )
  }

  if (c.totalOverdue > 0) {
    if (c.defaultTone === 'LEGAL') {
      return <span className="text-[12.5px] text-gray-500 font-medium leading-tight">Legal notice 5h ago</span>
    }
    if (c.defaultTone === 'FIRM') {
      return <span className="text-[12.5px] text-gray-500 font-medium leading-tight">Reminder sent 2h ago</span>
    }
    return <span className="text-[12.5px] text-gray-500 font-medium leading-tight">Reminder read 45m ago</span>
  }

  return <span className="text-[12.5px] text-gray-500 font-medium leading-tight">UPI tapped 1h ago</span>
}

function renderActionButton(c: CustomerWithSummary) {
  if (c.totalOutstanding === 0) {
    return (
      <Link
        href={`/customers/${c.id}`}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 hover:text-[#FF6A39] transition-all justify-end select-none group/btn"
      >
        <span>Receipt</span>
        <HugeiconsIcon 
          icon={ArrowRight02Icon} 
          size={14} 
          className="text-gray-400 group-hover/btn:translate-x-0.5 transition-transform duration-200" 
        />
      </Link>
    )
  }

  if (c.totalOverdue > 0) {
    if (c.defaultTone === 'LEGAL') {
      return (
        <Link
          href={`/reminders?customerId=${c.id}`}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-red-600 hover:text-red-700 transition-all justify-end select-none group/btn"
        >
          <span>File MSME</span>
          <HugeiconsIcon 
            icon={ArrowRight02Icon} 
            size={14} 
            className="text-red-400 group-hover/btn:translate-x-0.5 transition-transform duration-200" 
          />
        </Link>
      )
    }
    return (
      <Link
        href={`/reminders?customerId=${c.id}`}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-900 hover:text-[#FF6A39] transition-all justify-end select-none group/btn"
      >
        <span>Remind</span>
        <HugeiconsIcon 
          icon={ArrowRight02Icon} 
          size={14} 
          className="text-gray-400 group-hover/btn:translate-x-0.5 transition-transform duration-200" 
        />
      </Link>
    )
  }

  // Pending
  return (
    <Link
      href={`/customers/${c.id}`}
      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 hover:text-[#FF6A39] transition-all justify-end select-none group/btn"
    >
      <span>Track</span>
      <HugeiconsIcon 
        icon={ArrowRight02Icon} 
        size={14} 
        className="text-gray-400 group-hover/btn:translate-x-0.5 transition-transform duration-200" 
      />
    </Link>
  )
}

export function CustomerTable({
  customers,
  isSampleData = false,
}: {
  customers: CustomerWithSummary[]
  isSampleData?: boolean
}) {
  const [filter, setFilter] = useState<FilterKey>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const placeholders = [
    "Search by name, phone, city...",
    "Try searching 'Mumbai'...",
    "Search by 10-digit phone...",
    "Search 'Rahul Sharma'..."
  ]

  useEffect(() => {
    let timer: NodeJS.Timeout
    const currentFullText = placeholders[placeholderIndex]

    if (isDeleting) {
      timer = setTimeout(() => {
        setPlaceholder(currentFullText.substring(0, charIndex - 1))
        setCharIndex(prev => prev - 1)
      }, 30)
    } else {
      timer = setTimeout(() => {
        setPlaceholder(currentFullText.substring(0, charIndex + 1))
        setCharIndex(prev => prev + 1)
      }, 60)
    }

    if (!isDeleting && charIndex === currentFullText.length) {
      timer = setTimeout(() => setIsDeleting(true), 2500)
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, placeholderIndex])

  const totalToCollect = customers.reduce((s, c) => s + c.totalOutstanding, 0)
  
  const filtered = applyFilter(customers, filter).filter((c) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      c.name.toLowerCase().includes(query) ||
      (c.phone && c.phone.toLowerCase().includes(query)) ||
      (c.city && c.city.toLowerCase().includes(query)) ||
      (c.contactName && c.contactName.toLowerCase().includes(query))
    )
  })

  return (
    <div className="rounded-2xl bg-white border border-[#EBEAE6]/60 overflow-hidden">

      {/* ── Table Header ── */}
      <div className="border-b border-gray-100 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left: total to collect */}
        <div className="flex items-baseline gap-2 min-w-0 self-start md:self-auto">
          <span className="text-[13px] font-medium text-black tracking-tight whitespace-nowrap">
            To Collect
          </span>
          <span className="text-[22px] font-bold text-gray-900 tracking-tight leading-none">
            {formatINRCompact(totalToCollect)}
          </span>
        </div>

        {/* Center: Search input box */}
        <div className="relative flex-1 max-w-[340px] w-full mx-auto md:mx-0">
          <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <HugeiconsIcon icon={Search01Icon} size={16} className="text-gray-400" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full h-10 bg-[#F1F1F1] rounded-full pl-11 pr-10 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-[#EBEBEB] focus:ring-2 focus:ring-[#FF6A39]/20 transition-all duration-200 border-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 text-xs font-semibold transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right: filter toggle tabs */}
        <div 
          className="flex items-center gap-1 rounded-xl bg-gray-100/70 p-1 flex-shrink-0 w-full md:w-auto overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {FILTERS.map((f) => {
            const count = applyFilter(customers, f.key).length
            const isActive = filter === f.key

            let indicator = null
            if (f.key === 'all') {
              indicator = <span className="h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
            } else if (f.key === 'overdue') {
              indicator = <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
            } else if (f.key === 'due') {
              indicator = <span className="h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
            } else if (f.key === 'paid') {
              indicator = <HugeiconsIcon icon={CheckmarkSquare01Icon} size={12} className="text-emerald-600 flex-shrink-0" />
            }

            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all whitespace-nowrap ${isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {indicator}
                <span>{f.label}</span>
                <span className={`text-[11px] font-bold tabular-nums ${isActive ? 'text-[#FF6A39]' : 'text-gray-400'
                  }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-left text-[11.5px] font-bold tracking-wider text-gray-400 uppercase">#</th>
              <th className="px-4 py-3 text-left text-[11.5px] font-bold tracking-wider text-gray-400 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-[11.5px] font-bold tracking-wider text-gray-400 uppercase">Amount Due</th>
              <th className="px-4 py-3 text-left text-[11.5px] font-bold tracking-wider text-gray-400 uppercase">Invoices</th>
              <th className="px-4 py-3 text-left text-[11.5px] font-bold tracking-wider text-gray-400 uppercase">Tone Phase</th>
              <th className="px-4 py-3 text-left text-[11.5px] font-bold tracking-wider text-gray-400 uppercase">WhatsApp</th>
              <th className="px-4 py-3 text-left text-[11.5px] font-bold tracking-wider text-gray-400 uppercase">Last Activity</th>
              <th className="px-6 py-3 text-right text-[11.5px] font-bold tracking-wider text-gray-400 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-[13px] text-gray-400 font-medium">
                  No customers match this filter
                </td>
              </tr>
            ) : (
              filtered.map((c, i) => {
                return (
                  <tr key={c.id} className="group transition-colors hover:bg-gray-50/40">

                    {/* Number (#) */}
                    <td className="px-6 py-4 text-[12px] font-medium text-gray-400 select-none whitespace-nowrap">
                      {String(i + 1).padStart(2, '0')}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-4">
                      <div>
                        <Link
                          href={`/customers/${c.id}`}
                          className="text-[14px] font-semibold text-gray-900 hover:text-[#FF6A39] transition-colors leading-tight block"
                        >
                          {c.name}
                        </Link>
                        <p className="text-[11.5px] text-gray-400 mt-1 font-medium whitespace-nowrap">
                          {c.phone}
                          {c.city && <span className="text-gray-300 mx-1.5">·</span>}
                          {c.city && <span>{c.city}</span>}
                        </p>
                      </div>
                    </td>

                    {/* Amount Due */}
                    <td className="px-4 py-4">
                      {c.totalOutstanding === 0 ? (
                        <div>
                          <p className="text-[14px] font-medium text-gray-500">₹0</p>
                          <p className="text-[11px] text-gray-400 font-medium mt-0.5 whitespace-nowrap">Paid</p>
                        </div>
                      ) : (
                        <div>
                          <p className={`text-[14px] font-semibold ${c.totalOverdue > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                            {formatINRCompact(c.totalOutstanding)}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5 font-medium whitespace-nowrap">
                            {c.totalOverdue > 0 
                              ? `+${formatINRCompact(c.totalOverdue * 0.08)} interest` 
                              : 'Due today'
                            }
                          </p>
                        </div>
                      )}
                    </td>

                    {/* Invoices */}
                    <td className="px-4 py-4">
                      {c.totalOutstanding === 0 ? (
                        <span className="inline-flex items-center rounded-full bg-gray-50 border border-gray-200 px-2.5 py-0.5 text-[11px] font-semibold text-gray-500 whitespace-nowrap">
                          All clear
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-50 border border-gray-200 px-2.5 py-0.5 text-[11px] font-semibold text-gray-700 whitespace-nowrap">
                          {c.overdueCount > 0 ? `${c.overdueCount} invoice${c.overdueCount !== 1 ? 's' : ''}` : '1 invoice'}
                        </span>
                      )}
                    </td>

                    {/* Tone Phase */}
                    <td className="px-4 py-4">
                      {getTonePhaseBadge(c)}
                    </td>

                    {/* WhatsApp */}
                    <td className="px-4 py-4">
                      {getWhatsAppStatus(c)}
                    </td>

                    {/* Last Activity */}
                    <td className="px-4 py-4">
                      {getLastActivity(c)}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      {renderActionButton(c)}
                    </td>

                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
