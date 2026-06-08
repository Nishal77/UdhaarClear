import { prisma } from '@/lib/prisma/client'
import { notFound } from 'next/navigation'
import { formatINR } from '@/lib/utils/currency'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import PaymentClient from './PaymentClient'
import { getPayMode, splitIntoParts } from '@/lib/payments/routing'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    select: { invoiceNumber: true, amount: true, business: { select: { name: true } } },
  })
  if (!invoice) return { title: 'Payment Not Found' }
  return {
    title: `Pay ${invoice.invoiceNumber} — ${invoice.business.name}`,
    description: `Secure payment link for invoice ${invoice.invoiceNumber}`,
  }
}

export default async function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: { select: { name: true, contactName: true } },
      business: {
        select: {
          name: true,
          phone: true,
          city: true,
          upiId: true,
          bankAccountNo: true,
          bankIfsc: true,
          bankAccountName: true,
        },
      },
    },
  })

  if (!invoice) notFound()

  const amount = Number(invoice.amount)
  const paid = invoice.status === 'PAID'
  const customerName = invoice.customer.contactName ?? invoice.customer.name
  const formattedAmount = formatINR(amount)
  const formattedDue = format(invoice.dueDate, 'd MMM yyyy')
  const formattedInvoice = format(invoice.invoiceDate, 'd MMM yyyy')

  // Determine payment mode using shared routing logic:
  //   < ₹50K   → 'upi'    (pure Razorpay / UPI link)
  //   ₹50K–₹2L → 'hybrid' (show both UPI parts + bank transfer)
  //   > ₹2L    → 'bank'   (NEFT/RTGS only — finance teams won't click a payment link)
  const payMode = getPayMode(amount)

  // Build UPI deep-link
  const upiLink = invoice.business.upiId
    ? `upi://pay?pa=${encodeURIComponent(invoice.business.upiId)}&pn=${encodeURIComponent(invoice.business.name)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Invoice ${invoice.invoiceNumber}`)}`
    : null

  // Split into UPI-safe parts (≤ ₹99K each) for hybrid mode
  const parts = payMode === 'hybrid' ? splitIntoParts(amount) : []

  return (
    <PaymentClient
      invoiceId={id}
      invoiceNumber={invoice.invoiceNumber}
      amount={amount}
      formattedAmount={formattedAmount}
      formattedDue={formattedDue}
      formattedInvoice={formattedInvoice}
      customerName={customerName}
      businessName={invoice.business.name}
      businessPhone={invoice.business.phone}
      businessCity={invoice.business.city ?? ''}
      upiId={invoice.business.upiId ?? null}
      upiLink={upiLink}
      bankAccountNo={invoice.business.bankAccountNo ?? null}
      bankIfsc={invoice.business.bankIfsc ?? null}
      bankAccountName={invoice.business.bankAccountName ?? null}
      payMode={payMode}
      parts={parts}
      isPaid={paid}
      description={invoice.description ?? ''}
    />
  )
}
