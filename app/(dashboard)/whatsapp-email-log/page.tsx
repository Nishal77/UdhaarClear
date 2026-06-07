import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { Settings02Icon } from '@hugeicons/core-free-icons'
import { WhatsappEmailLogDashboard, WhatsappEmailLogItem } from '@/components/whatsapp-email-log/WhatsappEmailLogDashboard'

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

  // Map real database records into flat client formats
  const databaseItems: WhatsappEmailLogItem[] = reminders.map((r) => ({
    id: r.id,
    invoiceNumber: r.invoice.invoiceNumber,
    amount: Number(r.invoice.amount),
    customerName: r.invoice.customer.name,
    customerPhone: r.invoice.customer.phone,
    customerCity: r.invoice.customer.city,
    customerEmail: r.invoice.customer.email,
    channel: r.channel as any,
    tone: r.tone,
    status: r.status,
    dayOverdue: r.dayOverdue,
    outcome: r.outcome || (
      r.status === 'REPLIED'
        ? 'Customer replied to reminder'
        : r.status === 'FAILED'
          ? (r.failReason || 'Failed to deliver')
          : r.status === 'READ'
            ? 'Reminder read by customer'
            : r.status === 'DELIVERED'
              ? 'Delivered · Unopened'
              : 'Sent · Pending delivery receipt'
    ),
    createdAt: r.createdAt,
    readAt: r.readAt,
    messageBody: r.messageBody,
    templateName: r.templateName,
  }))

  return (
    <div className="space-y-6 relative overflow-hidden">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col select-none relative z-10">
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
        initialLogs={databaseItems}
        isSample={false}
      />

    </div>
  )
}
