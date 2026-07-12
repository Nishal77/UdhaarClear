import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function POST(request: Request) {
  try {
    const { email, message } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedMessage = message.trim()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    await prisma.wishlistFeedback.create({
      data: {
        email: trimmedEmail,
        message: trimmedMessage,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Thank you for sharing! We will look into it. 🎉",
    })
  } catch (error) {
    console.error('Error in wishlist feedback submission:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
