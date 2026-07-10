/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma/client', () => ({
  prisma: {
    reminder: { findFirst: vi.fn() },
    invoice: { update: vi.fn() },
  },
}))
vi.mock('@/lib/whatsapp/client', () => ({
  sendTextMessage: vi.fn().mockResolvedValue({}),
}))
vi.mock('@/lib/services/owner-notifications', () => ({
  notifyOwnerPaymentPendingApproval: vi.fn().mockResolvedValue(undefined),
}))

import { prisma } from '@/lib/prisma/client'
import { sendTextMessage } from '@/lib/whatsapp/client'
import { notifyOwnerPaymentPendingApproval } from '@/lib/services/owner-notifications'
import { detectUtr, tryHandleBuyerUtrReply } from '@/lib/whatsapp/buyer-payment'
import type { WhatsAppMessage } from '@/types/whatsapp'

const replyMsg = (body: string, contextId?: string): WhatsAppMessage => ({
  id: 'wamid.IN',
  from: '919741793580',
  timestamp: '0',
  type: 'text',
  text: { body },
  ...(contextId ? { context: { id: contextId } } : {}),
})

const invoiceRow = {
  id: 'inv_1',
  invoiceNumber: 'INV-1042',
  amount: 20000,
  paidAmount: 0,
  status: 'OVERDUE',
  business: { name: 'Sharma Traders', phone: '+919999999999' },
  customer: { name: 'Nishal', contactName: null, phone: '+919741793580' },
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('detectUtr', () => {
  it('detects 12-digit IMPS ref', () => {
    expect(detectUtr('paid, ref 123456789012')).toBe('123456789012')
  })
  it('detects NEFT-style UTR with bank prefix', () => {
    expect(detectUtr('UTR: HDFC0012345678901234')).toBe('HDFC0012345678901234')
  })
  it('detects explicit "UTR" keyword prefix', () => {
    expect(detectUtr('my UTR is SBIN1234567890')).toBe('SBIN1234567890')
  })
  it('returns null for plain short text', () => {
    expect(detectUtr('hi, I paid yesterday')).toBeNull()
  })
  it('returns null for phone numbers (10 digits)', () => {
    expect(detectUtr('call me on 9876543210')).toBeNull()
  })
})

describe('tryHandleBuyerUtrReply', () => {
  it('returns false when no context.id (not a reply)', async () => {
    const result = await tryHandleBuyerUtrReply(replyMsg('123456789012'))
    expect(result).toBe(false)
    expect(prisma.reminder.findFirst).not.toHaveBeenCalled()
  })

  it('returns false when body has no UTR pattern', async () => {
    const result = await tryHandleBuyerUtrReply(replyMsg('thanks', 'wamid.ORIG'))
    expect(result).toBe(false)
  })

  it('returns false when no reminder found for context.id', async () => {
    ;(prisma.reminder.findFirst as any).mockResolvedValue(null)
    const result = await tryHandleBuyerUtrReply(replyMsg('ref 123456789012', 'wamid.MISSING'))
    expect(result).toBe(false)
  })

  it('sets PENDING_CONFIRMATION, acks buyer, and alerts owner on valid UTR reply', async () => {
    ;(prisma.reminder.findFirst as any).mockResolvedValue({ invoice: invoiceRow })
    ;(prisma.invoice.update as any).mockResolvedValue({})

    const result = await tryHandleBuyerUtrReply(replyMsg('UTR 123456789012', 'wamid.ORIG'))

    expect(result).toBe(true)
    expect(prisma.invoice.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'inv_1' },
        data: expect.objectContaining({
          status: 'PENDING_CONFIRMATION',
          paymentRef: '123456789012',
          autoReminder: false,
        }),
      })
    )
    expect(sendTextMessage).toHaveBeenCalledWith(
      expect.objectContaining({ body: expect.stringContaining('123456789012') })
    )
    expect(notifyOwnerPaymentPendingApproval).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerPhone: '+919999999999',
        utr: '123456789012',
        invoiceId: 'inv_1',
      })
    )
  })

  it('acks buyer and returns true for already-PAID invoice without re-updating', async () => {
    ;(prisma.reminder.findFirst as any).mockResolvedValue({
      invoice: { ...invoiceRow, status: 'PAID' },
    })

    const result = await tryHandleBuyerUtrReply(replyMsg('UTR 123456789012', 'wamid.ORIG'))

    expect(result).toBe(true)
    expect(prisma.invoice.update).not.toHaveBeenCalled()
    const body = (sendTextMessage as any).mock.calls[0][0].body
    expect(body.toLowerCase()).toContain('already fully paid')
  })

  it('acks buyer and returns true for already-PENDING_CONFIRMATION invoice without re-updating', async () => {
    ;(prisma.reminder.findFirst as any).mockResolvedValue({
      invoice: { ...invoiceRow, status: 'PENDING_CONFIRMATION' },
    })

    const result = await tryHandleBuyerUtrReply(replyMsg('UTR 123456789012', 'wamid.ORIG'))

    expect(result).toBe(true)
    expect(prisma.invoice.update).not.toHaveBeenCalled()
    const body = (sendTextMessage as any).mock.calls[0][0].body
    expect(body.toLowerCase()).toContain('pending confirmation')
  })
})
