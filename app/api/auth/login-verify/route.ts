import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { verifyOtpSession, COOKIE_NAME } from '@/lib/auth/otp-cookie'
import { cookies } from 'next/headers'

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

    // Read and verify custom OTP session cookie
    const cookieStore = await cookies()
    const rawCookie = cookieStore.get(COOKIE_NAME)?.value

    if (!rawCookie) {
      return NextResponse.json(
        { error: 'Session expired or not found. Please try signing in again.' },
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
      return NextResponse.json({ error: 'Incorrect verification code. Please try again.' }, { status: 400 })
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

    // Clear OTP cookie
    cookieStore.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('OTP login verification error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
