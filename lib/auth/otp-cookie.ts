import crypto from 'crypto'
import { prisma } from '@/lib/prisma/client'

const COOKIE_NAME = 'uc_otp_session'
const OTP_TTL_MS = 10 * 60 * 1000 // 10 minutes

export interface OtpSession {
  id: string
  name: string
  email: string
  otp: string
  attempts: number
}

function getSecret(): string {
  const secret = process.env.OTP_SECRET
  if (!secret) throw new Error('OTP_SECRET env var not set')
  return secret
}

export function generateOtp(): string {
  // Cryptographically secure 6-digit code
  return String(crypto.randomInt(100000, 999999))
}

/**
 * Creates an OtpSession record in the database and returns a signed opaque token containing the session ID.
 */
export async function signOtpSession(data: {
  name?: string
  email: string
  otp: string
}): Promise<string> {
  const session = await prisma.otpSession.create({
    data: {
      email: data.email,
      name: data.name || null,
      otp: data.otp,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  })

  const payload = Buffer.from(session.id).toString('base64url')
  const sig = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('base64url')

  return `${payload}.${sig}`
}

/**
 * Verifies the token signature, decodes the session ID, and retrieves the OtpSession from the database.
 * Returns null if the token signature is invalid, the session has expired, or the session does not exist.
 */
export async function verifyOtpSession(token: string): Promise<OtpSession | null> {
  try {
    const dotIndex = token.lastIndexOf('.')
    if (dotIndex === -1) return null

    const payload = token.slice(0, dotIndex)
    const sig = token.slice(dotIndex + 1)

    const expected = crypto
      .createHmac('sha256', getSecret())
      .update(payload)
      .digest('base64url')

    // Constant-time comparison to prevent timing attacks
    if (sig.length !== expected.length) return null
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null

    const sessionId = Buffer.from(payload, 'base64url').toString()
    const session = await prisma.otpSession.findUnique({
      where: { id: sessionId },
    })

    if (!session) return null
    if (Date.now() > session.expiresAt.getTime()) return null

    return {
      id: session.id,
      name: session.name || '',
      email: session.email,
      otp: session.otp,
      attempts: session.attempts,
    }
  } catch (error) {
    console.error('Error verifying OTP session:', error)
    return null
  }
}

export { COOKIE_NAME }
