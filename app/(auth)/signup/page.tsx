'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { AuthLogo } from '@/components/auth/AuthLogo'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { MicrosoftButton } from '@/components/auth/MicrosoftButton'
import { OtpInput } from '@/components/auth/OtpInput'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

const RESEND_COOLDOWN = 60

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'password' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)
  const [canResend, setCanResend] = useState(false)

  // Resend Timer countdown
  useEffect(() => {
    if (step !== 'otp') return
    if (cooldown <= 0) {
      setCanResend(true)
      return
    }
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown, step])

  // Email form submit
  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address')
      return
    }
    setStep('password')
  }

  // Password form submit -> sends OTP
  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Something went wrong')
        setLoading(false)
        return
      }

      toast.success('Verification code sent to your email')
      setCooldown(RESEND_COOLDOWN)
      setCanResend(false)
      setStep('otp')
    } catch (err) {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // OTP complete verify
  const handleOtpComplete = useCallback(
    async (otp: string) => {
      setLoading(true)
      try {
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

        toast.success('Account created! Welcome to UdhaarClear.')
        router.push('/dashboard')
        router.refresh()
      } catch (err) {
        toast.error('An error occurred during verification.')
        setLoading(false)
      }
    },
    [email, router]
  )

  // Resend OTP trigger
  async function handleResend() {
    if (!canResend || !email) return

    setLoading(true)
    try {
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
    } catch (err) {
      toast.error('Failed to resend code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] min-h-screen bg-white">
      
      {/* Left side: Form Panel */}
      <div className="flex flex-col justify-between p-6 md:p-10 min-h-screen">
        
        {/* Header - logo on top left, no right links */}
        <header className="flex items-center justify-start w-full max-w-[420px] mx-auto shrink-0">
          <AuthLogo />
        </header>

        {/* Form Main Area */}
        <main className="flex flex-col justify-center items-center flex-grow py-8 w-full max-w-[420px] mx-auto">
          <div className="w-full">
            
            {/* STEP 1: EMAIL */}
            {step === 'email' && (
              <div>
                <div className="mb-6">
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1">Create your account</h1>
                  <p className="text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="font-bold text-gray-900 underline underline-offset-2 hover:text-[#ECA828] transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>

                {/* OAuth Login */}
                <div className="space-y-3">
                  <GoogleButton label="Sign up with Google" />
                  <MicrosoftButton label="Sign up with Microsoft" />
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

                {/* Form */}
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="business@mail.com"
                        className="block w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#ECA828] focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all font-medium"
                      />
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold text-white shadow-md shadow-amber-500/10 hover:shadow-lg active:scale-[0.98] transition-all"
                    style={{ backgroundColor: '#ECA828' }}
                  >
                    Continue with email
                  </button>
                </form>

                <p className="mt-6 text-center text-xs text-gray-400 leading-relaxed">
                  By using UdhaarClear, you are agreeing to our{' '}
                  <Link href="/privacy" className="underline hover:text-gray-700 transition-colors font-medium">Privacy Policy</Link>{' '}
                  and{' '}
                  <Link href="/terms" className="underline hover:text-gray-700 transition-colors font-medium">Terms</Link>.
                </p>
              </div>
            )}

            {/* STEP 2: PASSWORD */}
            {step === 'password' && (
              <div>
                <button
                  onClick={() => setStep('email')}
                  className="mb-6 inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  ← Change email
                </button>

                <div className="mb-6">
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1">Choose your password</h1>
                  <p className="text-sm text-gray-500 truncate max-w-sm">
                    Setting up credentials for <span className="font-semibold text-gray-700">{email}</span>
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="minimum 8 characters"
                        className="block w-full rounded-xl border border-gray-200 pl-10 pr-11 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#ECA828] focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all font-medium"
                      />
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold text-white shadow-md shadow-amber-500/10 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-55 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#ECA828' }}
                  >
                    {loading ? 'Submitting...' : 'Create account →'}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 3: OTP */}
            {step === 'otp' && (
              <div className="text-center">
                <button
                  onClick={() => setStep('email')}
                  className="mb-6 inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors self-start"
                >
                  ← Go back
                </button>

                {/* Mail envelope icon */}
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 shadow-inner border border-amber-100/50">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      stroke="#ECA828"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1">Check your email</h1>
                <p className="text-sm text-gray-500">We sent a 6-digit confirmation code to</p>
                <p className="mt-1 text-sm font-bold text-gray-800 break-all">{email}</p>

                <div className="mt-8 flex justify-center">
                  <OtpInput onComplete={handleOtpComplete} disabled={loading} />
                </div>

                {loading && <p className="mt-5 text-xs text-amber-500 font-bold animate-pulse">Verifying code...</p>}

                <div className="mt-8 text-xs select-none">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="font-bold text-gray-900 underline underline-offset-2 hover:text-[#ECA828] transition-colors"
                    >
                      Resend code
                    </button>
                  ) : (
                    <p className="text-gray-400">
                      Resend code in{' '}
                      <span className="font-bold text-gray-600">{cooldown}s</span>
                    </p>
                  )}
                </div>

                <p className="mt-4 text-[10px] text-gray-400">
                  Check your spam/updates folder if you don&apos;t see the message
                </p>
              </div>
            )}

          </div>
        </main>

        {/* Empty bottom space to align form center, no duplicate footer */}
        <div className="h-10 shrink-0" />

      </div>

      {/* Right side: Aesthetic Panel (Desktop only) with white container padding/margin */}
      <div className="hidden lg:block p-3 lg:p-4 bg-white h-screen overflow-hidden shrink-0">
        <div 
          className="relative w-full h-full rounded-[40px] overflow-hidden flex flex-col justify-between items-center py-16 px-12 text-center select-none border border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
          style={{
            backgroundImage: "url('/images/signup_bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Soft background dark overlay */}
          <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />

          {/* Client Logos Row */}
          <div className="relative z-10 w-full flex items-center justify-between gap-6 opacity-90 select-none px-6 shrink-0">
            {/* Bombas */}
            <span className="text-white font-extrabold tracking-widest uppercase text-[14px] drop-shadow-sm font-sans flex items-center gap-1.5">
              <svg className="w-4.5 h-4.5 text-white fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              BOMBAS
            </span>
            {/* The Athletic */}
            <span className="text-white font-black italic tracking-tight text-[16px] drop-shadow-sm font-serif">
              The Athletic
            </span>
            {/* Domino's */}
            <span className="text-white font-bold tracking-tight text-[15px] drop-shadow-sm font-sans flex items-center gap-1 shrink-0">
              <span className="w-3.5 h-3.5 bg-white rounded-sm inline-block rotate-45 shrink-0 shadow-inner" /> Domino&apos;s
            </span>
            {/* Wayfair */}
            <span className="text-white font-bold tracking-widest text-[15px] drop-shadow-sm font-sans lowercase">
              wayfair
            </span>
            {/* Berkeley */}
            <span className="text-white font-semibold tracking-wide text-[15px] drop-shadow-sm font-serif flex items-center gap-1.5">
              <svg className="w-4 h-4 text-white fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2L2 22h20L12 2zm0 4l6.5 13h-13L12 6z" />
              </svg>
              Berkeley
            </span>
          </div>

          {/* Floating Mockup Browser Window - Translucent & Glassmorphic */}
          <div className="relative z-10 w-full max-w-[680px] bg-white/15 backdrop-blur-2xl border border-white/30 rounded-t-3xl shadow-[0_40px_90px_rgba(0,0,0,0.28)] overflow-hidden flex flex-col transform translate-y-16 transition-all duration-300 hover:translate-y-10 hover:shadow-[0_50px_110px_rgba(0,0,0,0.32)] group/browser">
            
            {/* Mockup Title bar */}
            <div className="bg-black/15 border-b border-white/15 px-5 py-3.5 flex items-center justify-between shrink-0 select-none">
              
              {/* Tabs & Controls */}
              <div className="flex items-center gap-5">
                {/* Window Dots */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/80 block" />
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-2.5 text-white/40 shrink-0">
                  <span className="text-[11px] font-bold select-none cursor-default hover:text-white/60">‹</span>
                  <span className="text-[11px] font-bold select-none cursor-default hover:text-white/60">›</span>
                  <span className="text-[9px] font-bold select-none cursor-default hover:text-white/60">↻</span>
                </div>

                {/* Mock Tabs */}
                <div className="flex items-center gap-1.5 bg-black/20 p-0.5 rounded-xl shrink-0">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-md text-[10px] text-white font-medium shadow-sm">
                    {/* App Icon */}
                    <svg className="w-3.5 h-3.5 text-amber-300 fill-current" viewBox="0 0 24 24">
                      <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                    </svg>
                    <span>App</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-white/50 font-medium hover:text-white/80 transition-colors">
                    {/* Forms Icon */}
                    <svg className="w-3.5 h-3.5 text-blue-300 fill-current" viewBox="0 0 24 24">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                    </svg>
                    <span>Forms</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-white/50 font-medium hover:text-white/80 transition-colors">
                    {/* Database Icon */}
                    <svg className="w-3.5 h-3.5 text-green-300 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C7.58 2 4 3.79 4 6v4c0 2.21 3.58 4 8 4s8-1.79 8-4V6c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.43 6 2s-2.13 2-6 2-6-1.43-6-2 2.13-2 6-2zm0 10c-3.87 0-6-1.43-6-2v-1.5c1.47 1.25 3.65 1.5 6 1.5s4.53-.25 6-1.5V12c0 .57-2.13 2-6 2zm0 4c-3.87 0-6-1.43-6-2v-1.5c1.47 1.25 3.65 1.5 6 1.5s4.53-.25 6-1.5V16c0 .57-2.13 2-6 2z" />
                    </svg>
                    <span>Database</span>
                  </div>
                </div>
              </div>

              {/* Address Bar */}
              <div className="flex items-center gap-1.5 bg-black/15 border border-white/10 rounded-xl px-3.5 py-1 text-[10px] text-white/70 font-mono w-full max-w-[220px] shadow-inner shrink-0">
                <svg className="w-3 h-3 text-white/60 fill-current" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
                <span>app.udhaarclear.com</span>
              </div>
              
            </div>
            
            {/* Mock Layout Body */}
            <div className="flex flex-1 min-h-0 text-left">
              
              {/* Mock Sidebar - Glassmorphic Dark */}
              <div className="w-[150px] border-r border-white/10 bg-black/10 backdrop-blur-md p-4 flex flex-col justify-between shrink-0 select-none">
                <div className="space-y-6">
                  {/* Brand */}
                  <div className="flex items-center gap-2">
                    <div className="w-5.5 h-5.5 rounded bg-amber-500 flex items-center justify-center text-white font-extrabold text-[11px] shadow-sm">
                      ₹
                    </div>
                    <span className="text-[11px] font-bold text-white tracking-wide">UdhaarClear</span>
                  </div>
                  {/* Links */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <div className="h-2 w-14 bg-white/70 rounded" />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div className="h-2 w-16 bg-white/20 rounded" />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <div className="h-2 w-12 bg-white/20 rounded" />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      <div className="h-2 w-20 bg-white/20 rounded" />
                    </div>
                  </div>
                </div>
                
                {/* Bottom Sidebar settings */}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                  <div className="h-2 w-10 bg-white/20 rounded" />
                </div>
              </div>
              
              {/* Mock Content Area - Glassmorphic White */}
              <div className="flex-grow bg-white/70 backdrop-blur-md p-6 space-y-5 select-none">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                  <span>Dashboard</span>
                  <span>/</span>
                  <span className="text-gray-500">Payments</span>
                </div>

                {/* Title & Stats */}
                <div className="flex justify-between items-center">
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 bg-gray-300 rounded" />
                    <div className="h-2.5 w-44 bg-gray-200/70 rounded" />
                  </div>
                  {/* Status chip with pulsing green dot */}
                  <div className="h-5 px-2.5 bg-green-500/10 text-green-700 font-bold text-[9px] flex items-center gap-1.5 rounded-full border border-green-500/20 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Active
                  </div>
                </div>
                
                {/* Fake Table Records with colored indicator progress tracks */}
                <div className="space-y-3 pt-2">
                  
                  {/* Row 1: Green progress indicator */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center text-[10px] font-bold">✓</span>
                      <div className="space-y-1">
                        <div className="h-2.5 w-20 bg-gray-300 rounded" />
                        <div className="h-1.5 w-12 bg-gray-100 rounded" />
                      </div>
                    </div>
                    {/* Progress Track */}
                    <div className="h-1.5 w-20 bg-gray-200/50 rounded-full overflow-hidden shrink-0">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  
                  {/* Row 2: Orange progress indicator */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center text-[10px] font-bold">!</span>
                      <div className="space-y-1">
                        <div className="h-2.5 w-24 bg-gray-300 rounded" />
                        <div className="h-1.5 w-10 bg-gray-100 rounded" />
                      </div>
                    </div>
                    {/* Progress Track */}
                    <div className="h-1.5 w-20 bg-gray-200/50 rounded-full overflow-hidden shrink-0">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: '55%' }} />
                    </div>
                  </div>

                  {/* Row 3: Yellow progress indicator */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-yellow-500/10 text-yellow-600 flex items-center justify-center text-[10px] font-bold">?</span>
                      <div className="space-y-1">
                        <div className="h-2.5 w-16 bg-gray-300 rounded" />
                        <div className="h-1.5 w-12 bg-gray-100 rounded" />
                      </div>
                    </div>
                    {/* Progress Track */}
                    <div className="h-1.5 w-20 bg-gray-200/50 rounded-full overflow-hidden shrink-0">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '35%' }} />
                    </div>
                  </div>

                  {/* Row 4: Blue progress indicator */}
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center text-[10px] font-bold">i</span>
                      <div className="space-y-1">
                        <div className="h-2.5 w-22 bg-gray-300 rounded" />
                        <div className="h-1.5 w-8 bg-gray-100 rounded" />
                      </div>
                    </div>
                    {/* Progress Track */}
                    <div className="h-1.5 w-20 bg-gray-200/50 rounded-full overflow-hidden shrink-0">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
