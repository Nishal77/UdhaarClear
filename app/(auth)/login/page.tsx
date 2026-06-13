'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { Mail, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'login' | 'otp'>('login')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  // OTP State
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(30)
  const [resending, setResending] = useState(false)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Resend OTP Countdown Timer
  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((t) => t - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [step, timer])

  // Reset OTP values and focus first input box when moving to the OTP step
  useEffect(() => {
    if (step === 'otp') {
      setOtpValues(['', '', '', '', '', ''])
      setTimer(30)
      setTimeout(() => {
        otpInputRefs.current[0]?.focus()
      }, 100)
    }
  }, [step])

  // Step 1: Submit email (requests OTP)
  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Authentication failed')
        setLoading(false)
        return
      }

      toast.success('Verification code sent to your email!')
      setStep('otp')
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Submit 6-digit OTP code to verify and sign in
  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    const otp = otpValues.join('')
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit verification code')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Verification failed')
        setLoading(false)
        return
      }

      toast.success('Welcome back to UdhaarClear!')
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      toast.error('Failed to complete login. Please try again.')
      setLoading(false)
    }
  }

  // Resend OTP code
  async function handleResendOtp() {
    if (timer > 0 || resending) return
    setResending(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to resend code')
        return
      }

      toast.success('Verification code resent successfully!')
      setTimer(30)
    } catch (err) {
      toast.error('Failed to resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  // OTP Input controls
  const handleOtpChange = (val: string, index: number) => {
    const sanitized = val.replace(/[^0-9]/g, '').slice(-1)
    const newValues = [...otpValues]
    newValues[index] = sanitized
    setOtpValues(newValues)

    if (sanitized && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        const newValues = [...otpValues]
        newValues[index - 1] = ''
        setOtpValues(newValues)
        otpInputRefs.current[index - 1]?.focus()
      } else {
        const newValues = [...otpValues]
        newValues[index] = ''
        setOtpValues(newValues)
      }
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between items-center py-12 px-4 select-none">
      
      {/* Main Container - flat white page layout */}
      <main className="w-full max-w-[420px] my-6">
        
        {/* STEP 1: EMAIL ENTRY */}
        {step === 'login' && (
          <div>
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-medium tracking-tight text-gray-950 mb-1">Sign in to UdhaarClear</h1>
              <p className="text-sm text-gray-500">Welcome back. Enter your credentials to continue</p>
            </div>

            {/* OAuth Login */}
            <div className="space-y-3">
              <GoogleButton label="Sign in with Google" />
            </div>

            {/* Divider */}
            <div className="relative my-6 select-none">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Or</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Email Field */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="business@mail.com"
                    className="block w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3.5 text-sm text-gray-950 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:border-[#ECA828] focus:outline-none transition-all font-medium"
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/15 hover:shadow-xl hover:shadow-amber-500/25 active:scale-[0.98] active:brightness-95 transition-all disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
                style={{ backgroundColor: '#ECA828' }}
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </form>

            {/* Create Account redirect */}
            <div className="mt-4 pt-3 text-center text-xs text-gray-500">
              New to UdhaarClear?{' '}
              <Link
                href="/signup"
                className="font-bold text-gray-950 underline underline-offset-2 hover:text-[#ECA828] transition-colors"
              >
                Create account
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION CARD */}
        {step === 'otp' && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            <button
              onClick={() => setStep('login')}
              className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={13} /> Back to login
            </button>

            <div className="mb-6 text-center">
              <h1 className="text-3xl font-medium tracking-tight text-gray-950 mb-2">Verify your email</h1>
              <p className="text-sm text-gray-500">
                We sent a 6-digit code to <span className="font-semibold text-gray-700">{email}</span>
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              
              {/* 6 Digit OTP Input Grid */}
              <div className="flex justify-between gap-2.5">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    id={`otp-input-${idx}`}
                    className="w-12 h-12 md:w-14 md:h-14 border border-gray-200 focus:border-[#ECA828] rounded-xl text-center text-lg font-bold outline-none transition-all bg-gray-50/50 focus:bg-white font-outfit"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || otpValues.some((v) => !v)}
                className="flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/15 hover:shadow-xl hover:shadow-amber-500/25 active:scale-[0.98] active:brightness-95 transition-all disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
                style={{ backgroundColor: '#ECA828' }}
              >
                {loading ? 'Verifying...' : 'Verify & Continue →'}
              </button>
            </form>

            {/* Resend OTP actions */}
            <div className="mt-6 text-center font-outfit">
              {timer > 0 ? (
                <span className="text-xs font-semibold text-gray-400">
                  Resend code in <span className="text-gray-600 font-bold">{timer}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-xs font-bold text-[#ECA828] hover:text-amber-600 transition-colors select-none cursor-pointer underline underline-offset-2"
                >
                  {resending ? 'Resending...' : 'Resend code'}
                </button>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Footer copyright and links */}
      <footer className="w-full max-w-[420px] text-center shrink-0">
        <p className="text-center text-xs text-gray-400 leading-relaxed mb-6 px-6">
          By using UdhaarClear, you are agreeing to our{' '}
          <Link href="/privacy" className="underline hover:text-gray-700 transition-colors font-medium">Privacy Policy</Link>{' '}
          and{' '}
          <Link href="/terms" className="underline hover:text-gray-700 transition-colors font-medium">Terms</Link>.
        </p>
        <div className="flex items-center justify-between w-full border-t border-gray-100/60 pt-5">
          <span className="text-[10px] text-gray-400 font-medium">© 2026 UdhaarClear</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors font-medium">
              Privacy Policy
            </Link>
            <Link href="/support" className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors font-medium">
              Support
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
