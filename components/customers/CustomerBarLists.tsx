'use client'

import React from 'react'
import { BarList } from '@/components/ui/BarList'
import { formatINR } from '@/lib/utils/currency'

interface CustomerBarItem {
  id: string
  name: string
  value: number
  formattedValue: string
  totalOutstanding: number
  totalOverdue: number
  overdueCount: number
  phone: string | null
  city: string | null
  contactName: string | null
  defaultTone: string
  isBlocked: boolean
  colorClass?: string
}

interface CustomerBarListsProps {
  customers: {
    id: string
    name: string
    contactName: string | null
    phone: string | null
    city: string | null
    defaultTone: string
    isBlocked: boolean
    totalOutstanding: number
    totalOverdue: number
    overdueCount: number
  }[]
}

export function CustomerBarLists({ customers }: CustomerBarListsProps) {
  // Map and sort for Outstanding (Top 4)
  const outstandingData: CustomerBarItem[] = [...customers]
    .filter((c) => c.totalOutstanding > 0)
    .sort((a, b) => b.totalOutstanding - a.totalOutstanding)
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      name: c.name,
      value: c.totalOutstanding,
      formattedValue: formatINR(c.totalOutstanding),
      totalOutstanding: c.totalOutstanding,
      totalOverdue: c.totalOverdue,
      overdueCount: c.overdueCount,
      phone: c.phone,
      city: c.city,
      contactName: c.contactName,
      defaultTone: c.defaultTone,
      isBlocked: c.isBlocked,
      colorClass: 'bg-gradient-to-r from-blue-500/5 to-blue-500/15',
    }))

  // Map and sort for Overdue (Top 4)
  const overdueData: CustomerBarItem[] = [...customers]
    .filter((c) => c.totalOverdue > 0)
    .sort((a, b) => b.totalOverdue - a.totalOverdue)
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      name: c.name,
      value: c.totalOverdue,
      formattedValue: formatINR(c.totalOverdue),
      totalOutstanding: c.totalOutstanding,
      totalOverdue: c.totalOverdue,
      overdueCount: c.overdueCount,
      phone: c.phone,
      city: c.city,
      contactName: c.contactName,
      defaultTone: c.defaultTone,
      isBlocked: c.isBlocked,
      colorClass: 'bg-gradient-to-r from-rose-500/5 to-rose-500/15',
    }))

  return (
    <div className="grid grid-cols-1 divide-y md:divide-y-0 md:divide-x divide-[#EBEAE6]/60 md:grid-cols-2">
      {/* Outstanding Debtors Column */}
      <div className="px-6 py-8 space-y-4">
        <div>
          <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Top Customers by Outstanding Amount</h3>
          <p className="text-[12px] text-gray-400 mt-0.5">Active and future receivables currently billed</p>
        </div>
        {outstandingData.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-gray-400 font-medium">No outstanding balances</div>
        ) : (
          <BarList
            data={outstandingData}
            sortOrder="none" // Already pre-sorted and sliced
          />
        )}
      </div>

      {/* Overdue Debtors Column */}
      <div className="px-6 py-8 space-y-4">
        <div>
          <h3 className="text-[16px] font-bold text-red-600 tracking-tight">Top Customers by Overdue Amount</h3>
          <p className="text-[12px] text-gray-400 mt-0.5">Critical receivables past their due dates</p>
        </div>
        {overdueData.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-gray-400 font-medium">No overdue balances</div>
        ) : (
          <BarList
            data={overdueData}
            sortOrder="none" // Already pre-sorted and sliced
          />
        )}
      </div>
    </div>
  )
}
