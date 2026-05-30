import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { CustomerTable } from '@/components/customers/CustomerTable'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { IconUsers } from '@tabler/icons-react'
import Link from 'next/link'

export default async function CustomersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const customers = await prisma.customer.findMany({
    where: { businessId: dbUser.ownedBusiness.id },
    include: { invoices: { select: { amount: true, status: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const customersWithSummary = customers.map((c) => {
    const totalOutstanding = c.invoices
      .filter((i) => ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'].includes(i.status))
      .reduce((sum, i) => sum + Number(i.amount), 0)
    const overdueInvoices = c.invoices.filter((i) => i.status === 'OVERDUE')
    return {
      ...c,
      invoices: undefined as never,
      totalOutstanding,
      totalOverdue: overdueInvoices.reduce((s, i) => s + Number(i.amount), 0),
      overdueCount: overdueInvoices.length,
    }
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your debtors and their outstanding invoices"
        action={
          <Link
            href="/customers/new"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            + Add Customer
          </Link>
        }
      />

      {customers.length === 0 ? (
        <EmptyState
          icon={<IconUsers size={40} />}
          title="No customers yet"
          description="Add your first customer to start sending payment reminders"
          action={
            <Link
              href="/customers/new"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Add First Customer
            </Link>
          }
        />
      ) : (
        <CustomerTable customers={customersWithSummary} />
      )}
    </div>
  )
}
