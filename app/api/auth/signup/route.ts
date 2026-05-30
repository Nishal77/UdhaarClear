import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateOtp, signOtpSession, COOKIE_NAME } from '@/lib/auth/otp-cookie'
import { sendEmail } from '@/lib/email/client'
import { otpVerificationEmail } from '@/lib/email/templates/otp-verification'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = signupSchema.safeParse(body)

  if (!parsed.success) {
    const issues = parsed.error.issues
    const message = issues[0]?.message ?? 'Invalid input'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const { name, email, password } = parsed.data

  // Check Supabase Auth directly — the public.users table may lag or be missing
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const authCheckRes = await fetch(
    `${supabaseUrl}/auth/v1/admin/users?filter=${encodeURIComponent(email)}`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }
  )
  if (authCheckRes.ok) {
    const { users } = await authCheckRes.json()
    if (Array.isArray(users) && users.some((u: { email: string }) => u.email === email)) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }
  }

  const otp = generateOtp()
  const token = signOtpSession({ name, email, password, otp })

  // Send OTP email via Resend
  try {
    await sendEmail({
      to: email,
      subject: `${otp} is your UdhaarClear verification code`,
      html: otpVerificationEmail({ name, otp }),
    })
  } catch (err) {
    console.error('Failed to send OTP email:', err)
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }

  const response = NextResponse.json({ ok: true })

  // HTTP-only signed cookie — expires in 10 minutes
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
