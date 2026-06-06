import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { PageHeader } from '@/components/layout/PageHeader'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const customers = await prisma.customer.findMany({
    where: { businessId: dbUser.ownedBusiness.id, isBlocked: false },
    orderBy: { name: 'asc' },
  })

  const { customerId } = await searchParams

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Add Invoice"
        description="Create a new invoice and set up automated payment reminders"
      />
      <div className="rounded-2xl bg-white p-8 border border-gray-200/60">
        <InvoiceForm
          customers={customers}
          defaultValues={customerId ? { customerId } : undefined}
        />
      </div>
    </div>
  )
}
