'use client'

import Link from 'next/link'
import { Customer } from '@prisma/client'
import { formatINRCompact } from '@/lib/utils/currency'
import { HugeiconsIcon } from '@hugeicons/react'
import { PencilEdit01Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons'

interface CustomerWithSummary extends Customer {
  totalOutstanding: number
  totalOverdue: number
  overdueCount: number
}

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
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const TONE_BADGE: Record<string, string> = {
  GENTLE:     'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  ASSERTIVE:  'bg-amber-50 text-amber-700 ring-amber-600/10',
  FIRM:       'bg-orange-50 text-orange-700 ring-orange-600/10',
  LEGAL:      'bg-red-50 text-red-700 ring-red-600/10',
}

export function CustomerTable({ customers }: { customers: CustomerWithSummary[] }) {
  return (
    <div className="rounded-2xl bg-white border border-[#EBEAE6]/60 shadow-sm overflow-hidden">
      {/* Table header */}
      <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-white to-gray-50/20">
        <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest">
          {customers.length} customer{customers.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">#</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Customer</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Outstanding</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Overdue</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">Tone</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">Status</th>
              <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {customers.map((c, i) => {
              const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length]
              const toneBadge = TONE_BADGE[c.defaultTone] ?? 'bg-gray-100 text-gray-600 ring-gray-500/10'

              return (
                <tr
                  key={c.id}
                  className="group transition-colors hover:bg-gray-50/60"
                >
                  {/* Index */}
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-medium text-gray-400">{String(i + 1).padStart(2, '0')}</span>
                  </td>

                  {/* Customer info */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${avatarColor}`}>
                        {initials(c.name)}
                      </div>
                      <div>
                        <Link
                          href={`/customers/${c.id}`}
                          className="text-[14px] font-semibold text-gray-900 hover:text-[#FF6A39] transition-colors leading-tight block"
                        >
                          {c.name}
                        </Link>
                        <p className="text-[12px] text-gray-400 mt-0.5">{c.phone}</p>
                        {c.contactName && (
                          <p className="text-[11px] text-gray-300 mt-0.5">{c.contactName}</p>
                        )}
                      </div>
                    </div>
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

                  {/* Tone */}
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${toneBadge}`}>
                      {c.defaultTone.charAt(0) + c.defaultTone.slice(1).toLowerCase()}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 text-center">
                    {c.isBlocked ? (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 ring-1 ring-inset ring-red-600/10">
                        Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                        Active
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/customers/${c.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
                        title="Edit"
                      >
                        <HugeiconsIcon icon={PencilEdit01Icon} size={15} />
                      </Link>
                      <Link
                        href={`/customers/${c.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
                        title="View"
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
