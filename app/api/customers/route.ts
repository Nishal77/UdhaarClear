import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { customerSchema } from '@/lib/validations/customer'
import { checkCustomerLimit } from '@/lib/plans'
import { normalizeIndianPhone } from '@/lib/utils/phone'
import { prisma } from '@/lib/prisma/client'

export async function GET(request: Request) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')

  const customers = await prisma.customer.findMany({
    where: {
      businessId: session.businessId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ],
      }),
    },
    include: {
      invoices: {
        select: { amount: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const customersWithSummary = customers.map((c) => {
    const totalOutstanding = c.invoices
      .filter((i) => ['PENDING', 'DUE', 'OVERDUE', 'PENDING_CONFIRMATION', 'PARTIALLY_PAID'].includes(i.status))
      .reduce((sum, i) => sum + Number(i.amount), 0)
    const overdueInvoices = c.invoices.filter((i) => i.status === 'OVERDUE')
    const totalOverdue = overdueInvoices.reduce((sum, i) => sum + Number(i.amount), 0)
    const { invoices: _, ...customer } = c
    return { ...customer, totalOutstanding, totalOverdue, overdueCount: overdueInvoices.length }
  })

  return apiSuccess({ customers: customersWithSummary })
}

export async function POST(request: Request) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const body = await request.json()
  const parsed = customerSchema.safeParse(body)
  if (!parsed.success) {
    return apiError('VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten())
  }

  const canAdd = await checkCustomerLimit(session.businessId)
  if (!canAdd) {
    return apiError('PLAN_LIMIT_REACHED', 'Customer limit reached for your plan', 402)
  }

  const phone = normalizeIndianPhone(parsed.data.phone)

  const existing = await prisma.customer.findUnique({
    where: { businessId_phone: { businessId: session.businessId, phone } },
  })
  if (existing) {
    return apiError('DUPLICATE_PHONE', 'A customer with this phone number already exists', 409)
  }

  const customer = await prisma.customer.create({
    data: {
      businessId: session.businessId,
      ...parsed.data,
      phone,
    },
  })

  return apiSuccess({ customer }, 201)
}
