'use client'

/**
 * CustomerDetail
 * Renders the full premium detail view for a single customer.
 * Used by: app/(dashboard)/customers/[id]/page.tsx
 */

import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  SmartPhone01Icon,
  MailAtSign01Icon,
  Location01Icon,
  Building01Icon,
  Calendar01Icon,
  PencilEdit01Icon,
  Add01Icon,
  ArrowLeft02Icon,
  WhatsappIcon,
  SentIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
} from '@hugeicons/core-free-icons'
import { formatINRCompact } from '@/lib/utils/currency'
import { formatDate, formatDateLong } from '@/lib/utils/date'
import { InvoiceStatusBadge } from '@/components/invoices/InvoiceStatusBadge'
import { InvoiceStatus } from '@prisma/client'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CustomerInvoice {
  id: string
  invoiceNumber: string
  amount: number
  paidAmount: number | null
  status: InvoiceStatus
  dueDate: Date
  invoiceDate: Date
  customer: { name: string; phone: string }
}

interface CustomerReminder {
  id: string
  createdAt: Date
  channel: string
  status: string
}

interface CustomerDetailProps {
  customer: {
    id: string
    name: string
    phone: string
    email: string | null
    contactName: string | null
    gstin: string | null
    city: string | null
    notes: string | null
    defaultTone: string
    isBlocked: boolean
    createdAt: Date
    invoices: CustomerInvoice[]
    reminders?: CustomerReminder[]
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_PALETTE = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600',
]

function avatarGradient(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_PALETTE.length
  return AVATAR_PALETTE[idx]
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

const TONE_BADGE: Record<string, { label: string; cls: string }> = {
  GENTLE:    { label: 'Gentle',    cls: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10' },
  ASSERTIVE: { label: 'Assertive', cls: 'bg-amber-50 text-amber-700 ring-amber-600/10' },
  FIRM:      { label: 'Firm',      cls: 'bg-orange-50 text-orange-700 ring-orange-600/10' },
  LEGAL:     { label: 'Legal',     cls: 'bg-red-50 text-red-700 ring-red-600/10' },
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const { invoices } = customer

  const outstanding = invoices
    .filter((i) => ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'].includes(i.status))
    .reduce((s, i) => s + Number(i.amount), 0)

  const overdue = invoices
    .filter((i) => i.status === 'OVERDUE')
    .reduce((s, i) => s + Number(i.amount), 0)

  const collected = invoices
    .filter((i) => i.status === 'PAID')
    .reduce((s, i) => s + Number(i.paidAmount ?? i.amount), 0)

  const overdueCount = invoices.filter((i) => i.status === 'OVERDUE').length
  const tone = TONE_BADGE[customer.defaultTone] ?? TONE_BADGE.GENTLE

  return (
    <div className="space-y-5">

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-[12px] text-gray-400">
        <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
        <span>›</span>
        <Link href="/customers" className="hover:text-gray-600 transition-colors">Customers</Link>
        <span>›</span>
        <span className="font-medium text-gray-700">{customer.name}</span>
      </nav>

      {/* ── Hero Header Card ── */}
      <div className="rounded-[22px] bg-white border border-[#EBEAE6]/60 overflow-hidden">

        <div className="px-8 py-6 flex items-start justify-between gap-4">
          {/* Left: avatar + info */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className={`relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarGradient(customer.name)} text-[20px] font-semibold text-white shadow-lg`}>
              {initials(customer.name)}
              {/* Online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white">
                <span className={`h-2.5 w-2.5 rounded-full ${customer.isBlocked ? 'bg-red-500' : 'bg-emerald-500'}`} />
              </span>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[22px] font-bold text-gray-900 leading-tight">{customer.name}</h1>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${tone.cls}`}>
                  {tone.label}
                </span>
                {customer.isBlocked && (
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-700 ring-1 ring-inset ring-red-600/10">
                    Blocked
                  </span>
                )}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                  <HugeiconsIcon icon={SmartPhone01Icon} size={13} className="text-gray-400" />
                  {customer.phone}
                </span>
                {customer.email && (
                  <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                    <HugeiconsIcon icon={MailAtSign01Icon} size={13} className="text-gray-400" />
                    {customer.email}
                  </span>
                )}
                {customer.city && (
                  <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                    <HugeiconsIcon icon={Location01Icon} size={13} className="text-gray-400" />
                    {customer.city}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-[13px] text-gray-400">
                  <HugeiconsIcon icon={Calendar01Icon} size={13} className="text-gray-400" />
                  Customer since {formatDateLong(customer.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/customers/${customer.id}/edit`}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
              Edit
            </Link>
            <Link
              href={`/whatsapp-email-log?customerId=${customer.id}`}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              <HugeiconsIcon icon={WhatsappIcon} size={14} className="text-emerald-500" />
              Send Reminder
            </Link>
            <Link
              href={`/invoices/new?customerId=${customer.id}`}
              className="flex items-center gap-1.5 rounded-xl bg-[#FF6A39] px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[#E05B2E] transition-all shadow-sm"
            >
              <HugeiconsIcon icon={Add01Icon} size={14} />
              Add Invoice
            </Link>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-4 divide-x divide-[#EBEAE6]/60 border-t border-[#EBEAE6]/60">
          {[
            { label: 'Total Outstanding', value: formatINRCompact(outstanding), color: 'text-gray-900', sub: 'Pending + Overdue' },
            { label: 'Overdue Amount',    value: formatINRCompact(overdue),      color: overdueCount > 0 ? 'text-red-600' : 'text-gray-900', sub: `${overdueCount} invoice${overdueCount !== 1 ? 's' : ''}` },
            { label: 'Total Collected',   value: formatINRCompact(collected),    color: 'text-emerald-600', sub: `${invoices.filter(i => i.status === 'PAID').length} paid` },
            { label: 'Total Invoices',    value: invoices.length.toString(),     color: 'text-gray-900', sub: 'All time' },
          ].map((s) => (
            <div key={s.label} className="px-6 py-5 flex flex-col justify-center">
              <p className="text-[14px] font-medium text-black tracking-tight">{s.label}</p>
              <div className="mt-2.5 flex items-baseline gap-1.5">
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

      {/* ── Two Column: Details + Reminder Activity ── */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">

        {/* Contact Details */}
        <div className="lg:col-span-2 rounded-[22px] bg-white border border-[#EBEAE6]/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-[14px] font-semibold text-gray-900">Contact Details</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <InfoRow icon={SmartPhone01Icon} label="Phone" value={customer.phone} />
            {customer.email && <InfoRow icon={MailAtSign01Icon} label="Email" value={customer.email} />}
            {customer.contactName && <InfoRow icon={Building01Icon} label="Contact Person" value={customer.contactName} />}
            {customer.city && <InfoRow icon={Location01Icon} label="City" value={customer.city} />}
            {customer.gstin && (
              <InfoRow
                icon={Building01Icon}
                label="GSTIN"
                value={<span className="font-mono text-[13px]">{customer.gstin}</span>}
              />
            )}
            <InfoRow icon={Calendar01Icon} label="Added on" value={formatDateLong(customer.createdAt)} />
            <InfoRow
              icon={SentIcon}
              label="Default Tone"
              value={
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${tone.cls}`}>
                  {tone.label}
                </span>
              }
            />
            {customer.notes && (
              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Notes</p>
                <p className="text-[13px] text-gray-600 leading-relaxed">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recovery Timeline */}
        <div className="lg:col-span-3 rounded-[22px] bg-white border border-[#EBEAE6]/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-gray-900">Invoice Summary</h2>
            <Link
              href={`/invoices?customerId=${customer.id}`}
              className="text-[12px] font-semibold text-[#FF6A39] hover:text-[#E05B2E] transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {invoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-lg">📄</span>
                </div>
                <p className="text-[13px] font-medium text-gray-500">No invoices yet</p>
                <Link
                  href={`/invoices/new?customerId=${customer.id}`}
                  className="mt-3 text-[12px] font-semibold text-[#FF6A39] hover:underline"
                >
                  Add first invoice →
                </Link>
              </div>
            ) : (
              invoices.slice(0, 6).map((inv) => {
                const daysOverdue = inv.status === 'OVERDUE'
                  ? Math.max(0, Math.floor((Date.now() - inv.dueDate.getTime()) / 86400000))
                  : 0
                return (
                  <Link
                    key={inv.id}
                    href={`/invoices/${inv.id}`}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/60 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        inv.status === 'PAID' ? 'bg-emerald-50' :
                        inv.status === 'OVERDUE' ? 'bg-red-50' : 'bg-amber-50'
                      }`}>
                        <HugeiconsIcon
                          icon={inv.status === 'PAID' ? CheckmarkCircle01Icon : Clock01Icon}
                          size={15}
                          className={
                            inv.status === 'PAID' ? 'text-emerald-600' :
                            inv.status === 'OVERDUE' ? 'text-red-600' : 'text-amber-600'
                          }
                        />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-900">{inv.invoiceNumber}</p>
                        <p className="text-[11px] text-gray-400">
                          Due {formatDate(inv.dueDate)}
                          {daysOverdue > 0 && (
                            <span className="text-red-500 font-medium"> · {daysOverdue}d overdue</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <InvoiceStatusBadge status={inv.status} />
                      <span className={`text-[14px] font-bold ${
                        inv.status === 'OVERDUE' ? 'text-red-600' :
                        inv.status === 'PAID' ? 'text-emerald-600' : 'text-gray-900'
                      }`}>
                        {formatINRCompact(Number(inv.amount))}
                      </span>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

// ─── Helper sub-component ──────────────────────────────────────────────────────

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
