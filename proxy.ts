import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { REFERRAL_COOKIE_NAME, REFERRAL_COOKIE_MAX_AGE_SECONDS } from '@/lib/ca/referral'

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow standard public files, static assets, and API requests to pass through
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/wishlist')
  ) {
    const response = await updateSession(request)

    // Capture a CA's referral code from `?ref=` on the way through
    const ref = request.nextUrl.searchParams.get('ref')
    if (ref) {
      response.cookies.set(REFERRAL_COOKIE_NAME, ref, {
        maxAge: REFERRAL_COOKIE_MAX_AGE_SECONDS,
        path: '/',
        sameSite: 'lax',
      })
    }

    return response
  }

  // Rewrite all other requests to the Wishlist page at '/wishlist'
  const response = NextResponse.rewrite(new URL('/wishlist', request.url))

  // Capture a CA's referral code on rewritten routes as well
  const ref = request.nextUrl.searchParams.get('ref')
  if (ref) {
    response.cookies.set(REFERRAL_COOKIE_NAME, ref, {
      maxAge: REFERRAL_COOKIE_MAX_AGE_SECONDS,
      path: '/',
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
