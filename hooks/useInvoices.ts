'use client'

import { useState, useEffect } from 'react'
import { InvoiceWithCustomer } from '@/types/database'

export function useInvoices(params?: { customerId?: string; status?: string }) {
  const [invoices, setInvoices] = useState<InvoiceWithCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const qs = new URLSearchParams()
    if (params?.customerId) qs.set('customerId', params.customerId)
    if (params?.status) qs.set('status', params.status)

    fetch(`/api/invoices?${qs}`)
      .then((r) => r.json())
      .then((data) => setInvoices(data.invoices ?? []))
      .catch(() => setError('Failed to load invoices'))
      .finally(() => setLoading(false))
  }, [params?.customerId, params?.status])

  return { invoices, loading, error }
}
