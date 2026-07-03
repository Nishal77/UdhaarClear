import { prisma } from '@/lib/prisma/client'
import { sendTemplateMessage } from '@/lib/whatsapp/client'
import { TEMPLATE_NAMES, buildCAOtpComponents } from '@/lib/whatsapp/templates'
import { verifyICAIMembership } from '@/lib/ca/icai-verification'

const OTP_EXPIRY_MINUTES = 10
const MAX_OTP_ATTEMPTS = 5

function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

/**
 * Generates a fresh OTP for a CA, stores it on their profile, and sends it
 * via WhatsApp. Used both for the initial registration and for "resend".
 */
export async function sendCAOtp(caProfileId: string, phone: string): Promise<void> {
  const otp = generateOtpCode()
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

  await prisma.cAProfile.update({
    where: { id: caProfileId },
    data: { otpCode: otp, otpExpiresAt: expiresAt, otpAttempts: 0, verificationStatus: 'OTP_SENT' },
  })

  await sendTemplateMessage({
    to: phone,
    templateName: TEMPLATE_NAMES.CA_OTP,
    components: buildCAOtpComponents(otp),
  })
}

export type VerifyCAOtpResult = { ok: true } | { ok: false; reason: string }

/**
 * Verifies the code a CA submitted. On success, this is also the moment the
 * ICAI membership check actually runs (see lib/ca/icai-verification.ts) —
 * phone ownership and membership legitimacy are two separate checks, and
 * there's no point running the ICAI check before we know we're talking to
 * the real phone owner.
 */
export async function verifyCAOtp(caProfileId: string, submittedOtp: string): Promise<VerifyCAOtpResult> {
  const ca = await prisma.cAProfile.findUnique({ where: { id: caProfileId } })

  if (!ca || !ca.otpCode || !ca.otpExpiresAt) {
    return { ok: false, reason: 'No verification code pending — request a new one' }
  }
  if (ca.otpAttempts >= MAX_OTP_ATTEMPTS) {
    return { ok: false, reason: 'Too many incorrect attempts — request a new code' }
  }
  if (ca.otpExpiresAt < new Date()) {
    return { ok: false, reason: 'Code expired — request a new one' }
  }
  if (ca.otpCode !== submittedOtp) {
    await prisma.cAProfile.update({
      where: { id: caProfileId },
      data: { otpAttempts: { increment: 1 } },
    })
    return { ok: false, reason: 'Incorrect code' }
  }

  const icaiResult = await verifyICAIMembership(ca.icaiMembershipNumber, ca.copNumber)

  await prisma.cAProfile.update({
    where: { id: caProfileId },
    data: {
      otpCode: null,
      otpExpiresAt: null,
      otpAttempts: 0,
      verificationStatus: icaiResult.status,
      verifiedAt: icaiResult.status === 'VERIFIED' ? new Date() : null,
    },
  })

  return { ok: true }
}
