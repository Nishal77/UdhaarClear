'use client'

import Link from 'next/link'
import { formatINR } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'

interface Defaulter {
  customerId: string
  customerName: string
  totalOverdue: number
  oldestDaysOverdue: number
  lastReminderAt: Date | null
}

export function TopDefaulters({ defaulters }: { defaulters: Defaulter[] }) {
  if (!defaulters.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Top Defaulters</h2>
        <p className="text-sm text-gray-500 text-center py-8">No overdue invoices. Great job!</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Top Defaulters</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
              <th className="pb-2 font-medium">Customer</th>
              <th className="pb-2 font-medium text-right">Overdue</th>
              <th className="pb-2 font-medium text-right">Days</th>
              <th className="pb-2 font-medium">Last Reminder</th>
            </tr>
          </thead>
          <tbody>
            {defaulters.map((d, i) => (
              <tr key={d.customerId} className="border-b border-gray-50 text-sm">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">#{i + 1}</span>
                    <Link
                      href={`/customers/${d.customerId}`}
                      className="font-medium text-gray-900 hover:text-brand-600"
                    >
                      {d.customerName}
                    </Link>
                  </div>
                </td>
                <td className="py-3 text-right font-semibold text-red-600">
                  {formatINR(d.totalOverdue)}
                </td>
                <td className="py-3 text-right">
                  <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                    {d.oldestDaysOverdue}d
                  </span>
                </td>
                <td className="py-3 text-gray-500">
                  {d.lastReminderAt ? formatDate(d.lastReminderAt) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
