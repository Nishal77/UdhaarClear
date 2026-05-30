import { prisma } from '@/lib/prisma/client'
import { normalizeIndianPhone } from '@/lib/utils/phone'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { z } from 'zod'

// Minimal schema — business name & phone collected in post-signup onboarding flow
const onboardingSchema = z.object({
  supabaseId: z.string(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  // Optional fields for users coming from the old full-form signup
  businessName: z.string().optional(),
  phone: z.string().optional(),
})

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = onboardingSchema.safeParse(body)
  if (!parsed.success) {
    return apiError('VALIDATION_ERROR', 'Invalid input', 400)
  }

  const { supabaseId, name, businessName, phone, email } = parsed.data

  // Idempotent — safe to call multiple times
  const existing = await prisma.user.findUnique({ where: { supabaseId } })
  if (existing) return apiSuccess({ user: existing })

  const normalizedPhone = phone ? normalizeIndianPhone(phone) : null

  const user = await prisma.user.create({
    data: {
      supabaseId,
      email: email ?? `${supabaseId}@placeholder.com`,
      name,
      phone: normalizedPhone,
      ownedBusiness: {
        create: {
          name: businessName ?? name,
          // Business phone defaults to empty — user updates it in onboarding settings
          phone: normalizedPhone ?? '',
          email,
        },
      },
    },
    include: { ownedBusiness: true },
  })

  return apiSuccess({ user }, 201)
}
