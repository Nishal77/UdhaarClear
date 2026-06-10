'use client'

import { useState, useEffect } from 'react'
import { formatINRCompact } from '@/lib/utils/currency'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  InvoiceIcon,
  Search01Icon,
  InformationCircleIcon,
  Mail01Icon,
  WhatsappIcon
} from '@hugeicons/core-free-icons'

// Data structures for outstanding invoice details per DPD cell
interface DetailInvoice {
  id: string
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

export function AgingHeatmap() {
  const [heatmapData, setHeatmapData] = useState<HeatmapRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
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

  // Fetch live heatmap metrics from the backend API
  useEffect(() => {
    let isMounted = true
    setLoading(true)
    fetch('/api/analytics/heatmap')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch aging heatmap data')
        return res.json()
      })
      .then((data) => {
        if (isMounted) {
          setHeatmapData(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Heatmap fetch error:', err)
        if (isMounted) {
          setError(err.message || 'Failed to fetch aging heatmap data')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Calculations for sums of columns
  const getFilteredRows = () => {
    return heatmapData.filter((row) => {
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
      return 'bg-gray-50/30 text-gray-300 font-normal border border-dashed border-gray-200/50 hover:bg-gray-50/60 cursor-default'
    }

    const hoverClass = 'hover:scale-[1.02] hover:shadow-2xs cursor-pointer transition-all'

    switch (type) {
      case 'current':
        return `bg-emerald-50/40 text-emerald-700 border border-emerald-100/30 ${hoverClass}`
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

  // Dispatch real manual email or WhatsApp reminders using the remind API
  const triggerReminder = async (invoiceId: string, type: 'whatsapp' | 'email') => {
    const promise = fetch(`/api/invoices/${invoiceId}/remind`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channel: type }),
    }).then(async (res) => {
      const resJson = await res.json()
      if (!res.ok) {
        throw new Error(resJson.message || 'Failed to send reminder')
      }
      return resJson
    })

    toast.promise(promise, {
      loading: 'Sending reminder...',
      success: 'Reminder sent successfully!',
      error: (err) => err.message || 'Failed to send reminder',
    })
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse select-none">
        {/* Key Metrics Grid Skeleton */}
        <div className="bg-white border border-[#EBEAE6] rounded-[22px] overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="px-6 py-6 space-y-2.5">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-6 w-24 bg-gray-150 rounded" />
              </div>
            ))}
          </div>
        </div>
        {/* Toolbar Skeleton */}
        <div className="bg-white border border-[#EBEAE6] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="h-10 w-full md:w-[340px] bg-gray-150 rounded-full" />
          <div className="h-6 w-full md:w-[200px] bg-gray-100 rounded" />
        </div>
        {/* Table Skeleton */}
        <div className="bg-white border border-[#EBEAE6] rounded-[22px] p-6 space-y-4">
          <div className="h-10 bg-gray-100 rounded-xl" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-50 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50/50 border border-red-100 rounded-[22px] p-8 text-center select-none space-y-3">
        <span className="text-lg font-bold text-red-800 block">Failed to Load Aging Heatmap</span>
        <p className="text-[13px] text-red-600 font-semibold max-w-md mx-auto">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* ── Key Metrics Grid (Unified Premium Panel) ── */}
      <div className="bg-white border border-[#EBEAE6] rounded-[22px] overflow-hidden select-none">
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x text-left">
          
          {/* Stat 1: Total Ledger */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Total Ledger (AR)</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                {formatINRCompact(grandTotal)}
              </span>
              <span className="inline-flex items-center text-emerald-700 text-[11.5px] font-medium whitespace-nowrap">
                Dynamic
              </span>
            </div>
          </div>

          {/* Stat 2: At Risk (>30 Days) */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">At Risk (&gt;30 Days)</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                {formatINRCompact(sum31_45 + sum46_60 + sum61_90 + sum90_plus)}
              </span>
              <span className="inline-flex items-center text-red-700 text-[11.5px] font-medium whitespace-nowrap">
                Requires Attention
              </span>
            </div>
          </div>

          {/* Stat 3: Critical (>90 Days) */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Critical (&gt;90 Days)</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                {formatINRCompact(sum90_plus)}
              </span>
              <span className="inline-flex items-center gap-1 text-violet-700 text-[11.5px] font-medium whitespace-nowrap">
                Legal Eligible
              </span>
            </div>
          </div>

          {/* Stat 4: Risk Index */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Collection Index</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                {grandTotal > 0 ? ((sumCurrent + sum1_30) / grandTotal * 100).toFixed(1) : '100'}%
              </span>
              <span className="inline-flex items-center text-blue-700 text-[11.5px] font-medium whitespace-nowrap">
                Healthy portion
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Heatmap Toolbar controls ── */}
      <div className="bg-white border border-[#EBEAE6] rounded-xl p-4 select-none text-left">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Left Block: Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px] max-w-[340px] w-full">
              <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                <HugeiconsIcon icon={Search01Icon} size={16} className="text-gray-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers..."
                className="w-full h-10 bg-[#F1F1F1] rounded-full pl-11 pr-10 text-[13px] text-gray-800 focus:outline-none focus:bg-[#EBEBEB] focus:ring-2 focus:ring-[#FF6A39]/20 transition-all duration-200 border-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 text-xs font-semibold transition-colors z-10"
                >
                  Clear
                </button>
              )}
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
      <div className="rounded-[22px] bg-white border border-[#EBEAE6] shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#EBEAE6] select-none bg-gray-50/50">
                <th className="px-5 py-4 text-left text-[14px] font-semibold text-gray-600 w-[220px]">Customer</th>
                <th className="px-4 py-4 text-center text-[14px] font-semibold text-gray-600 w-[90px]">Risk Profile</th>
                <th className="px-4 py-4 text-right text-[14px] font-semibold text-gray-600 w-[110px]">Not Overdue</th>
                <th className="px-4 py-4 text-right text-[14px] font-semibold text-gray-600 w-[110px]">1-30 Days</th>
                <th className="px-4 py-4 text-right text-[14px] font-semibold text-gray-600 w-[110px]">31-45 Days</th>
                <th className="px-4 py-4 text-right text-[14px] font-semibold text-gray-600 w-[110px]">46-60 Days</th>
                <th className="px-4 py-4 text-right text-[14px] font-semibold text-gray-600 w-[110px]">61-90 Days</th>
                <th className="px-4 py-4 text-right text-[14px] font-semibold text-gray-600 w-[110px]">&gt;90 Days</th>
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
                    <td className="px-5 py-4.5 w-[220px]">
                      <div>
                        <span className="text-[14.5px] font-semibold text-gray-900 block leading-tight">
                          {row.customerName}
                        </span>
                        <span className="text-[11.5px] text-gray-500 font-semibold block mt-1.5">
                          Total AR: {formatINRCompact(row.current + row.dpd_1_30 + row.dpd_31_45 + row.dpd_46_60 + row.dpd_61_90 + row.dpd_90_plus)}
                        </span>
                      </div>
                    </td>

                    {/* Risk Badge */}
                    <td className="px-4 py-4 text-center w-[90px]">
                      <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[11px] font-extrabold tracking-wide whitespace-nowrap ${
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
                    <td className="px-1.5 py-3 text-right">
                      <div
                        onClick={() => handleCellClick(row.customerName, 'Not Overdue', row.invoices.current, row.current)}
                        className={`mx-0.5 py-2.5 px-2 rounded-xl text-[13.5px] font-extrabold text-center transition-all ${getHeatmapColor(row.current, 'current')}`}
                      >
                        {row.current > 0 ? formatINRCompact(row.current) : '—'}
                      </div>
                    </td>

                    {/* 1-30 Days */}
                    <td className="px-1.5 py-3 text-right">
                      <div
                        onClick={() => handleCellClick(row.customerName, '1-30 Days DPD', row.invoices.dpd_1_30, row.dpd_1_30)}
                        className={`mx-0.5 py-2.5 px-2 rounded-xl text-[13.5px] font-extrabold text-center transition-all ${getHeatmapColor(row.dpd_1_30, 'dpd_1_30')}`}
                      >
                        {row.dpd_1_30 > 0 ? formatINRCompact(row.dpd_1_30) : '—'}
                      </div>
                    </td>

                    {/* 31-45 Days */}
                    <td className="px-1.5 py-3 text-right">
                      <div
                        onClick={() => handleCellClick(row.customerName, '31-45 Days DPD', row.invoices.dpd_31_45, row.dpd_31_45)}
                        className={`mx-0.5 py-2.5 px-2 rounded-xl text-[13.5px] font-extrabold text-center transition-all ${getHeatmapColor(row.dpd_31_45, 'dpd_31_45')}`}
                      >
                        {row.dpd_31_45 > 0 ? formatINRCompact(row.dpd_31_45) : '—'}
                      </div>
                    </td>

                    {/* 46-60 Days */}
                    <td className="px-1.5 py-3 text-right">
                      <div
                        onClick={() => handleCellClick(row.customerName, '46-60 Days DPD', row.invoices.dpd_46_60, row.dpd_46_60)}
                        className={`mx-0.5 py-2.5 px-2 rounded-xl text-[13.5px] font-extrabold text-center transition-all ${getHeatmapColor(row.dpd_46_60, 'dpd_46_60')}`}
                      >
                        {row.dpd_46_60 > 0 ? formatINRCompact(row.dpd_46_60) : '—'}
                      </div>
                    </td>

                    {/* 61-90 Days */}
                    <td className="px-1.5 py-3 text-right">
                      <div
                        onClick={() => handleCellClick(row.customerName, '61-90 Days DPD', row.invoices.dpd_61_90, row.dpd_61_90)}
                        className={`mx-0.5 py-2.5 px-2 rounded-xl text-[13.5px] font-extrabold text-center transition-all ${getHeatmapColor(row.dpd_61_90, 'dpd_61_90')}`}
                      >
                        {row.dpd_61_90 > 0 ? formatINRCompact(row.dpd_61_90) : '—'}
                      </div>
                    </td>

                    {/* >90 Days */}
                    <td className="px-1.5 py-3 text-right">
                      <div
                        onClick={() => handleCellClick(row.customerName, '>90 Days DPD', row.invoices.dpd_90_plus, row.dpd_90_plus)}
                        className={`mx-0.5 py-2.5 px-2 rounded-xl text-[13.5px] font-extrabold text-center transition-all ${getHeatmapColor(row.dpd_90_plus, 'dpd_90_plus')}`}
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
                <td colSpan={2} className="px-5 py-5 text-left text-[15px] font-medium tracking-tight text-gray-900">
                  Total Outstanding
                </td>
                <td className="px-4 py-5 text-[14.5px] font-extrabold text-emerald-700">{formatINRCompact(sumCurrent)}</td>
                <td className="px-4 py-5 text-[14.5px] font-extrabold text-blue-700">{formatINRCompact(sum1_30)}</td>
                <td className="px-4 py-5 text-[14.5px] font-extrabold text-[#C06514]">{formatINRCompact(sum31_45)}</td>
                <td className="px-4 py-5 text-[14.5px] font-extrabold text-[#D9791D]">{formatINRCompact(sum46_60)}</td>
                <td className="px-4 py-5 text-[14.5px] font-extrabold text-[#E14F4B]">{formatINRCompact(sum61_90)}</td>
                <td className="px-4 py-5 text-[14.5px] font-extrabold text-[#FF0000]">{formatINRCompact(sum90_plus)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── Interactive Heatmap Guide Banner ── */}
      <div className="flex items-center gap-3 bg-blue-50/40 border border-blue-100/30 rounded-[20px] p-4 text-left select-none">
        <span className="p-2 rounded-xl bg-blue-100 text-blue-600 shrink-0">
          <HugeiconsIcon icon={InformationCircleIcon} size={18} />
        </span>
        <div className="space-y-0.5">
          <span className="text-[13px] font-extrabold text-blue-900 block">
            Interactive Heatmap Guide
          </span>
          <p className="text-[12.5px] text-blue-750 font-semibold leading-relaxed">
            The heatmap table is fully interactive. Click on any colored amount cell above to open the Invoice Inspector, where you can view specific invoices and dispatch quick WhatsApp or Email reminders.
          </p>
        </div>
      </div>

      {/* ── Actionable Aging Advice box (Smart Suggestions) ── */}
      <div className="bg-white border border-[#EBEAE6] rounded-[22px] p-6 text-left select-none space-y-5">
        <div className="flex items-center">
          <h3 className="text-[15px] font-extrabold text-gray-900 tracking-tight">
            AI Smart Suggestions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Card 1: High concentration late */}
          <div className="bg-gradient-to-br from-red-500/[0.03] to-red-500/[0.08] hover:from-red-500/[0.06] hover:to-red-500/[0.12] border border-red-500/20 p-5 rounded-2xl flex gap-4 transition-all duration-300 hover:shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-red-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm text-lg font-bold">
              🔥
            </div>
            <div className="space-y-2 flex-1">
              <span className="text-[10px] font-extrabold text-red-700 uppercase tracking-widest block">
                Risk Concentration Warning
              </span>
              <h4 className="text-sm font-extrabold text-gray-900 leading-tight">
                Overdue balances have reached critical collection ranges
              </h4>
              <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                Over {formatINRCompact(sum90_plus + sum61_90)} ({((sum90_plus + sum61_90) / (grandTotal || 1) * 100).toFixed(0)}% of your ledger) is overdue by more than 60 days. These balances have entered high-risk ranges where customer repayment likelihood drops significantly.
              </p>
            </div>
          </div>

          {/* Card 2: Recovery opportunity */}
          <div className="bg-gradient-to-br from-blue-500/[0.03] to-blue-500/[0.08] hover:from-blue-500/[0.06] hover:to-blue-500/[0.12] border border-blue-500/20 p-5 rounded-2xl flex gap-4 transition-all duration-300 hover:shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm text-lg font-bold">
              💡
            </div>
            <div className="space-y-2 flex-1">
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-widest block">
                Interactive Drill-Down
              </span>
              <h4 className="text-sm font-extrabold text-gray-900 leading-tight">
                Inspect details and dispatch reminders
              </h4>
              <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                Click on any colored amount cell in the table below to open the Invoice Inspector. From there, you can view specific invoices and dispatch quick WhatsApp/Email reminders.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── INVOICE INSPECTOR DRAWER (Sliding drawer) ── */}
      {inspectorOpen && selectedCell && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={() => setInspectorOpen(false)} />

          <div className="relative z-10 w-full max-w-md bg-[#FFFFFF] flex flex-col h-full border-l border-[#EBEAE6] rounded-l-[28px] overflow-hidden">
            
            {/* Header */}
            <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="text-left space-y-1">
                <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-[11.5px] font-semibold text-[#FF6A39] border border-orange-100/50">
                  {selectedCell.bracketName} Bracket
                </span>
                <h3 className="text-[18px] font-semibold text-gray-900 leading-tight">
                  {selectedCell.customerName}
                </h3>
              </div>
              <button
                onClick={() => setInspectorOpen(false)}
                className="h-8 w-8 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200/50 flex items-center justify-center transition-all text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Cell Info Overview */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-left">
              <div className=" text-left relative overflow-hidden">
                
                <span className="text-[14px] font-medium text-gray-600 tracking-tight block">
                  Total Cell Balance
                </span>
                <span className="text-[28px] font-semibold text-gray-900 leading-none mt-2 block tracking-tight">
                  {formatINRCompact(selectedCell.totalAmount)}
                </span>
                
                <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-600">
                  <span className="flex items-center gap-1.5">
                     <span className="w-2 h-2 rounded-full bg-[#FF6A39]" />
                    {selectedCell.bracketName} DPD
                  </span>
                  <span>{selectedCell.invoices.length} {selectedCell.invoices.length === 1 ? 'Invoice' : 'Invoices'}</span>
                </div>
              </div>

              {/* Invoices List */}
              <div className="space-y-4">
                <span className="text-[14px] font-medium text-gray-600 tracking-tight block">
                  Invoice Breakdown
                </span>

                {selectedCell.invoices.length === 0 ? (
                  <div className="text-[14px] text-gray-600 font-medium py-8 text-center">
                    No active invoices mapped to this DPD cell.
                  </div>
                ) : (
                  selectedCell.invoices.map((inv) => (
                    <div key={inv.invoiceNumber} className="bg-white space-y-4 transition-all duration-300">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[11.5px] font-bold bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg text-gray-600">
                          {inv.invoiceNumber}
                        </span>
                        <span className="text-[16px] font-bold text-gray-900">
                          {formatINRCompact(inv.amount)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[12px] text-gray-500 font-semibold border-b border-gray-100/60 pb-3">
                        <span className="flex items-center gap-1.5">
                          <HugeiconsIcon icon={InvoiceIcon} size={14} className="text-gray-400" />
                          Due: {inv.dueDate}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-50 border border-rose-100/30 text-red-600 font-extrabold text-[10px]">
                          {inv.daysLate} Days Late
                        </span>
                      </div>

                      {/* Reminder Actions */}
                      <div className="flex gap-2 pt-0.5">
                        <button
                          onClick={() => triggerReminder(inv.id, 'whatsapp')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold py-2 px-3 rounded-xl text-[11.5px] transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                        >
                          <HugeiconsIcon icon={WhatsappIcon} size={14} />
                          Send WhatsApp
                        </button>
                        <button
                          onClick={() => triggerReminder(inv.id, 'email')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-950 hover:bg-gray-850 text-white font-semibold py-2 px-3 rounded-xl text-[11.5px] transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                        >
                          <HugeiconsIcon icon={Mail01Icon} size={14} />
                          Send Email
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white border-t border-gray-100 flex gap-2.5">
              <button
                onClick={() => setInspectorOpen(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-extrabold py-3 px-4 rounded-xl text-[12.5px] transition-colors cursor-pointer"
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
