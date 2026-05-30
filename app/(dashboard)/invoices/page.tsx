import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { InvoiceTable } from '@/components/invoices/InvoiceTable'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { IconFileInvoice } from '@tabler/icons-react'
import Link from 'next/link'

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const { status } = await searchParams

  const invoices = await prisma.invoice.findMany({
    where: {
      businessId: dbUser.ownedBusiness.id,
      ...(status && { status: status as never }),
    },
    include: { customer: true },
    orderBy: { dueDate: 'asc' },
  })

  const tabs = ['ALL', 'OVERDUE', 'DUE', 'PENDING', 'PAID']

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description={`${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}`}
        action={
          <Link
            href="/invoices/new"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            + Add Invoice
          </Link>
        }
      />

      {/* Status filter tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {tabs.map((tab) => (
          <Link
            key={tab}
            href={tab === 'ALL' ? '/invoices' : `/invoices?status=${tab}`}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              (tab === 'ALL' && !status) || tab === status
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>

      {invoices.length === 0 ? (
        <EmptyState
          icon={<IconFileInvoice size={40} />}
          title="No invoices found"
          description={status ? `No ${status.toLowerCase()} invoices` : 'Add your first invoice to get started'}
          action={
            !status ? (
              <Link
                href="/invoices/new"
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Add First Invoice
              </Link>
            ) : undefined
          }
        />
      ) : (
        <InvoiceTable invoices={invoices} />
      )}
    </div>
  )
}
