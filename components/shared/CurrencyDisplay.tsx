'use client'

import { formatINR } from '@/lib/utils/currency'
import { cn } from '@/lib/utils/cn'

interface CurrencyDisplayProps {
  amount: number | string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function CurrencyDisplay({ amount, className, size = 'md' }: CurrencyDisplayProps) {
  const formatted = formatINR(typeof amount === 'string' ? parseFloat(amount) : amount)
  return (
    <span
      className={cn(
        'font-semibold tabular-nums',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-xl',
        className
      )}
    >
      {formatted}
    </span>
  )
}
