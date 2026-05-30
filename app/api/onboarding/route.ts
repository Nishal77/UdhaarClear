import { prisma } from '@/lib/prisma/client'
import { normalizeIndianPhone } from '@/lib/utils/phone'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { z } from 'zod'

const onboardingSchema = z.object({
  supabaseId: z.string(),
  name: z.string().min(1),
  businessName: z.string().min(1),
  phone: z.string(),
  email: z.string().email().optional(),
})

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = onboardingSchema.safeParse(body)
  if (!parsed.success) {
    return apiError('VALIDATION_ERROR', 'Invalid input', 400)
  }

  const { supabaseId, name, businessName, phone, email } = parsed.data
  const normalizedPhone = normalizeIndianPhone(phone)

  const existing = await prisma.user.findUnique({ where: { supabaseId } })
  if (existing) return apiSuccess({ user: existing })

  const user = await prisma.user.create({
    data: {
      supabaseId,
      email: email ?? `${supabaseId}@placeholder.com`,
      name,
      phone: normalizedPhone,
      ownedBusiness: {
        create: {
          name: businessName,
          phone: normalizedPhone,
          email,
        },
      },
    },
    include: { ownedBusiness: true },
  })

  return apiSuccess({ user }, 201)
}
