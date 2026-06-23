import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function main() {
  const wabaId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
  const token = process.env.WHATSAPP_ACCESS_TOKEN

  if (!wabaId || !token) {
    console.error('Missing WHATSAPP_BUSINESS_ACCOUNT_ID or WHATSAPP_ACCESS_TOKEN in env')
    return
  }

  console.log('--- CREATING WHATSAPP TEMPLATE (payment_reminder_gentle) ---')
  console.log('WABA ID:', wabaId)

  const url = `https://graph.facebook.com/v19.0/${wabaId}/message_templates`

  // Template payload with dynamic URL button
  const body = {
    name: 'payment_reminder_gentle_v2',
    category: 'MARKETING',
    language: 'en_US',
    components: [
      {
        type: 'BODY',
        text: 'Hi {{1}}, your invoice {{2}} from {{3}} for {{4}} is due on {{5}}. You can view details and pay securely using the button below.'
      },
      {
        type: 'BUTTONS',
        buttons: [
          {
            type: 'URL',
            text: 'Pay Now',
            url: 'https://udhaarclear.in/pay/{{1}}'
          }
        ]
      }
    ]
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const result = await response.json()
    console.log('Response Status:', response.status)
    console.log('Response Body:', JSON.stringify(result, null, 2))
  } catch (err) {
    console.error('Failed to create template:', err)
  }
}

main()
