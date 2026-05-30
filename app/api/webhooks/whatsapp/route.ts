import crypto from 'crypto'
import { handleStatusUpdate } from '@/lib/whatsapp/webhook'
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

  const expectedSig = `sha256=${crypto
    .createHmac('sha256', process.env.WHATSAPP_ACCESS_TOKEN ?? '')
    .update(body)
    .digest('hex')}`

  if (!crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature))) {
    return new Response('Forbidden', { status: 403 })
  }

  const payload = JSON.parse(body) as WhatsAppWebhookPayload

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      for (const status of change.value.statuses ?? []) {
        await handleStatusUpdate(status)
      }
    }
  }

  return new Response('OK', { status: 200 })
}
