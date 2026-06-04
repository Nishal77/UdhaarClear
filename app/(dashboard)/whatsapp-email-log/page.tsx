import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { Settings02Icon } from '@hugeicons/core-free-icons'
import { WhatsappEmailLogDashboard, WhatsappEmailLogItem } from '@/components/whatsapp-email-log/WhatsappEmailLogDashboard'

// ─── High-end fallback logs shown when no database entries exist ─────
const SAMPLE_ITEMS = (): WhatsappEmailLogItem[] => [
  {
    id: 'sample-rem-1',
    invoiceNumber: 'INV-2026-001',
    amount: 185000,
    customerName: 'Ramesh Traders Pvt. Ltd.',
    customerPhone: '+91 98200 11223',
    customerCity: 'Mumbai',
    customerEmail: 'ramesh.traders@example.com',
    channel: 'WHATSAPP',
    tone: 'FIRM',
    status: 'READ',
    dayOverdue: 15,
    outcome: 'Link opened 2x · Pending payment',
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45m ago
    readAt: new Date(Date.now() - 35 * 60 * 1000),
    templateName: 'payment_reminder_firm',
    messageBody: 'Dear *Ramesh Traders Pvt. Ltd.*,\n\nThis is a firm reminder that your invoice *INV-2026-001* for *₹1,85,000* is now 15 days overdue.\n\nPlease clear the balance immediately to ensure uninterrupted services.\n\nPayment Link: https://udhaarclear.com/pay/inv-001\n\nRegards,\nUdhaarClear Support'
  },
  {
    id: 'sample-rem-2',
    invoiceNumber: 'INV-2026-002',
    amount: 640000,
    customerName: 'Bharat Steel Works',
    customerPhone: '+91 99000 77811',
    customerCity: 'Pune',
    customerEmail: 'bharatsteel@example.com',
    channel: 'WHATSAPP',
    tone: 'LEGAL',
    status: 'REPLIED',
    dayOverdue: 42,
    outcome: 'Replied: "Awaiting bank approval, payment by Friday"',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3h ago
    readAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    templateName: 'payment_reminder_legal',
    messageBody: 'URGENT NOTICE:\n\n*Bharat Steel Works*,\nYour payment of *₹6,40,000* for invoice *INV-2026-002* is 42 days overdue. This is our final notice before escalating this claim to MSME Samadhaan for interest recovery.\n\nClear your dues now: https://udhaarclear.com/pay/inv-002'
  },
  {
    id: 'sample-rem-3',
    invoiceNumber: 'INV-2026-003',
    amount: 88500,
    customerName: 'Sunita Fabrics',
    customerPhone: '+91 87321 54210',
    customerCity: 'Surat',
    customerEmail: 'sunita.fabrics@example.com',
    channel: 'WHATSAPP',
    tone: 'GENTLE',
    status: 'REPLIED',
    dayOverdue: 8,
    outcome: 'Replied: "Processed via UPI PhonePe"',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12h ago
    readAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
    templateName: 'payment_reminder_gentle',
    messageBody: 'Hello *Sunita Fabrics*,\n\nThis is a friendly reminder that invoice *INV-2026-003* for *₹88,500* is 8 days overdue. We would appreciate it if you could process the payment online using this link: https://udhaarclear.com/pay/inv-003.\n\nThank you!'
  },
  {
    id: 'sample-rem-4',
    invoiceNumber: 'INV-2026-004',
    amount: 215000,
    customerName: 'Kaveri Auto Parts',
    customerPhone: '+91 93456 22890',
    customerCity: 'Bengaluru',
    customerEmail: 'kaveri.auto@example.com',
    channel: 'EMAIL',
    tone: 'FIRM',
    status: 'DELIVERED',
    dayOverdue: 0,
    outcome: 'Delivered · Unopened',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    templateName: 'email_invoice_reminder_firm',
    messageBody: 'Dear Kaveri Auto Parts,\n\nWe hope this email finds you well. We are writing to remind you that Invoice INV-2026-004 of ₹2,15,000 is outstanding. Please click the button below to review and pay this invoice.\n\nIf you have already processed the payment, please ignore this email.'
  },
  {
    id: 'sample-rem-5',
    invoiceNumber: 'INV-2026-005',
    amount: 47000,
    customerName: 'Priya Exports & Co.',
    customerPhone: '+91 82200 65432',
    customerCity: 'Delhi',
    customerEmail: 'priya.exports@example.com',
    channel: 'EMAIL',
    tone: 'GENTLE',
    status: 'READ',
    dayOverdue: 5,
    outcome: 'Email read 3x · Payment link clicked',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    readAt: new Date(Date.now() - 1.9 * 24 * 60 * 60 * 1000),
    templateName: 'email_invoice_reminder_gentle',
    messageBody: 'Dear Priya Exports & Co.,\n\nThis is a courteous reminder that Invoice INV-2026-005 for ₹47,000 is currently due. Please find details of the invoice attached or click the link below to pay online. We appreciate your prompt payment!'
  },
  {
    id: 'sample-rem-6',
    invoiceNumber: 'INV-2026-006',
    amount: 1850000,
    customerName: 'MegaVision Electronics',
    customerPhone: '+91 97700 33145',
    customerCity: 'Hyderabad',
    customerEmail: 'megavision@example.com',
    channel: 'WHATSAPP',
    tone: 'FIRM',
    status: 'READ',
    dayOverdue: 35,
    outcome: 'Link opened 5x · Attempted payment',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    readAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    templateName: 'payment_reminder_firm',
    messageBody: 'Dear *MegaVision Electronics*,\n\nYour invoice *INV-2026-006* of *₹18,50,000* is 35 days overdue. Please clear it immediately at: https://udhaarclear.com/pay/inv-006'
  },
  {
    id: 'sample-rem-7',
    invoiceNumber: 'INV-2026-007',
    amount: 120000,
    customerName: 'Tara Decoratives',
    customerPhone: '+91 88800 12345',
    customerCity: 'Jaipur',
    customerEmail: 'tara.decor@example.com',
    channel: 'WHATSAPP',
    tone: 'LEGAL',
    status: 'FAILED',
    dayOverdue: 45,
    outcome: 'Failed · Recipient lacks active WhatsApp',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    templateName: 'payment_reminder_legal',
    messageBody: 'Dear *Tara Decoratives*,\n\nThis is a legal reminder that your invoice *INV-2026-007* of *₹1,20,000* is 45 days overdue. Please clear the payment online: https://udhaarclear.com/pay/inv-007'
  },
  {
    id: 'sample-rem-8',
    invoiceNumber: 'INV-2026-008',
    amount: 335000,
    customerName: 'Rajlaxmi Pharmaceuticals',
    customerPhone: '+91 96600 98760',
    customerCity: 'Ahmedabad',
    customerEmail: 'rajlaxmi.pharma@example.com',
    channel: 'WHATSAPP',
    tone: 'GENTLE',
    status: 'SENT',
    dayOverdue: 4,
    outcome: 'Sent · Awaiting delivery receipt',
    createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10m ago
    templateName: 'payment_reminder_gentle',
    messageBody: 'Dear *Rajlaxmi Pharmaceuticals*,\n\nA quick friendly follow-up: invoice *INV-2026-008* of *₹3,35,000* is 4 days overdue. You can pay here: https://udhaarclear.com/pay/inv-008'
  }
]

export default async function WhatsappEmailLogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const reminders = await prisma.reminder.findMany({
    where: { businessId: dbUser.ownedBusiness.id },
    include: { invoice: { include: { customer: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const isSampleData = reminders.length === 0

  // Map real database records into flat client formats
  const databaseItems: WhatsappEmailLogItem[] = reminders.map((r) => ({
    id: r.id,
    invoiceNumber: r.invoice.invoiceNumber,
    amount: Number(r.invoice.amount),
    customerName: r.invoice.customer.name,
    customerPhone: r.invoice.customer.phone,
    customerCity: r.invoice.customer.city,
    customerEmail: r.invoice.customer.email,
    channel: r.channel,
    tone: r.tone,
    status: r.status,
    dayOverdue: r.dayOverdue,
    outcome: r.status === 'REPLIED'
      ? 'Customer replied to reminder'
      : r.status === 'FAILED'
        ? (r.failReason || 'Failed to deliver')
        : r.status === 'READ'
          ? 'Reminder read by customer'
          : r.status === 'DELIVERED'
            ? 'Delivered · Unopened'
            : 'Sent · Pending delivery receipt',
    createdAt: r.createdAt,
    readAt: r.readAt,
    messageBody: r.messageBody,
    templateName: r.templateName,
  }))

  const displayLogs = isSampleData ? SAMPLE_ITEMS() : databaseItems

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col select-none">
        <nav className="flex items-center gap-1.5 text-[12px] text-gray-400">
          <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">Logs</span>
        </nav>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight">Whatsapp & Email Logs</h1>
          <Link
            href="/settings/reminder-customisation"
            className="flex items-center gap-2 rounded-xl bg-[#FF6A39] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#E05B2E] transition-all"
          >
            <HugeiconsIcon icon={Settings02Icon} size={15} />
            Configure Tones
          </Link>
        </div>
        <p className="mt-1 text-[13px] text-gray-400">
          Track, manage, and inspect all sent communications and delivery logs
        </p>
      </div>

      {/* ── Main Dashboard Interactive Panel ── */}
      <WhatsappEmailLogDashboard
        initialLogs={displayLogs}
        isSample={isSampleData}
      />

    </div>
  )
}
