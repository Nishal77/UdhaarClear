import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function main() {
  // Dynamically import the prisma client after env variables are loaded
  const { prisma } = await import('../lib/prisma/client')

  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        createdAt: true,
      },
      take: 10,
    })
    console.log('--- REGISTERED USERS ---')
    console.log(JSON.stringify(users, null, 2))
  } catch (err) {
    console.error('Error fetching users:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
