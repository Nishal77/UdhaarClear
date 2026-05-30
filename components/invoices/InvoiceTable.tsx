'use client'

import Link from 'next/link'
import { InvoiceWithCustomer } from '@/types/database'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'
import { formatINRCompact } from '@/lib/utils/currency'
import { formatDate, daysOverdue } from '@/lib/utils/date'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon, SentIcon } from '@hugeicons/core-free-icons'

const AVATAR_COLORS = [
  'bg-violet-100 text-violet-700',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-orange-100 text-orange-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-amber-100 text-amber-700',
]

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function OverdueBadge({ days }: { days: number }) {
  if (days > 30) return (
    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
      {days}d overdue
    </span>
  )
  if (days > 0) return (
    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold text-orange-700">
      {days}d overdue
    </span>
  )
  if (days === 0) return (
    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
      Due today
    </span>
  )
  return (
    <span className="text-[12px] text-gray-400">
      In {Math.abs(days)}d
    </span>
  )
}

export function InvoiceTable({ invoices }: { invoices: InvoiceWithCustomer[] }) {
  return (
    <div className="rounded-2xl bg-white border border-[#EBEAE6]/60 shadow-sm overflow-hidden">
      {/* Table header */}
      <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-white to-gray-50/20">
        <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest">
          {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Invoice #</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Customer</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Amount</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Due Date</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">Overdue By</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">Status</th>
              <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.map((inv, i) => {
              const days = daysOverdue(inv.dueDate)
              const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length]

              return (
                <tr key={inv.id} className="group transition-colors hover:bg-gray-50/60">
                  {/* Invoice number */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-[12px] font-mono font-semibold text-gray-700">
                      {inv.invoiceNumber}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${avatarColor}`}>
                        {initials(inv.customer.name)}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-900 leading-tight">
                          {inv.customer.name}
                        </p>
                        <p className="text-[11px] text-gray-400">{inv.customer.phone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-4 text-right">
                    <span className="text-[14px] font-bold text-gray-900">
                      {formatINRCompact(Number(inv.amount))}
                    </span>
                    {inv.paidAmount && Number(inv.paidAmount) > 0 && (
                      <p className="text-[11px] text-emerald-600 mt-0.5">
                        {formatINRCompact(Number(inv.paidAmount))} paid
                      </p>
                    )}
                  </td>

                  {/* Due date */}
                  <td className="px-4 py-4">
                    <span className="text-[13px] text-gray-600 font-medium">
                      {formatDate(inv.dueDate)}
                    </span>
                  </td>

                  {/* Overdue badge */}
                  <td className="px-4 py-4 text-center">
                    <OverdueBadge days={days} />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 text-center">
                    <InvoiceStatusBadge status={inv.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {inv.status === 'OVERDUE' && (
                        <Link
                          href={`/invoices/${inv.id}?remind=1`}
                          className="flex items-center gap-1.5 rounded-lg bg-[#FF6A39] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#E05B2E] transition-colors"
                        >
                          <HugeiconsIcon icon={SentIcon} size={12} />
                          Remind
                        </Link>
                      )}
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
                      >
                        <HugeiconsIcon icon={ArrowRight02Icon} size={15} />
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
