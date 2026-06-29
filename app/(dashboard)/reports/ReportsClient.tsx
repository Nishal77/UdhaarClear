'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { CollectionChart } from '@/components/dashboard/CollectionChart'
import { formatINR } from '@/lib/utils/currency'
import { toast } from 'sonner'

interface ReportsClientProps {
  stats: {
    totalInvoiced: number
    totalCollected: number
    collectionRate: number
    avgDsoValue: number
  }
  chartData: Array<{
    month: string
    invoiced: number
    collected: number
  }>
  topCustomers: Array<{
    customerId: string
    _sum: { paidAmount: number | null }
  }>
  customers: Array<{
    id: string
    name: string
  }>
  allInvoices: Array<{
    invoiceNumber: string
    customer: { name: string }
    amount: number
    invoiceDate: string
    dueDate: string
    status: string
    paidAmount?: number | null
    paidAt?: string | null
  }>
}

export function ReportsClient({
  stats,
  chartData,
  topCustomers,
  customers,
  allInvoices,
}: ReportsClientProps) {
  const [downloading, setDownloading] = useState(false)

  // Client-side CSV compiler
  const handleExportCSV = () => {
    try {
      const csvHeaders = ['Invoice Number', 'Customer Name', 'Billed Amount (INR)', 'Invoice Date', 'Due Date', 'Status', 'Paid Amount', 'Settled Date']
      const csvRows = allInvoices.map((inv) => [
        inv.invoiceNumber,
        inv.customer.name,
        inv.amount,
        new Date(inv.invoiceDate).toLocaleDateString('en-IN'),
        new Date(inv.dueDate).toLocaleDateString('en-IN'),
        inv.status,
        inv.paidAmount ?? 0,
        inv.paidAt ? new Date(inv.paidAt).toLocaleDateString('en-IN') : '—'
      ])

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `udhaarclear_reconciliation_report_${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('CSV ledger data exported successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to export CSV report')
    }
  }

  // Client-side PDF trigger
  const handleDownloadPDF = async () => {
    setDownloading(true)
    const toastId = toast.loading('Compiling auditor reconciliation report...')
    try {
      const response = await fetch('/api/reports/download')
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `udhaarclear_auditor_report_${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success('PDF Auditor Report downloaded successfully!', { id: toastId })
    } catch (err) {
      console.error(err)
      toast.error('Failed to download PDF auditor report', { id: toastId })
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header with action buttons */}
      <PageHeader 
        title="Reports" 
        description="Collection analytics and auditor reconciliation ledgers" 
        action={
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-full border border-[#EBEAE6] bg-white px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shadow-3xs"
            >
              📊 Export CSV
            </button>
            <button
              disabled={downloading}
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 rounded-full bg-gray-950 hover:bg-gray-850 px-4 py-2.5 text-[12px] font-bold text-white active:scale-95 transition-all cursor-pointer shadow-3xs disabled:opacity-60"
            >
              {downloading ? '⏳ Compiling...' : '📥 Download Auditor PDF'}
            </button>
          </div>
        }
      />

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Total Invoiced', value: formatINR(stats.totalInvoiced) },
          { label: 'Total Collected', value: formatINR(stats.totalCollected) },
          { label: 'Collection Rate', value: `${stats.collectionRate}%` },
          { label: 'Avg DSO', value: `${stats.avgDsoValue} days` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white border border-[#EBEAE6] p-5 text-left select-none">
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className="mt-2 text-xl font-bold text-gray-900 leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recharts Chart */}
      <CollectionChart data={chartData} />

      {/* Top Paying Customers Table */}
      <div className="rounded-xl bg-white border border-[#EBEAE6] p-6 text-left select-none">
        <h2 className="text-[15px] font-extrabold text-gray-900 mb-4">Top Paying Customers</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EBEAE6]/60 text-left text-xs font-bold text-gray-400">
              <th className="pb-2">#</th>
              <th className="pb-2">Customer</th>
              <th className="pb-2 text-right">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            {topCustomers.map((c, i) => {
              const customer = customers.find((x) => x.id === c.customerId)
              return (
                <tr key={c.customerId} className="border-b border-gray-50 text-[13.5px] font-semibold text-gray-800">
                  <td className="py-2.5 text-gray-400 font-mono">{i + 1}</td>
                  <td className="py-2.5">{customer?.name ?? '—'}</td>
                  <td className="py-2.5 text-right text-emerald-700 font-extrabold">{formatINR(Number(c._sum.paidAmount ?? 0))}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}
