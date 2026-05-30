'use client'

import { Reminder } from '@prisma/client'
import { formatDateLong } from '@/lib/utils/date'
import { IconMessage, IconCheck, IconEye, IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils/cn'

const STATUS_ICON = {
  QUEUED: IconMessage,
  SENT: IconMessage,
  DELIVERED: IconCheck,
  READ: IconEye,
  FAILED: IconX,
  REPLIED: IconMessage,
}

const STATUS_COLOR = {
  QUEUED: 'text-gray-400',
  SENT: 'text-blue-500',
  DELIVERED: 'text-blue-600',
  READ: 'text-green-600',
  FAILED: 'text-red-500',
  REPLIED: 'text-purple-500',
}

export function ReminderTimeline({ reminders }: { reminders: Reminder[] }) {
  if (!reminders.length) {
    return <p className="text-sm text-gray-500">No reminders sent yet</p>
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {reminders.map((r, i) => {
          const Icon = STATUS_ICON[r.status]
          return (
            <li key={r.id}>
              <div className="relative pb-8">
                {i < reminders.length - 1 && (
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" />
                )}
                <div className="relative flex items-start space-x-3">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-full bg-gray-100', STATUS_COLOR[r.status])}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', {
                        'bg-blue-50 text-blue-700': r.tone === 'GENTLE',
                        'bg-orange-50 text-orange-700': r.tone === 'FIRM',
                        'bg-red-50 text-red-700': r.tone === 'LEGAL',
                      })}>
                        {r.tone}
                      </span>
                      <span className="text-xs text-gray-500">{r.status}</span>
                      {r.triggeredBy === 'MANUAL' && (
                        <span className="text-xs text-gray-400">• manual</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{r.messageBody}</p>
                    <p className="mt-1 text-xs text-gray-400">{formatDateLong(r.createdAt)}</p>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
