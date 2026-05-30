'use client'

import { DashboardStats } from '@/types/database'
import { formatINRCompact } from '@/lib/utils/currency'
import {
  IconTrendingUp,
  IconTrendingDown,
  IconAlertTriangle,
  IconCircleCheck,
  IconMessage2,
  IconWallet,
} from '@tabler/icons-react'

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const recoveryRate =
    stats.totalOutstanding > 0
      ? Math.round((stats.collectedThisMonth / (stats.collectedThisMonth + stats.totalOutstanding)) * 100)
      : 0

  const cards = [
    {
      label: 'Total Outstanding',
      value: formatINRCompact(stats.totalOutstanding),
      sub: 'Across all invoices',
      icon: IconWallet,
      trend: '+8%',
      trendUp: false,
      gradient: 'from-[#EEF2FF] to-[#E0E7FF]',
      iconBg: 'bg-brand-500',
      accentBar: 'bg-brand-500',
    },
    {
      label: 'Recovered This Month',
      value: formatINRCompact(stats.collectedThisMonth),
      sub: `${recoveryRate}% recovery rate`,
      icon: IconCircleCheck,
      trend: '+23%',
      trendUp: true,
      gradient: 'from-[#F0FDF4] to-[#DCFCE7]',
      iconBg: 'bg-emerald-500',
      accentBar: 'bg-emerald-500',
    },
    {
      label: 'Reminders Sent Today',
      value: stats.remindersSentToday.toString(),
      sub: 'via WhatsApp',
      icon: IconMessage2,
      trend: '9 delivered',
      trendUp: true,
      gradient: 'from-[#EFF6FF] to-[#DBEAFE]',
      iconBg: 'bg-blue-500',
      accentBar: 'bg-blue-500',
    },
    {
      label: 'Overdue Customers',
      value: stats.overdueCount.toString(),
      sub: `${formatINRCompact(stats.totalOverdue)} overdue`,
      icon: IconAlertTriangle,
      trend: '3 need Final Notice',
      trendUp: false,
      isAlert: true,
      gradient: 'from-[#FFF7ED] to-[#FFEDD5]',
      iconBg: 'bg-orange-500',
      accentBar: 'bg-orange-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)] border border-black/4"
        >
          {/* Accent top bar */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] ${card.accentBar}`} />

          <div className="p-5 pt-6">
            {/* Header row */}
            <div className="flex items-start justify-between mb-3">
              <p className="text-[12px] font-semibold text-gray-500 leading-tight">{card.label}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.iconBg} shadow-sm`}>
                <card.icon size={15} className="text-white" />
              </div>
            </div>

            {/* Value */}
            <p className="text-[28px] font-bold text-gray-900 leading-none tracking-tight">
              {card.value}
            </p>

            {/* Sub + trend */}
            <div className="mt-2.5 flex items-center gap-1.5">
              {card.trendUp !== undefined && (
                <span
                  className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    card.isAlert
                      ? 'bg-orange-50 text-orange-600'
                      : card.trendUp
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {!card.isAlert && (card.trendUp ? <IconTrendingUp size={10} /> : <IconTrendingDown size={10} />)}
                  {card.trend}
                </span>
              )}
              <span className="text-[11px] text-gray-400">{card.sub}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
