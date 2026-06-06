'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { InvoiceWithCustomer } from '@/types/database'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'
import { formatINRCompact } from '@/lib/utils/currency'
import { formatDate, daysOverdue } from '@/lib/utils/date'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon, Search01Icon } from '@hugeicons/core-free-icons'

export type ClientInvoice = Omit<InvoiceWithCustomer, 'amount' | 'paidAmount'> & {
  amount: number
  paidAmount: number | null
}

const STATUS_TABS = [
  { label: 'All',      value: undefined },
  { label: 'Overdue',  value: 'OVERDUE' },
  { label: 'Due',      value: 'DUE' },
  { label: 'Pending',  value: 'PENDING' },
  { label: 'Paid',     value: 'PAID' },
] as const

function OverdueBadge({ days }: { days: number }) {
  if (days > 30) return (
    <span className="text-[12.5px] font-bold text-[#FF0000] whitespace-nowrap">
      {days} days overdue
    </span>
  )
  if (days > 0) return (
    <span className="text-[12.5px] font-semibold text-[#FF8C42] whitespace-nowrap">
      {days} days overdue
    </span>
  )
  if (days === 0) return (
    <span className="text-[12.5px] font-semibold text-amber-500 whitespace-nowrap">
      Due today
    </span>
  )
  return (
    <span className="text-[12.5px] text-gray-500 font-medium whitespace-nowrap">
      In {Math.abs(days)} days
    </span>
  )
}

function renderActionButton(inv: ClientInvoice) {
  if (inv.status === 'OVERDUE') {
    return (
      <Link
        href={`/invoices/${inv.id}?remind=1`}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#FF6A39] hover:text-[#E05B2E] transition-all justify-end select-none group/btn"
      >
        <span>Remind</span>
        <HugeiconsIcon 
          icon={ArrowRight02Icon} 
          size={14} 
          className="text-[#FF6A39]/60 group-hover/btn:translate-x-0.5 transition-transform duration-200" 
        />
      </Link>
    )
  }
  return (
    <Link
      href={`/invoices/${inv.id}`}
      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 hover:text-[#FF6A39] transition-all justify-end select-none group/btn"
    >
      <span>View Details</span>
      <HugeiconsIcon 
        icon={ArrowRight02Icon} 
        size={14} 
        className="text-gray-400 group-hover/btn:translate-x-0.5 transition-transform duration-200" 
      />
    </Link>
  )
}

export function InvoiceTable({
  invoices,
  counts,
  activeStatus,
}: {
  invoices: ClientInvoice[]
  counts: {
    ALL: number
    OVERDUE: number
    DUE: number
    PENDING: number
    PAID: number
  }
  activeStatus: string | undefined
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState('')

  const placeholders = [
    "Search by invoice number, name...",
    "Try searching 'INV-001'...",
    "Search by phone number...",
    "Search 'Ramesh Gupta'..."
  ]

  const [placeholder, setPlaceholder] = useState(placeholders[0])
  const [slideState, setSlideState] = useState<'idle' | 'slide-out' | 'reset'>('idle')

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      // 1. Start slide up out
      setSlideState('slide-out')

      // 2. Snap to bottom instantly after slide-out (300ms)
      setTimeout(() => {
        index = (index + 1) % placeholders.length
        setPlaceholder(placeholders[index])
        setSlideState('reset')

        // 3. Slide up in on the next browser frame
        setTimeout(() => {
          setSlideState('idle')
        }, 30)
      }, 300)
    }, 3800)

    return () => clearInterval(interval)
  }, [])

  const filtered = invoices.filter((inv) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      inv.invoiceNumber.toLowerCase().includes(query) ||
      inv.customer.name.toLowerCase().includes(query) ||
      (inv.customer.phone && inv.customer.phone.toLowerCase().includes(query))
    )
  })

  const handleTabClick = (val: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val) {
      params.set('status', val)
    } else {
      params.delete('status')
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  let transitionClass = 'transition-all duration-300 ease-out'
  if (slideState === 'idle') {
    transitionClass += ' opacity-100 translate-y-0'
  } else if (slideState === 'slide-out') {
    transitionClass += ' opacity-0 -translate-y-3'
  } else if (slideState === 'reset') {
    transitionClass += ' opacity-0 translate-y-3 transition-none'
  }

  return (
    <div className="rounded-2xl bg-white border border-[#EBEAE6]/60 overflow-hidden">
      
      {/* ── Table Header Panel (Left: Input Box, Right: Toggle Options) ── */}
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

        {/* Right End: Toggle Options (Filter Tabs) */}
        <div className="flex items-center gap-1 rounded-xl bg-gray-100/70 p-1 flex-shrink-0 w-full md:w-auto overflow-x-auto select-none">
          {STATUS_TABS.map((tab) => {
            const isActive = tab.value === activeStatus
            const count = counts[tab.value ?? 'ALL']

            let indicator = null
            if (tab.value === undefined) {
              indicator = <span className="h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
            } else if (tab.value === 'OVERDUE') {
              indicator = <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
            } else if (tab.value === 'DUE') {
              indicator = <span className="h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
            } else if (tab.value === 'PENDING') {
              indicator = <span className="h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            } else if (tab.value === 'PAID') {
              indicator = <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            }

            return (
              <button
                key={tab.label}
                onClick={() => handleTabClick(tab.value)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-gray-900'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {indicator}
                <span>{tab.label}</span>
                <span className={`text-[11px] font-semibold tabular-nums ${isActive ? 'text-[#FF6A39]' : 'text-gray-600'}`}>
                  ({count})
                </span>
              </button>
            )
          })}
        </div>

      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 select-none">
              <th className="px-6 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">#</th>
              <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Invoice</th>
              <th className="px-6 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Customer</th>
              <th className="px-6 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Due Date</th>
              <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Overdue By</th>
              <th className="px-4 py-3 text-left text-[14px] font-semibold tracking-tight text-gray-700">Status</th>
              <th className="px-4 py-3 text-right text-[14px] font-semibold tracking-tight text-gray-700">Amount</th>
              <th className="px-6 py-3 text-right text-[14px] font-semibold tracking-tight text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-[13px] text-gray-400 font-medium select-none">
                  No invoices match this filter
                </td>
              </tr>
            ) : (
              filtered.map((inv, idx) => {
                const days = daysOverdue(inv.dueDate)

                return (
                  <tr key={inv.id} className="group transition-colors hover:bg-gray-50/40">
                    
                    {/* Index (#) */}
                    <td className="px-6 py-4 text-[12px] font-medium text-gray-400 select-none whitespace-nowrap">
                      {String(idx + 1).padStart(2, '0')}
                    </td>

                    {/* Invoice Number */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-[11.5px] font-mono font-semibold text-gray-700">
                        {inv.invoiceNumber}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-4">
                      <div>
                        <Link
                          href={`/customers/${inv.customer.id}`}
                          className="text-[14px] font-semibold text-gray-900 hover:text-[#FF6A39] transition-colors leading-tight block"
                        >
                          {inv.customer.name}
                        </Link>
                        <p className="text-[11.5px] text-gray-400 mt-1 font-medium whitespace-nowrap">
                          {inv.customer.phone}
                          {inv.customer.city && <span className="text-gray-300 mx-1.5">·</span>}
                          {inv.customer.city && <span>{inv.customer.city}</span>}
                        </p>
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-[13.5px] text-gray-600 font-medium">
                        {formatDate(inv.dueDate)}
                      </span>
                    </td>

                    {/* Overdue Badge */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {inv.status === 'PAID' ? (
                        <span className="text-[12.5px] text-emerald-600 font-semibold select-none">
                          Settled
                        </span>
                      ) : (
                        <OverdueBadge days={days} />
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <InvoiceStatusBadge status={inv.status} />
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <span className="text-[14px] font-semibold text-gray-900 block leading-tight">
                        {formatINRCompact(Number(inv.amount))}
                      </span>
                      {inv.paidAmount && Number(inv.paidAmount) > 0 ? (
                        <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                          {formatINRCompact(Number(inv.paidAmount))} paid
                        </p>
                      ) : null}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      {renderActionButton(inv)}
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
