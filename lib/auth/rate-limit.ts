import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma/client'

export async function getClientIp(): Promise<string> {
  try {
    const h = await headers()
    const forwarded = h.get('x-forwarded-for')
    const realIp = h.get('x-real-ip')
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    if (realIp) {
      return realIp
    }
  } catch {
    // Non-fatal (e.g. if called outside request context)
  }
  return '127.0.0.1'
}

export interface RateLimitResult {
  ok: boolean
  remaining: number
  resetAt: Date
}

/**
 * Checks if the request is within rate limit boundaries.
 * Enforces rate limiting using the database.
 *
 * @param key Unique key identifier (e.g. "rate_limit:email:user@example.com")
 * @param limit Maximum allowed hits within the window
 * @param windowMs Time window in milliseconds
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = new Date()

  // Clean up expired rate limits inline to keep the table size bounded
  try {
    await prisma.rateLimit.deleteMany({
      where: {
        resetAt: { lt: now },
      },
    })
  } catch (err) {
    console.error('Failed to clean up expired rate limits:', err)
  }

  try {
    const record = await prisma.rateLimit.findUnique({
      where: { key },
    })

    if (!record) {
      const resetAt = new Date(now.getTime() + windowMs)
      await prisma.rateLimit.create({
        data: {
          key,
          count: 1,
          resetAt,
        },
      })
      return { ok: true, remaining: limit - 1, resetAt }
    }

    if (now > record.resetAt) {
      const resetAt = new Date(now.getTime() + windowMs)
      await prisma.rateLimit.update({
        where: { key },
        data: {
          count: 1,
          resetAt,
        },
      })
      return { ok: true, remaining: limit - 1, resetAt }
    }

    if (record.count >= limit) {
      return { ok: false, remaining: 0, resetAt: record.resetAt }
    }

    const updated = await prisma.rateLimit.update({
      where: { key },
      data: {
        count: { increment: 1 },
      },
    })

    return { ok: true, remaining: limit - updated.count, resetAt: record.resetAt }
  } catch (error) {
    console.error(`Rate limit check error for key ${key}:`, error)
    // Fail closed for security in authentication routes, throw error so handler returns 500
    throw new Error('Verification service temporarily unavailable. Please try again later.')
  }
}
