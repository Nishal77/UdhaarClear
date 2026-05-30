'use client'

import { InvoiceStatus } from '@prisma/client'
import { cn } from '@/lib/utils/cn'

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' },
  DUE: { label: 'Due Today', className: 'bg-orange-50 text-orange-700 ring-orange-600/20' },
  OVERDUE: { label: 'Overdue', className: 'bg-red-50 text-red-700 ring-red-600/20 font-bold' },
  PARTIALLY_PAID: { label: 'Partial', className: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  PAID: { label: 'Paid', className: 'bg-green-50 text-green-700 ring-green-600/20' },
  DISPUTED: { label: 'Disputed', className: 'bg-purple-50 text-purple-700 ring-purple-600/20' },
  WRITTEN_OFF: { label: 'Written Off', className: 'bg-gray-100 text-gray-600 ring-gray-500/20' },
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
