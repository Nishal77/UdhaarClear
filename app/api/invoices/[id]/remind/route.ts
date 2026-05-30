import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'
import { selectTone } from '@/lib/whatsapp/tone-engine'
import { TEMPLATE_NAMES, buildGentleComponents, buildFirmComponents, buildLegalComponents } from '@/lib/whatsapp/templates'
import { sendTemplateMessage } from '@/lib/whatsapp/client'
import { createPaymentLink } from '@/lib/razorpay/payment-link'
import { formatINR } from '@/lib/utils/currency'
import { formatDate, daysOverdue } from '@/lib/utils/date'

const MAX_MANUAL_PER_DAY = 3

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { id } = await params
  const invoice = await prisma.invoice.findFirst({
    where: { id, businessId: session.businessId },
    include: { customer: true, business: true },
  })
  if (!invoice) return apiError('NOT_FOUND', 'Invoice not found', 404)

  // Rate limit: max 3 manual reminders per invoice per day
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const manualCount = await prisma.reminder.count({
    where: { invoiceId: id, triggeredBy: 'MANUAL', createdAt: { gte: today } },
  })
  if (manualCount >= MAX_MANUAL_PER_DAY) {
    return apiError('RATE_LIMIT', 'Maximum 3 manual reminders per invoice per day', 429)
  }

  const days = daysOverdue(invoice.dueDate)
  const tone = selectTone(days, invoice.reminderTone)

  let paymentLink = invoice.razorpayLinkUrl
  if (!paymentLink) {
    try {
      const link = await createPaymentLink({
        invoiceId: id,
        businessId: session.businessId,
        invoiceNumber: invoice.invoiceNumber,
        amount: Number(invoice.amount),
        customerName: invoice.customer.contactName ?? invoice.customer.name,
        customerPhone: invoice.customer.phone,
        customerEmail: invoice.customer.email,
      })
      paymentLink = link.short_url
      await prisma.invoice.update({ where: { id }, data: { razorpayLinkId: link.id, razorpayLinkUrl: link.short_url } })
    } catch {
      paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${id}`
    }
  }

  const customerName = invoice.customer.contactName ?? invoice.customer.name
  const amount = formatINR(Number(invoice.amount))
  const templateName = TEMPLATE_NAMES[tone as keyof typeof TEMPLATE_NAMES]

  let components
  let messageBody: string

  if (tone === 'GENTLE') {
    components = buildGentleComponents({
      customerName, businessName: invoice.business.name,
      invoiceNumber: invoice.invoiceNumber, invoiceDate: formatDate(invoice.invoiceDate),
      amount, dueDate: formatDate(invoice.dueDate), paymentLink: paymentLink ?? '',
    })
    messageBody = `Reminder: Invoice ${invoice.invoiceNumber} for ${amount}. Pay: ${paymentLink}`
  } else if (tone === 'FIRM') {
    components = buildFirmComponents({
      customerName, invoiceNumber: invoice.invoiceNumber, amount,
      daysOverdue: String(days), paymentLink: paymentLink ?? '',
      businessPhone: invoice.business.phone, businessName: invoice.business.name,
    })
    messageBody = `FIRM: Invoice ${invoice.invoiceNumber} for ${amount} is ${days} days overdue. Pay: ${paymentLink}`
  } else {
    components = buildLegalComponents({
      customerName, invoiceNumber: invoice.invoiceNumber, amount,
      daysOverdue: String(days), paymentLink: paymentLink ?? '', businessName: invoice.business.name,
    })
    messageBody = `FINAL NOTICE: Invoice ${invoice.invoiceNumber} for ${amount} is ${days} days overdue. Pay: ${paymentLink}`
  }

  const waResponse = await sendTemplateMessage({
    to: invoice.customer.phone,
    templateName,
    languageCode: 'hi',
    components,
  })

  const reminder = await prisma.reminder.create({
    data: {
      businessId: session.businessId,
      invoiceId: id,
      tone,
      templateName,
      messageBody,
      dayOverdue: days,
      status: 'SENT',
      waMessageId: waResponse.messages?.[0]?.id,
      paymentLinkUrl: paymentLink,
      triggeredBy: 'MANUAL',
    },
  })

  return apiSuccess({ reminder, messageId: waResponse.messages?.[0]?.id })
}
