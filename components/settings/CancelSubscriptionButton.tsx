'use client'

import React, { useTransition } from 'react'

interface CancelSubscriptionButtonProps {
  onCancel: () => Promise<void>
}

export function CancelSubscriptionButton({ onCancel }: CancelSubscriptionButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleCancelClick = () => {
    if (confirm('Are you sure you want to cancel your subscription? You will be downgraded to the Free Plan.')) {
      startTransition(async () => {
        try {
          await onCancel()
        } catch (error) {
          console.error('Cancellation error:', error)
          alert('Failed to cancel subscription. Please try again.')
        }
      })
    }
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleCancelClick}
      className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100/60 border border-rose-100 px-4 py-2.5 rounded-full transition-all duration-200 cursor-pointer active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Cancelling...' : 'Cancel Subscription'}
    </button>
  )
}
