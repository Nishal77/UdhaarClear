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

  // Two separate onboarding wizards share the same "onboarded" metadata
  // flag (see app/onboarding/page.tsx and app/ca/onboarding/page.tsx, both
  // call supabase.auth.updateUser({ data: { onboarded: true } }) on
  // completion) — a given account is only ever a business owner OR a CA,
  // never both, so one boolean is enough.
  const isCAOnboardingPath = path.startsWith('/ca/onboarding')
  const isBusinessOnboardingPath = path.startsWith('/onboarding')
  const isOnboardingPath = isBusinessOnboardingPath || isCAOnboardingPath

  // /ca/* other than the onboarding page itself is the CA dashboard area —
  // checked separately so a not-yet-onboarded CA gets sent to CA onboarding,
  // not the business wizard.
  const isCAProtected = path.startsWith('/ca') && !isCAOnboardingPath

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
    isCAProtected

  if (!user) {
    if (process.env.NODE_ENV === 'development') {
      return supabaseResponse
    }
    if (isProtected || isOnboardingPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  } else {
    // User is logged in
    const isOnboarded = user.user_metadata?.onboarded === true

    if (isOnboardingPath && isOnboarded) {
      // User is already onboarded, send them to dashboard (which itself
      // forwards CAs on to /ca/dashboard — see app/(dashboard)/dashboard/page.tsx)
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    if (!isOnboarded) {
      if (isCAProtected) {
        const url = request.nextUrl.clone()
        url.pathname = '/ca/onboarding'
        return NextResponse.redirect(url)
      }
      if (isProtected) {
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
