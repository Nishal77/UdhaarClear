import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isOnboardingPath = path.startsWith('/onboarding')

  const isProtected =
    path.startsWith('/dashboard') ||
    path.startsWith('/customers') ||
    path.startsWith('/invoices') ||
    path.startsWith('/whatsapp-email-log') ||
    path.startsWith('/reports') ||
    path.startsWith('/settings') ||
    path.startsWith('/msme-samadhaan') ||
    path.startsWith('/analytics') ||
    path.startsWith('/team') ||
    path.startsWith('/ca')

  if (!user) {
    if (isProtected || isOnboardingPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  } else {
    // User is logged in
    const isOnboarded = user.user_metadata?.onboarded === true

    if (isOnboardingPath && isOnboarded) {
      // User is already onboarded, send them to dashboard
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    if (isProtected && !isOnboarded) {
      // User is logged in but not onboarded, send them to onboarding
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
