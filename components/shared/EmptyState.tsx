'use client'

import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        className
      )}
    >
      {icon && (
        <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100/60 border border-gray-100 shadow-[0_2px_6px_rgba(0,0,0,0.015)]">
          <div className="text-gray-400/90 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">{title}</h3>
      {description && (
        <p className="mt-2 text-[13px] text-gray-400 max-w-[280px] leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
