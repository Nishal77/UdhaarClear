import { prisma } from '@/lib/prisma/client'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { AuditorReport } from '@/lib/pdf/AuditorReport'
import { daysOverdue } from '@/lib/utils/date'
import { buildAgeingBreakdown } from '@/lib/utils/ageing'

const OUTSTANDING_STATUSES = ['PENDING', 'DUE', 'OVERDUE', 'PENDING_CONFIRMATION', 'PARTIALLY_PAID']

/**
 * Builds the auditor-ready recovery report PDF for a business and returns the
 * raw bytes. Single source of the report so the web download route
 * (app/api/reports/download) and the WhatsApp "Report" bot command
 * (lib/whatsapp/bot.ts) render exactly the same document.
 *
 * Returns null if the business doesn't exist.
 */
export async function generateAuditorReportPDF(businessId: string): Promise<Buffer | null> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { name: true, legalName: true, gstin: true, phone: true },
  })
  if (!business) return null

  const [totalInvoiced, totalCollected, avgDso, invoices] = await Promise.all([
    prisma.invoice.aggregate({
      where: { businessId },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: { businessId, status: 'PAID' },
      _sum: { paidAmount: true },
    }),
    prisma.invoice.findMany({
      where: { businessId, status: 'PAID', paidAt: { not: null } },
      select: { invoiceDate: true, paidAt: true },
    }),
    prisma.invoice.findMany({
      where: { businessId },
      include: { customer: true },
      orderBy: { invoiceDate: 'desc' },
    }),
  ])

  // Average DSO (days sales outstanding) across paid invoices.
  const dsoValues = avgDso.map((i) =>
    Math.round((i.paidAt!.getTime() - i.invoiceDate.getTime()) / 86400000)
  )
  const avgDsoValue = dsoValues.length
    ? Math.round(dsoValues.reduce((a, b) => a + b, 0) / dsoValues.length)
    : 0

  const collectionRate = totalInvoiced._sum.amount
    ? Math.round((Number(totalCollected._sum.paidAmount ?? 0) / Number(totalInvoiced._sum.amount)) * 100)
    : 0

  // Ageing buckets from still-outstanding invoices only.
  const outstandingInvoices = invoices.filter((inv) => OUTSTANDING_STATUSES.includes(inv.status))
  const ageing = buildAgeingBreakdown(
    outstandingInvoices.map((inv) => ({
      dueDate: inv.dueDate,
      amount: Number(inv.amount),
      paidAmount: inv.paidAmount ? Number(inv.paidAmount) : null,
    })),
    daysOverdue
  )

  const element = createElement(AuditorReport as never, {
    business: {
      name: business.name,
      legalName: business.legalName,
      gstin: business.gstin,
      phone: business.phone,
    },
    stats: {
      totalInvoiced: Number(totalInvoiced._sum.amount ?? 0),
      totalCollected: Number(totalCollected._sum.paidAmount ?? 0),
      collectionRate,
      avgDsoValue,
    },
    ageing,
    invoices: invoices.map((inv) => ({
      invoiceNumber: inv.invoiceNumber,
      customer: { name: inv.customer.name },
      amount: Number(inv.amount),
      invoiceDate: inv.invoiceDate,
      dueDate: inv.dueDate,
      status: inv.status,
      paidAmount: inv.paidAmount ? Number(inv.paidAmount) : 0,
    })),
  })

  return renderToBuffer(element as never)
}
