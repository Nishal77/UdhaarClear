import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateOtp, signOtpSession, COOKIE_NAME } from '@/lib/auth/otp-cookie'
import { sendEmail } from '@/lib/email/client'
import { otpVerificationEmail } from '@/lib/email/templates/otp-verification'
import { getClientIp, checkRateLimit } from '@/lib/auth/rate-limit'
import { prisma } from '@/lib/prisma/client'
import { createServiceClient } from '@/lib/supabase/server'
import fs from 'fs'
import path from 'path'

// OTP-only signup — no passwords anywhere in the auth flow. Email is
// validated server-side here (Zod format check) and again by Supabase when
// the auth user is created; the client-side regex is never the only gate.
const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email'),
  name: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      const issues = parsed.error.issues
      const message = issues[0]?.message ?? 'Invalid input'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const { email } = parsed.data
    const name = parsed.data.name || email.split('@')[0]

    const ip = await getClientIp()

    // 1. Enforce IP-based rate limiting (max 10 requests per 10 minutes)
    const ipLimit = await checkRateLimit(`rate_limit:signup:ip:${ip}`, 10, 10 * 60 * 1000)
    if (!ipLimit.ok) {
      return NextResponse.json(
        { error: 'Too many requests from this device. Please try again in 10 minutes.' },
        { status: 429 }
      )
    }

    // 2. Enforce email-based rate limiting (max 5 requests per 10 minutes)
    const emailLimit = await checkRateLimit(`rate_limit:signup:email:${email}`, 5, 10 * 60 * 1000)
    if (!emailLimit.ok) {
      return NextResponse.json(
        { error: 'Too many verification code requests for this email. Please try again in 10 minutes.' },
        { status: 429 }
      )
    }

    // Check Supabase Auth directly to see if the email already exists
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

    let existingUser: any = null
    if (authCheckRes.ok) {
      const { users } = await authCheckRes.json()
      existingUser = Array.isArray(users) ? users.find((u: { email: string }) => u.email === email) : null
    }

    if (existingUser && existingUser.email_confirmed_at) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // 3. Resolve dynamic avatar
    let defaultAvatar = '/profile/img1.jpeg'
    try {
      const dir = path.join(process.cwd(), 'public', 'profile')
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir)
        const matching = files.filter(f => f.startsWith('img') && (f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png')))
        if (matching.length > 0) {
          const randomIndex = Math.floor(Math.random() * matching.length)
          defaultAvatar = `/profile/${matching[randomIndex]}`
        }
      }
    } catch (err) {
      console.error('Failed to resolve dynamic avatar:', err)
    }

    const adminClient = await createServiceClient()

    // 4. Create or update unconfirmed user record in Supabase immediately
    if (existingUser) {
      // Refresh display metadata in case the name/avatar changed. No password
      // is ever set — this is an OTP-only account.
      const { error: updateError } = await adminClient.auth.admin.updateUserById(existingUser.id, {
        user_metadata: { name, avatar_url: defaultAvatar },
      })
      if (updateError) {
        console.error('Failed to update unconfirmed user details:', updateError)
        return NextResponse.json({ error: 'Failed to update account details' }, { status: 500 })
      }
    } else {
      // Create new unconfirmed, passwordless auth user in Supabase. Auth
      // happens entirely via the emailed OTP → magiclink token in verify-otp.
      const { error: createError } = await adminClient.auth.admin.createUser({
        email,
        email_confirm: false, // starts unconfirmed
        user_metadata: { name, avatar_url: defaultAvatar },
      })
      if (createError) {
        console.error('Supabase createUser error:', createError)
        return NextResponse.json({ error: 'Failed to create account profile' }, { status: 500 })
      }
    }

    // 5. Clean up any existing OTP sessions for this email to prevent reuse
    await prisma.otpSession.deleteMany({
      where: { email },
    })

    const otp = generateOtp()
    
    // 6. Create and set OTP session cookie (no password stored!)
    const token = await signOtpSession({ name, email, otp })

    // Send OTP email via Resend
    try {
      await sendEmail({
        to: email,
        subject: `${otp} is your UdhaarClear verification code`,
        html: otpVerificationEmail({ name, otp }),
      })
    } catch (err) {
      console.error('Failed to send OTP email:', err)
      // Cleanup OTP session
      await prisma.otpSession.deleteMany({ where: { email } }).catch(() => {})
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
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
