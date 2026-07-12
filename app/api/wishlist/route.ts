import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import crypto from 'crypto'

const BASELINE_VOTES = 32

function getIpHash(request: Request): string {
  // Try common proxy headers first, fallback to loopback for local dev
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || '127.0.0.1')
  return crypto.createHash('sha256').update(ip).digest('hex')
}

export async function GET(request: Request) {
  try {
    const ipHash = getIpHash(request)
    
    // Count database upvotes
    const dbCount = await prisma.wishlistVote.count()
    const totalUpvotes = BASELINE_VOTES + dbCount

    // Check if the current user has voted
    const existing = await prisma.wishlistVote.findUnique({
      where: { ipHash },
    })

    return NextResponse.json({
      upvotes: totalUpvotes,
      upvoted: !!existing,
    })
  } catch (error) {
    console.error('Error fetching wishlist upvotes:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const ipHash = getIpHash(request)

    // Attempt to record the vote
    try {
      await prisma.wishlistVote.create({
        data: { ipHash },
      })
    } catch (e: any) {
      // Unique constraint violation (P2002) means already voted
      if (e.code === 'P2002') {
        const dbCount = await prisma.wishlistVote.count()
        return NextResponse.json({
          upvotes: BASELINE_VOTES + dbCount,
          upvoted: true,
          message: 'Already voted',
        })
      }
      throw e
    }

    const dbCount = await prisma.wishlistVote.count()
    return NextResponse.json({
      upvotes: BASELINE_VOTES + dbCount,
      upvoted: true,
    })
  } catch (error) {
    console.error('Error submitting wishlist upvote:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
