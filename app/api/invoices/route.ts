import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { invoiceSchema } from '@/lib/validations/invoice'
import { checkInvoiceLimit } from '@/lib/plans'
import { prisma } from '@/lib/prisma/client'

function generateInvoiceNumber(count: number): string {
  const year = new Date().getFullYear()
  return `INV-${year}-${String(count + 1).padStart(4, '0')}`
}

export async function GET(request: Request) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const customerId = searchParams.get('customerId')
  const sortBy = searchParams.get('sortBy') ?? 'dueDate'
  const order = (searchParams.get('order') ?? 'asc') as 'asc' | 'desc'

  const invoices = await prisma.invoice.findMany({
    where: {
      businessId: session.businessId,
      ...(status && { status: status as never }),
      ...(customerId && { customerId }),
    },
    include: { customer: true },
    orderBy: { [sortBy]: order },
  })

  return apiSuccess({ invoices })
}

export async function POST(request: Request) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const body = await request.json()
  const parsed = invoiceSchema.safeParse({
    ...body,
    invoiceDate: body.invoiceDate ? new Date(body.invoiceDate) : undefined,
    dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
  })
  if (!parsed.success) {
    return apiError('VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten())
  }

  const canAdd = await checkInvoiceLimit(session.businessId)
  if (!canAdd) {
    return apiError('PLAN_LIMIT_REACHED', 'Invoice limit reached for your plan', 402)
  }

  const customer = await prisma.customer.findFirst({
    where: { id: parsed.data.customerId, businessId: session.businessId },
  })
  if (!customer) return apiError('NOT_FOUND', 'Customer not found', 404)

  const count = await prisma.invoice.count({ where: { businessId: session.businessId } })
  const invoiceNumber = parsed.data.invoiceNumber || generateInvoiceNumber(count)

  const invoice = await prisma.invoice.create({
    data: {
      businessId: session.businessId,
      customerId: parsed.data.customerId,
      invoiceNumber,
      amount: parsed.data.amount,
      description: parsed.data.description,
      invoiceDate: parsed.data.invoiceDate,
      dueDate: parsed.data.dueDate,
      creditDays: parsed.data.creditDays,
      reminderTone: parsed.data.reminderTone,
      autoReminder: parsed.data.autoReminder,
    },
  })

  return apiSuccess({ invoice }, 201)
}
