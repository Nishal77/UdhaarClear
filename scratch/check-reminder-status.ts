import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function main() {
  const { prisma } = await import('../lib/prisma/client')
  console.log('Fetching last sent reminder status...')
  try {
    const reminder = await prisma.reminder.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { invoice: { include: { customer: true } } },
    })

    if (!reminder) {
      console.log('No reminders found in database.')
      return
    }

    console.log('Reminder Details:')
    console.log('ID:', reminder.id)
    console.log('Created At:', reminder.createdAt)
    console.log('Channel:', reminder.channel)
    console.log('Status:', reminder.status)
    console.log('Outcome:', reminder.outcome)
    console.log('WhatsApp Msg ID:', reminder.waMessageId)
    console.log('Customer Phone:', reminder.invoice.customer.phone)
  } catch (error) {
    console.error('Failed to query:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
