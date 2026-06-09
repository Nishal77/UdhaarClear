'use client'

import { createClient } from '@/lib/supabase/client'

interface MicrosoftButtonProps {
  label?: string
}

export function MicrosoftButton({ label = 'Continue with Microsoft' }: MicrosoftButtonProps) {
  async function handleClick() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      },
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors select-none"
    >
      <MicrosoftIcon />
      <span className="font-semibold text-gray-800">{label}</span>
    </button>
  )
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      {/* Top Left - Red/Orange */}
      <rect width="11" height="11" fill="#F25022" />
      {/* Top Right - Green */}
      <rect x="12" width="11" height="11" fill="#7FBA00" />
      {/* Bottom Left - Blue */}
      <rect y="12" width="11" height="11" fill="#00A4EF" />
      {/* Bottom Right - Yellow */}
      <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
    </svg>
  )
}
