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

  await prisma.reminder.updateMany({
    where: { waMessageId: update.id },
    data: {
      status: newStatus,
      deliveredAt: update.status === 'delivered' ? new Date() : undefined,
      readAt: update.status === 'read' ? new Date() : undefined,
    },
  })
}
