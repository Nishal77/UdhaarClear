'use client'

import Link from 'next/link'
import { InvoiceWithCustomer } from '@/types/database'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay'
import { formatDate, daysOverdue } from '@/lib/utils/date'
import { IconChevronRight } from '@tabler/icons-react'

export function InvoiceTable({ invoices }: { invoices: InvoiceWithCustomer[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overdue</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="relative px-6 py-3"><span className="sr-only">View</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {invoices.map((inv) => {
            const days = daysOverdue(inv.dueDate)
            return (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-mono text-gray-900">{inv.invoiceNumber}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{inv.customer.name}</p>
                  <p className="text-xs text-gray-500">{inv.customer.phone}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <CurrencyDisplay amount={Number(inv.amount)} size="sm" />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(inv.dueDate)}</td>
                <td className="px-6 py-4">
                  {days > 0 ? (
                    <span className="text-sm font-semibold text-red-600">{days}d</span>
                  ) : days === 0 ? (
                    <span className="text-sm font-medium text-orange-500">Today</span>
                  ) : (
                    <span className="text-xs text-gray-400">In {Math.abs(days)}d</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <InvoiceStatusBadge status={inv.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/invoices/${inv.id}`} className="text-gray-400 hover:text-brand-600">
                    <IconChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
