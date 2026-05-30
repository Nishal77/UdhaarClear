import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { IconMessage } from '@tabler/icons-react'
import { formatDateLong } from '@/lib/utils/date'
import { formatINR } from '@/lib/utils/currency'
import Link from 'next/link'

const STATUS_BADGE: Record<string, string> = {
  SENT: 'bg-blue-50 text-blue-700',
  DELIVERED: 'bg-blue-100 text-blue-800',
  READ: 'bg-green-50 text-green-700',
  FAILED: 'bg-red-50 text-red-700',
  QUEUED: 'bg-gray-100 text-gray-600',
  REPLIED: 'bg-purple-50 text-purple-700',
}

const TONE_BADGE: Record<string, string> = {
  GENTLE: 'bg-teal-50 text-teal-700',
  FIRM: 'bg-orange-50 text-orange-700',
  LEGAL: 'bg-red-50 text-red-700',
}

export default async function RemindersPage() {
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reminders"
        description={`${reminders.length} reminders sent`}
      />

      {reminders.length === 0 ? (
        <EmptyState
          icon={<IconMessage size={40} />}
          title="No reminders sent yet"
          description="Reminders are sent automatically or when you trigger them manually from an invoice"
        />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {reminders.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">
                    {r.invoice.customer.name}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    <Link href={`/invoices/${r.invoiceId}`} className="hover:text-brand-600 font-mono">
                      {r.invoice.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">{formatINR(Number(r.invoice.amount))}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${TONE_BADGE[r.tone]}`}>
                      {r.tone}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-500">{formatDateLong(r.createdAt)}</td>
                  <td className="px-6 py-3 text-xs text-gray-400">{r.triggeredBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
