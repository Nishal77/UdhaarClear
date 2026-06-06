import { prisma } from '@/lib/prisma/client'
import { normalizeIndianPhone } from '@/lib/utils/phone'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Schema for checking / creating onboarding flow details
const onboardingSchema = z.object({
  supabaseId: z.string(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  businessName: z.string().optional(),
  phone: z.string().optional(), // personal phone
  bizPhone: z.string().optional(), // business phone
  city: z.string().optional(),
  gstin: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return apiError('UNAUTHORIZED', 'Not authenticated', 401)
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { ownedBusiness: true },
    })

    if (dbUser?.ownedBusiness) {
      return apiSuccess({ onboarded: true, user: dbUser })
    }

    return apiSuccess({ onboarded: false })
  } catch (err) {
    return apiError('INTERNAL_SERVER_ERROR', err instanceof Error ? err.message : 'Unknown error', 500)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = onboardingSchema.safeParse(body)
    if (!parsed.success) {
      return apiError('VALIDATION_ERROR', 'Invalid input', 400)
    }

    const { supabaseId, name, businessName, phone, bizPhone, city, gstin, email } = parsed.data

    // Idempotent — check if user already exists
    const existing = await prisma.user.findUnique({
      where: { supabaseId },
      include: { ownedBusiness: true },
    })
    
    if (existing) {
      // If user already exists, update business details if they were passed
      const updatedUser = await prisma.user.update({
        where: { supabaseId },
        data: {
          name,
          phone: phone ? normalizeIndianPhone(phone) : existing.phone,
          ownedBusiness: {
            update: {
              name: businessName ?? existing.ownedBusiness?.name ?? name,
              phone: bizPhone ? normalizeIndianPhone(bizPhone) : (phone ? normalizeIndianPhone(phone) : (existing.ownedBusiness?.phone ?? '')),
              city: city ?? existing.ownedBusiness?.city ?? null,
              gstin: gstin ?? existing.ownedBusiness?.gstin ?? null,
            }
          }
        },
        include: { ownedBusiness: true }
      })
      return apiSuccess({ user: updatedUser })
    }

    const normalizedPersonalPhone = phone ? normalizeIndianPhone(phone) : null
    const normalizedBizPhone = bizPhone ? normalizeIndianPhone(bizPhone) : (phone ? normalizeIndianPhone(phone) : '')

    const user = await prisma.user.create({
      data: {
        supabaseId,
        email: email ?? `${supabaseId}@placeholder.com`,
        name,
        phone: normalizedPersonalPhone,
        ownedBusiness: {
          create: {
            name: businessName ?? name,
            phone: normalizedBizPhone,
            email,
            city: city ?? null,
            gstin: gstin ?? null,
          },
        },
      },
      include: { ownedBusiness: true },
    })

    return apiSuccess({ user }, 201)
  } catch (err) {
    return apiError('INTERNAL_SERVER_ERROR', err instanceof Error ? err.message : 'Unknown error', 500)
  }
}

