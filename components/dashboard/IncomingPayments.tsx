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
  Invoice03Icon,
  BankIcon,
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

export function IncomingPayments({ initialConfirmations }: IncomingPaymentsProps) {
  const [items, setItems] = useState<PendingConfirmation[]>(initialConfirmations ?? [])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const formatINR = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

  const formatDateLong = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    } catch { return dateStr }
  }

  const handleCopy = (utr: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(utr)
    setCopiedId(id)
    toast.success('UTR copied!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleApprove = async (id: string, invoiceNo: string) => {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/invoices/${id}/approve-payment`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message ?? 'Failed')
      toast.success(`✅ Payment confirmed! Receipt sent to buyer. Invoice #${invoiceNo} marked PAID.`)
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err: any) {
      toast.error(err.message ?? 'Could not approve payment')
    } finally {
      setLoadingId(null)
    }
  }

  const handleReject = async (id: string, invoiceNo: string) => {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/invoices/${id}/reject-payment`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message ?? 'Failed')
      toast.error(`❌ Payment rejected. Buyer notified. Reminders will resume for #${invoiceNo}.`)
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err: any) {
      toast.error(err.message ?? 'Could not reject payment')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] select-none transition-all border border-[#EBEAE6]/60">
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
              {items.length > 0 && (
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11.5px] font-semibold text-indigo-700 select-none">
                  Pending Settlement
                </span>
              )}
            </h2>
            <p className="text-[12.5px] text-gray-500 font-medium">
              Review and settle incoming customer direct transfers.
            </p>
          </div>
        </div>
        <span className="text-[11.5px] font-medium text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1">
          {items.length} Verification {items.length === 1 ? 'Request' : 'Requests'}
        </span>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300">
            <HugeiconsIcon icon={BankIcon} size={26} />
          </div>
          <div className="text-center">
            <p className="text-[14px] font-semibold text-gray-700">No incoming payments</p>
            <p className="text-[12.5px] text-gray-400 font-medium mt-0.5">
              When a buyer replies with a UTR number, it will appear here for your approval.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((inv) => {
            const isLoading = loadingId === inv.id
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
                    <span>Submitted: {formatDateLong(inv.updatedAt)}</span>
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
                      <path d="M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )
              } : null,
            ].filter((item): item is { key: string; content: React.JSX.Element } => item !== null)

            return (
              <div
                key={inv.id}
                className="relative overflow-hidden rounded-2xl bg-emerald-50/15 hover:bg-emerald-50/30 border border-emerald-500/10 pl-4 pr-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all duration-300"
              >
                {/* Left Column */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shrink-0 shadow-3xs border border-emerald-100/40">
                    <HugeiconsIcon icon={InvoiceIcon} size={20} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap text-[14px]">
                      <span className="font-bold text-gray-950">{inv.customerName}</span>
                      <span className="text-gray-500 font-medium flex items-center gap-1 select-none">claims payment 🔔</span>
                      <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2 py-0.5 text-[13px] font-semibold text-emerald-700 border border-emerald-100/80">
                        {formatINR(inv.amount)}
                      </span>
                      <span className="text-gray-500 font-mono font-medium text-xs">· Invoice #{inv.invoiceNumber}</span>
                    </div>

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

                {/* Action buttons */}
                <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
                  <button
                    onClick={() => handleReject(inv.id, inv.invoiceNumber)}
                    disabled={isLoading}
                    className="group h-9 px-4 rounded-xl bg-gray-50 hover:bg-rose-50/50 text-gray-500 hover:text-rose-600 border border-gray-100/60 hover:border-rose-100/50 font-bold text-[12px] transition-all cursor-pointer flex items-center gap-1.5 select-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HugeiconsIcon icon={AlertCircleIcon} size={13} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleApprove(inv.id, inv.invoiceNumber)}
                    disabled={isLoading}
                    className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12px] shadow-[0_2px_8px_rgba(16,185,129,0.12)] border-0 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={13} className="text-emerald-100" />
                    <span>{isLoading ? 'Processing…' : 'Approve'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
