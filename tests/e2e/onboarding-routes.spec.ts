import { test, expect } from '@playwright/test'

// /onboarding and /ca/onboarding are client components — the redirect for
// an unauthenticated visitor happens via a useEffect (supabase.auth.getUser()
// -> router.replace('/login')) rather than a server redirect, so it lands
// one render after initial load.

test('/onboarding redirects an unauthenticated visitor to /login', async ({ page }) => {
  await page.goto('/onboarding')
  await page.waitForURL('**/login')
  expect(new URL(page.url()).pathname).toBe('/login')
})

// Unlike /onboarding, /ca/onboarding (app/ca/onboarding/page.tsx) has no
// getUser() check at all — an unauthenticated visitor can load the CA
// registration form directly instead of being sent to /login. Documented
// here as a known gap rather than asserted as a bug fix.
test('/ca/onboarding has no auth guard — form renders even when logged out', async ({ page }) => {
  const response = await page.goto('/ca/onboarding')
  expect(response?.status()).toBeLessThan(400)
  await expect(page.getByRole('button', { name: /register|submit|continue|verify/i }).first()).toBeVisible()
})
