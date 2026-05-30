'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { AuthLogo } from '@/components/auth/AuthLogo'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { AppleButton } from '@/components/auth/AppleButton'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-10 py-6">
        <AuthLogo />
        <p className="text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold text-gray-900 underline underline-offset-2 hover:text-amber-600 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </header>

      {/* Form area */}
      <main className="flex flex-1 items-center justify-center px-8">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back to UdhaarClear!</h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Please enter your details to sign in to your account
            </p>
          </div>

          {/* OAuth buttons */}
          <div className="space-y-3">
            <GoogleButton />
            <AppleButton />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-gray-400">Or sign in with</span>
            </div>
          </div>

          {/* Email & password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@mail.com"
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="minimum 8 characters"
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{ backgroundColor: '#ECA828' }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-gray-700 underline underline-offset-2 hover:text-amber-600 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
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
