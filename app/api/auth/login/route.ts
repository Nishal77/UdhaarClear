import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateOtp, signOtpSession, COOKIE_NAME } from '@/lib/auth/otp-cookie'
import { sendEmail } from '@/lib/email/client'
import { otpVerificationEmail } from '@/lib/email/templates/otp-verification'
import { prisma } from '@/lib/prisma/client'
import { getClientIp, checkRateLimit } from '@/lib/auth/rate-limit'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const { email } = parsed.data

    const ip = await getClientIp()

    // 1. Enforce IP-based rate limiting (max 10 requests per 10 minutes)
    const ipLimit = await checkRateLimit(`rate_limit:login:ip:${ip}`, 10, 10 * 60 * 1000)
    if (!ipLimit.ok) {
      return NextResponse.json(
        { error: 'Too many requests from this device. Please try again in 10 minutes.' },
        { status: 429 }
      )
    }

    // 2. Enforce email-based rate limiting (max 5 requests per 10 minutes)
    const emailLimit = await checkRateLimit(`rate_limit:login:email:${email}`, 5, 10 * 60 * 1000)
    if (!emailLimit.ok) {
      return NextResponse.json(
        { error: 'Too many verification code requests for this email. Please try again in 10 minutes.' },
        { status: 429 }
      )
    }

    // 3. Verify user exists in the database
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email. Please sign up instead.' },
        { status: 404 }
      )
    }

    // 4. Invalidate/delete any previous active OTP sessions for this email to prevent reuse
    await prisma.otpSession.deleteMany({
      where: { email },
    })

    // 5. Generate custom 6-digit OTP
    const otp = generateOtp()

    // 6. Send branded email using Resend
    try {
      await sendEmail({
        to: email,
        subject: `${otp} is your UdhaarClear verification code`,
        html: otpVerificationEmail({ name: user.name, otp }),
      })
    } catch (err) {
      console.error('Failed to send login OTP email:', err)
      return NextResponse.json(
        { error: 'Failed to send verification code. Please try again.' },
        { status: 500 }
      )
    }

    // 7. Create and set OTP session cookie
    const token = await signOtpSession({
      name: user.name,
      email,
      otp,
    })

    const response = NextResponse.json({ ok: true, message: 'Verification code sent.' })

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10, // 10 minutes
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
