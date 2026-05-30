import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { customerSchema } from '@/lib/validations/customer'
import { normalizeIndianPhone } from '@/lib/utils/phone'
import { prisma } from '@/lib/prisma/client'

async function getCustomer(id: string, businessId: string) {
  const customer = await prisma.customer.findFirst({
    where: { id, businessId },
  })
  return customer
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { id } = await params
  const customer = await prisma.customer.findFirst({
    where: { id, businessId: session.businessId },
    include: { invoices: { orderBy: { createdAt: 'desc' } } },
  })

  if (!customer) return apiError('NOT_FOUND', 'Customer not found', 404)

  const outstanding = customer.invoices
    .filter((i) => ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'].includes(i.status))
    .reduce((sum, i) => sum + Number(i.amount), 0)
  const overdue = customer.invoices
    .filter((i) => i.status === 'OVERDUE')
    .reduce((sum, i) => sum + Number(i.amount), 0)

  return apiSuccess({
    customer,
    invoiceSummary: {
      total: customer.invoices.reduce((sum, i) => sum + Number(i.amount), 0),
      outstanding,
      overdue,
    },
  })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { id } = await params
  const customer = await getCustomer(id, session.businessId)
  if (!customer) return apiError('NOT_FOUND', 'Customer not found', 404)

  const body = await request.json()
  const parsed = customerSchema.partial().safeParse(body)
  if (!parsed.success) {
    return apiError('VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten())
  }

  const data = { ...parsed.data }
  if (data.phone) data.phone = normalizeIndianPhone(data.phone)

  const updated = await prisma.customer.update({ where: { id }, data })
  return apiSuccess({ customer: updated })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { id } = await params
  const customer = await prisma.customer.findFirst({
    where: { id, businessId: session.businessId },
    include: { _count: { select: { invoices: true } } },
  })
  if (!customer) return apiError('NOT_FOUND', 'Customer not found', 404)

  if (customer._count.invoices > 0) {
    await prisma.customer.update({ where: { id }, data: { isBlocked: true } })
  } else {
    await prisma.customer.delete({ where: { id } })
  }

  return apiSuccess({ success: true })
}
