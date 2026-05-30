'use client'

import Link from 'next/link'
import { Customer } from '@prisma/client'
import { formatINR } from '@/lib/utils/currency'
import { IconEdit, IconChevronRight } from '@tabler/icons-react'

interface CustomerWithSummary extends Customer {
  totalOutstanding: number
  totalOverdue: number
  overdueCount: number
}

export function CustomerTable({ customers }: { customers: CustomerWithSummary[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Outstanding
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Overdue
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {customers.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.phone}</p>
                  {c.contactName && (
                    <p className="text-xs text-gray-400">{c.contactName}</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                {formatINR(c.totalOutstanding)}
              </td>
              <td className="px-6 py-4 text-right">
                {c.totalOverdue > 0 ? (
                  <div>
                    <p className="text-sm font-semibold text-red-600">{formatINR(c.totalOverdue)}</p>
                    <p className="text-xs text-red-400">{c.overdueCount} invoice{c.overdueCount !== 1 ? 's' : ''}</p>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{c.defaultTone}</td>
              <td className="px-6 py-4">
                {c.isBlocked ? (
                  <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                    Blocked
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                    Active
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right text-sm">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/customers/${c.id}/edit`} className="text-gray-400 hover:text-gray-600">
                    <IconEdit size={16} />
                  </Link>
                  <Link href={`/customers/${c.id}`} className="text-gray-400 hover:text-gray-600">
                    <IconChevronRight size={16} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
