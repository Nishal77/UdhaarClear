import { prisma } from '@/lib/prisma/client'
import { isReminderDay, shouldAutoPause } from '@/lib/whatsapp/tone-engine'
import { daysOverdue, isSunday } from '@/lib/utils/date'
import { InvoiceStatus } from '@prisma/client'
import { ReminderService } from '@/lib/services/reminder-service'
import { sendTextMessage } from '@/lib/whatsapp/client'
import { formatINR } from '@/lib/utils/currency'

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

  const isGlobalWhatsAppEnabled = !!process.env.WHATSAPP_ACCESS_TOKEN && !!process.env.WHATSAPP_PHONE_NUMBER_ID

  const invoices = await prisma.invoice.findMany({
    where: {
      status: { in: ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'] },
      autoReminder: true,
      remindersPaused: false,
      customer: { isBlocked: false },
      ...(isGlobalWhatsAppEnabled ? {} : { business: { waConnected: true } }),
    },
    include: {
      customer: true,
      business: true,
    },
  })

  for (const invoice of invoices) {
    try {
      const days = daysOverdue(invoice.dueDate)

      // Day 28 Human Gate Interception:
      // If it reaches Day 28 and has NOT been approved yet (legalNoticeSentAt is null),
      // we must pause reminders and alert the business owner.
      if (days === 28 && !invoice.legalNoticeSentAt) {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { remindersPaused: true },
        })

        // Notify business owner
        const ownerPhone = invoice.business.phone
        if (ownerPhone) {
          try {
            const amountStr = formatINR(Number(invoice.amount))
            await sendTextMessage({
              to: ownerPhone,
              body: `⚠️ Human Gate Approval Required:\nInvoice ${invoice.invoiceNumber} for ${invoice.customer.name} (${amountStr}) is 28 days overdue.\n\nAutomated legal warning sequence is paused.\n\nReply:\n👉 "Yes ${invoice.customer.name}" to approve & send notice\n👉 "No ${invoice.customer.name}" to dismiss\n👉 "Pause ${invoice.customer.name}" to keep reminders paused`,
            })
          } catch (err) {
            console.error('Failed to send Day 28 Human Gate notification:', err)
          }
        }
        result.skipped++
        continue
      }

      if (shouldAutoPause(days)) {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { remindersPaused: true },
        })
        result.skipped++
        continue
      }

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

      const serviceResult = await ReminderService.sendReminder({
        invoiceId: invoice.id,
        channel: 'BOTH',
        triggeredBy: 'AUTO',
      })

      if (serviceResult.error) {
        result.errors.push(`Invoice ${invoice.id}: Partial success (${serviceResult.error})`)
      }

      result.sent++
    } catch (err) {
      result.failed++
      result.errors.push(`Invoice ${invoice.id}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return result
}
