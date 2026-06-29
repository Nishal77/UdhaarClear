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
  languageCode = 'en_US',
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
