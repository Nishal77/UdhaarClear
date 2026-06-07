import { prisma } from '@/lib/prisma/client'
import { ReminderStatus } from '@prisma/client'

interface WhatsAppStatusUpdate {
  id: string
  status: string
  timestamp: string
  recipient_id: string
}

export async function handleStatusUpdate(update: WhatsAppStatusUpdate) {
  const statusMap: Record<string, ReminderStatus> = {
    sent: 'SENT',
    delivered: 'DELIVERED',
    read: 'READ',
    failed: 'FAILED',
  }

  const newStatus = statusMap[update.status]
  if (!newStatus) return

  // Find all reminders with this waMessageId to process them
  const reminders = await prisma.reminder.findMany({
    where: { waMessageId: update.id },
  })

  for (const reminder of reminders) {
    const isEmailOpened = !!(
      reminder.outcome?.includes('Email opened') || 
      reminder.outcome?.includes('Email read')
    )

    let updatedOutcome = reminder.outcome
    let updatedStatus = reminder.status

    if (reminder.channel === 'BOTH') {
      if (update.status === 'delivered') {
        // Only update status if it's not already READ (from Email or WhatsApp)
        updatedStatus = (reminder.status === 'READ' || isEmailOpened) ? 'READ' : 'DELIVERED'
        updatedOutcome = isEmailOpened 
          ? 'WhatsApp delivered · Email opened' 
          : 'WhatsApp delivered · Email sent'
      } else if (update.status === 'read') {
        updatedStatus = 'READ'
        updatedOutcome = isEmailOpened 
          ? 'WhatsApp read & Email opened' 
          : 'WhatsApp read · Email sent'
      } else if (update.status === 'failed') {
        // If WhatsApp failed, but email was already opened, keep as READ and note the failure
        updatedStatus = isEmailOpened ? 'READ' : 'FAILED'
        updatedOutcome = isEmailOpened
          ? 'WhatsApp failed · Email opened'
          : 'WhatsApp failed · Email sent'
      }
    } else {
      // Single channel WhatsApp
      if (update.status === 'delivered') {
        updatedStatus = 'DELIVERED'
        updatedOutcome = 'WhatsApp delivered'
      } else if (update.status === 'read') {
        updatedStatus = 'READ'
        updatedOutcome = 'WhatsApp read by customer'
      } else if (update.status === 'failed') {
        updatedStatus = 'FAILED'
        updatedOutcome = 'WhatsApp delivery failed'
      }
    }

    const data: any = {
      status: updatedStatus,
      outcome: updatedOutcome,
    }

    if (update.status === 'delivered') {
      data.deliveredAt = reminder.deliveredAt ?? new Date()
    } else if (update.status === 'read') {
      data.readAt = reminder.readAt ?? new Date()
    }

    await prisma.reminder.update({
      where: { id: reminder.id },
      data,
    })
  }
}
