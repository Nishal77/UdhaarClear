import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function main() {
  const { prisma } = await import('../lib/prisma/client')
  const { ReminderService } = await import('../lib/services/reminder-service')

  try {
    console.log('--- WHATSAPP REMINDER INTEGRATION TEST ---')
    console.log('Using WABA ID:', process.env.WHATSAPP_BUSINESS_ACCOUNT_ID)
    console.log('Using Phone Number ID:', process.env.WHATSAPP_PHONE_NUMBER_ID)

    // 1. Find the test user
    const user = await prisma.user.findFirst({
      include: { ownedBusiness: true },
    })

    if (!user) {
      throw new Error('No user found in the database. Please run signup or create a user first.')
    }

    console.log(`Using user: ${user.name} (${user.email})`)

    // 2. Find or create a business for the user
    let business = user.ownedBusiness
    if (!business) {
      business = await prisma.business.create({
        data: {
          name: 'Test Business',
          phone: '9999999999',
          email: user.email,
          ownerId: user.id,
        },
      })
      console.log('Created test business record')
    }

    console.log(`Using business: ${business.name} (ID: ${business.id})`)

    // 3. Find or create a test customer with the recipient phone number
    const testPhoneNumber = '9741793580'
    let customer = await prisma.customer.findFirst({
      where: {
        businessId: business.id,
        phone: testPhoneNumber,
      },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          businessId: business.id,
          name: 'Nishal Test',
          phone: testPhoneNumber,
          email: 'test-customer@udhaarclear.com',
          defaultTone: 'GENTLE',
        },
      })
      console.log(`Created test customer for phone number: ${testPhoneNumber}`)
    } else {
      console.log(`Found existing test customer for phone: ${customer.phone}`)
    }

    // 4. Find or create an overdue invoice for the customer
    let invoice = await prisma.invoice.findFirst({
      where: {
        customerId: customer.id,
        status: { not: 'PAID' },
      },
    })

    if (!invoice) {
      invoice = await prisma.invoice.create({
        data: {
          businessId: business.id,
          customerId: customer.id,
          invoiceNumber: `INV-TEST-${Date.now().toString().slice(-6)}`,
          amount: 15000.00,
          description: 'SaaS Platform Integration Test Invoice',
          invoiceDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
          creditDays: 8,
          status: 'OVERDUE',
          autoReminder: true,
          remindersPaused: false,
        },
      })
      console.log(`Created test overdue invoice: ${invoice.invoiceNumber}`)
    } else {
      console.log(`Using existing unpaid invoice: ${invoice.invoiceNumber}`)
    }

    // 5. Trigger the reminder dispatch
    console.log('Sending WhatsApp reminder via ReminderService.sendReminder...')
    const result = await ReminderService.sendReminder({
      invoiceId: invoice.id,
      channel: 'WHATSAPP',
      triggeredBy: 'MANUAL',
    })

    console.log('\n--- SUCCESS! ---')
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('\n--- FAILURE ---')
    console.error('Error during test execution:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
