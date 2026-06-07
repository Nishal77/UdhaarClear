import { prisma } from '@/lib/prisma/client'
import { isReminderDay } from '@/lib/whatsapp/tone-engine'
import { daysOverdue, isSunday } from '@/lib/utils/date'
import { InvoiceStatus } from '@prisma/client'
import { ReminderService } from '@/lib/services/reminder-service'

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
