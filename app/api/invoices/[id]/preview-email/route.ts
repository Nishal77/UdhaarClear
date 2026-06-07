import { getBusinessFromSession } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma/client'
import { buildReminderEmail } from '@/lib/email/templates/payment-reminder'
import { selectTone } from '@/lib/whatsapp/tone-engine'
import { daysOverdue, formatDate } from '@/lib/utils/date'
import { formatINR } from '@/lib/utils/currency'
import { ReminderTone } from '@prisma/client'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const toneQuery = searchParams.get('tone') as ReminderTone | null

  const invoice = await prisma.invoice.findFirst({
    where: { id, businessId: session.businessId },
    include: { customer: true, business: true },
  })

  if (!invoice) {
    return new Response('Invoice not found', { status: 404 })
  }

  const days = daysOverdue(invoice.dueDate)
  const tone = toneQuery || selectTone(days, invoice.reminderTone)
  const customerName = invoice.customer.contactName ?? invoice.customer.name
  const amount = formatINR(Number(invoice.amount))

  let paymentLink = invoice.razorpayLinkUrl
  if (!paymentLink) {
    paymentLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pay/${id}`
  }

  const emailParams = {
    reminderId: 'preview-mode-no-id',
    customerName,
    businessName: invoice.business.name,
    businessPhone: invoice.business.phone,
    businessGstin: invoice.business.gstin,
    businessCity: invoice.business.city,
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: formatDate(invoice.invoiceDate),
    dueDate: formatDate(invoice.dueDate),
    amount,
    daysOverdue: days,
    paymentLink,
    bankAccountNo: invoice.business.bankAccountNo,
    bankIfsc: invoice.business.bankIfsc,
    bankAccountName: invoice.business.bankAccountName,
    upiId: invoice.business.upiId,
  }

  const { html } = buildReminderEmail(tone, emailParams)

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}

export const dynamic = 'force-dynamic'
