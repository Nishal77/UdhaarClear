import { prisma } from '@/lib/prisma/client'
import { normalizeIndianPhone } from '@/lib/utils/phone'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { getSessionUser } from '@/lib/utils/auth'
import { REFERRAL_COOKIE_NAME } from '@/lib/ca/referral'
import { cookies } from 'next/headers'
import { z } from 'zod'

// Schema for checking / creating onboarding flow details.
// supabaseId is NEVER read from here — it always comes from the verified
// session (see getSessionUser below), never from client input.
const onboardingSchema = z.object({
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
    const user = await getSessionUser()
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
    // Identity comes ONLY from the verified session — a client can never
    // pass someone else's supabaseId and edit their business.
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return apiError('UNAUTHORIZED', 'Not authenticated', 401)
    }
    const supabaseId = sessionUser.id

    const body = await request.json()
    const parsed = onboardingSchema.safeParse(body)
    if (!parsed.success) {
      return apiError('VALIDATION_ERROR', 'Invalid input', 400)
    }

    const { name, businessName, phone, bizPhone, city, gstin, email } = parsed.data
    const normalizedPersonalPhone = phone ? normalizeIndianPhone(phone) : null
    const normalizedBizPhone = bizPhone ? normalizeIndianPhone(bizPhone) : (phone ? normalizeIndianPhone(phone) : '')

    // Referral attribution: read the CA's code exactly once, right here at
    // business creation. No other code path in this app ever writes to
    // Business.caId again — that's what makes it "locked forever" per the
    // CA partner program (see lib/ca/referral.ts).
    const cookieStore = await cookies()
    const referralCode = cookieStore.get(REFERRAL_COOKIE_NAME)?.value
    const referringCA = referralCode
      ? await prisma.cAProfile.findUnique({ where: { referralCode }, select: { id: true } })
      : null

    // The User row is created up front at signup (see
    // app/api/auth/verify-otp/route.ts) WITHOUT a business — that only
    // happens here, the first time someone actually completes this wizard.
    // So `existing` is the common case; `!existing` only covers signup
    // paths that don't pre-create a bare user row (e.g. some OAuth flows).
    const existing = await prisma.user.findUnique({
      where: { supabaseId },
      include: { ownedBusiness: true },
    })

    if (existing) {
      const updatedUser = await prisma.user.update({
        where: { supabaseId },
        data: {
          name,
          phone: normalizedPersonalPhone ?? existing.phone,
          ownedBusiness: existing.ownedBusiness
            ? {
                // Business already exists (e.g. re-submitting this wizard) — update it in place.
                update: {
                  name: businessName ?? existing.ownedBusiness.name,
                  phone: normalizedBizPhone || existing.ownedBusiness.phone,
                  city: city ?? existing.ownedBusiness.city,
                  gstin: gstin ?? existing.ownedBusiness.gstin,
                },
              }
            : {
                // First time this user completes the business wizard —
                // create it now, attributing the referral if one is pending.
                create: {
                  name: businessName ?? name,
                  phone: normalizedBizPhone,
                  email,
                  city: city ?? null,
                  gstin: gstin ?? null,
                  caId: referringCA?.id ?? null,
                },
              },
        },
        include: { ownedBusiness: true },
      })
      return apiSuccess({ user: updatedUser })
    }

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
            caId: referringCA?.id ?? null,
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

