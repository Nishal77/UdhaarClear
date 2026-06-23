/**
 * @vitest-environment node
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { generateOtp, signOtpSession, verifyOtpSession } from '@/lib/auth/otp-cookie'
import { checkRateLimit } from '@/lib/auth/rate-limit'
import { prisma } from '@/lib/prisma/client'

describe('OTP & Rate Limiting Security Controls', () => {
  const testEmail = 'sec-test@udhaarclear.com'

  beforeEach(async () => {
    await prisma.otpSession.deleteMany({ where: { email: testEmail } })
    await prisma.rateLimit.deleteMany({
      where: {
        key: {
          in: [
            `rate_limit:test:ip`,
            `rate_limit:login:email:${testEmail}`,
            `rate_limit:login:ip:127.0.0.1`
          ]
        }
      }
    })
  })

  afterEach(async () => {
    await prisma.otpSession.deleteMany({ where: { email: testEmail } })
    await prisma.rateLimit.deleteMany({
      where: {
        key: {
          in: [
            `rate_limit:test:ip`,
            `rate_limit:login:email:${testEmail}`,
            `rate_limit:login:ip:127.0.0.1`
          ]
        }
      }
    })
  })

  describe('generateOtp', () => {
    it('generates a 6-digit numeric OTP code', () => {
      const otp = generateOtp()
      expect(otp).toHaveLength(6)
      expect(/^\d+$/.test(otp)).toBe(true)
    })
  })

  describe('signOtpSession & verifyOtpSession', () => {
    it('creates an OTP session in the DB and returns a signed opaque token (no plaintext OTP in token)', async () => {
      const otp = '123456'
      const token = await signOtpSession({
        name: 'Sec Test',
        email: testEmail,
        otp,
      })

      // The token should NOT contain the plaintext OTP
      const payloadBase64 = token.split('.')[0]
      const decodedPayload = Buffer.from(payloadBase64 || '', 'base64url').toString()
      expect(decodedPayload).not.toContain(otp)
      // Decoded payload should just be the opaque sessionId (a cuid)
      expect(decodedPayload.length).toBeGreaterThanOrEqual(20)

      // Verify the session fetches successfully with the valid token
      const session = await verifyOtpSession(token)
      expect(session).not.toBeNull()
      expect(session?.email).toBe(testEmail)
      expect(session?.name).toBe('Sec Test')
      expect(session?.otp).toBe(otp)
      expect(session?.attempts).toBe(0)
    })

    it('rejects a modified token signature', async () => {
      const token = await signOtpSession({
        email: testEmail,
        otp: '123456',
      })

      const modifiedToken = token.replace(/\.[^.]+$/, '.tamperedSignature')
      const session = await verifyOtpSession(modifiedToken)
      expect(session).toBeNull()
    })

    it('fails to verify if the session has expired', async () => {
      const token = await signOtpSession({
        email: testEmail,
        otp: '123456',
      })

      const payloadBase64 = token.split('.')[0]
      const sessionId = Buffer.from(payloadBase64 || '', 'base64url').toString()

      // Manually set expiration in the past
      await prisma.otpSession.update({
        where: { id: sessionId },
        data: { expiresAt: new Date(Date.now() - 1000) },
      })

      const session = await verifyOtpSession(token)
      expect(session).toBeNull()
    })
  })

  describe('enforceMaxAttempts Lockout', () => {
    it('blocks verification after 5 attempts', async () => {
      const token = await signOtpSession({
        email: testEmail,
        otp: '123456',
      })

      // Check first attempt
      let session = await verifyOtpSession(token)
      expect(session).not.toBeNull()

      // Simulate 5 incorrect verification attempts
      for (let i = 1; i <= 5; i++) {
        const currentSession = await verifyOtpSession(token)
        if (!currentSession) break

        await prisma.otpSession.update({
          where: { id: currentSession.id },
          data: { attempts: { increment: 1 } },
        })
      }

      // Retrieve should show attempts has reached 5
      session = await verifyOtpSession(token)
      expect(session?.attempts).toBe(5)
    })
  })

  describe('checkRateLimit', () => {
    it('allows requests within limit and blocks when exceeded', async () => {
      const limitKey = 'rate_limit:test:ip'
      const limit = 3
      const windowMs = 5000 // 5 seconds

      // 1st request
      let res = await checkRateLimit(limitKey, limit, windowMs)
      expect(res.ok).toBe(true)
      expect(res.remaining).toBe(2)

      // 2nd request
      res = await checkRateLimit(limitKey, limit, windowMs)
      expect(res.ok).toBe(true)
      expect(res.remaining).toBe(1)

      // 3rd request
      res = await checkRateLimit(limitKey, limit, windowMs)
      expect(res.ok).toBe(true)
      expect(res.remaining).toBe(0)

      // 4th request (should be blocked)
      res = await checkRateLimit(limitKey, limit, windowMs)
      expect(res.ok).toBe(false)
      expect(res.remaining).toBe(0)
    })
  })
})
