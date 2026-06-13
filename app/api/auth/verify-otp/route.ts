import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateOtp, verifyOtpSession, signOtpSession, COOKIE_NAME } from '@/lib/auth/otp-cookie'
import { sendEmail } from '@/lib/email/client'
import { otpVerificationEmail } from '@/lib/email/templates/otp-verification'
import { prisma } from '@/lib/prisma/client'
import { cookies } from 'next/headers'

const verifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
})

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = verifySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { email, otp } = parsed.data

  // Read and verify signed OTP cookie
  const cookieStore = await cookies()
  const rawCookie = cookieStore.get(COOKIE_NAME)?.value

  if (!rawCookie) {
    return NextResponse.json(
      { error: 'Session expired. Please request a new code.' },
      { status: 400 }
    )
  }

  const session = verifyOtpSession(rawCookie)

  if (!session) {
    return NextResponse.json(
      { error: 'Session expired. Please request a new code.' },
      { status: 400 }
    )
  }

  if (session.email !== email) {
    return NextResponse.json({ error: 'Email mismatch' }, { status: 400 })
  }

  if (session.otp !== otp) {
    return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 })
  }

  // Create auth user via admin — email pre-confirmed, Supabase sends no email
  const adminClient = await createServiceClient()
  const randomImgIndex = Math.floor(Math.random() * 10) + 1
  const defaultAvatar = `/profile/img${randomImgIndex}.jpeg`
  const { data: authData, error: createError } = await adminClient.auth.admin.createUser({
    email: session.email,
    password: session.password,
    email_confirm: true,
    user_metadata: { name: session.name, avatar_url: defaultAvatar },
  })

  if (createError || !authData.user) {
    if (createError?.message?.includes('already been registered')) {
      // Auth user exists (e.g. prior partial signup) — attempt sign-in with stored creds
      const userClient = await createClient()
      const { data: signInData, error: signInError } = await userClient.auth.signInWithPassword({
        email: session.email,
        password: session.password,
      })
      if (!signInError && signInData.session) {
        cookieStore.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
        return NextResponse.json({ ok: true })
      }
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 409 }
      )
    }
    console.error('Supabase createUser error:', createError)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }

  // Create DB user + default business record
  try {
    const existing = await prisma.user.findUnique({ where: { supabaseId: authData.user.id } })
    if (!existing) {
      await prisma.user.create({
        data: {
          supabaseId: authData.user.id,
          email: session.email,
          name: session.name,
          ownedBusiness: {
            create: {
              name: session.name,
              phone: '',
              email: session.email,
            },
          },
        },
      })
    }
  } catch (dbErr) {
    console.error('DB user creation error:', dbErr)
    // Non-fatal — user can update business info in settings
  }

  // Sign in using regular SSR client — it sets session cookies on the response via next/headers
  const userClient = await createClient()
  const { data: signInData, error: signInError } = await userClient.auth.signInWithPassword({
    email: session.email,
    password: session.password,
  })

  if (signInError || !signInData.session) {
    console.error('Sign-in after create failed:', signInError)
    return NextResponse.json(
      { error: 'Account created. Please sign in manually.' },
      { status: 500 }
    )
  }

  // Clear OTP cookie on success
  cookieStore.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })

  return NextResponse.json({ ok: true })
}

// Resend — regenerates OTP, refreshes cookie, re-sends email
export async function PUT(request: Request) {
  const { email } = await request.json()

  const cookieStore = await cookies()
  const rawCookie = cookieStore.get(COOKIE_NAME)?.value
  const session = rawCookie ? verifyOtpSession(rawCookie) : null

  if (!session || session.email !== email) {
    return NextResponse.json(
      { error: 'Session not found. Please go back and sign up again.' },
      { status: 400 }
    )
  }

  const newOtp = generateOtp()
  const newToken = signOtpSession({
    name: session.name,
    email: session.email,
    password: session.password,
    otp: newOtp,
  })

  await sendEmail({
    to: session.email,
    subject: `${newOtp} is your UdhaarClear verification code`,
    html: otpVerificationEmail({ name: session.name, otp: newOtp }),
  })

  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, newToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
