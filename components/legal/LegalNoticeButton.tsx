'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { IconFileText } from '@tabler/icons-react'
import { triggerActivityToast } from '@/components/shared/ActivityToast'

export function LegalNoticeButton({ 
  invoiceId, 
  invoiceDaysOverdue, 
  customerName 
}: { 
  invoiceId: string; 
  invoiceDaysOverdue: number; 
  customerName: string 
}) {
  const [loading, setLoading] = useState(false)

  if (invoiceDaysOverdue < 30) {
    return (
      <p className="text-xs text-gray-400">
        Legal notice available after 30 days overdue ({30 - invoiceDaysOverdue} days remaining)
      </p>
    )
  }

  async function handleGenerate() {
    setLoading(true)
    try {
      const res = await fetch(`/api/legal-notice/${invoiceId}`, { method: 'POST' })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.message ?? 'Failed to generate notice')
        return
      }
      const { url } = await res.json()
      window.open(url, '_blank')
      toast.success('Legal notice generated')
      triggerActivityToast({
        type: 'escalation',
        customerName: customerName,
        detail: 'Legal notice generated'
      })
    } catch {
      toast.error('Failed to generate legal notice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
    >
      <IconFileText size={16} />
      {loading ? 'Generating...' : 'Generate Legal Notice'}
    </button>
  )
}
