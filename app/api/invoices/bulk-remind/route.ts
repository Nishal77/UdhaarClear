import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'
import { ReminderService } from '@/lib/services/reminder-service'

// Same per-invoice daily cap as the single-invoice remind route
// (app/api/invoices/[id]/remind/route.ts) — a customer shouldn't get
// spammed just because the owner clicked "remind all" more than once today.
const MAX_MANUAL_PER_DAY = 3

export interface BulkRemindResult {
  sent: number
  skipped: number
  failed: number
}

/**
 * POST /api/invoices/bulk-remind
 *
 * Sends a manual reminder to every overdue invoice for the logged-in
 * business in one action ("Remind all overdue" button on the invoices page).
 * Runs sequentially, one invoice at a time — fine for the invoice counts on
 * today's plans, but a genuinely large portfolio (thousands of invoices)
 * would need a background job queue instead of a single request. That's out
 * of scope here; see the Month 3-6 roadmap for BullMQ/Upstash.
 */
export async function POST() {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const overdueInvoices = await prisma.invoice.findMany({
    where: {
      businessId: session.businessId,
      status: 'OVERDUE',
      remindersPaused: false,
      customer: { isBlocked: false },
    },
    include: {
      _count: {
        select: {
          reminders: {
            where: { triggeredBy: 'MANUAL', createdAt: { gte: today } },
          },
        },
      },
    },
  })

  const result: BulkRemindResult = { sent: 0, skipped: 0, failed: 0 }

  for (const invoice of overdueInvoices) {
    const alreadyRemindedToday = invoice._count.reminders >= MAX_MANUAL_PER_DAY
    if (alreadyRemindedToday) {
      result.skipped++
      continue
    }

    try {
      await ReminderService.sendReminder({
        invoiceId: invoice.id,
        channel: 'BOTH',
        triggeredBy: 'MANUAL',
      })
      result.sent++
    } catch {
      // ReminderService already logs a FAILED Reminder row internally —
      // just keep going so one bad invoice doesn't block the rest.
      result.failed++
    }
  }

  return apiSuccess(result)
}
