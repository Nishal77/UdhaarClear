const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Running test query with PENDING_CONFIRMATION status...')
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        status: 'PENDING_CONFIRMATION'
      },
      take: 1
    })
    console.log('Query succeeded! Found:', invoices.length, 'invoices')
  } catch (error) {
    console.error('Query failed with error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
