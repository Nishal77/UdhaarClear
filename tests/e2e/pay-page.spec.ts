import { test, expect } from '@playwright/test'

test.describe('Public payment link page', () => {
  test('unknown invoice id renders a 404, not a crash', async ({ page }) => {
    const response = await page.goto('/pay/00000000-0000-0000-0000-000000000000')
    expect(response?.status()).toBe(404)
  })
})
