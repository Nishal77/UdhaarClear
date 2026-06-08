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
      toast.success('Reminder sent via WhatsApp & Email')
      if (invoice) {
        triggerActivityToast({
          type: 'reminder',
          customerName: invoice.customer.name,
          detail: 'WhatsApp & Email reminder sent'
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
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF6A39] to-[#FF845A] hover:from-[#E05B2E] hover:to-[#FF6A39] active:from-[#C7481E] active:to-[#E05B2E] px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none"
                >
                  <div className="flex items-center -space-x-2.5">
                    <WhatsAppIconCustom className="w-6 h-6 shrink-0 relative z-10" />
                    <div className="relative z-0 h-6 w-6 rounded-full bg-white flex items-center justify-center  overflow-hidden">
                      <GmailIconCustom className="w-[14px] h-[11px] shrink-0" />
                    </div>
                  </div>
                  <span className="tracking-wide">
                    {sending ? 'Sending...' : 'Send Reminder'}
                  </span>
                </button>
                <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-3.5 py-2.5 text-[13px] font-semibold text-gray-700 transition-all select-none cursor-pointer">
                  <HugeiconsIcon icon={SentIcon} size={14} className="text-gray-500" />
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        window.open(`/api/invoices/${id}/preview-email?day=${e.target.value}`, '_blank')
                        e.target.value = '' // reset selection
                      }
                    }}
                    className="bg-transparent border-none outline-none font-semibold text-gray-700 cursor-pointer pr-1"
                    defaultValue=""
                  >
                    <option value="" disabled>Preview Email</option>
                    <option value="-3">Day -3 (Gentle: Due in 3d)</option>
                    <option value="0">Day 0 (Gentle: Due today)</option>
                    <option value="3">Day 3 (Gentle: 3d overdue)</option>
                    <option value="7">Day 7 (Gentle: 7d overdue)</option>
                    <option value="10">Day 10 (Firm: 10d overdue)</option>
                    <option value="15">Day 15 (Firm: 15d overdue)</option>
                    <option value="21">Day 21 (Firm: 21d overdue)</option>
                    <option value="28">Day 28 (Legal: 28d overdue)</option>
                    <option value="35">Day 35 (Legal: 35d overdue)</option>
                    <option value="42">Day 42 (Legal: 42d overdue)</option>
                  </select>
                </div>
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
              sub: 'Total count',
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

            {/* ── Recovery Schedule ── */}
            {!isPaid && (
              <RecoverySchedule dueDate={new Date(invoice.dueDate)} daysOverdueCount={days} />
            )}
            
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

// ── Recovery Schedule helper ──────────────────────────────────────────────────
function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function fmtShort(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

function RecoverySchedule({ dueDate, daysOverdueCount }: { dueDate: Date; daysOverdueCount: number }) {
  // Normalize base due date and today's date to midnight in local timezone
  const baseDue = new Date(dueDate)
  baseDue.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Phase windows (days overdue) matching tone-engine.ts boundaries
  const phases = [
    {
      tone: 'GENTLE',
      label: 'Gentle Reminders',
      desc: '4 friendly nudges over 7 days',
      color: 'emerald',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-500',
      bgColor: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-700',
      reminders: [
        { label: 'Reminder 1 (Pre-due)', dayOffset: -3 },
        { label: 'Reminder 2 (Due Day)', dayOffset: 0 },
        { label: 'Reminder 3', dayOffset: 3 },
        { label: 'Reminder 4', dayOffset: 7 },
      ],
      startDay: -3,
      endDay: 7,
    },
    {
      tone: 'FIRM',
      label: 'Firm Reminders',
      desc: '3 firm notices — days 8 to 27',
      color: 'orange',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-500',
      badgeBg: 'bg-orange-50 text-orange-700',
      reminders: [
        { label: 'Reminder 5', dayOffset: 10 },
        { label: 'Reminder 6', dayOffset: 15 },
        { label: 'Reminder 7', dayOffset: 21 },
      ],
      startDay: 8,
      endDay: 27,
    },
    {
      tone: 'LEGAL',
      label: 'Legal Notice',
      desc: '3 formal warnings & council escalation',
      color: 'red',
      textColor: 'text-red-700',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-500',
      badgeBg: 'bg-red-50 text-red-700',
      reminders: [
        { label: 'Reminder 8', dayOffset: 28 },
        { label: 'Reminder 9', dayOffset: 35 },
        { label: 'Reminder 10 (Final)', dayOffset: 42 },
        { label: 'Legal Notice Draft', dayOffset: 43 },
        { label: 'Case Filing Portal', dayOffset: 51 },
      ],
      startDay: 28,
      endDay: 999,
    },
  ]

  return (
    <div className="mt-5 rounded-2xl border border-[#EBEAE6] bg-white p-5 select-none shadow-3xs text-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-3">
        <h3 className="text-xs font-bold text-gray-500 tracking-wider">RECOVERY SCHEDULE</h3>
        <span className="text-xs font-medium text-gray-400">Auto-escalation plan</span>
      </div>

      {/* Timeline items list */}
      <div className="space-y-5">
        {phases.map((phase, pi) => {
          const isPast = daysOverdueCount > phase.endDay
          const isActive = daysOverdueCount >= phase.startDay && daysOverdueCount <= phase.endDay
          const isFuture = daysOverdueCount < phase.startDay

          // Custom dot markup matching design
          let dotElement
          if (isActive) {
            dotElement = (
              <div className={`h-5 w-5 rounded-full border-2 ${phase.borderColor} bg-white flex items-center justify-center shrink-0`}>
                <div className={`h-2.5 w-2.5 rounded-full ${phase.bgColor}`} />
              </div>
            )
          } else {
            dotElement = (
              <div className="h-5 w-5 flex items-center justify-center shrink-0">
                <div className={`h-3.5 w-3.5 rounded-full ${isPast ? 'bg-gray-300' : 'bg-gray-200'}`} />
              </div>
            )
          }

          const labelColor = isPast
            ? 'text-gray-400 font-semibold'
            : isActive
            ? `${phase.textColor} font-bold`
            : 'text-gray-700 font-semibold'

          const badgeText = isPast ? 'DONE' : isActive ? 'ACTIVE' : 'UPCOMING'
          const badgeBg = isPast
            ? 'bg-gray-100 text-gray-400'
            : isActive
            ? phase.badgeBg
            : 'bg-gray-100 text-gray-400'

          return (
            <div key={pi} className="flex gap-3">
              {/* Spine Connector */}
              <div className="flex flex-col items-center">
                {dotElement}
                {pi < phases.length - 1 && (
                  <div className={`w-0.5 flex-1 mt-1.5 ${isPast ? 'bg-gray-200' : 'bg-gray-100'}`} style={{ minHeight: 110 }} />
                )}
              </div>

              {/* Phase details */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[13px] ${labelColor}`}>{phase.label}</span>
                  <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-md tracking-wide ${badgeBg}`}>
                    {badgeText}
                  </span>
                </div>
                <p className="text-[12px] text-gray-400 mt-1 font-medium">{phase.desc}</p>
                
                {/* Reminders schedule rows */}
                <div className="mt-2.5 space-y-2 pl-0.5">
                  {phase.reminders.map((r, ri) => {
                    const expectedDate = addDays(baseDue, r.dayOffset)
                    expectedDate.setHours(0, 0, 0, 0)
                    
                    // Direct date-to-date past check for perfect local timezone accuracy
                    const isThisPast = expectedDate.getTime() <= today.getTime()

                    return (
                      <div key={ri} className="flex items-center justify-between gap-2 text-xs">
                        <span className={isThisPast ? 'text-gray-400 line-through font-medium' : 'text-gray-650 font-medium'}>
                          {r.label}
                        </span>
                        <span className={`tabular-nums font-semibold ${isThisPast ? 'text-gray-300' : 'text-gray-700'}`}>
                          {fmtShort(expectedDate)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
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

const WhatsAppIconCustom = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_4083_2339)">
      <path d="M7.08822 20.6472L7.47602 20.8411C9.09208 21.8107 10.9019 22.2632 12.7118 22.2632C18.4 22.2632 23.054 17.6092 23.054 11.921C23.054 9.20622 21.9551 6.55603 20.016 4.61685C18.0768 2.67767 15.4912 1.57886 12.7118 1.57886C7.02363 1.57886 2.36958 6.23282 2.43426 11.9857C2.43426 13.9248 3.01601 15.7994 3.98555 17.4152L4.24408 17.8031L3.20995 21.6168L7.08822 20.6472Z" fill="#00E676"/>
      <path d="M21.1149 3.58263C18.9171 1.32033 15.8791 0.0921631 12.7765 0.0921631C6.18343 0.0921631 0.883039 5.45714 0.947626 11.9856C0.947626 14.054 1.52937 16.0579 2.49901 17.8677L0.818359 24.0084L7.08829 22.3924C8.83353 23.3621 10.7726 23.8145 12.7119 23.8145C19.2404 23.8145 24.5407 18.4495 24.5407 11.9211C24.5407 8.75375 23.3125 5.78035 21.1149 3.58263ZM12.7765 21.8108C11.0312 21.8108 9.28601 21.3584 7.7993 20.4534L7.4115 20.2595L3.6625 21.229L4.63204 17.5447L4.37351 17.1568C1.52937 12.5675 2.88681 6.49136 7.54077 3.64722C12.1947 0.803175 18.2061 2.16061 21.0503 6.81457C23.8943 11.4685 22.5369 17.4799 17.883 20.3241C16.3962 21.2936 14.5864 21.8107 12.7765 21.8107V21.8108ZM18.4647 14.636L17.7537 14.3128C17.7537 14.3128 16.7195 13.8603 16.0731 13.5371C16.0084 13.5371 15.9438 13.4724 15.8791 13.4724C15.6852 13.4724 15.5559 13.5371 15.4267 13.6018C15.4267 13.6018 15.3621 13.6663 14.4571 14.7006C14.3924 14.8298 14.2632 14.8945 14.1339 14.8945H14.0692C14.0046 14.8945 13.8754 14.8298 13.8107 14.7652L13.4875 14.636C12.7765 14.3128 12.1301 13.9249 11.613 13.4078C11.4837 13.2785 11.2898 13.1493 11.1605 13.02C10.708 12.5675 10.2555 12.0504 9.93243 11.4686L9.86775 11.3394C9.80316 11.2747 9.80316 11.2101 9.73848 11.0808C9.73848 10.9516 9.73848 10.8223 9.80316 10.7576C9.80316 10.7576 10.0617 10.4344 10.2555 10.2405C10.3849 10.1112 10.4495 9.91734 10.5788 9.78807C10.708 9.59412 10.7727 9.33559 10.708 9.14165C10.6434 8.81843 9.86775 7.0732 9.6739 6.6854C9.54454 6.49145 9.41536 6.42687 9.22142 6.36219H8.51041C8.38105 6.36219 8.25187 6.42687 8.12251 6.42687L8.05783 6.49145C7.92857 6.55613 7.7993 6.6854 7.67004 6.74999C7.54077 6.87934 7.47609 7.00852 7.34682 7.13788C6.89434 7.71962 6.63581 8.43063 6.63581 9.14165C6.63581 9.65871 6.76508 10.1759 6.95902 10.6283L7.0237 10.8223C7.60545 12.0504 8.38105 13.1493 9.41536 14.1188L9.6739 14.3774C9.86775 14.5713 10.0617 14.7006 10.191 14.8944C11.5484 16.058 13.0997 16.8983 14.8449 17.3508C15.0389 17.4153 15.2974 17.4153 15.4913 17.48H16.1377C16.4609 17.48 16.8487 17.3508 17.1073 17.2215C17.3012 17.0922 17.4304 17.0922 17.5597 16.963L17.6891 16.8336C17.8183 16.7043 17.9476 16.6397 18.0769 16.5105C18.2061 16.3812 18.3354 16.2519 18.4001 16.1226C18.5293 15.8641 18.5939 15.5408 18.6586 15.2177V14.7652C18.6586 14.7652 18.5939 14.7006 18.4647 14.636Z" fill="white"/>
    </g>
    <defs>
      <clipPath id="clip0_4083_2339">
        <rect width="23.722" height="24" fill="white" transform="translate(0.818359 0.0921631)"/>
      </clipPath>
    </defs>
  </svg>
)

const GmailIconCustom = ({ className = "w-[24px] h-[20px]" }: { className?: string }) => (
  <svg viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_4083_2397)">
      <path d="M2.09569 24.0921H6.99003V12.2058L-0.00195312 6.96179V21.9946C-0.00195312 23.1535 0.936728 24.0922 2.09569 24.0922V24.0921Z" fill="#4285F4"/>
      <path d="M23.7754 24.0923H28.6698C29.8287 24.0923 30.7674 23.1537 30.7674 21.9948V6.96204L23.7754 12.206V24.0923Z" fill="#34A853"/>
      <path d="M23.7754 3.11628V12.2058L30.7674 6.96186V4.1651C30.7674 1.57282 27.8081 0.0922772 25.7331 1.64799L23.7754 3.11628Z" fill="#FBBC04"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.99219 12.206V3.11639L15.3825 9.4092L23.7728 3.11639V12.206L15.3825 18.4987L6.99219 12.206Z" fill="#EA4335"/>
      <path d="M-0.00195312 4.16504V6.9618L6.99003 12.2058V3.11622L5.03227 1.64793C2.95734 0.0922189 -0.00195312 1.57277 -0.00195312 4.16492V4.16504Z" fill="#C5221F"/>
    </g>
    <defs>
      <clipPath id="clip0_4083_2397">
        <rect width="30.7646" height="24" fill="white" transform="translate(-0.00390625 0.0921631)"/>
      </clipPath>
    </defs>
  </svg>
)
