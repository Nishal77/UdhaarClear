import { prisma } from '@/lib/prisma/client'
import { notFound } from 'next/navigation'
import { formatINR } from '@/lib/utils/currency'
import type { Metadata } from 'next'
import ConfirmClient from './ConfirmClient'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    select: { invoiceNumber: true, business: { select: { name: true } } },
  })
  if (!invoice) return { title: 'Confirm Payment' }
  return {
    title: `Confirm Payment #${invoice.invoiceNumber} — ${invoice.business.name}`,
  }
}

export default async function ConfirmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: { select: { name: true, contactName: true } },
      business: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
  })

  if (!invoice) notFound()

  const amount = Number(invoice.amount)
  const isPaid = invoice.status === 'PAID'
  const customerName = invoice.customer.contactName ?? invoice.customer.name
  const formattedAmount = formatINR(amount)

  return (
    <ConfirmClient
      invoiceId={id}
      invoiceNumber={invoice.invoiceNumber}
      amount={amount}
      formattedAmount={formattedAmount}
      customerName={customerName}
      businessName={invoice.business.name}
      businessPhone={invoice.business.phone}
      isPaid={isPaid}
      status={invoice.status}
    />
  )
}
