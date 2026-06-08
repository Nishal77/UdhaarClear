'use client'

import { InvoiceStatus } from '@prisma/client'
import { cn } from '@/lib/utils/cn'

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-amber-50/50 text-amber-700 border-amber-200/60' },
  DUE: { label: 'Due Today', className: 'bg-yellow-50/60 text-[#EF9F27] border-[#EF9F27]/30' },
  OVERDUE: { label: 'Overdue', className: 'bg-red-50/50 text-red-700 border-red-200/60 font-semibold' },
  PARTIALLY_PAID: { label: 'Partial', className: 'bg-blue-50/50 text-blue-700 border-blue-200/60' },
  PAID: { label: 'Paid', className: 'bg-emerald-50/50 text-emerald-700 border-emerald-200/60' },
  DISPUTED: { label: 'Disputed', className: 'bg-purple-50/50 text-purple-700 border-purple-200/60' },
  WRITTEN_OFF: { label: 'Written Off', className: 'bg-gray-50 text-gray-500 border-gray-200' },
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-tight whitespace-nowrap select-none',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
