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
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Firm name <span className="text-red-500">*</span>
                </label>
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
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Mobile number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center rounded-xl border border-gray-200 focus-within:border-gray-600 transition-colors bg-white">
                  <div className="flex items-center gap-1.5 pl-3.5 pr-2.5 py-3 border-r border-gray-200 select-none shrink-0 text-sm font-medium text-gray-500">
                    <span className="text-[15px] filter saturate-[0.85]">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="block w-full bg-transparent px-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none rounded-r-xl"
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1.5 font-normal">
                  <svg className="w-3.5 h-3.5 text-emerald-500 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.718-1.463L0 24zm6.59-4.846c1.6.95 3.16 1.449 4.805 1.451 5.432.003 9.85-4.412 9.852-9.845.002-2.63-1.023-5.101-2.887-6.968C16.552 1.905 14.083.882 11.455.882 6.023.882 1.605 5.298 1.603 10.732c-.001 1.676.439 3.313 1.272 4.767L1.87 21.053l5.777-1.517v.001zm10.777-7.455c-.29-.145-1.72-.848-1.986-.944-.267-.097-.46-.145-.654.145-.193.291-.748.944-.919 1.138-.17.194-.34.219-.63.073-.29-.145-1.229-.453-2.34-1.444-.863-.77-1.446-1.72-1.615-2.012-.17-.291-.018-.448.127-.592.13-.13.29-.34.436-.509.145-.17.194-.291.291-.485.097-.194.049-.364-.025-.509-.073-.146-.654-1.576-.897-2.158-.236-.569-.475-.492-.654-.501-.17-.008-.364-.01-.557-.01-.194 0-.509.073-.776.364-.267.29-1.02 1.02-1.02 2.487 0 1.467 1.067 2.885 1.213 3.079.145.194 2.1 3.206 5.088 4.496.71.307 1.264.49 1.696.629.713.227 1.36.195 1.871.118.571-.085 1.72-.704 1.962-1.383.243-.679.243-1.261.17-1.383-.074-.122-.267-.195-.557-.34z"/>
                  </svg>
                  <span>We'll send a verification code here via WhatsApp</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    ICAI membership no <span className="text-red-500">*</span>
                  </label>
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

              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-600 tracking-tight leading-relaxed">
               Note: Your membership number is checked against the ICAI directory. Most registrations activate immediately; a small number get a manual review from our team first.
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

            <p className="mt-6 text-center text-xs text-gray-400 tracking-tight">
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
