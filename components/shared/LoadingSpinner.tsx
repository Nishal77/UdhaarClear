'use client'

import { cn } from '@/lib/utils/cn'

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-brand-500',
        className
      )}
    />
  )
}

export function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <LoadingSpinner className="h-10 w-10" />
    </div>
  )
}
