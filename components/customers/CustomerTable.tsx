'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Customer } from '@prisma/client'
import { formatINRCompact } from '@/lib/utils/currency'
import { HugeiconsIcon } from '@hugeicons/react'
import { PencilEdit01Icon, ArrowRight02Icon, WhatsappIcon } from '@hugeicons/core-free-icons'
import { formatDate } from '@/lib/utils/date'

interface CustomerWithSummary extends Customer {
  totalOutstanding: number
  totalOverdue: number
  overdueCount: number
  nextDueDate: Date | null
}

type FilterKey = 'all' | 'overdue' | 'due' | 'paid' | 'blocked'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'due', label: 'Due' },
  { key: 'paid', label: 'All Paid' },
  { key: 'blocked', label: 'Blocked' },
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
    case 'blocked': return customers.filter((c) => c.isBlocked)
    default: return customers
  }
}

export function CustomerTable({
  customers,
  isSampleData = false,
}: {
  customers: CustomerWithSummary[]
  isSampleData?: boolean
}) {
  const [filter, setFilter] = useState<FilterKey>('all')

  const totalToCollect = customers.reduce((s, c) => s + c.totalOutstanding, 0)
  const filtered = applyFilter(customers, filter)

  return (
    <div className="rounded-2xl bg-white border border-[#EBEAE6]/60 overflow-hidden">

      {/* ── Table Header ── */}
      <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">

        {/* Left: total to collect */}
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-[13px] font-medium text-black tracking-tight whitespace-nowrap">
            To Collect
          </span>
          <span className="text-[22px] font-bold text-gray-900 tracking-tight leading-none">
            {formatINRCompact(totalToCollect)}
          </span>
        </div>

        {/* Right: filter toggle tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-gray-100/70 p-1 flex-shrink-0">
          {FILTERS.map((f) => {
            const count = applyFilter(customers, f.key).length
            const isActive = filter === f.key
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all ${isActive
                    ? 'bg-white text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {f.label}
                <span className={`text-[10px] font-bold tabular-nums ${isActive ? 'text-[#FF6A39]' : 'text-gray-400'
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
              <th className="px-6 py-3 text-left text-[14px] font-medium  tracking-tight text-black">#</th>
              <th className="px-4 py-3 text-left text-[14px] font-medium  tracking-tight text-black">Customer</th>
              <th className="px-4 py-3 text-right text-[14px] font-medium  tracking-tight text-black">Outstanding</th>
              <th className="px-4 py-3 text-right text-[14px] font-medium  tracking-tight text-black">Overdue</th>
              <th className="px-4 py-3 text-left text-[14px] font-medium  tracking-tight text-black">Deadline</th>
              <th className="px-4 py-3 text-center text-[14px] font-medium  tracking-tight text-black">Tone</th>
              <th className="px-4 py-3 text-center text-[14px] font-medium  tracking-tight text-black">Status</th>
              <th className="px-6 py-3 text-right text-[14px] font-medium  tracking-tight text-black">Actions</th>
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
                const toneBadge = TONE_BADGE[c.defaultTone] ?? 'bg-gray-100 text-gray-600 ring-gray-500/10'

                return (
                  <tr key={c.id} className="group transition-colors hover:bg-gray-50/50">

                    {/* Index */}
                    <td className="px-6 py-4">
                      <span className="text-[12px] font-medium text-gray-300">{String(i + 1).padStart(2, '0')}</span>
                    </td>

                    {/* Customer info */}
                    <td className="px-4 py-4">
                      <Link
                        href={`/customers/${c.id}`}
                        className="text-[14px] font-semibold text-gray-900 hover:text-[#FF6A39] transition-colors leading-tight block"
                      >
                        {c.name}
                      </Link>
                      <p className="text-[12px] text-gray-400 mt-0.5">
                        {c.phone}
                        {c.city && <span className="text-gray-300 mx-1">·</span>}
                        {c.city && <span>{c.city}</span>}
                      </p>
                      {c.contactName && (
                        <p className="text-[11px] text-gray-300 mt-0.5">{c.contactName}</p>
                      )}
                    </td>

                    {/* Outstanding */}
                    <td className="px-4 py-4 text-right">
                      <span className="text-[14px] font-bold text-gray-900">
                        {formatINRCompact(c.totalOutstanding)}
                      </span>
                    </td>

                    {/* Overdue */}
                    <td className="px-4 py-4 text-right">
                      {c.totalOverdue > 0 ? (
                        <div>
                          <p className="text-[14px] font-bold text-red-600">{formatINRCompact(c.totalOverdue)}</p>
                          <p className="text-[11px] text-red-400 mt-0.5">
                            {c.overdueCount} invoice{c.overdueCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[13px] text-gray-300 font-medium">—</span>
                      )}
                    </td>

                    {/* Deadline */}
                    <td className="px-4 py-4 text-left">
                      {c.nextDueDate ? (
                        <div>
                          <p className={`text-[13.5px] font-semibold ${
                            c.totalOverdue > 0 ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {formatDate(c.nextDueDate)}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-none">
                            {c.totalOverdue > 0 ? 'Missed deadline' : 'Upcoming due'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[13px] text-gray-300 font-medium">—</span>
                      )}
                    </td>

                    {/* Tone */}
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${toneBadge}`}>
                        {c.defaultTone.charAt(0) + c.defaultTone.slice(1).toLowerCase()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-center">
                      {c.isBlocked ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                          <span className="text-[13px] font-medium text-red-600">Blocked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                          </span>
                          <span className="text-[13px] font-medium text-emerald-700">Active</span>
                        </span>
                      )}
                    </td>


                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/customers/${c.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                        >
                          <HugeiconsIcon icon={PencilEdit01Icon} size={12} />
                          Edit
                        </Link>
                        <Link
                          href={`/reminders?customerId=${c.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-all"
                        >
                          <HugeiconsIcon icon={WhatsappIcon} size={12} />
                          Reminder
                        </Link>
                      </div>
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
