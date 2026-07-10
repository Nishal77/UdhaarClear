/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { WhatsAppMessage } from '@/types/whatsapp'

vi.mock('@/lib/prisma/client', () => ({
  prisma: {
    reminder: { findFirst: vi.fn() },
    invoice: { findFirst: vi.fn(), update: vi.fn() },
  },
}))
vi.mock('@/lib/whatsapp/client', () => ({
  sendTextMessage: vi.fn().mockResolvedValue({}),
}))

import { prisma } from '@/lib/prisma/client'
import { sendTextMessage } from '@/lib/whatsapp/client'
import {
  detectNegotiationChoice,
  isButtonReply,
  handleNegotiationButton,
} from '@/lib/whatsapp/negotiation'

const buttonMsg = (label: string, contextId?: string): WhatsAppMessage => ({
  id: 'wamid.IN',
  from: '919741793580',
  timestamp: '0',
  type: 'button',
  button: { text: label, payload: label },
  ...(contextId ? { context: { id: contextId } } : {}),
})

const invoiceRow = {
  id: 'inv_1',
  invoiceNumber: 'INV-1042',
  amount: 20000,
  paidAmount: 0,
  business: { name: 'Sharma Traders' },
  customer: { name: 'Nishal', contactName: null },
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.NEXT_PUBLIC_APP_URL = 'https://udhaarclear.in'
})

describe('detectNegotiationChoice', () => {
  it('maps "Pay Full Amount" → full', () => {
    expect(detectNegotiationChoice(buttonMsg('Pay Full Amount'))).toBe('full')
  })
  it('maps "Pay Half Amount" → half', () => {
    expect(detectNegotiationChoice(buttonMsg('Pay Half Amount'))).toBe('half')
  })
  it('maps "Pay in Two Parts" → half', () => {
    expect(detectNegotiationChoice(buttonMsg('Pay in Two Parts'))).toBe('half')
  })
  it('returns null for an unrelated button', () => {
    expect(detectNegotiationChoice(buttonMsg('Contact Support'))).toBeNull()
  })
})

describe('isButtonReply', () => {
  it('true for type button', () => {
    expect(isButtonReply(buttonMsg('Pay Full Amount'))).toBe(true)
  })
  it('false for a plain text message', () => {
    expect(isButtonReply({ id: 'x', from: 'y', timestamp: '0', type: 'text', text: { body: 'hi' } })).toBe(false)
  })
})

describe('handleNegotiationButton — FULL', () => {
  it('resolves invoice by context.id and sends the full payment link', async () => {
    ;(prisma.reminder.findFirst as any).mockResolvedValue({ invoice: invoiceRow })

    await handleNegotiationButton(buttonMsg('Pay Full Amount', 'wamid.ORIG'))

    expect(prisma.reminder.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { waMessageId: 'wamid.ORIG' } })
    )
    expect(prisma.invoice.update).not.toHaveBeenCalled() // full choice never snoozes
    const body = (sendTextMessage as any).mock.calls[0][0].body
    expect(body).toContain('/pay/inv_1')
    expect(body).toContain('20,000') // full remaining balance
  })
})

describe('handleNegotiationButton — HALF', () => {
  it('snoozes reminders and offers half of the remaining balance', async () => {
    ;(prisma.reminder.findFirst as any).mockResolvedValue({ invoice: invoiceRow })

    await handleNegotiationButton(buttonMsg('Pay Half Amount', 'wamid.ORIG'))

    // Must pause reminders with a future resume date.
    const updateArg = (prisma.invoice.update as any).mock.calls[0][0]
    expect(updateArg.where).toEqual({ id: 'inv_1' })
    expect(updateArg.data.remindersPaused).toBe(true)
    expect(updateArg.data.remindersPausedUntil).toBeInstanceOf(Date)
    expect(updateArg.data.remindersPausedUntil.getTime()).toBeGreaterThan(Date.now())

    const body = (sendTextMessage as any).mock.calls[0][0].body
    expect(body).toContain('10,000') // half of 20,000
  })

  it('uses remaining balance (not full amount) when partially paid', async () => {
    ;(prisma.reminder.findFirst as any).mockResolvedValue({
      invoice: { ...invoiceRow, paidAmount: 8000 }, // 12,000 remaining → half 6,000
    })

    await handleNegotiationButton(buttonMsg('Pay Half Amount', 'wamid.ORIG'))

    const body = (sendTextMessage as any).mock.calls[0][0].body
    expect(body).toContain('6,000')
  })
})

describe('handleNegotiationButton — no matching invoice', () => {
  it('replies gracefully instead of throwing', async () => {
    ;(prisma.reminder.findFirst as any).mockResolvedValue(null)
    ;(prisma.invoice.findFirst as any).mockResolvedValue(null)

    await handleNegotiationButton(buttonMsg('Pay Full Amount', 'wamid.MISSING'))

    expect(prisma.invoice.update).not.toHaveBeenCalled()
    const body = (sendTextMessage as any).mock.calls[0][0].body
    expect(body.toLowerCase()).toContain("couldn't find")
  })
})
