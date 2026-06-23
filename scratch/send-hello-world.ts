import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function main() {
  const WHATSAPP_API_BASE = `https://graph.facebook.com/v19.0`
  const activePhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const activeToken = process.env.WHATSAPP_ACCESS_TOKEN
  const to = '919741793580'

  console.log('--- WHATSAPP HELLO WORLD TEST ---')
  console.log('Phone ID:', activePhoneId)
  console.log('Token starts with:', activeToken?.slice(0, 15))

  if (!activePhoneId || !activeToken) {
    console.error('Missing credentials')
    return
  }

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
            name: 'hello_world',
            language: { code: 'en_US' },
          },
        }),
      }
    )

    const result = await response.json()
    console.log('Response Status:', response.status)
    console.log('Response Body:', JSON.stringify(result, null, 2))
  } catch (err) {
    console.error('Fetch error:', err)
  }
}

main()
