'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  CheckmarkCircle01Icon, 
  Calendar01Icon, 
  Ticket01Icon, 
  InvoiceIcon,
  AlertCircleIcon,
  Invoice03Icon
} from '@hugeicons/core-free-icons'

interface PendingConfirmation {
  id: string
  invoiceNumber: string
  customerName: string
  amount: number
  dueDate: string
  paymentRef: string | null
  documentUrl: string | null
  updatedAt: string
}

interface IncomingPaymentsProps {
  initialConfirmations: PendingConfirmation[]
}

const DUMMY_CONFIRMATIONS: PendingConfirmation[] = [
  {
    id: 'dummy-confirm-1',
    invoiceNumber: 'INV-2026-004',
    customerName: 'Kaveri Auto Parts',
    amount: 25000.00,
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paymentRef: 'UTR992810238491',
    documentUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=800&auto=format&fit=crop&q=60',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 'dummy-confirm-2',
    invoiceNumber: 'INV-2026-003',
    customerName: 'Sunita Fabrics',
    amount: 88500.00,
    dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    paymentRef: 'UTR772091834211',
    documentUrl: null,
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
  }
]

export function IncomingPayments({ initialConfirmations }: IncomingPaymentsProps) {
  const [items, setItems] = useState<PendingConfirmation[]>(
    initialConfirmations && initialConfirmations.length > 0 ? initialConfirmations : DUMMY_CONFIRMATIONS
  )
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDateLong = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  const handleCopy = (utr: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(utr)
    setCopiedId(id)
    toast.success('UTR copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleMarkAsPaid = (id: string, invoiceNo: string) => {
    toast.success(`Success! Invoice #${invoiceNo} verified and marked as fully PAID (Mock)`)
    // Optimistic fade-out animation by filtering from local state
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleReportMock = (id: string, invoiceNo: string) => {
    toast.error(`UTR verification reported as disputed/invalid for Invoice #${invoiceNo} (Mock)`)
    // Optimistic fade-out animation by filtering from local state
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  if (items.length === 0) return null

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] select-none transition-all">
      {/* Decorative bg glow */}
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-linear-to-br from-indigo-50/10 to-indigo-50/5 blur-3xl pointer-events-none" />

      {/* Title Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50/80 border border-indigo-100/35 flex items-center justify-center text-indigo-600 shrink-0">
            <HugeiconsIcon icon={Invoice03Icon} size={20} />
          </div>
          <div>
            <h2 className="text-[16.5px] font-bold text-gray-950 tracking-tight flex items-center gap-2">
              Incoming Payments
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11.5px] font-semibold text-indigo-700 select-none">
                Pending Settlement
              </span>
            </h2>
            <p className="text-[12.5px] text-gray-500 font-medium">
              Review and settle incoming customer direct transfers.
            </p>
          </div>
        </div>
        <span className="text-[11.5px] font-medium text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1">
          {items.length} Verification Requests
        </span>
      </div>

      {/* Horizontal Notifications matching User Sketch */}
      <div className="mt-4 space-y-3">
        {items.map((inv) => {
          const metadataItems = [
            inv.paymentRef ? {
              key: 'utr',
              content: (
                <button
                  onClick={(e) => handleCopy(inv.paymentRef!, inv.id, e)}
                  className="inline-flex items-center gap-1 rounded-md bg-indigo-50/60 hover:bg-indigo-100/40 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 transition-colors font-mono cursor-pointer align-middle"
                >
                  <HugeiconsIcon icon={Ticket01Icon} size={11} className="text-indigo-400" />
                  <span>UTR: {inv.paymentRef}</span>
                  {copiedId === inv.id && (
                    <span className="text-[9px] text-emerald-600 font-bold ml-0.5">✓</span>
                  )}
                </button>
              )
            } : null,
            {
              key: 'date',
              content: (
                <span className="inline-flex items-center gap-1">
                  <HugeiconsIcon icon={Calendar01Icon} size={12} className="text-gray-400" />
                  <span>Paid: {formatDateLong(inv.updatedAt)}</span>
                </span>
              )
            },
            inv.documentUrl ? {
              key: 'screenshot',
              content: (
                <a
                  href={inv.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#FF6A39] hover:text-[#E05B2E] font-bold underline inline-flex items-center gap-0.5"
                >
                  <span>Screenshot</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )
            } : null
          ].filter((item): item is { key: string; content: React.JSX.Element } => item !== null)

          return (
            <div
              key={inv.id}
              className="relative overflow-hidden rounded-2xl bg-emerald-50/15 hover:bg-emerald-50/30 border border-emerald-500/10 pl-4 pr-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all duration-300"
            >
              {/* Left Column details */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shrink-0 shadow-3xs border border-emerald-100/40">
                  <HugeiconsIcon icon={InvoiceIcon} size={20} />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap text-[14px]">
                    <span className="font-bold text-gray-950">
                      {inv.customerName}
                    </span>
                    <span className="text-gray-500 font-medium flex items-center gap-1 select-none">
                      paid 🎉
                    </span>
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2 py-0.5 text-[13px] font-semibold text-emerald-700 border border-emerald-100/80 font-medium">
                      {formatINR(inv.amount)}
                    </span>
                    <span className="text-gray-500 font-mono font-medium text-xs">
                      · Invoice #{inv.invoiceNumber}
                    </span>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-gray-500 font-medium pt-0.5">
                    {metadataItems.map((item, idx) => (
                      <div key={item.key} className="flex items-center gap-2.5">
                        {idx > 0 && <span className="text-gray-400 select-none text-[10px]">•</span>}
                        {item.content}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            {/* Right Action buttons matching user request */}
            <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
              <button
                onClick={() => handleReportMock(inv.id, inv.invoiceNumber)}
                className="group h-9 px-4 rounded-xl bg-gray-50 hover:bg-rose-50/50 text-gray-500 hover:text-rose-600 border border-gray-100/60 hover:border-rose-100/50 font-bold text-[12px] transition-all cursor-pointer flex items-center gap-1.5 select-none"
              >
                <HugeiconsIcon icon={AlertCircleIcon} size={13} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
                <span>Report</span>
              </button>
              
              <button
                onClick={() => handleMarkAsPaid(inv.id, inv.invoiceNumber)}
                className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12px] shadow-[0_2px_8px_rgba(16,185,129,0.12)] border-0 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={13} className="text-emerald-100" />
                <span>Mark as Paid</span>
              </button>
            </div>
          </div>
        )
      })}
      </div>
    </div>
  )
}
