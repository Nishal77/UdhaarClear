import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function main() {
  const wabaId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
  const token = process.env.WHATSAPP_ACCESS_TOKEN

  if (!wabaId || !token) {
    console.error('WABA ID or Access Token is missing in environment variables.')
    return
  }

  console.log('Fetching templates for WABA:', wabaId)
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${wabaId}/message_templates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('API Error:', JSON.stringify(err, null, 2))
      return
    }

    const data = await res.json()
    console.log('Templates list:')
    data.data.forEach((tpl: any) => {
      if (tpl.name === 'invoice_update_alert_v3') {
        console.log(JSON.stringify(tpl, null, 2))
      } else {
        console.log(`- Name: ${tpl.name} | Language: ${tpl.language} | Status: ${tpl.status}`)
      }
    })
  } catch (err) {
    console.error('Failed to fetch:', err)
  }
}

main()
