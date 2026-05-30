import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { PageHeader } from '@/components/layout/PageHeader'
import { InvoiceTable } from '@/components/invoices/InvoiceTable'
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay'
import Link from 'next/link'
import { formatDate } from '@/lib/utils/date'
import { IconEdit, IconPlus } from '@tabler/icons-react'

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const { id } = await params
  const customer = await prisma.customer.findFirst({
    where: { id, businessId: dbUser.ownedBusiness.id },
    include: {
      invoices: { include: { customer: true }, orderBy: { createdAt: 'desc' } },
    },
  })

  if (!customer) notFound()

  const outstanding = customer.invoices
    .filter((i) => ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'].includes(i.status))
    .reduce((s, i) => s + Number(i.amount), 0)
  const overdue = customer.invoices
    .filter((i) => i.status === 'OVERDUE')
    .reduce((s, i) => s + Number(i.amount), 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.name}
        description={customer.phone}
        action={
          <div className="flex gap-2">
            <Link
              href={`/customers/${id}/edit`}
              className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <IconEdit size={14} /> Edit
            </Link>
            <Link
              href={`/invoices/new?customerId=${id}`}
              className="flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              <IconPlus size={14} /> Add Invoice
            </Link>
          </div>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Outstanding', value: outstanding, color: 'text-blue-700' },
          { label: 'Overdue', value: overdue, color: 'text-red-600' },
          { label: 'Total Invoices', value: customer.invoices.length, isCount: true, color: 'text-gray-900' },
          { label: 'Default Tone', value: customer.defaultTone, isText: true, color: 'text-gray-700' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            {s.isCount || s.isText ? (
              <p className={`mt-1 text-xl font-bold ${s.color}`}>{s.value}</p>
            ) : (
              <CurrencyDisplay amount={s.value as number} size="lg" className={s.color} />
            )}
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="rounded-xl bg-white border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Customer Details</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          {customer.contactName && (
            <>
              <dt className="text-gray-500">Contact</dt>
              <dd className="text-gray-900">{customer.contactName}</dd>
            </>
          )}
          {customer.email && (
            <>
              <dt className="text-gray-500">Email</dt>
              <dd className="text-gray-900">{customer.email}</dd>
            </>
          )}
          {customer.gstin && (
            <>
              <dt className="text-gray-500">GSTIN</dt>
              <dd className="font-mono text-gray-900">{customer.gstin}</dd>
            </>
          )}
          {customer.city && (
            <>
              <dt className="text-gray-500">City</dt>
              <dd className="text-gray-900">{customer.city}</dd>
            </>
          )}
          <dt className="text-gray-500">Added</dt>
          <dd className="text-gray-900">{formatDate(customer.createdAt)}</dd>
          {customer.notes && (
            <>
              <dt className="text-gray-500">Notes</dt>
              <dd className="text-gray-700 italic">{customer.notes}</dd>
            </>
          )}
        </dl>
      </div>

      {/* Invoice history */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Invoices ({customer.invoices.length})</h2>
        {customer.invoices.length === 0 ? (
          <p className="text-sm text-gray-500">No invoices yet</p>
        ) : (
          <InvoiceTable invoices={customer.invoices} />
        )}
      </div>
    </div>
  )
}
