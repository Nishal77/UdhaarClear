'use client'

import { useState, useEffect } from 'react'
import { CustomerWithInvoiceSummary } from '@/types/database'

export function useCustomers() {
  const [customers, setCustomers] = useState<CustomerWithInvoiceSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/customers')
      .then((r) => r.json())
      .then((data) => {
        setCustomers(data.customers ?? [])
      })
      .catch(() => setError('Failed to load customers'))
      .finally(() => setLoading(false))
  }, [])

  return { customers, loading, error }
}
