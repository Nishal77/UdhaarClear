import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateOtp, signOtpSession, COOKIE_NAME } from '@/lib/auth/otp-cookie'
import { sendEmail } from '@/lib/email/client'
import { otpVerificationEmail } from '@/lib/email/templates/otp-verification'
import { prisma } from '@/lib/prisma/client'

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

    // 1. Verify user exists in the database
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email. Please sign up instead.' },
        { status: 404 }
      )
    }

    // 2. Generate custom 6-digit OTP
    const otp = generateOtp()

    // 3. Send branded email using Resend
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

    // 4. Create and set OTP session cookie
    // Since we generate the link on verify, we don't need a tokenHash here yet
    const token = signOtpSession({
      name: user.name,
      email,
      password: '', // tokenHash will be generated on login-verify
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
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
