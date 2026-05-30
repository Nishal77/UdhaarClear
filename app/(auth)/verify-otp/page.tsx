'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { AuthLogo } from '@/components/auth/AuthLogo'
import { OtpInput } from '@/components/auth/OtpInput'

const RESEND_COOLDOWN = 60

function VerifyOtpContent() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get('email') ?? ''

  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) {
      setCanResend(true)
      return
    }
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleOtpComplete = useCallback(
    async (otp: string) => {
      if (!email) {
        toast.error('Email missing. Please go back and try again.')
        return
      }

      setLoading(true)

      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Verification failed')
        setLoading(false)
        return
      }

      toast.success('Email verified! Welcome to UdhaarClear.')
      router.push('/dashboard')
      router.refresh()
    },
    [email, router]
  )

  async function handleResend() {
    if (!canResend || !email) return

    const res = await fetch('/api/auth/verify-otp', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error ?? 'Failed to resend code')
      return
    }

    toast.success('New code sent to your email')
    setCanResend(false)
    setCooldown(RESEND_COOLDOWN)
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-10 py-6">
        <AuthLogo />
        <Link
          href="/signup"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to sign up
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-8">
        <div className="w-full max-w-[400px] text-center">
          {/* Mail icon */}
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: '#FEF3C7' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                stroke="#ECA828"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
          <p className="mt-2 text-sm text-gray-500">We sent a 6-digit code to</p>
          <p className="mt-0.5 text-sm font-semibold text-gray-800">{email || 'your email'}</p>

          <div className="mt-8 flex justify-center">
            <OtpInput onComplete={handleOtpComplete} disabled={loading} />
          </div>

          {loading && <p className="mt-5 text-sm text-gray-400">Verifying...</p>}

          <div className="mt-7">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm font-semibold text-gray-900 underline underline-offset-2 hover:text-amber-600 transition-colors"
              >
                Resend code
              </button>
            ) : (
              <p className="text-sm text-gray-400">
                Resend code in{' '}
                <span className="font-semibold text-gray-600">{cooldown}s</span>
              </p>
            )}
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Check your spam folder if you don&apos;t see it
          </p>
        </div>
      </main>

      <footer className="flex items-center justify-between px-10 py-5">
        <span className="text-xs text-gray-400">© 2024 UdhaarClear</span>
        <div className="flex gap-5">
          <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/support" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Support
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-white text-gray-500 font-medium">
        Loading...
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  )
}
