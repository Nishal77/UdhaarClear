import crypto from 'crypto'
import { handleStatusUpdate, handleInboundMessage } from '@/lib/whatsapp/webhook'
import type { WhatsAppWebhookPayload } from '@/types/whatsapp'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }

  return new Response('Forbidden', { status: 403 })
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-hub-signature-256') ?? ''

  // Meta signs webhook payloads with the App Secret (from the Meta App
  // dashboard), not the WhatsApp access token — using the wrong key here
  // means every real webhook gets silently rejected.
  const expectedSig = `sha256=${crypto
    .createHmac('sha256', process.env.WHATSAPP_APP_SECRET ?? '')
    .update(body)
    .digest('hex')}`

  const expectedBuf = Buffer.from(expectedSig)
  const receivedBuf = Buffer.from(signature)

  // timingSafeEqual throws if buffer lengths differ, so check that first —
  // a malformed/missing header should fail closed, not crash the route.
  const isValid = expectedBuf.length === receivedBuf.length &&
    crypto.timingSafeEqual(expectedBuf, receivedBuf)

  if (!isValid) {
    return new Response('Forbidden', { status: 403 })
  }

  const payload = JSON.parse(body) as WhatsAppWebhookPayload

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      // 1. Process status updates
      for (const status of change.value.statuses ?? []) {
        await handleStatusUpdate(status)
      }

      // 2. Process inbound messages
      for (const message of change.value.messages ?? []) {
        await handleInboundMessage(message)
      }
    }
  }

  return new Response('OK', { status: 200 })
}
