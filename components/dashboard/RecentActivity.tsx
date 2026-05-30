'use client'

import { formatDistanceToNow } from 'date-fns'
import { formatINR } from '@/lib/utils/currency'
import { IconMessage, IconCircleCheck, IconFileInvoice } from '@tabler/icons-react'

type ActivityType = 'reminder_sent' | 'payment_received' | 'invoice_added'

interface Activity {
  id: string
  type: ActivityType
  customerName: string
  amount: number
  createdAt: Date
}

const ACTIVITY_CONFIG: Record<ActivityType, { icon: typeof IconMessage; color: string; label: string }> = {
  reminder_sent: { icon: IconMessage, color: 'text-blue-600 bg-blue-50', label: 'Reminder sent' },
  payment_received: { icon: IconCircleCheck, color: 'text-green-600 bg-green-50', label: 'Payment received' },
  invoice_added: { icon: IconFileInvoice, color: 'text-purple-600 bg-purple-50', label: 'Invoice added' },
}

export function RecentActivity({ activities }: { activities: Activity[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h2>
      {!activities.length ? (
        <p className="text-sm text-gray-500 text-center py-8">No activity yet</p>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => {
            const config = ACTIVITY_CONFIG[a.type]
            return (
              <div key={a.id} className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${config.color}`}>
                  <config.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{a.customerName}</span>
                    {' — '}{config.label}
                  </p>
                  <p className="text-xs text-gray-500">{formatINR(a.amount)}</p>
                </div>
                <p className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDistanceToNow(a.createdAt, { addSuffix: true })}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
