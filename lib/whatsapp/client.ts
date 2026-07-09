import type { TemplateComponent } from './templates'

const WHATSAPP_API_BASE = `https://graph.facebook.com/v19.0`

export interface SendTemplateParams {
  to: string
  templateName: string
  languageCode?: string
  components: TemplateComponent[]
  phoneNumberId?: string
  accessToken?: string
}

export async function sendTemplateMessage({
  to,
  templateName,
  languageCode = 'en',
  components,
  phoneNumberId,
  accessToken,
}: SendTemplateParams): Promise<{ messages: Array<{ id: string }> }> {
  const activePhoneId = phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID
  const activeToken = accessToken || process.env.WHATSAPP_ACCESS_TOKEN

  if (!activePhoneId || !activeToken) {
    throw new Error('WhatsApp API credentials are not configured')
  }

  const response = await fetch(
    `${WHATSAPP_API_BASE}/${activePhoneId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${activeToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`)
  }

  return response.json()
}

export interface SendDocumentParams {
  to: string
  /** Publicly-fetchable URL of the document (e.g. a Supabase signed URL). */
  link: string
  /** File name shown to the recipient, e.g. "recovery-report-Jul-2026.pdf". */
  filename: string
  caption?: string
  phoneNumberId?: string
  accessToken?: string
}

/**
 * Sends a document (PDF, etc.) by link via the WhatsApp Cloud API. Meta
 * fetches the URL server-side, so it must be publicly reachable for the
 * duration of the send (a time-boxed Supabase signed URL works fine).
 */
export async function sendDocumentMessage({
  to,
  link,
  filename,
  caption,
  phoneNumberId,
  accessToken,
}: SendDocumentParams): Promise<{ messages: Array<{ id: string }> }> {
  const activePhoneId = phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID
  const activeToken = accessToken || process.env.WHATSAPP_ACCESS_TOKEN

  if (!activePhoneId || !activeToken) {
    throw new Error('WhatsApp API credentials are not configured')
  }

  const response = await fetch(
    `${WHATSAPP_API_BASE}/${activePhoneId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${activeToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'document',
        document: { link, filename, ...(caption ? { caption } : {}) },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`)
  }

  return response.json()
}

export interface SendTextParams {
  to: string
  body: string
  phoneNumberId?: string
  accessToken?: string
}

export async function sendTextMessage({
  to,
  body,
  phoneNumberId,
  accessToken,
}: SendTextParams): Promise<any> {
  const activePhoneId = phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID
  const activeToken = accessToken || process.env.WHATSAPP_ACCESS_TOKEN

  if (!activePhoneId || !activeToken) {
    throw new Error('WhatsApp API credentials are not configured')
  }

  const response = await fetch(
    `${WHATSAPP_API_BASE}/${activePhoneId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${activeToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: {
          preview_url: false,
          body,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`)
  }

  return response.json()
}
