/**
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { AuditorReport } from '@/lib/pdf/AuditorReport'

describe('PDF Auditor Report Generation', () => {
  it('successfully compiles the AuditorReport document template into a PDF binary buffer', async () => {
    const mockBusiness = {
      name: 'Test Business',
      legalName: 'Test Business Pvt Ltd',
      gstin: '27AAAAA1111A1Z1',
      phone: '+919876543210',
    }

    const mockStats = {
      totalInvoiced: 50000,
      totalCollected: 35000,
      collectionRate: 70,
      avgDsoValue: 12,
    }

    const mockInvoices = [
      {
        invoiceNumber: 'INV-001',
        customer: { name: 'Customer A' },
        amount: 20000,
        invoiceDate: new Date(),
        dueDate: new Date(),
        status: 'PAID',
        paidAmount: 20000,
      },
      {
        invoiceNumber: 'INV-002',
        customer: { name: 'Customer B' },
        amount: 30000,
        invoiceDate: new Date(),
        dueDate: new Date(),
        status: 'PENDING',
        paidAmount: 0,
      },
    ]

    const element = createElement(AuditorReport as any, {
      business: mockBusiness,
      stats: mockStats,
      invoices: mockInvoices,
    })

    const buffer = await renderToBuffer(element as any)
    expect(buffer).toBeDefined()
    expect(buffer.length).toBeGreaterThan(0)
    
    // React-pdf generated buffer should start with PDF magic bytes: %PDF
    const headerStr = buffer.toString('utf-8', 0, 4)
    expect(headerStr).toBe('%PDF')
  })
})
