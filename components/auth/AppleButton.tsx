'use client'

import { createClient } from '@/lib/supabase/client'

interface AppleButtonProps {
  label?: string
}

export function AppleButton({ label = 'Continue with Apple' }: AppleButtonProps) {
  async function handleClick() {
    const supabase = createClient()
    // Requires Apple OAuth configured in Supabase Auth > Providers > Apple
    await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      },
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
    >
      <AppleIcon />
      {label}
    </button>
  )
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.275 9.552c-.013-1.7.742-2.99 2.266-3.942-.853-1.218-2.137-1.89-3.834-2.03-1.602-.136-3.352.938-3.99.938-.67 0-2.22-.896-3.42-.896C1.97 3.662 0 5.174 0 8.26c0 .93.17 1.89.508 2.879.454 1.297 2.09 4.478 3.793 4.426.745-.018 1.272-.53 2.644-.53 1.327 0 1.8.53 2.674.53 1.719-.025 3.202-2.916 3.634-4.216-.023-.01-2.978-1.19-2.978-4.797zM10.648 2.31C11.88 0.86 11.764-.007 11.73 0 10.7.067 9.497.69 8.805 1.553c-.647.8-1.207 2.07-1.054 3.297 1.129.086 2.27-.555 2.897-2.54z"
        fill="#000"
      />
    </svg>
  )
}
