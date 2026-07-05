import { test, expect } from '@playwright/test'

// Both webhook routes must fail closed on a bad/missing signature — this
// is the one thing that's safe to verify against the live routes without
// real provider secrets or triggering an actual payment/message side effect.

test.describe('Webhook signature verification', () => {
  test('Razorpay webhook rejects an invalid signature', async ({ request }) => {
    const response = await request.post('/api/webhooks/razorpay', {
      headers: { 'x-razorpay-signature': 'not-a-real-signature' },
      data: { event: 'payment_link.paid' },
    })
    expect(response.status()).toBe(403)
  })

  test('WhatsApp webhook rejects an invalid signature', async ({ request }) => {
    const response = await request.post('/api/webhooks/whatsapp', {
      headers: { 'x-hub-signature-256': 'sha256=deadbeef' },
      data: { entry: [] },
    })
    expect(response.status()).toBe(403)
  })

  test('WhatsApp webhook GET verify challenge rejects a wrong verify token', async ({ request }) => {
    const response = await request.get(
      '/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=wrong-token&hub.challenge=123'
    )
    expect(response.status()).toBe(403)
  })
})
