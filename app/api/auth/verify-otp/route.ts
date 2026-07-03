import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateOtp, verifyOtpSession, signOtpSession, COOKIE_NAME } from '@/lib/auth/otp-cookie'
import { sendEmail } from '@/lib/email/client'
import { otpVerificationEmail } from '@/lib/email/templates/otp-verification'
import { prisma } from '@/lib/prisma/client'
import { cookies } from 'next/headers'
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
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
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

    // 2. Read and verify signed OTP cookie
    const cookieStore = await cookies()
    const rawCookie = cookieStore.get(COOKIE_NAME)?.value

    if (!rawCookie) {
      return NextResponse.json(
        { error: 'Session expired. Please request a new code.' },
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
        { error: `Incorrect code. Please try again. (Remaining attempts: ${5 - updatedSession.attempts})` },
        { status: 400 }
      )
    }

    const adminClient = await createServiceClient()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    // 4. Retrieve the unconfirmed user from Supabase Auth to confirm their details
    const authCheckRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?filter=${encodeURIComponent(session.email)}`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    )

    if (!authCheckRes.ok) {
      return NextResponse.json({ error: 'Account profile not found. Please sign up again.' }, { status: 400 })
    }

    const { users } = await authCheckRes.json()
    const supabaseUser = Array.isArray(users) ? users.find((u: { email: string }) => u.email === session.email) : null

    if (!supabaseUser) {
      return NextResponse.json({ error: 'Account profile not found. Please sign up again.' }, { status: 400 })
    }

    // 5. Create the bare DB user record (if not already existing).
    // IMPORTANT: no ownedBusiness is created here. Account creation happens
    // before the person has said whether they're a business owner or a CA
    // partner (that choice happens on /onboarding, which links to
    // /ca/onboarding) — auto-creating a Business at this point used to lock
    // every new signup into "business owner" and block CA registration with
    // a false "already registered as a business" error. The actual profile
    // (Business or CAProfile) is created lazily by whichever onboarding
    // flow the user actually completes.
    try {
      const existing = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } })
      if (!existing) {
        await prisma.user.create({
          data: {
            supabaseId: supabaseUser.id,
            email: session.email,
            name: session.name,
          },
        })
      }
    } catch (dbErr) {
      console.error('DB user creation error:', dbErr)
    }

    // 6. Generate Supabase magiclink token using the Admin Client
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email: session.email,
    })

    if (linkError || !linkData?.properties) {
      console.error('Supabase generateLink error on verification:', linkError)
      return NextResponse.json(
        { error: 'Failed to authenticate user. Please try again.' },
        { status: 500 }
      )
    }

    const tokenHash = linkData.properties.hashed_token

    // 7. Authenticate user via Supabase SSR client by verifying the magiclink token hash
    // This will confirm the user and log them in
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

    // 8. Delete OTP session from database
    await prisma.otpSession.delete({ where: { id: session.id } }).catch(() => {})

    // Clear OTP cookie on success
    cookieStore.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Signup OTP verification error:', error)
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

// Resend — regenerates OTP, refreshes cookie, re-sends email
export async function PUT(request: Request) {
  try {
    const { email } = await request.json()

    const ip = await getClientIp()

    // 1. Enforce IP-based rate limiting (max 10 requests per 10 minutes)
    const ipLimit = await checkRateLimit(`rate_limit:resend:ip:${ip}`, 10, 10 * 60 * 1000)
    if (!ipLimit.ok) {
      return NextResponse.json(
        { error: 'Too many requests from this device. Please try again in 10 minutes.' },
        { status: 429 }
      )
    }

    // 2. Enforce email-based rate limiting (max 5 requests per 10 minutes)
    const emailLimit = await checkRateLimit(`rate_limit:resend:email:${email}`, 5, 10 * 60 * 1000)
    if (!emailLimit.ok) {
      return NextResponse.json(
        { error: 'Too many verification code requests for this email. Please try again in 10 minutes.' },
        { status: 429 }
      )
    }

    const cookieStore = await cookies()
    const rawCookie = cookieStore.get(COOKIE_NAME)?.value
    const session = rawCookie ? await verifyOtpSession(rawCookie) : null

    if (!session || session.email !== email) {
      return NextResponse.json(
        { error: 'Session not found. Please go back and request a new code.' },
        { status: 400 }
      )
    }

    // Delete the old OTP session in database
    await prisma.otpSession.delete({ where: { id: session.id } }).catch(() => {})

    const newOtp = generateOtp()
    
    // Creates a new database OTP session and returns a signed opaque token (no password stored!)
    const newToken = await signOtpSession({
      name: session.name,
      email: session.email,
      otp: newOtp,
    })

    try {
      await sendEmail({
        to: session.email,
        subject: `${newOtp} is your UdhaarClear verification code`,
        html: otpVerificationEmail({ name: session.name, otp: newOtp }),
      })
    } catch (err) {
      console.error('Failed to resend OTP email:', err)
      // Cleanup
      await prisma.otpSession.deleteMany({ where: { email } }).catch(() => {})
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set(COOKIE_NAME, newToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10,
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch (error: any) {
    console.error('OTP resend error:', error)
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
