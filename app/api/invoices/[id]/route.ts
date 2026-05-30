import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'
import { z } from 'zod'

const patchSchema = z.object({
  amount: z.number().positive().optional(),
  dueDate: z.string().optional(),
  reminderTone: z.enum(['GENTLE', 'FIRM', 'LEGAL']).optional(),
  autoReminder: z.boolean().optional(),
  remindersPaused: z.boolean().optional(),
  status: z.enum(['PAID', 'DISPUTED', 'WRITTEN_OFF', 'PARTIALLY_PAID']).optional(),
  paidAmount: z.number().positive().optional(),
  paymentMethod: z.string().optional(),
  paymentRef: z.string().optional(),
})

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { id } = await params
  const invoice = await prisma.invoice.findFirst({
    where: { id, businessId: session.businessId },
    include: {
      customer: true,
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
  if (parsed.data.status === 'PAID') {
    updateData.paidAt = new Date()
    updateData.autoReminder = false
    updateData.paidAmount = parsed.data.paidAmount ?? existing.amount
  }

  const invoice = await prisma.invoice.update({ where: { id }, data: updateData })
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
