import { test, expect } from '@playwright/test'

test.describe('Public marketing pages', () => {
  test('landing page loads and has a CTA to sign up', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBeLessThan(400)
    await expect(page.locator('a[href*="signup"]').first()).toBeVisible()
  })

  test('pricing page loads and lists plans', async ({ page }) => {
    const response = await page.goto('/pricing')
    expect(response?.status()).toBeLessThan(400)
    await expect(page.getByText(/₹|free|starter|pro|growth/i).first()).toBeVisible()
  })
})
