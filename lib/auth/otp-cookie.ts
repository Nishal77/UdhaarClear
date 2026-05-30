import crypto from 'crypto'

const COOKIE_NAME = 'uc_otp_session'
const OTP_TTL_MS = 10 * 60 * 1000 // 10 minutes

export interface OtpSession {
  name: string
  email: string
  password: string
  otp: string
  exp: number
}

function getSecret(): string {
  const secret = process.env.OTP_SECRET
  if (!secret) throw new Error('OTP_SECRET env var not set')
  return secret
}

// Signs payload as base64url.hmac — no external deps
export function signOtpSession(data: Omit<OtpSession, 'exp'>): string {
  const session: OtpSession = { ...data, exp: Date.now() + OTP_TTL_MS }
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url')
  const sig = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('base64url')
  return `${payload}.${sig}`
}

export function verifyOtpSession(token: string): OtpSession | null {
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

    const session: OtpSession = JSON.parse(Buffer.from(payload, 'base64url').toString())

    if (Date.now() > session.exp) return null

    return session
  } catch {
    return null
  }
}

export function generateOtp(): string {
  // Cryptographically secure 6-digit code
  return String(crypto.randomInt(100000, 999999))
}

export { COOKIE_NAME }
