'use client'

import Link from 'next/link'
import { formatINR, formatINRCompact } from '@/lib/utils/currency'

interface Defaulter {
  customerId: string
  customerName: string
  totalOverdue: number
  oldestDaysOverdue: number
  lastReminderAt: Date | null
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const AVATAR_COLORS = [
  'bg-rose-100 text-rose-700',
  'bg-orange-100 text-orange-700',
  'bg-amber-100 text-amber-700',
  'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700',
]

function DaysBadge({ days }: { days: number }) {
  if (days >= 30) return (
    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
      {days}d
    </span>
  )
  if (days >= 14) return (
    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold text-orange-700">
      {days}d
    </span>
  )
  return (
    <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-[11px] font-bold text-yellow-700">
      {days}d
    </span>
  )
}

export function TopDefaulters({ defaulters, noBorder = false }: { defaulters: Defaulter[]; noBorder?: boolean }) {
  return (
    <div className={noBorder ? "w-full" : "rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)] border border-black/4"}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
        <div>
          <h2 className="text-[15px] font-bold text-gray-900">Overdue — Needs Attention</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {defaulters.length} customer{defaulters.length !== 1 ? 's' : ''} with overdue invoices
          </p>
        </div>
        <Link
          href="/invoices?status=overdue"
          className="text-[12px] font-semibold text-brand-500 hover:text-brand-700 transition-colors"
        >
          See all →
        </Link>
      </div>

      {!defaulters.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <span className="text-2xl">🎉</span>
          </div>
          <p className="text-[13px] font-semibold text-gray-600">All clear!</p>
          <p className="text-[11px] text-gray-400 mt-1">No overdue invoices right now</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">Customer</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400">Amount</th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-400">Overdue By</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {defaulters.map((d, i) => (
                <tr key={d.customerId} className="group transition-colors hover:bg-gray-50/60">
                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                      >
                        {initials(d.customerName)}
                      </div>
                      <div>
                        <Link
                          href={`/customers/${d.customerId}`}
                          className="text-[13px] font-semibold text-gray-900 hover:text-brand-600 transition-colors"
                        >
                          {d.customerName}
                        </Link>
                        <p className="text-[10px] text-gray-400">
                          Last reminder:{' '}
                          {d.lastReminderAt
                            ? new Date(d.lastReminderAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                            : 'Never'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-4 text-right">
                    <span className="text-[14px] font-bold text-red-600">
                      {formatINRCompact(d.totalOverdue)}
                    </span>
                  </td>

                  {/* Days overdue */}
                  <td className="px-4 py-4 text-center">
                    <DaysBadge days={d.oldestDaysOverdue} />
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/reminders?customer=${d.customerId}`}
                      className="inline-flex items-center rounded-lg bg-brand-500 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors"
                    >
                      Send Reminder
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
