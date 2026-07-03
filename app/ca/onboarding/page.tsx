'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { OtpInput } from '@/components/auth/OtpInput'

/**
 * CA partner registration — firm details + ICAI membership, then a
 * WhatsApp OTP to confirm the phone number. On success this sets the same
 * `onboarded` flag the business wizard uses (see lib/supabase/middleware.ts
 * for why one flag covers both) and lands on /ca/dashboard.
 */
export default function CAOnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [loading, setLoading] = useState(false)

  const [firmName, setFirmName] = useState('')
  const [phone, setPhone] = useState('')
  const [icaiMembershipNumber, setIcaiMembershipNumber] = useState('')
  const [copNumber, setCopNumber] = useState('')

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/ca/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firmName: firmName.trim(),
          phone: phone.trim(),
          icaiMembershipNumber: icaiMembershipNumber.trim(),
          copNumber: copNumber.trim() || undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Registration failed')

      toast.success('Verification code sent to your WhatsApp')
      setStep('otp')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleOtpComplete(otp: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/ca/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Verification failed')

      const { error } = await supabase.auth.updateUser({ data: { onboarded: true } })
      if (error) throw error

      toast.success('Welcome to the UdhaarClear CA Partner Program!')
      router.push('/ca/dashboard')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setLoading(true)
    try {
      const res = await fetch('/api/ca/verify-otp', { method: 'PUT' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Failed to resend code')
      toast.success('New code sent')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to resend code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px]">
        {step === 'form' && (
          <>
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 mb-4">
                CA Partner Program
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">
                Become a UdhaarClear Partner
              </h1>
              <p className="text-sm text-gray-500">
                Refer clients, earn monthly payouts, help MSMEs get paid on time.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Firm name</label>
                <input
                  type="text"
                  required
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  placeholder="Sharma & Associates"
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Mobile number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-400">We'll send a verification code here via WhatsApp</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">ICAI membership no.</label>
                  <input
                    type="text"
                    required
                    value={icaiMembershipNumber}
                    onChange={(e) => setIcaiMembershipNumber(e.target.value)}
                    placeholder="123456"
                    className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    COP number <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={copNumber}
                    onChange={(e) => setCopNumber(e.target.value)}
                    placeholder="COP12345"
                    className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-500 leading-relaxed">
                Your membership number is checked against the ICAI directory. Most registrations activate immediately; a small number get a manual review from our team first.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-semibold text-white transition-all disabled:opacity-55 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#262624' }}
              >
                {loading ? 'Submitting...' : 'Continue →'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-400">
              Registering a business instead?{' '}
              <Link href="/onboarding" className="font-semibold text-gray-700 hover:text-gray-900">
                Go to business onboarding
              </Link>
            </p>
          </>
        )}

        {step === 'otp' && (
          <div className="text-center">
            <button
              onClick={() => setStep('form')}
              className="mb-6 inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Back
            </button>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">Verify your WhatsApp number</h1>
            <p className="text-sm text-gray-500 mb-8">
              We sent a 6-digit code to <span className="font-semibold text-gray-700">{phone}</span>
            </p>

            <div className="flex justify-center">
              <OtpInput onComplete={handleOtpComplete} disabled={loading} />
            </div>

            {loading && <p className="mt-5 text-xs text-amber-600 font-semibold animate-pulse">Verifying...</p>}

            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="mt-8 text-sm font-semibold text-gray-700 hover:text-gray-900 underline underline-offset-2 disabled:opacity-50"
            >
              Resend code
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
