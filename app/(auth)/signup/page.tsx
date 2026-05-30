'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { AuthLogo } from '@/components/auth/AuthLogo'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { AppleButton } from '@/components/auth/AppleButton'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error ?? 'Something went wrong')
      setLoading(false)
      return
    }

    // OTP sent — redirect to verify page
    toast.success('Code sent to your email')
    router.push(`/verify-otp?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-10 py-6">
        <AuthLogo />
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-gray-900 underline underline-offset-2 hover:text-amber-600 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </header>

      <main className="flex flex-1 items-center justify-center px-8 py-4">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="mt-1.5 text-sm text-gray-500">Free to start — no credit card required</p>
          </div>

          <div className="space-y-3">
            <GoogleButton label="Sign up with Google" />
            <AppleButton label="Sign up with Apple" />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-gray-400">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rajesh Sharma"
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>

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
                  minLength={8}
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
              className="mt-1 flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{ backgroundColor: '#ECA828' }}
            >
              {loading ? 'Sending code...' : 'Continue →'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-400">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="underline underline-offset-2 hover:text-gray-600">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-gray-600">
              Privacy Policy
            </Link>
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
