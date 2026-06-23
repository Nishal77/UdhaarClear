import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function main() {
  const WHATSAPP_API_BASE = `https://graph.facebook.com/v19.0`
  const activePhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const activeToken = process.env.WHATSAPP_ACCESS_TOKEN
  const to = '919741793580'

  console.log('--- WHATSAPP GENTLE EN TEST ---')
  console.log('Phone ID:', activePhoneId)

  if (!activePhoneId || !activeToken) {
    console.error('Missing credentials')
    return
  }

  // Choose en or en_US to test
  const lang = 'en_US' // Meta templates are often 'en' or 'en_US'

  try {
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
            name: 'payment_reminder_gentle',
            language: { code: lang },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: 'Nishal Test' },
                  { type: 'text', text: 'INV-123' },
                  { type: 'text', text: 'Test Business' },
                  { type: 'text', text: 'Rs. 15,000' },
                  { type: 'text', text: 'June 30, 2026' },
                  { type: 'text', text: 'https://udhaarclear.in/pay/123' },
                ],
              },
            ],
          },
        }),
      }
    )

    const result = await response.json()
    console.log(`Response Status with ${lang}:`, response.status)
    console.log('Response Body:', JSON.stringify(result, null, 2))
  } catch (err) {
    console.error('Fetch error:', err)
  }
}

main()
