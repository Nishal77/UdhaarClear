import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

const ADMIN_USER = process.env.WISHLIST_ADMIN_USER || 'admin'
const ADMIN_PASS = process.env.WISHLIST_ADMIN_PASS || 'UdhaarClearAdmin2026!'

const BASELINE_VOTES = 32

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false
  }

  try {
    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    return username === ADMIN_USER && password === ADMIN_PASS
  } catch (error) {
    return false
  }
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Wishlist Admin"' },
    })
  }

  try {
    const dbVotes = await prisma.wishlistVote.count()
    const dbEmails = await prisma.wishlistEmail.count()
    const dbFeedbacks = await prisma.wishlistFeedback.count()

    const emailsList = await prisma.wishlistEmail.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const feedbacksList = await prisma.wishlistFeedback.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      stats: {
        baselineVotes: BASELINE_VOTES,
        dbVotes,
        totalVotes: BASELINE_VOTES + dbVotes,
        totalEmails: dbEmails,
        totalFeedbacks: dbFeedbacks,
      },
      emails: emailsList,
      feedbacks: feedbacksList,
    })
  } catch (error) {
    console.error('Error fetching admin statistics:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
