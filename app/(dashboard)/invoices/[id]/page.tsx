'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { InvoiceStatusBadge } from '@/components/invoices/InvoiceStatusBadge'
import { ReminderTimeline } from '@/components/invoices/ReminderTimeline'
import { LegalNoticeButton } from '@/components/legal/LegalNoticeButton'
import { PageLoader } from '@/components/shared/LoadingSpinner'
import { formatDate, daysOverdue } from '@/lib/utils/date'
import { formatINRCompact } from '@/lib/utils/currency'
import { toast } from 'sonner'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  WhatsappIcon,
  Add01Icon,
  PencilEdit01Icon,
  CheckmarkCircle01Icon,
  Calendar01Icon,
  Clock01Icon,
  SentIcon,
} from '@hugeicons/core-free-icons'
import type { InvoiceWithAll } from '@/types/database'
import { triggerActivityToast } from '@/components/shared/ActivityToast'

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [invoice, setInvoice] = useState<InvoiceWithAll | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [markingPaid, setMarkingPaid] = useState(false)

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setInvoice(d.invoice)
        if (d.invoice) {
          triggerActivityToast({
            type: 'opened',
            customerName: d.invoice.customer.name,
            detail: `Invoice #${d.invoice.invoiceNumber} opened`
          })
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  async function sendReminder() {
    setSending(true)
    try {
      const res = await fetch(`/api/invoices/${id}/remind`, { method: 'POST' })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.message)
        return
      }
      toast.success('Reminder sent via WhatsApp')
      if (invoice) {
        triggerActivityToast({
          type: 'reminder',
          customerName: invoice.customer.name,
          detail: 'WhatsApp reminder sent'
        })
      }
      router.refresh()
    } finally {
      setSending(false)
    }
  }

  async function markPaid() {
    setMarkingPaid(true)
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID' }),
      })
      if (!res.ok) { toast.error('Failed to mark as paid'); return }
      toast.success('Invoice marked as paid')
      const d = await res.json()
      setInvoice((prev) => prev ? { ...prev, ...d.invoice } : null)
      if (invoice) {
        triggerActivityToast({
          type: 'payment',
          customerName: invoice.customer.name,
          amount: formatINRCompact(Number(invoice.amount)),
          detail: 'Marked as paid'
        })
      }
    } finally {
      setMarkingPaid(false)
    }
  }

  if (loading) return <PageLoader />
  if (!invoice) return <p className="text-gray-500 p-8">Invoice not found</p>

  const days = daysOverdue(invoice.dueDate)
  const isPaid = ['PAID', 'WRITTEN_OFF'].includes(invoice.status)

  return (
    <div className="space-y-4 w-full">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-[12px] text-gray-400 select-none">
        <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
        <span>›</span>
        <Link href="/invoices" className="hover:text-gray-600 transition-colors">Invoices</Link>
        <span>›</span>
        <span className="font-medium text-gray-700">{invoice.invoiceNumber}</span>
      </nav>

      {/* ── Hero Header Card ── */}
      <div className="rounded-[22px] bg-white border border-[#EBEAE6]/60 overflow-hidden">
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
          {/* Left Info */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[22px] font-bold text-gray-900 leading-tight">Invoice {invoice.invoiceNumber}</h1>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <p className="text-[13.5px] text-gray-500 mt-1.5 font-medium">{invoice.customer.name}</p>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {!isPaid && (
              <>
                <button
                  onClick={sendReminder}
                  disabled={sending}
                  className="flex items-center gap-1.5 rounded-xl bg-[#FF6A39] hover:bg-[#E05B2E] px-4 py-2.5 text-[13px] font-semibold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <HugeiconsIcon icon={WhatsappIcon} size={14} className="text-white" />
                  {sending ? 'Sending...' : 'Send Reminder'}
                </button>
                <button
                  onClick={markPaid}
                  disabled={markingPaid}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-[13px] font-semibold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} />
                  {markingPaid ? 'Saving...' : 'Mark Paid'}
                </button>
              </>
            )}
            <Link
              href={`/invoices/${id}/edit`}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2.5 text-[13px] font-semibold text-gray-700 transition-all select-none cursor-pointer"
            >
              <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
              Edit
            </Link>
          </div>
        </div>

        {/* ── Stats Strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#EBEAE6]/60 border-t border-[#EBEAE6]/60 bg-white">
          {[
            {
              label: 'Amount',
              value: formatINRCompact(Number(invoice.amount)),
              color: 'text-gray-900',
              sub: 'Total value',
            },
            {
              label: 'Due Date',
              value: formatDate(invoice.dueDate),
              color: 'text-gray-900',
              sub: 'Payment timeline',
            },
            {
              label: 'Days Overdue',
              value: days > 0 ? `${days} days` : days === 0 ? 'Today' : `${Math.abs(days)}d left`,
              color: days > 0 ? 'text-red-600' : 'text-emerald-600',
              sub: days > 0 ? 'Past due date' : 'On track',
            },
            {
              label: 'Reminders Sent',
              value: invoice.reminders.length.toString(),
              color: 'text-gray-900',
              sub: 'WhatsApp count',
            },
          ].map((s) => (
            <div key={s.label} className="px-5 py-3.5 flex flex-col justify-center">
              <p className="text-[14px] font-medium text-black tracking-tight">{s.label}</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className={`text-[26px] font-semibold leading-none tracking-tight ${s.color}`}>
                  {s.value}
                </span>
                <span className="text-[11px] text-gray-600 font-medium whitespace-nowrap">
                  {s.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Details Grid ── */}
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-5">
        {/* Left column: Invoice Details */}
        <div className="lg:col-span-2 rounded-[22px] bg-white border border-[#EBEAE6]/60 overflow-hidden shadow-3xs">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="text-[14px] font-semibold text-gray-900">Invoice Details</h2>
          </div>
          <div className="px-5 py-4 space-y-3">
            <InfoRow icon={Calendar01Icon} label="Invoice Date" value={formatDate(invoice.invoiceDate)} />
            <InfoRow icon={Clock01Icon} label="Credit Days" value={`${invoice.creditDays} days`} />
            <InfoRow icon={SentIcon} label="Reminder Tone" value={invoice.reminderTone} />
            <InfoRow icon={CheckmarkCircle01Icon} label="Auto Reminder" value={invoice.autoReminder ? 'Active' : 'Disabled'} />
            
            {invoice.razorpayLinkUrl && (
              <div className="mt-3.5 rounded-xl bg-gray-50 p-4 border border-[#EBEAE6]/50">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Payment Link</p>
                <a
                  href={invoice.razorpayLinkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#FF6A39] hover:text-[#E05B2E] underline font-medium break-all"
                >
                  {invoice.razorpayLinkUrl}
                </a>
              </div>
            )}
            
            {invoice.description && (
              <div className="mt-3.5 rounded-xl bg-gray-50 p-4 border border-[#EBEAE6]/50">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Description</p>
                <p className="text-[13px] text-gray-600 leading-relaxed">{invoice.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Timelines & Notices */}
        <div className="lg:col-span-3 space-y-3.5">
          {/* Legal notice section */}
          {!isPaid && (
            <div className="rounded-[22px] bg-white border border-[#EBEAE6]/60 p-5 shadow-3xs">
              <h2 className="text-[14px] font-semibold text-gray-900 mb-2">Legal Notice</h2>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                Escalate collection action with official legal warnings automatically drafted and sent via certified channels.
              </p>
              <LegalNoticeButton invoiceId={id} invoiceDaysOverdue={days} customerName={invoice.customer.name} />
            </div>
          )}

          {/* Reminder history section */}
          <div className="rounded-[22px] bg-white border border-[#EBEAE6]/60 p-5 shadow-3xs">
            <h2 className="text-[14px] font-semibold text-gray-900 mb-3">
              Reminder History ({invoice.reminders.length})
            </h2>
            <ReminderTimeline reminders={invoice.reminders} />
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>['icon']
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
        <HugeiconsIcon icon={icon} size={13} className="text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
        <div className="mt-0.5 text-[13px] text-gray-700 font-medium">{value}</div>
      </div>
    </div>
  )
}
