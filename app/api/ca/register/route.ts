import { z } from 'zod'
import { prisma } from '@/lib/prisma/client'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { getSessionUser } from '@/lib/utils/auth'
import { normalizeIndianPhone, isValidIndianPhone } from '@/lib/utils/phone'
import { generateReferralCode } from '@/lib/ca/referral'
import { sendCAOtp } from '@/lib/ca/otp'

const registerSchema = z.object({
  firmName: z.string().min(1),
  phone: z.string().min(8),
  icaiMembershipNumber: z.string().min(1),
  copNumber: z.string().optional(),
})

/**
 * POST /api/ca/register
 *
 * Registers the currently logged-in user as a CA partner and sends the
 * first WhatsApp OTP to confirm the phone number. A user can only ever be a
 * business owner OR a CA — never both — so this rejects anyone who already
 * has a business, and is idempotent for anyone who already has a CAProfile
 * (just re-sends the OTP rather than erroring).
 */
export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return apiError('VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten())
    }

    const { firmName, icaiMembershipNumber } = parsed.data
    const copNumber = parsed.data.copNumber?.trim() || null

    if (!isValidIndianPhone(parsed.data.phone)) {
      return apiError('VALIDATION_ERROR', 'Enter a valid 10-digit Indian mobile number', 400)
    }
    const phone = normalizeIndianPhone(parsed.data.phone)

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: sessionUser.id },
      include: { ownedBusiness: true, caProfile: true },
    })
    if (!dbUser) return apiError('NOT_FOUND', 'User record not found', 404)

    if (dbUser.ownedBusiness) {
      return apiError('INVALID', 'This account is already registered as a business — a CA partner account must be separate', 400)
    }

    let caProfile = dbUser.caProfile

    if (!caProfile) {
      try {
        caProfile = await prisma.cAProfile.create({
          data: {
            userId: dbUser.id,
            firmName,
            phone,
            icaiMembershipNumber,
            copNumber,
            referralCode: generateReferralCode(),
          },
        })
      } catch (err: unknown) {
        if (isUniqueConstraintError(err, 'phone')) {
          return apiError('DUPLICATE', 'This phone number is already registered to another CA partner', 409)
        }
        if (isUniqueConstraintError(err, 'icaiMembershipNumber')) {
          return apiError('DUPLICATE', 'This ICAI membership number is already registered', 409)
        }
        throw err
      }
    }

    try {
      await sendCAOtp(caProfile.id, phone)
    } catch (err) {
      return apiError('SEND_FAILED', err instanceof Error ? err.message : 'Failed to send verification code', 500)
    }

    return apiSuccess({ caProfileId: caProfile.id }, 201)
  } catch (err) {
    // Catch-all: any unexpected error (e.g. a DB/migration issue) must still
    // come back as JSON — otherwise Next.js's plain-text 500 page breaks the
    // frontend's `res.json()` call with a confusing "not valid JSON" error
    // that hides the real problem.
    console.error('CA registration error:', err)
    return apiError('INTERNAL_SERVER_ERROR', err instanceof Error ? err.message : 'Something went wrong', 500)
  }
}

function isUniqueConstraintError(err: unknown, field: string): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === 'P2002' &&
    'meta' in err &&
    JSON.stringify((err as { meta?: unknown }).meta).includes(field)
  )
}
