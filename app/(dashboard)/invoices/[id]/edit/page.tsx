import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { PageHeader } from '@/components/layout/PageHeader'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const { id } = await params
  const invoice = await prisma.invoice.findFirst({
    where: { id, businessId: dbUser.ownedBusiness.id },
  })
  if (!invoice) notFound()

  const customers = await prisma.customer.findMany({
    where: { businessId: dbUser.ownedBusiness.id },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title={`Edit Invoice ${invoice.invoiceNumber}`} />
      <div className="rounded-xl bg-white p-6  border border-gray-200">
        <InvoiceForm
          customers={customers}
          invoiceId={id}
          defaultValues={{
            customerId: invoice.customerId,
            invoiceNumber: invoice.invoiceNumber,
            amount: Number(invoice.amount),
            description: invoice.description ?? undefined,
            invoiceDate: invoice.invoiceDate.toISOString(),
            dueDate: invoice.dueDate.toISOString(),
            creditDays: invoice.creditDays,
            reminderTone: invoice.reminderTone,
            autoReminder: invoice.autoReminder,
          }}
        />
      </div>
    </div>
  )
}
