import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    const trimmedEmail = email.trim().toLowerCase()
    
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    try {
      await prisma.wishlistEmail.create({
        data: { email: trimmedEmail },
      })
    } catch (e: any) {
      // P2002 unique constraint means already signed up
      if (e.code === 'P2002') {
        return NextResponse.json({ 
          success: true, 
          message: "You're already on the list! 🎉" 
        })
      }
      throw e
    }

    return NextResponse.json({ 
      success: true, 
      message: "You're on the list! 🎉" 
    })
  } catch (error) {
    console.error('Error in wishlist email signup:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
