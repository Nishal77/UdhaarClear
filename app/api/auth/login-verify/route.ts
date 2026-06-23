import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { verifyOtpSession, COOKIE_NAME } from '@/lib/auth/otp-cookie'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma/client'
import { getClientIp, checkRateLimit } from '@/lib/auth/rate-limit'

const verifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = verifySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input fields' }, { status: 400 })
    }

    const { email, otp } = parsed.data

    const ip = await getClientIp()

    // 1. Enforce IP-based rate limit on verification attempts (max 20 attempts per 10 minutes)
    const ipLimit = await checkRateLimit(`rate_limit:verify:ip:${ip}`, 20, 10 * 60 * 1000)
    if (!ipLimit.ok) {
      return NextResponse.json(
        { error: 'Too many verification attempts from this device. Please try again in 10 minutes.' },
        { status: 429 }
      )
    }

    // 2. Read and verify custom OTP session cookie
    const cookieStore = await cookies()
    const rawCookie = cookieStore.get(COOKIE_NAME)?.value

    if (!rawCookie) {
      return NextResponse.json(
        { error: 'Session expired or not found. Please try signing in again.' },
        { status: 400 }
      )
    }

    const session = await verifyOtpSession(rawCookie)

    if (!session) {
      return NextResponse.json(
        { error: 'Session expired. Please request a new code.' },
        { status: 400 }
      )
    }

    if (session.email !== email) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 400 })
    }

    // 3. Enforce maximum of 5 attempts on the session
    if (session.attempts >= 5) {
      // Invalidate the session
      await prisma.otpSession.delete({ where: { id: session.id } }).catch(() => {})
      cookieStore.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
      return NextResponse.json(
        { error: 'Too many incorrect attempts. This session has been locked. Please request a new code.' },
        { status: 400 }
      )
    }

    if (session.otp !== otp) {
      // Increment verification attempts in database
      const updatedSession = await prisma.otpSession.update({
        where: { id: session.id },
        data: { attempts: { increment: 1 } },
      })

      if (updatedSession.attempts >= 5) {
        // Lockout reached: delete session and clear cookie
        await prisma.otpSession.delete({ where: { id: session.id } }).catch(() => {})
        cookieStore.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
        return NextResponse.json(
          { error: 'Too many incorrect attempts. This session has been locked. Please request a new code.' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: `Incorrect verification code. Please try again. (Remaining attempts: ${5 - updatedSession.attempts})` },
        { status: 400 }
      )
    }

    // Generate Supabase magiclink token using the Admin Client
    const adminClient = await createServiceClient()
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email,
    })

    if (linkError || !linkData?.properties) {
      console.error('Supabase generateLink error on verification:', linkError)
      return NextResponse.json(
        { error: 'Failed to authenticate user. Please try again.' },
        { status: 500 }
      )
    }

    const tokenHash = linkData.properties.hashed_token

    // Authenticate user via Supabase SSR client by verifying the magiclink token hash
    const supabase = await createClient()
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'magiclink',
    })

    if (verifyError) {
      console.error('Supabase token_hash verification error:', verifyError)
      return NextResponse.json(
        { error: verifyError.message || 'Verification failed. Please try again.' },
        { status: 400 }
      )
    }

    // Delete OTP session from database on success
    await prisma.otpSession.delete({ where: { id: session.id } }).catch(() => {})

    // Clear OTP cookie
    cookieStore.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('OTP login verification error:', error)
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
