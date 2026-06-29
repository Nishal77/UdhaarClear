import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { ReportsClient } from './ReportsClient'
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns'

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const businessId = dbUser.ownedBusiness.id
  const now = new Date()

  const [totalInvoiced, totalCollected, avgDso, topCustomers, allInvoices] = await Promise.all([
    prisma.invoice.aggregate({ where: { businessId }, _sum: { amount: true }, _count: true }),
    prisma.invoice.aggregate({ where: { businessId, status: 'PAID' }, _sum: { paidAmount: true } }),
    prisma.invoice.findMany({
      where: { businessId, status: 'PAID', paidAt: { not: null } },
      select: { invoiceDate: true, paidAt: true },
    }),
    prisma.invoice.groupBy({
      by: ['customerId'],
      where: { businessId, status: 'PAID' },
      _sum: { paidAmount: true },
      orderBy: { _sum: { paidAmount: 'desc' } },
      take: 5,
    }),
    prisma.invoice.findMany({
      where: { businessId },
      include: { customer: true },
      orderBy: { invoiceDate: 'desc' },
    }),
  ])

  const dsoValues = avgDso.map((i) =>
    Math.round((i.paidAt!.getTime() - i.invoiceDate.getTime()) / 86400000)
  )
  const avgDsoValue = dsoValues.length ? Math.round(dsoValues.reduce((a, b) => a + b, 0) / dsoValues.length) : 0

  const customerIds = topCustomers.map((c) => c.customerId)
  const customers = await prisma.customer.findMany({ where: { id: { in: customerIds } } })

  const chartData = await Promise.all(
    Array.from({ length: 6 }, async (_, i) => {
      const monthDate = subMonths(now, 5 - i)
      const start = startOfMonth(monthDate)
      const end = endOfMonth(monthDate)
      const [inv, col] = await Promise.all([
        prisma.invoice.aggregate({ where: { businessId, invoiceDate: { gte: start, lte: end } }, _sum: { amount: true } }),
        prisma.invoice.aggregate({ where: { businessId, status: 'PAID', paidAt: { gte: start, lte: end } }, _sum: { paidAmount: true } }),
      ])
      return {
        month: format(monthDate, 'MMM yy'),
        invoiced: Number(inv._sum.amount ?? 0),
        collected: Number(col._sum.paidAmount ?? 0),
      }
    })
  )

  const collectionRate = totalInvoiced._sum.amount
    ? Math.round((Number(totalCollected._sum.paidAmount ?? 0) / Number(totalInvoiced._sum.amount)) * 100)
    : 0

  return (
    <ReportsClient
      stats={{
        totalInvoiced: Number(totalInvoiced._sum.amount ?? 0),
        totalCollected: Number(totalCollected._sum.paidAmount ?? 0),
        collectionRate,
        avgDsoValue,
      }}
      chartData={chartData}
      topCustomers={topCustomers.map((tc) => ({
        customerId: tc.customerId,
        _sum: { paidAmount: tc._sum.paidAmount ? Number(tc._sum.paidAmount) : 0 },
      }))}
      customers={customers}
      allInvoices={allInvoices.map((inv) => ({
        invoiceNumber: inv.invoiceNumber,
        customer: { name: inv.customer.name },
        amount: Number(inv.amount),
        invoiceDate: inv.invoiceDate.toISOString(),
        dueDate: inv.dueDate.toISOString(),
        status: inv.status,
        paidAmount: inv.paidAmount ? Number(inv.paidAmount) : 0,
        paidAt: inv.paidAt ? inv.paidAt.toISOString() : null,
      }))}
    />
  )
}
