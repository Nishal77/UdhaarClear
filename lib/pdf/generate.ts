import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { LegalNotice } from './LegalNotice'

interface LegalNoticeData {
  business: {
    name: string
    legalName?: string | null
    gstin?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    phone: string
  }
  customer: {
    name: string
    gstin?: string | null
    address?: string | null
    city?: string | null
  }
  invoice: {
    invoiceNumber: string
    amount: number
    invoiceDate: Date
    dueDate: Date
    daysOverdue: number
  }
}

export async function generateLegalNoticePDF(data: LegalNoticeData): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = createElement(LegalNotice as any, data)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return renderToBuffer(element as any)
}
