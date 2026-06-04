'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatINRCompact } from '@/lib/utils/currency'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Coins01Icon,
  HourglassIcon,
  InvoiceIcon,
  AiBrain01Icon,
  Chart01Icon
} from '@hugeicons/core-free-icons'

// Mock Data structure for outstanding invoice details per cell
interface DetailInvoice {
  invoiceNumber: string
  amount: number
  daysLate: number
  dueDate: string
  status: 'CURRENT' | 'OVERDUE'
}

interface HeatmapRow {
  id: string
  customerName: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  current: number
  dpd_1_30: number
  dpd_31_45: number
  dpd_46_60: number
  dpd_61_90: number
  dpd_90_plus: number
  invoices: {
    current: DetailInvoice[]
    dpd_1_30: DetailInvoice[]
    dpd_31_45: DetailInvoice[]
    dpd_46_60: DetailInvoice[]
    dpd_61_90: DetailInvoice[]
    dpd_90_plus: DetailInvoice[]
  }
}

const HEATMAP_DATA: HeatmapRow[] = [
  {
    id: 'c-1',
    customerName: 'Reddy Enterprises',
    riskLevel: 'HIGH',
    current: 150000,
    dpd_1_30: 80000,
    dpd_31_45: 0,
    dpd_46_60: 120000,
    dpd_61_90: 0,
    dpd_90_plus: 0,
    invoices: {
      current: [{ invoiceNumber: 'INV-2026-012', amount: 150000, daysLate: 0, dueDate: '15 Jun 2026', status: 'CURRENT' }],
      dpd_1_30: [{ invoiceNumber: 'INV-2026-009', amount: 80000, daysLate: 15, dueDate: '20 May 2026', status: 'OVERDUE' }],
      dpd_31_45: [],
      dpd_46_60: [{ invoiceNumber: 'INV-2026-004', amount: 120000, daysLate: 50, dueDate: '15 Apr 2026', status: 'OVERDUE' }],
      dpd_61_90: [],
      dpd_90_plus: []
    }
  },
  {
    id: 'c-2',
    customerName: 'Bharat Steel Works',
    riskLevel: 'HIGH',
    current: 0,
    dpd_1_30: 0,
    dpd_31_45: 640000,
    dpd_46_60: 0,
    dpd_61_90: 0,
    dpd_90_plus: 0,
    invoices: {
      current: [],
      dpd_1_30: [],
      dpd_31_45: [{ invoiceNumber: 'INV-2026-002', amount: 640000, daysLate: 42, dueDate: '23 Apr 2026', status: 'OVERDUE' }],
      dpd_46_60: [],
      dpd_61_90: [],
      dpd_90_plus: []
    }
  },
  {
    id: 'c-3',
    customerName: 'MegaVision Electronics',
    riskLevel: 'CRITICAL',
    current: 0,
    dpd_1_30: 350000,
    dpd_31_45: 0,
    dpd_46_60: 0,
    dpd_61_90: 1850000,
    dpd_90_plus: 0,
    invoices: {
      current: [],
      dpd_1_30: [{ invoiceNumber: 'INV-2026-010', amount: 350000, daysLate: 22, dueDate: '13 May 2026', status: 'OVERDUE' }],
      dpd_31_45: [],
      dpd_46_60: [],
      dpd_61_90: [{ invoiceNumber: 'INV-2026-006', amount: 1850000, daysLate: 72, dueDate: '24 Mar 2026', status: 'OVERDUE' }],
      dpd_90_plus: []
    }
  },
  {
    id: 'c-4',
    customerName: 'Tara Decoratives',
    riskLevel: 'CRITICAL',
    current: 50000,
    dpd_1_30: 0,
    dpd_31_45: 0,
    dpd_46_60: 0,
    dpd_61_90: 0,
    dpd_90_plus: 120000,
    invoices: {
      current: [{ invoiceNumber: 'INV-2026-015', amount: 50000, daysLate: 0, dueDate: '22 Jun 2026', status: 'CURRENT' }],
      dpd_1_30: [],
      dpd_31_45: [],
      dpd_46_60: [],
      dpd_61_90: [],
      dpd_90_plus: [{ invoiceNumber: 'INV-2026-007', amount: 120000, daysLate: 95, dueDate: '01 Mar 2026', status: 'OVERDUE' }]
    }
  },
  {
    id: 'c-5',
    customerName: 'Karan Logistics Ltd.',
    riskLevel: 'LOW',
    current: 450000,
    dpd_1_30: 0,
    dpd_31_45: 0,
    dpd_46_60: 0,
    dpd_61_90: 0,
    dpd_90_plus: 0,
    invoices: {
      current: [{ invoiceNumber: 'INV-2026-018', amount: 450000, daysLate: 0, dueDate: '18 Jun 2026', status: 'CURRENT' }],
      dpd_1_30: [],
      dpd_31_45: [],
      dpd_46_60: [],
      dpd_61_90: [],
      dpd_90_plus: []
    }
  },
  {
    id: 'c-6',
    customerName: 'Vertex Solutions Co.',
    riskLevel: 'MEDIUM',
    current: 0,
    dpd_1_30: 0,
    dpd_31_45: 89000,
    dpd_46_60: 0,
    dpd_61_90: 0,
    dpd_90_plus: 0,
    invoices: {
      current: [],
      dpd_1_30: [],
      dpd_31_45: [{ invoiceNumber: 'INV-2026-011', amount: 89000, daysLate: 33, dueDate: '02 May 2026', status: 'OVERDUE' }],
      dpd_46_60: [],
      dpd_61_90: [],
      dpd_90_plus: []
    }
  }
]

export function AgingHeatmap() {
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL')
  
  // Drawer states
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{
    customerName: string
    bracketName: string
    invoices: DetailInvoice[]
    totalAmount: number
  } | null>(null)

  // Calculations for sums of columns
  const getFilteredRows = () => {
    return HEATMAP_DATA.filter((row) => {
      const matchesSearch = row.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRisk = riskFilter === 'ALL' || row.riskLevel === riskFilter
      return matchesSearch && matchesRisk
    })
  }

  const filteredRows = getFilteredRows()

  const sumCurrent = filteredRows.reduce((s, r) => s + r.current, 0)
  const sum1_30 = filteredRows.reduce((s, r) => s + r.dpd_1_30, 0)
  const sum31_45 = filteredRows.reduce((s, r) => s + r.dpd_31_45, 0)
  const sum46_60 = filteredRows.reduce((s, r) => s + r.dpd_46_60, 0)
  const sum61_90 = filteredRows.reduce((s, r) => s + r.dpd_61_90, 0)
  const sum90_plus = filteredRows.reduce((s, r) => s + r.dpd_90_plus, 0)
  const grandTotal = sumCurrent + sum1_30 + sum31_45 + sum46_60 + sum61_90 + sum90_plus

  // Dynamic Heatmap Colors mapping function
  const getHeatmapColor = (amount: number, type: 'current' | 'dpd_1_30' | 'dpd_31_45' | 'dpd_46_60' | 'dpd_61_90' | 'dpd_90_plus') => {
    if (amount === 0) {
      return 'bg-white text-gray-300 font-normal hover:bg-gray-50 border-dashed border-gray-100'
    }

    const hoverClass = 'hover:scale-[1.02] hover:shadow-2xs cursor-pointer transition-all'

    switch (type) {
      case 'current':
        return `bg-emerald-50/40 text-emerald-700 font-bold border border-emerald-100/30 ${hoverClass}`
      case 'dpd_1_30':
        return amount < 100000
          ? `bg-blue-50/40 text-blue-700 border border-blue-100/30 ${hoverClass}`
          : `bg-blue-100/60 text-blue-800 border border-blue-200/40 ${hoverClass}`
      case 'dpd_31_45':
        return amount < 100000
          ? `bg-amber-50/50 text-amber-700 border border-amber-100/30 ${hoverClass}`
          : `bg-amber-100/70 text-amber-800 border border-amber-200/40 ${hoverClass}`
      case 'dpd_46_60':
        return amount < 100000
          ? `bg-orange-50 text-orange-700 border border-orange-100/30 ${hoverClass}`
          : `bg-orange-100 text-orange-850 border border-orange-200/40 ${hoverClass}`
      case 'dpd_61_90':
        return amount < 100000
          ? `bg-rose-50 text-rose-700 border border-rose-100/30 ${hoverClass}`
          : `bg-rose-100 text-rose-850 border border-rose-200/40 ${hoverClass}`
      case 'dpd_90_plus':
        return amount < 100000
          ? `bg-red-50 text-red-750 border border-red-150 ${hoverClass}`
          : `bg-red-100 text-red-900 border border-red-200 ${hoverClass}`
      default:
        return `bg-gray-50 text-gray-800 ${hoverClass}`
    }
  }

  // Handle cell click to open invoice inspector drawer
  const handleCellClick = (
    customerName: string,
    bracketName: string,
    invoices: DetailInvoice[],
    amount: number
  ) => {
    if (amount === 0) return
    setSelectedCell({
      customerName,
      bracketName,
      invoices,
      totalAmount: amount
    })
    setInspectorOpen(true)
  }

  const triggerSimulatedReminder = (invNum: string, type: 'whatsapp' | 'email') => {
    toast.success(`Reminder sent for ${invNum} via ${type === 'whatsapp' ? 'WhatsApp' : 'Email'}`)
  }

  return (
    <div className="space-y-4">

      {/* ── Metrics Bar (Premium Individual Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        
        {/* Metric 1: Total Accounts Receivable */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Ledger (AR)</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <HugeiconsIcon icon={Coins01Icon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block">
              {formatINRCompact(grandTotal)}
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ● Dynamic calculation
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Overdue AR */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">At Risk (&gt;30 Days)</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-650">
              <HugeiconsIcon icon={HourglassIcon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block">
              {formatINRCompact(sum31_45 + sum46_60 + sum61_90 + sum90_plus)}
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ⚠️ Requires attention
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Critical Overdue */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Critical (&gt;90 Days)</span>
            <span className="p-1.5 rounded-lg bg-violet-50 text-violet-600">
              <HugeiconsIcon icon={InvoiceIcon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block font-mono">
              {formatINRCompact(sum90_plus)}
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ⏱️ Legal claim eligible
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Risk Index */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Collection Index</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <HugeiconsIcon icon={Chart01Icon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block">
              {grandTotal > 0 ? ((sumCurrent + sum1_30) / grandTotal * 100).toFixed(1) : '100'}%
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                Healthy portion: Current + 1-30d
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Heatmap Toolbar controls ── */}
      <div className="bg-white border border-[#EBEAE6] rounded-xl p-4 select-none shadow-xs text-left">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Left Block: Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers..."
                className="w-full h-9 bg-gray-50 rounded-lg pl-9 pr-8 text-[12px] text-gray-800 border border-[#EBEAE6] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FF6A39]/20 transition-all"
              />
            </div>

            {/* Risk filter group */}
            <div className="flex items-center gap-1 bg-gray-100/70 p-1 rounded-lg">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setRiskFilter(risk as any)}
                  className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all ${
                    riskFilter === risk
                      ? 'bg-white text-gray-900 shadow-3xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          {/* Right Block: Heatmap Color Scale explanation */}
          <div className="flex items-center gap-3 flex-wrap text-[11px] font-semibold text-gray-400">
            <span className="uppercase tracking-wider">Risk Scale:</span>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 border border-emerald-100/30 text-emerald-700 text-[10px]">
                Current
              </span>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 border border-blue-100/30 text-blue-700 text-[10px]">
                1-30 DPD
              </span>
              <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 border border-amber-100/30 text-amber-700 text-[10px]">
                31-45 DPD
              </span>
              <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-0.5 border border-orange-100/30 text-orange-700 text-[10px]">
                46-60 DPD
              </span>
              <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 border border-rose-100/30 text-rose-700 text-[10px]">
                61-90 DPD
              </span>
              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 border border-red-150 text-red-750 text-[10px]">
                &gt;90 DPD
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Heatmap Matrix Table ── */}
      <div className="rounded-xl bg-white border border-[#EBEAE6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#EBEAE6] select-none bg-gray-50/50">
                <th className="px-5 py-3.5 text-left text-[12px] font-bold text-gray-500 w-[220px]">Customer</th>
                <th className="px-4 py-3.5 text-center text-[12px] font-bold text-gray-500 w-[90px]">Risk Profile</th>
                <th className="px-4 py-3.5 text-right text-[12px] font-bold text-gray-500 w-[110px]">Not Overdue</th>
                <th className="px-4 py-3.5 text-right text-[12px] font-bold text-gray-500 w-[110px]">1-30 Days</th>
                <th className="px-4 py-3.5 text-right text-[12px] font-bold text-gray-500 w-[110px]">31-45 Days</th>
                <th className="px-4 py-3.5 text-right text-[12px] font-bold text-gray-500 w-[110px]">46-60 Days</th>
                <th className="px-4 py-3.5 text-right text-[12px] font-bold text-gray-500 w-[110px]">61-90 Days</th>
                <th className="px-4 py-3.5 text-right text-[12px] font-bold text-gray-500 w-[110px]">&gt;90 Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEAE6]/60 text-left">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[13px] text-gray-400 font-medium select-none">
                    No customers match the current search or risk filters.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/40 transition-colors">
                    
                    {/* Customer Info */}
                    <td className="px-5 py-4 w-[220px]">
                      <div>
                        <span className="text-[13px] font-bold text-gray-900 block leading-tight">
                          {row.customerName}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium block mt-1">
                          Total AR: {formatINRCompact(row.current + row.dpd_1_30 + row.dpd_31_45 + row.dpd_46_60 + row.dpd_61_90 + row.dpd_90_plus)}
                        </span>
                      </div>
                    </td>

                    {/* Risk Badge */}
                    <td className="px-4 py-4 text-center w-[90px]">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9.5px] font-bold whitespace-nowrap ${
                        row.riskLevel === 'CRITICAL'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : row.riskLevel === 'HIGH'
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : row.riskLevel === 'MEDIUM'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {row.riskLevel}
                      </span>
                    </td>

                    {/* Heatmap Cells */}
                    {/* Current */}
                    <td className="px-2 py-2 text-right">
                      <div
                        onClick={() => handleCellClick(row.customerName, 'Not Overdue', row.invoices.current, row.current)}
                        className={`mx-1 p-2 rounded-lg text-xs font-bold text-right ${getHeatmapColor(row.current, 'current')}`}
                      >
                        {row.current > 0 ? formatINRCompact(row.current) : '—'}
                      </div>
                    </td>

                    {/* 1-30 Days */}
                    <td className="px-2 py-2 text-right">
                      <div
                        onClick={() => handleCellClick(row.customerName, '1-30 Days DPD', row.invoices.dpd_1_30, row.dpd_1_30)}
                        className={`mx-1 p-2 rounded-lg text-xs font-bold text-right ${getHeatmapColor(row.dpd_1_30, 'dpd_1_30')}`}
                      >
                        {row.dpd_1_30 > 0 ? formatINRCompact(row.dpd_1_30) : '—'}
                      </div>
                    </td>

                    {/* 31-45 Days */}
                    <td className="px-2 py-2 text-right">
                      <div
                        onClick={() => handleCellClick(row.customerName, '31-45 Days DPD', row.invoices.dpd_31_45, row.dpd_31_45)}
                        className={`mx-1 p-2 rounded-lg text-xs font-bold text-right ${getHeatmapColor(row.dpd_31_45, 'dpd_31_45')}`}
                      >
                        {row.dpd_31_45 > 0 ? formatINRCompact(row.dpd_31_45) : '—'}
                      </div>
                    </td>

                    {/* 46-60 Days */}
                    <td className="px-2 py-2 text-right">
                      <div
                        onClick={() => handleCellClick(row.customerName, '46-60 Days DPD', row.invoices.dpd_46_60, row.dpd_46_60)}
                        className={`mx-1 p-2 rounded-lg text-xs font-bold text-right ${getHeatmapColor(row.dpd_46_60, 'dpd_46_60')}`}
                      >
                        {row.dpd_46_60 > 0 ? formatINRCompact(row.dpd_46_60) : '—'}
                      </div>
                    </td>

                    {/* 61-90 Days */}
                    <td className="px-2 py-2 text-right">
                      <div
                        onClick={() => handleCellClick(row.customerName, '61-90 Days DPD', row.invoices.dpd_61_90, row.dpd_61_90)}
                        className={`mx-1 p-2 rounded-lg text-xs font-bold text-right ${getHeatmapColor(row.dpd_61_90, 'dpd_61_90')}`}
                      >
                        {row.dpd_61_90 > 0 ? formatINRCompact(row.dpd_61_90) : '—'}
                      </div>
                    </td>

                    {/* >90 Days */}
                    <td className="px-2 py-2 text-right">
                      <div
                        onClick={() => handleCellClick(row.customerName, '>90 Days DPD', row.invoices.dpd_90_plus, row.dpd_90_plus)}
                        className={`mx-1 p-2 rounded-lg text-xs font-bold text-right ${getHeatmapColor(row.dpd_90_plus, 'dpd_90_plus')}`}
                      >
                        {row.dpd_90_plus > 0 ? formatINRCompact(row.dpd_90_plus) : '—'}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

            {/* Bottom summary footer row */}
            <tfoot>
              <tr className="border-t border-[#EBEAE6] bg-gray-50/70 font-extrabold select-none text-right text-gray-900">
                <td colSpan={2} className="px-5 py-4 text-left text-xs font-black uppercase text-gray-500">
                  Total Outstanding
                </td>
                <td className="px-4 py-4 text-xs font-mono">{formatINRCompact(sumCurrent)}</td>
                <td className="px-4 py-4 text-xs font-mono">{formatINRCompact(sum1_30)}</td>
                <td className="px-4 py-4 text-xs font-mono text-amber-700">{formatINRCompact(sum31_45)}</td>
                <td className="px-4 py-4 text-xs font-mono text-orange-700">{formatINRCompact(sum46_60)}</td>
                <td className="px-4 py-4 text-xs font-mono text-rose-700">{formatINRCompact(sum61_90)}</td>
                <td className="px-4 py-4 text-xs font-mono text-red-700">{formatINRCompact(sum90_plus)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── Actionable Aging Advice box ── */}
      <div className="bg-[#FAF9F6] border border-[#EBEAE6] rounded-[22px] p-5 text-left select-none shadow-3xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-orange-100 text-[#FF6A39]">
            <HugeiconsIcon icon={AiBrain01Icon} size={16} />
          </span>
          <h3 className="text-[14.5px] font-extrabold text-gray-900 uppercase tracking-wider">
            Aging Heatmap Insights
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Insight 1: High concentration late */}
          <div className="bg-white border-l-4 border-red-500 border-y border-r border-[#EBEAE6]/65 p-4 rounded-r-xl flex gap-3.5 hover:shadow-xs transition-shadow">
            <div className="h-8.5 w-8.5 rounded-full bg-red-50 text-red-650 flex items-center justify-center flex-shrink-0 text-sm">
              🔥
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-900 block leading-tight">
                Critical Aging Concentration
              </span>
              <p className="text-[11.5px] text-gray-500 font-medium leading-relaxed">
                Over {formatINRCompact(sum90_plus + sum61_90)} ({( (sum90_plus + sum61_90) / (grandTotal || 1) * 100).toFixed(0)}% of your ledger) is overdue by more than 60 days. These accounts have entered critical collection probability ranges.
              </p>
            </div>
          </div>

          {/* Insight 2: Recovery opportunity */}
          <div className="bg-white border-l-4 border-blue-500 border-y border-r border-[#EBEAE6]/65 p-4 rounded-r-xl flex gap-3.5 hover:shadow-xs transition-shadow">
            <div className="h-8.5 w-8.5 rounded-full bg-blue-50 text-blue-650 flex items-center justify-center flex-shrink-0 text-sm">
              💡
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-900 block leading-tight">
                Collection Action Guide
              </span>
              <p className="text-[11.5px] text-gray-500 font-medium leading-relaxed">
                Clicking on colored cells opens the **Invoice Inspector**. Try selecting cells in the 31-45 and 46-60 DPD columns to dispatch assertive warnings.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── INVOICE INSPECTOR DRAWER (Sliding drawer) ── */}
      {inspectorOpen && selectedCell && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setInspectorOpen(false)} />

          <div className="relative z-10 w-full max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col h-full border-l border-[#EBEAE6]">
            
            {/* Header */}
            <div className="p-5 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold text-[#FF6A39] uppercase tracking-widest">
                  {selectedCell.bracketName} Bracket
                </span>
                <h3 className="text-[16px] font-bold text-gray-900 mt-0.5 leading-tight">
                  {selectedCell.customerName}
                </h3>
              </div>
              <button
                onClick={() => setInspectorOpen(false)}
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Cell Info Overview */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5 text-left">
              <div className="bg-white border border-[#EBEAE6] p-4 rounded-xl space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Total Cell Balance:</span>
                  <span className="font-extrabold text-gray-900">{formatINRCompact(selectedCell.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Outstanding Invoices:</span>
                  <span className="font-bold text-gray-800">{selectedCell.invoices.length} Files</span>
                </div>
              </div>

              {/* Invoices List */}
              <div className="space-y-3">
                <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wider block">
                  Invoice Breakdown
                </span>

                {selectedCell.invoices.length === 0 ? (
                  <div className="text-xs text-gray-400 font-medium py-4 text-center">
                    No active invoices mapped to this DPD cell.
                  </div>
                ) : (
                  selectedCell.invoices.map((inv) => (
                    <div key={inv.invoiceNumber} className="bg-white border border-[#EBEAE6] p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                          {inv.invoiceNumber}
                        </span>
                        <span className="text-xs font-extrabold text-red-650">
                          {formatINRCompact(inv.amount)}
                        </span>
                      </div>

                      <div className="flex justify-between text-[11px] text-gray-500 font-semibold border-b border-gray-50 pb-2">
                        <span>Due: {inv.dueDate}</span>
                        <span className="text-red-500">{inv.daysLate} Days Late</span>
                      </div>

                      {/* Reminder Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => triggerSimulatedReminder(inv.invoiceNumber, 'whatsapp')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-[10.5px] transition-colors cursor-pointer"
                        >
                          💬 Send WhatsApp
                        </button>
                        <button
                          onClick={() => triggerSimulatedReminder(inv.invoiceNumber, 'email')}
                          className="flex-1 bg-gray-950 hover:bg-gray-850 text-white font-bold py-1.5 px-3 rounded-lg text-[10.5px] transition-colors cursor-pointer"
                        >
                          ✉️ Send Email
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-white border-t border-gray-100 flex gap-2.5">
              <button
                onClick={() => setInspectorOpen(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
