import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { PageHeader } from '@/components/layout/PageHeader'
import { CollectionChart } from '@/components/dashboard/CollectionChart'
import { formatINR } from '@/lib/utils/currency'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

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

  const [totalInvoiced, totalCollected, avgDso, topCustomers] = await Promise.all([
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
    <div className="space-y-6">
      <PageHeader title="Reports" description="Collection analytics for your business" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Total Invoiced', value: formatINR(Number(totalInvoiced._sum.amount ?? 0)) },
          { label: 'Total Collected', value: formatINR(Number(totalCollected._sum.paidAmount ?? 0)) },
          { label: 'Collection Rate', value: `${collectionRate}%` },
          { label: 'Avg DSO', value: `${avgDsoValue} days` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white border border-gray-200 p-5">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="mt-2 text-xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <CollectionChart data={chartData} />

      <div className="rounded-xl bg-white border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Top Paying Customers</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-gray-500">
              <th className="pb-2">#</th>
              <th className="pb-2">Customer</th>
              <th className="pb-2 text-right">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            {topCustomers.map((c, i) => {
              const customer = customers.find((x) => x.id === c.customerId)
              return (
                <tr key={c.customerId} className="border-b border-gray-50">
                  <td className="py-2 text-gray-400">{i + 1}</td>
                  <td className="py-2 font-medium">{customer?.name ?? '—'}</td>
                  <td className="py-2 text-right text-green-700 font-semibold">{formatINR(Number(c._sum.paidAmount ?? 0))}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
