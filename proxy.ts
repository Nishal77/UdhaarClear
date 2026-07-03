import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { REFERRAL_COOKIE_NAME, REFERRAL_COOKIE_MAX_AGE_SECONDS } from '@/lib/ca/referral'

export default async function proxy(request: NextRequest) {
  const response = await updateSession(request)

  // Capture a CA's referral code from `?ref=` on the way through — same
  // "last-touch" cookie regardless of where updateSession() sent the
  // response (redirect or pass-through). The permanent attribution lock
  // happens once, later, when the business actually signs up — see
  // app/api/onboarding/route.ts, which reads this cookie exactly once and
  // never touches Business.caId again after that.
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
