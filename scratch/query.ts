import { prisma } from '../lib/prisma/client'

async function run() {
  const invoice = await prisma.invoice.findFirst()
  console.log('Invoice found:', invoice)
}

run().catch(console.error)
