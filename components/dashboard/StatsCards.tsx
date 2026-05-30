'use client'

import { DashboardStats } from '@/types/database'
import { formatINR } from '@/lib/utils/currency'
import { IconCurrencyRupee, IconAlertTriangle, IconCircleCheck, IconMessage } from '@tabler/icons-react'

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Outstanding',
      value: formatINR(stats.totalOutstanding),
      icon: IconCurrencyRupee,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Overdue',
      value: formatINR(stats.totalOverdue),
      sub: `${stats.overdueCount} invoices`,
      icon: IconAlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'Collected This Month',
      value: formatINR(stats.collectedThisMonth),
      icon: IconCircleCheck,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Reminders Sent Today',
      value: stats.remindersSentToday.toString(),
      icon: IconMessage,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{card.label}</p>
            <div className={`rounded-lg p-2 ${card.bg}`}>
              <card.icon size={18} className={card.color} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{card.value}</p>
          {card.sub && <p className="mt-1 text-xs text-gray-500">{card.sub}</p>}
        </div>
      ))}
    </div>
  )
}
