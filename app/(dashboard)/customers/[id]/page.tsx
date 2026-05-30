import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { CustomerDetail } from '@/components/customers/CustomerDetail'

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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
      invoices: {
        include: { customer: true },
        orderBy: { dueDate: 'desc' },
      },
    },
  })

  if (!customer) notFound()

  // Normalize Prisma Decimal → number for the component
  const normalized = {
    ...customer,
    invoices: customer.invoices.map((inv) => ({
      ...inv,
      amount: Number(inv.amount),
      paidAmount: inv.paidAmount !== null ? Number(inv.paidAmount) : null,
    })),
  }

  return <CustomerDetail customer={normalized} />
}
