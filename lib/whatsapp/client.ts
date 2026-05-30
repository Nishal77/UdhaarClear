import type { TemplateComponent } from './templates'

const WHATSAPP_API_BASE = `https://graph.facebook.com/v19.0`

export interface SendTemplateParams {
  to: string
  templateName: string
  languageCode?: string
  components: TemplateComponent[]
}

export async function sendTemplateMessage({
  to,
  templateName,
  languageCode = 'hi',
  components,
}: SendTemplateParams): Promise<{ messages: Array<{ id: string }> }> {
  const response = await fetch(
    `${WHATSAPP_API_BASE}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
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
