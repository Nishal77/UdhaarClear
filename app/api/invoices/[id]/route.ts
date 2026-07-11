import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'
import { sendBuyerPaymentReceipt } from '@/lib/services/payment-confirmation'
import { z } from 'zod'

const patchSchema = z.object({
  amount: z.number().positive().optional(),
  dueDate: z.string().optional(),
  reminderTone: z.enum(['GENTLE', 'FIRM', 'LEGAL']).optional(),
  autoReminder: z.boolean().optional(),
  remindersPaused: z.boolean().optional(),
  // ISO date string, or null to clear an existing snooze (pause forever /
  // resume now, depending on remindersPaused). See lib/cron/reminder-engine.ts
  // for how the cron job auto-resumes once this date passes.
  remindersPausedUntil: z.string().nullable().optional(),
  status: z.enum([
    'PENDING',
    'DUE',
    'OVERDUE',
    'PENDING_CONFIRMATION',
    'PARTIALLY_PAID',
    'PAID',
    'DISPUTED',
    'WRITTEN_OFF'
  ]).optional(),
  paidAmount: z.number().positive().optional(),
  paymentMethod: z.string().optional(),
  paymentRef: z.string().nullable().optional(),
})

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { id } = await params
  const invoice = await prisma.invoice.findFirst({
    where: { id, businessId: session.businessId },
    include: {
      customer: true,
      business: true,
      reminders: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!invoice) return apiError('NOT_FOUND', 'Invoice not found', 404)
  return apiSuccess({ invoice })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { id } = await params
  const existing = await prisma.invoice.findFirst({
    where: { id, businessId: session.businessId },
  })
  if (!existing) return apiError('NOT_FOUND', 'Invoice not found', 404)

  const body = await request.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return apiError('VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten())
  }

  const updateData: Record<string, unknown> = { ...parsed.data }
  if (parsed.data.dueDate) updateData.dueDate = new Date(parsed.data.dueDate)
  if (parsed.data.remindersPausedUntil !== undefined) {
    updateData.remindersPausedUntil = parsed.data.remindersPausedUntil
      ? new Date(parsed.data.remindersPausedUntil)
      : null
  }
  if (parsed.data.status === 'PAID') {
    updateData.paidAt = new Date()
    updateData.autoReminder = false
    updateData.paidAmount = parsed.data.paidAmount ?? existing.amount
  }

  const invoice = await prisma.invoice.update({
    where: { id },
    data: updateData,
    include: { customer: true, business: true },
  })

  // When the owner marks an invoice PAID from the dashboard, send the buyer
  // the same WhatsApp receipt the Razorpay auto-path sends — closes the gap
  // where manual approvals never notified the buyer. Only on the transition
  // into PAID (not a re-save of an already-paid invoice).
  if (parsed.data.status === 'PAID' && existing.status !== 'PAID') {
    await sendBuyerPaymentReceipt(invoice, Number(invoice.paidAmount ?? invoice.amount))
  }

  return apiSuccess({ invoice })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { id } = await params
  const invoice = await prisma.invoice.findFirst({
    where: { id, businessId: session.businessId },
  })
  if (!invoice) return apiError('NOT_FOUND', 'Invoice not found', 404)

  await prisma.invoice.delete({ where: { id } })
  return apiSuccess({ success: true })
}
