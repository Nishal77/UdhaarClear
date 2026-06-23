import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'
import { ReminderService } from '@/lib/services/reminder-service'

const MAX_MANUAL_PER_DAY = 3

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { id } = await params

  const body = await request.json().catch(() => ({}))
  
  // Normalize channel
  const rawChannel = String(body.channel || '').toUpperCase()
  const channel: 'WHATSAPP' | 'EMAIL' | 'BOTH' = 
    rawChannel === 'WHATSAPP' || rawChannel === 'EMAIL' || rawChannel === 'BOTH'
      ? rawChannel
      : 'BOTH'

  // Normalize tone
  const rawTone = String(body.tone || '').toUpperCase()
  const tone: 'GENTLE' | 'FIRM' | 'LEGAL' | undefined =
    rawTone === 'GENTLE' || rawTone === 'FIRM' || rawTone === 'LEGAL'
      ? rawTone
      : undefined

  const invoice = await prisma.invoice.findFirst({
    where: { id, businessId: session.businessId },
    include: { customer: true },
  })
  if (!invoice) return apiError('NOT_FOUND', 'Invoice not found', 404)

  // Validation: Check customer email address if email is requested
  if ((channel === 'EMAIL' || channel === 'BOTH') && !invoice.customer.email) {
    if (channel === 'EMAIL') {
      return apiError('NO_EMAIL', 'This customer has no email address on file', 422)
    }
  }

  // Rate limit: max 3 manual reminders per invoice per day
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const manualCount = await prisma.reminder.count({
    where: { invoiceId: id, triggeredBy: 'MANUAL', createdAt: { gte: today } },
  })
  if (manualCount >= MAX_MANUAL_PER_DAY) {
    // Temporarily commented out for testing so the user can send test reminders to check rendering on mobile.
    // return apiError('RATE_LIMIT', 'Maximum 3 manual reminders per invoice per day', 429)
  }

  try {
    const results = await ReminderService.sendReminder({
      invoiceId: id,
      channel,
      tone,
      triggeredBy: 'MANUAL',
    })

    return apiSuccess({ results, tone: results.tone, channel })
  } catch (err: any) {
    return apiError('SEND_FAILED', err.message || String(err), 500)
  }
}
