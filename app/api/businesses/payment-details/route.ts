import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'
import { z } from 'zod'

const paymentDetailsSchema = z.object({
  upiId: z.string().optional(),
  bankAccountNo: z.string().optional(),
  bankIfsc: z.string().optional(),
  bankAccountName: z.string().optional(),
})

export async function PATCH(request: Request) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const body = await request.json()
  const parsed = paymentDetailsSchema.safeParse(body)
  if (!parsed.success) {
    return apiError('VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten())
  }

  // At least one payment method required
  const { upiId, bankAccountNo, bankIfsc, bankAccountName } = parsed.data
  const hasUpi = upiId && upiId.trim().length > 0
  const hasBank = bankAccountNo && bankIfsc && bankAccountName

  if (!hasUpi && !hasBank) {
    return apiError('VALIDATION_ERROR', 'Provide at least a UPI ID or bank account details', 400)
  }

  const business = await prisma.business.update({
    where: { id: session.businessId },
    data: {
      upiId: upiId?.trim() || null,
      bankAccountNo: bankAccountNo?.trim() || null,
      bankIfsc: bankIfsc?.trim().toUpperCase() || null,
      bankAccountName: bankAccountName?.trim() || null,
    },
    select: { id: true, upiId: true, bankAccountNo: true, bankIfsc: true, bankAccountName: true },
  })

  return apiSuccess({ business })
}
