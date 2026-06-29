import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { AuditorReport } from '@/lib/pdf/AuditorReport'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { ownedBusiness: true },
    })

    if (!dbUser?.ownedBusiness) {
      return new Response('Business profile not found', { status: 404 })
    }

    const businessId = dbUser.ownedBusiness.id

    // Fetch stats and ledgers
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

    // Calculate DSO
    const dsoValues = avgDso.map((i) =>
      Math.round((i.paidAt!.getTime() - i.invoiceDate.getTime()) / 86400000)
    )
    const avgDsoValue = dsoValues.length
      ? Math.round(dsoValues.reduce((a, b) => a + b, 0) / dsoValues.length)
      : 0

    // Collection rate
    const collectionRate = totalInvoiced._sum.amount
      ? Math.round((Number(totalCollected._sum.paidAmount ?? 0) / Number(totalInvoiced._sum.amount)) * 100)
      : 0

    // Render Auditor Report PDF Document
    const element = createElement(AuditorReport as any, {
      business: {
        name: dbUser.ownedBusiness.name,
        legalName: dbUser.ownedBusiness.legalName,
        gstin: dbUser.ownedBusiness.gstin,
        phone: dbUser.ownedBusiness.phone,
      },
      stats: {
        totalInvoiced: Number(totalInvoiced._sum.amount ?? 0),
        totalCollected: Number(totalCollected._sum.paidAmount ?? 0),
        collectionRate,
        avgDsoValue,
      },
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

    const buffer = await renderToBuffer(element as any)
    const uint8Array = new Uint8Array(buffer)

    return new Response(uint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=udhaarclear_auditor_report_${Date.now()}.pdf`,
      },
    })
  } catch (err) {
    console.error('Failed to compile PDF Auditor Report:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
