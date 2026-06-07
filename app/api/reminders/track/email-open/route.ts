import { prisma } from '@/lib/prisma/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const reminderId = searchParams.get('reminderId')

  if (reminderId) {
    try {
      // Find the reminder and verify it exists
      const reminder = await prisma.reminder.findUnique({
        where: { id: reminderId },
      })

      if (reminder) {
        const hasAlreadyOpenedEmail = !!(
          reminder.outcome?.includes('Email opened') || 
          reminder.outcome?.includes('Email read')
        )
        if (!hasAlreadyOpenedEmail) {
          let newOutcome = 'Email opened by customer'
          if (reminder.channel === 'BOTH') {
            const isWaRead = !!(
              reminder.outcome?.includes('WhatsApp read') || 
              (reminder.status === 'READ' && reminder.readAt && !reminder.outcome?.includes('WhatsApp sent'))
            )
            const isWaDelivered = !!(
              reminder.outcome?.includes('WhatsApp delivered') || 
              reminder.status === 'DELIVERED'
            )
            const isWaFailed = !!(
              reminder.outcome?.includes('WhatsApp failed') || 
              reminder.status === 'FAILED'
            )

            if (isWaRead) {
              newOutcome = 'WhatsApp read & Email opened'
            } else if (isWaDelivered) {
              newOutcome = 'WhatsApp delivered · Email opened'
            } else if (isWaFailed) {
              newOutcome = 'WhatsApp failed · Email opened'
            } else {
              newOutcome = 'WhatsApp sent · Email opened'
            }
          }

          await prisma.reminder.update({
            where: { id: reminderId },
            data: {
              status: 'READ',
              readAt: reminder.readAt ?? new Date(),
              outcome: newOutcome,
            },
          })
        }
      }
    } catch (err) {
      console.error('Failed to log email open status update:', err)
    }
  }

  // Base64 encoded 1x1 transparent GIF pixel
  const pixelBuffer = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  )

  return new NextResponse(pixelBuffer, {
    headers: {
      'Content-Type': 'image/gif',
      'Content-Length': pixelBuffer.length.toString(),
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
}
export const dynamic = 'force-dynamic'
