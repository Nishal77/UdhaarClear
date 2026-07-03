import { z } from 'zod'
import { prisma } from '@/lib/prisma/client'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { getSessionUser } from '@/lib/utils/auth'
import { verifyCAOtp, sendCAOtp } from '@/lib/ca/otp'

async function getOwnCAProfile(supabaseId: string) {
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId },
    include: { caProfile: true },
  })
  return dbUser?.caProfile ?? null
}

const verifySchema = z.object({ otp: z.string().length(6) })

/** POST /api/ca/verify-otp — confirms the code sent during registration. */
export async function POST(request: Request) {
  const sessionUser = await getSessionUser()
  if (!sessionUser) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const body = await request.json()
  const parsed = verifySchema.safeParse(body)
  if (!parsed.success) return apiError('VALIDATION_ERROR', 'Enter the 6-digit code', 400)

  const caProfile = await getOwnCAProfile(sessionUser.id)
  if (!caProfile) return apiError('NOT_FOUND', 'No CA registration found for this account', 404)

  const result = await verifyCAOtp(caProfile.id, parsed.data.otp)
  if (!result.ok) return apiError('VERIFICATION_FAILED', result.reason, 400)

  return apiSuccess({ ok: true })
}

/** PUT /api/ca/verify-otp — resend a fresh code. */
export async function PUT() {
  const sessionUser = await getSessionUser()
  if (!sessionUser) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const caProfile = await getOwnCAProfile(sessionUser.id)
  if (!caProfile) return apiError('NOT_FOUND', 'No CA registration found for this account', 404)

  try {
    await sendCAOtp(caProfile.id, caProfile.phone)
  } catch (err) {
    return apiError('SEND_FAILED', err instanceof Error ? err.message : 'Failed to resend code', 500)
  }

  return apiSuccess({ ok: true })
}
