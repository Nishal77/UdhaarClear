import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { PageHeader } from '@/components/layout/PageHeader'
import { CustomerForm } from '@/components/customers/CustomerForm'

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
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
  })
  if (!customer) notFound()

  return (
    <div className="space-y-6 w-full">
      <PageHeader title={`Edit: ${customer.name}`} />
      <div className="rounded-[22px] bg-white p-8 border border-[#EBEAE6]/60">
        <CustomerForm
          customerId={id}
          defaultValues={{
            name: customer.name,
            contactName: customer.contactName ?? undefined,
            phone: customer.phone,
            email: customer.email ?? undefined,
            gstin: customer.gstin ?? undefined,
            address: customer.address ?? undefined,
            city: customer.city ?? undefined,
            defaultTone: customer.defaultTone,
            notes: customer.notes ?? undefined,
          }}
        />
      </div>
    </div>
  )
}
