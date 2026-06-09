'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { AuthLogo } from '@/components/auth/AuthLogo'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { MicrosoftButton } from '@/components/auth/MicrosoftButton'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Submit email step
  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address')
      return
    }
    setStep('password')
  }

  // Submit password and sign in
  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        toast.error(error.message ?? 'Sign-in failed')
        setLoading(false)
        return
      }

      toast.success('Welcome back to UdhaarClear!')
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      toast.error('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between items-center py-12 px-4 select-none">
      

      {/* Main Container - borderless, shadowless, flat white page layout */}
      <main className="w-full max-w-[420px] my-6">
        
        {/* STEP 1: EMAIL */}
        {step === 'email' && (
          <div>
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-medium tracking-tight text-gray-950 mb-1">Sign in to UdhaarClear</h1>
              <p className="text-sm text-gray-500">Welcome back. Enter your credentials to continue</p>
            </div>

            {/* OAuth Login */}
            <div className="space-y-3">
              <GoogleButton label="Sign in with Google" />
              <MicrosoftButton label="Sign in with Microsoft" />
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
                    className="block w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3.5 text-sm text-gray-950 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:border-[#ECA828] focus:outline-none transition-all font-medium"
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/15 hover:shadow-xl hover:shadow-amber-500/25 active:scale-[0.98] active:brightness-95 transition-all cursor-pointer"
                style={{ backgroundColor: '#ECA828' }}
              >
                Sign in with email
              </button>
            </form>

            {/* SSO Link */}
            <div className="mt-5 text-center">
              <Link
                href="/login"
                className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
              >
                Use single sign-on
              </Link>
            </div>

            {/* Create Account redirect */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-500">
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

        {/* STEP 2: PASSWORD */}
        {step === 'password' && (
          <div>
            <button
              onClick={() => setStep('email')}
              className="mb-6 inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-950 transition-colors"
            >
              ← Back to email
            </button>

            <div className="mb-6">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 mb-1">Enter your password</h1>
              <p className="text-sm text-gray-500 truncate max-w-sm">
                Signing in as <span className="font-semibold text-gray-700">{email}</span>
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="minimum 8 characters"
                    className="block w-full rounded-xl border border-gray-200 pl-10 pr-11 py-3.5 text-sm text-gray-950 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:border-[#ECA828] focus:outline-none focus:ring-4 focus:ring-amber-100/50 transition-all font-medium"
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
                className="mt-2 flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/15 hover:shadow-xl hover:shadow-amber-500/25 active:scale-[0.98] active:brightness-95 transition-all disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
                style={{ backgroundColor: '#ECA828' }}
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="mt-5 text-center">
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-gray-500 hover:text-[#ECA828] underline underline-offset-2 transition-colors"
              >
                Forgot password?
              </Link>
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
