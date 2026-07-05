import { test, expect } from '@playwright/test'

// Middleware (lib/supabase/middleware.ts) skips the auth redirect entirely
// when NODE_ENV === 'development' (a local-dev convenience), so these pages
// rely on their own server-side `if (!user) redirect('/login')` check
// instead — which is what actually gets exercised here since Playwright
// runs against `pnpm dev`.

const protectedRoutes = [
  '/dashboard',
  '/settings',
  '/ca/dashboard',
]

for (const route of protectedRoutes) {
  test(`${route} redirects an unauthenticated visitor to /login`, async ({ page }) => {
    await page.goto(route)
    await page.waitForURL('**/login')
    expect(new URL(page.url()).pathname).toBe('/login')
  })
}
