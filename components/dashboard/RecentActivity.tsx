'use client'

import { formatDistanceToNow } from 'date-fns'
import { formatINRCompact } from '@/lib/utils/currency'

type ActivityType = 'reminder_sent' | 'payment_received' | 'invoice_added'

interface Activity {
  id: string
  type: ActivityType
  customerName: string
  amount: number
  createdAt: Date
}

const CONFIG: Record<
  ActivityType,
  { label: string; badge: string; avatarBg: string; dot: string }
> = {
  reminder_sent: {
    label: 'reminder sent',
    badge: 'badge-sent',
    avatarBg: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
  },
  payment_received: {
    label: 'paid',
    badge: 'badge-paid',
    avatarBg: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  invoice_added: {
    label: 'invoice added',
    badge: 'badge-sent',
    avatarBg: 'bg-purple-100 text-purple-700',
    dot: 'bg-purple-500',
  },
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function RecentActivity({ activities }: { activities: Activity[] }) {
  return (
    <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)] border border-black/4 p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-gray-900">Live Activity</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Real-time payment events</p>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-[pulseSoft_2s_ease-in-out_infinite]" />
          Live
        </span>
      </div>

      {!activities.length ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <span className="text-lg">💤</span>
          </div>
          <p className="text-[13px] font-medium text-gray-500">No activity today</p>
          <p className="text-[11px] text-gray-400 mt-1">Send reminders to get started</p>
        </div>
      ) : (
        <div className="space-y-1">
          {activities.map((a, i) => {
            const cfg = CONFIG[a.type]
            return (
              <div
                key={a.id}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-gray-50"
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${cfg.avatarBg}`}
                >
                  {initials(a.customerName)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-gray-900 leading-tight">
                    <span className="font-semibold">{a.customerName}</span>
                    <span className="text-gray-400"> {cfg.label}</span>
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {formatDistanceToNow(a.createdAt, { addSuffix: true })}
                  </p>
                </div>

                {/* Right: amount + badge */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[12px] font-bold text-gray-900">
                    {formatINRCompact(a.amount)}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${cfg.badge}`}>
                    {a.type === 'payment_received' ? '● Paid' : a.type === 'reminder_sent' ? '● Sent' : '● Added'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
