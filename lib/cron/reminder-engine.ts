import { prisma } from '@/lib/prisma/client'
import { sendTemplateMessage } from '@/lib/whatsapp/client'
import { selectTone, isReminderDay } from '@/lib/whatsapp/tone-engine'
import {
  TEMPLATE_NAMES,
  buildGentleComponents,
  buildFirmComponents,
  buildLegalComponents,
} from '@/lib/whatsapp/templates'
import { createPaymentLink } from '@/lib/razorpay/payment-link'
import { formatINR } from '@/lib/utils/currency'
import { formatDate, daysOverdue, isSunday } from '@/lib/utils/date'
import { InvoiceStatus } from '@prisma/client'

export interface ReminderEngineResult {
  sent: number
  skipped: number
  failed: number
  errors: string[]
}

export async function runReminderEngine(): Promise<ReminderEngineResult> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (isSunday(today)) {
    return { sent: 0, skipped: 0, failed: 0, errors: ['Skipped: Sunday'] }
  }

  const result: ReminderEngineResult = { sent: 0, skipped: 0, failed: 0, errors: [] }

  const invoices = await prisma.invoice.findMany({
    where: {
      status: { in: ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'] },
      autoReminder: true,
      remindersPaused: false,
      customer: { isBlocked: false },
      business: { waConnected: true },
    },
    include: {
      customer: true,
      business: true,
    },
  })

  for (const invoice of invoices) {
    try {
      const days = daysOverdue(invoice.dueDate)

      if (!isReminderDay(days)) {
        result.skipped++
        continue
      }

      // Check for duplicate reminder today
      const existing = await prisma.reminder.findFirst({
        where: {
          invoiceId: invoice.id,
          createdAt: { gte: today },
        },
      })
      if (existing) {
        result.skipped++
        continue
      }

      // Update invoice status
      let newStatus: InvoiceStatus = invoice.status
      if (days === 0 && invoice.status === 'PENDING') newStatus = 'DUE'
      if (days > 0 && invoice.status !== 'OVERDUE') newStatus = 'OVERDUE'

      if (newStatus !== invoice.status) {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: newStatus },
        })
      }

      // Get or create payment link
      let paymentLink = invoice.razorpayLinkUrl
      if (!paymentLink) {
        try {
          const link = await createPaymentLink({
            invoiceId: invoice.id,
            businessId: invoice.businessId,
            invoiceNumber: invoice.invoiceNumber,
            amount: Number(invoice.amount),
            customerName: invoice.customer.contactName ?? invoice.customer.name,
            customerPhone: invoice.customer.phone,
            customerEmail: invoice.customer.email,
          })
          paymentLink = link.short_url
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: { razorpayLinkId: link.id, razorpayLinkUrl: link.short_url },
          })
        } catch {
          paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoice.id}`
        }
      }

      const tone = selectTone(days, invoice.reminderTone)
      const templateName = TEMPLATE_NAMES[tone]
      const customerName = invoice.customer.contactName ?? invoice.customer.name
      const amount = formatINR(Number(invoice.amount))

      let components
      let messageBody: string

      if (tone === 'GENTLE') {
        components = buildGentleComponents({
          customerName,
          businessName: invoice.business.name,
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: formatDate(invoice.invoiceDate),
          amount,
          dueDate: formatDate(invoice.dueDate),
          paymentLink: paymentLink ?? '',
        })
        messageBody = `Reminder: Invoice ${invoice.invoiceNumber} for ${amount} from ${invoice.business.name} is ${days <= 0 ? `due on ${formatDate(invoice.dueDate)}` : `${days} days overdue`}. Pay: ${paymentLink}`
      } else if (tone === 'FIRM') {
        components = buildFirmComponents({
          customerName,
          invoiceNumber: invoice.invoiceNumber,
          amount,
          daysOverdue: String(days),
          paymentLink: paymentLink ?? '',
          businessPhone: invoice.business.phone,
          businessName: invoice.business.name,
        })
        messageBody = `FIRM: Invoice ${invoice.invoiceNumber} for ${amount} is ${days} days overdue. Pay immediately: ${paymentLink}`
      } else {
        components = buildLegalComponents({
          customerName,
          invoiceNumber: invoice.invoiceNumber,
          amount,
          daysOverdue: String(days),
          paymentLink: paymentLink ?? '',
          businessName: invoice.business.name,
        })
        messageBody = `FINAL NOTICE: Invoice ${invoice.invoiceNumber} for ${amount} is ${days} days overdue. Legal action pending. Pay: ${paymentLink}`
      }

      const waResponse = await sendTemplateMessage({
        to: invoice.customer.phone,
        templateName,
        languageCode: 'hi',
        components,
      })

      await prisma.reminder.create({
        data: {
          businessId: invoice.businessId,
          invoiceId: invoice.id,
          tone,
          templateName,
          messageBody,
          dayOverdue: days,
          status: 'SENT',
          waMessageId: waResponse.messages?.[0]?.id,
          paymentLinkUrl: paymentLink,
          triggeredBy: 'AUTO',
        },
      })

      result.sent++
    } catch (err) {
      result.failed++
      result.errors.push(`Invoice ${invoice.id}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return result
}
