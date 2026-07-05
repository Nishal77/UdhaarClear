import { test, expect } from '@playwright/test'

// These specs only check rendering and client-side (HTML5) validation.
// They deliberately never submit a real email — doing so would trigger a
// live OTP send through Resend/WhatsApp against whatever address is typed.

test.describe('Login page', () => {
  test('renders email field and links to signup', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('a[href*="/signup"]').first()).toBeVisible()
  })

  test('blocks submit on empty email (HTML5 required)', async ({ page }) => {
    await page.goto('/login')
    const emailInput = page.locator('input[type="email"]')
    await page.getByRole('button', { name: /continue/i }).click()
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.checkValidity())
    expect(isInvalid).toBe(true)
  })
})

test.describe('Signup page', () => {
  test('renders signup form and links to login', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('a[href*="/login"]').first()).toBeVisible()
  })
})
