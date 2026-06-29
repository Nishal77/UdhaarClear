/**
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { handleInboundMessage } from '@/lib/whatsapp/bot'
import { prisma } from '@/lib/prisma/client'
import * as client from '@/lib/whatsapp/client'

// Mock the prisma client and the whatsapp client methods
vi.mock('@/lib/prisma/client', () => ({
  prisma: {
    business: {
      findFirst: vi.fn(),
    },
    customer: {
      findFirst: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
    invoice: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/whatsapp/client', () => ({
  sendTextMessage: vi.fn().mockResolvedValue({ message_id: 'mock-id' }),
}))

vi.mock('@/lib/services/reminder-service', () => ({
  ReminderService: {
    sendReminder: vi.fn().mockResolvedValue({ success: true, tone: 'LEGAL' }),
  },
}))

describe('WhatsApp Bot Inbound Command Processor', () => {
  const mockIncomingPhone = '919876543210'
  const mockBusiness = {
    id: 'b-1',
    name: 'Gada Electronics',
    phone: '+919876543210',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends an unauthorized error if the sender number is not registered', async () => {
    vi.mocked(prisma.business.findFirst).mockResolvedValue(null)

    await handleInboundMessage({
      id: 'msg-1',
      from: mockIncomingPhone,
      timestamp: '1234567890',
      type: 'text',
      text: { body: 'Status' },
    })

    expect(prisma.business.findFirst).toHaveBeenCalled()
    expect(client.sendTextMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        to: mockIncomingPhone,
        body: expect.stringContaining('Unauthorized'),
      })
    )
  })

  describe('Authorized Seller Commands', () => {
    beforeEach(() => {
      vi.mocked(prisma.business.findFirst).mockResolvedValue(mockBusiness as any)
    })

    it('rejects unrecognized commands with guide info', async () => {
      await handleInboundMessage({
        id: 'msg-1',
        from: mockIncomingPhone,
        timestamp: '1234567890',
        type: 'text',
        text: { body: 'Hello UdhaarClear' },
      })

      expect(client.sendTextMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockIncomingPhone,
          body: expect.stringContaining('Command not recognized'),
        })
      )
    })

    it('processes "Status" command showing outstanding summary', async () => {
      const mockInvoices = [
        {
          id: 'inv-1',
          invoiceNumber: 'INV-101',
          amount: 15000,
          paidAmount: 5000,
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days overdue
          customer: { name: 'Jethalal' },
        },
      ]
      vi.mocked(prisma.invoice.findMany).mockResolvedValue(mockInvoices as any)

      await handleInboundMessage({
        id: 'msg-1',
        from: mockIncomingPhone,
        timestamp: '1234567890',
        type: 'text',
        text: { body: 'Status' },
      })

      expect(prisma.invoice.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ businessId: 'b-1' }),
        })
      )
      expect(client.sendTextMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockIncomingPhone,
          body: expect.stringContaining('Outstanding Invoices'),
        })
      )
    })

    it('processes "Pause [Name]" command to halt recovery cadence', async () => {
      const mockCustomer = { id: 'cust-1', name: 'Jethalal' }
      vi.mocked(prisma.customer.findFirst).mockResolvedValue(mockCustomer as any)

      await handleInboundMessage({
        id: 'msg-1',
        from: mockIncomingPhone,
        timestamp: '1234567890',
        type: 'text',
        text: { body: 'Pause Jethalal' },
      })

      expect(prisma.customer.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ name: { equals: 'Jethalal', mode: 'insensitive' } }),
        })
      )
      expect(prisma.invoice.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ customerId: 'cust-1', businessId: 'b-1' }),
          data: { remindersPaused: true },
        })
      )
      expect(client.sendTextMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockIncomingPhone,
          body: expect.stringContaining('Paused automated reminders for Jethalal'),
        })
      )
    })

    it('processes "Report" command showing monthly stats', async () => {
      vi.mocked(prisma.invoice.findMany).mockResolvedValue([
        { amount: 20000, status: 'PAID' },
        { amount: 30000, status: 'PENDING' },
      ] as any)
      vi.mocked(prisma.customer.count).mockResolvedValue(2)

      await handleInboundMessage({
        id: 'msg-1',
        from: mockIncomingPhone,
        timestamp: '1234567890',
        type: 'text',
        text: { body: 'Report' },
      })

      expect(prisma.invoice.findMany).toHaveBeenCalled()
      expect(prisma.customer.count).toHaveBeenCalled()
      expect(client.sendTextMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockIncomingPhone,
          body: expect.stringContaining('Recovery Performance'),
        })
      )
    })

    it('processes simple "New invoice" command for existing customer', async () => {
      const mockCustomer = { id: 'cust-1', name: 'Jethalal' }
      const mockInvoice = { id: 'inv-2', invoiceNumber: 'INV-BOT-123', amount: 15000, customer: mockCustomer }
      vi.mocked(prisma.customer.findFirst).mockResolvedValue(mockCustomer as any)
      vi.mocked(prisma.invoice.create).mockResolvedValue(mockInvoice as any)

      await handleInboundMessage({
        id: 'msg-1',
        from: mockIncomingPhone,
        timestamp: '1234567890',
        type: 'text',
        text: { body: 'New invoice Jethalal 15000' },
      })

      expect(prisma.customer.findFirst).toHaveBeenCalled()
      expect(prisma.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            businessId: 'b-1',
            customerId: 'cust-1',
            amount: 15000,
          }),
        })
      )
      expect(client.sendTextMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockIncomingPhone,
          body: expect.stringContaining('created successfully'),
        })
      )
    })

    it('processes "Yes [Name]" command to approve and trigger legal notice', async () => {
      const mockCustomer = { id: 'cust-1', name: 'Jethalal' }
      const mockInvoice = { id: 'inv-1', invoiceNumber: 'INV-101', amount: 15000, customer: mockCustomer }
      vi.mocked(prisma.customer.findFirst).mockResolvedValue(mockCustomer as any)
      vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as any)

      await handleInboundMessage({
        id: 'msg-1',
        from: mockIncomingPhone,
        timestamp: '1234567890',
        type: 'text',
        text: { body: 'Yes Jethalal' },
      })

      expect(prisma.customer.findFirst).toHaveBeenCalled()
      expect(prisma.invoice.findFirst).toHaveBeenCalled()
      expect(prisma.invoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'inv-1' },
          data: expect.objectContaining({
            remindersPaused: false,
            legalNoticeSentAt: expect.any(Date),
          }),
        })
      )
      expect(client.sendTextMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockIncomingPhone,
          body: expect.stringContaining('approved and sent'),
        })
      )
    })

    it('processes "No [Name]" command to dismiss warning', async () => {
      const mockCustomer = { id: 'cust-1', name: 'Jethalal' }
      vi.mocked(prisma.customer.findFirst).mockResolvedValue(mockCustomer as any)

      await handleInboundMessage({
        id: 'msg-1',
        from: mockIncomingPhone,
        timestamp: '1234567890',
        type: 'text',
        text: { body: 'No Jethalal' },
      })

      expect(client.sendTextMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockIncomingPhone,
          body: expect.stringContaining('dismissed'),
        })
      )
    })

    it('processes "Snooze [Name]" command to delay due date', async () => {
      const mockCustomer = { id: 'cust-1', name: 'Jethalal' }
      const mockInvoice = { id: 'inv-1', invoiceNumber: 'INV-101', amount: 15000, dueDate: new Date() }
      vi.mocked(prisma.customer.findFirst).mockResolvedValue(mockCustomer as any)
      vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as any)

      await handleInboundMessage({
        id: 'msg-1',
        from: mockIncomingPhone,
        timestamp: '1234567890',
        type: 'text',
        text: { body: 'Snooze Jethalal' },
      })

      expect(prisma.invoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'inv-1' },
          data: expect.objectContaining({
            remindersPaused: false,
            dueDate: expect.any(Date),
          }),
        })
      )
      expect(client.sendTextMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockIncomingPhone,
          body: expect.stringContaining('snoozed for 7 days'),
        })
      )
    })
  })
})
