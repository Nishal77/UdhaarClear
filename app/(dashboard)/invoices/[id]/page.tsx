'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { InvoiceStatusBadge } from '@/components/invoices/InvoiceStatusBadge'
import { ReminderTimeline } from '@/components/invoices/ReminderTimeline'
import { LegalNoticeButton } from '@/components/legal/LegalNoticeButton'
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay'
import { PageLoader } from '@/components/shared/LoadingSpinner'
import { formatDate, daysOverdue } from '@/lib/utils/date'
import { toast } from 'sonner'
import Link from 'next/link'
import { IconSend, IconEdit, IconCheck } from '@tabler/icons-react'
import type { InvoiceWithAll } from '@/types/database'

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
      .then((d) => setInvoice(d.invoice))
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
    } finally {
      setMarkingPaid(false)
    }
  }

  if (loading) return <PageLoader />
  if (!invoice) return <p className="text-gray-500">Invoice not found</p>

  const days = daysOverdue(invoice.dueDate)
  const isPaid = ['PAID', 'WRITTEN_OFF'].includes(invoice.status)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice {invoice.invoiceNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">{invoice.customer.name}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <InvoiceStatusBadge status={invoice.status} />
          {!isPaid && (
            <>
              <button
                onClick={sendReminder}
                disabled={sending}
                className="flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              >
                <IconSend size={14} />
                {sending ? 'Sending...' : 'Send Reminder'}
              </button>
              <button
                onClick={markPaid}
                disabled={markingPaid}
                className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                <IconCheck size={14} />
                {markingPaid ? '...' : 'Mark Paid'}
              </button>
            </>
          )}
          <Link
            href={`/invoices/${id}/edit`}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <IconEdit size={14} /> Edit
          </Link>
        </div>
      </div>

      {/* Key details */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Amount</p>
          <CurrencyDisplay amount={Number(invoice.amount)} size="lg" className="text-gray-900 mt-1 block" />
        </div>
        <div className="rounded-xl bg-white border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Due Date</p>
          <p className="mt-1 text-lg font-bold text-gray-900">{formatDate(invoice.dueDate)}</p>
        </div>
        <div className="rounded-xl bg-white border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Days Overdue</p>
          <p className={`mt-1 text-lg font-bold ${days > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {days > 0 ? `${days} days` : days === 0 ? 'Today' : `${Math.abs(days)}d left`}
          </p>
        </div>
        <div className="rounded-xl bg-white border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Reminders Sent</p>
          <p className="mt-1 text-lg font-bold text-gray-900">{invoice.reminders.length}</p>
        </div>
      </div>

      {/* Invoice info */}
      <div className="rounded-xl bg-white border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Invoice Details</h2>
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-gray-500">Invoice Date</dt>
          <dd className="text-gray-900">{formatDate(invoice.invoiceDate)}</dd>
          <dt className="text-gray-500">Credit Days</dt>
          <dd className="text-gray-900">{invoice.creditDays} days</dd>
          <dt className="text-gray-500">Reminder Tone</dt>
          <dd className="text-gray-900">{invoice.reminderTone}</dd>
          <dt className="text-gray-500">Auto Reminder</dt>
          <dd className="text-gray-900">{invoice.autoReminder ? 'On' : 'Off'}</dd>
          {invoice.description && (
            <>
              <dt className="text-gray-500">Description</dt>
              <dd className="text-gray-700">{invoice.description}</dd>
            </>
          )}
          {invoice.razorpayLinkUrl && (
            <>
              <dt className="text-gray-500">Payment Link</dt>
              <dd>
                <a href={invoice.razorpayLinkUrl} target="_blank" rel="noreferrer" className="text-brand-600 text-xs underline">
                  {invoice.razorpayLinkUrl}
                </a>
              </dd>
            </>
          )}
          {invoice.paidAt && (
            <>
              <dt className="text-gray-500">Paid On</dt>
              <dd className="text-green-700 font-medium">{formatDate(invoice.paidAt)}</dd>
            </>
          )}
        </dl>
      </div>

      {/* Legal notice */}
      {!isPaid && (
        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Legal Notice</h2>
          <LegalNoticeButton invoiceId={id} invoiceDaysOverdue={days} />
        </div>
      )}

      {/* Reminder timeline */}
      <div className="rounded-xl bg-white border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Reminder History ({invoice.reminders.length})
        </h2>
        <ReminderTimeline reminders={invoice.reminders} />
      </div>
    </div>
  )
}
