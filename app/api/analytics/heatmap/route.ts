import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'

export async function GET(request: Request) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const businessId = session.businessId

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Fetch all customers of the business with their outstanding invoices
    const customers = await prisma.customer.findMany({
      where: { businessId },
      include: {
        invoices: {
          where: {
            status: {
              in: [
                'PENDING',
                'DUE',
                'OVERDUE',
                'PENDING_CONFIRMATION',
                'PARTIALLY_PAID',
                'DISPUTED',
              ],
            },
          },
        },
      },
    })

    // Filter only customers with active outstanding invoices
    const activeCustomers = customers.filter((c) => c.invoices.length > 0)

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const formatDate = (date: Date) => {
      const d = new Date(date)
      const day = d.getDate().toString().padStart(2, '0')
      const month = months[d.getMonth()]
      const year = d.getFullYear()
      return `${day} ${month} ${year}`
    }

    const heatmapRows = activeCustomers.map((customer) => {
      let current = 0
      let dpd_1_30 = 0
      let dpd_31_45 = 0
      let dpd_46_60 = 0
      let dpd_61_90 = 0
      let dpd_90_plus = 0

      const invoicesGrouped = {
        current: [] as any[],
        dpd_1_30: [] as any[],
        dpd_31_45: [] as any[],
        dpd_46_60: [] as any[],
        dpd_61_90: [] as any[],
        dpd_90_plus: [] as any[],
      }

      let maxDiffDays = -999999

      customer.invoices.forEach((inv) => {
        const remainingAmount = Number(inv.amount) - Number(inv.paidAmount ?? 0)
        if (remainingAmount <= 0) return

        const due = new Date(inv.dueDate)
        due.setHours(0, 0, 0, 0)
        const diffDays = Math.round((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays > maxDiffDays) {
          maxDiffDays = diffDays
        }

        const detailInvoice = {
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          amount: remainingAmount,
          daysLate: Math.max(0, diffDays),
          dueDate: formatDate(inv.dueDate),
          status: diffDays > 0 ? 'OVERDUE' : 'CURRENT',
        }

        if (diffDays <= 0) {
          current += remainingAmount
          invoicesGrouped.current.push(detailInvoice)
        } else if (diffDays <= 30) {
          dpd_1_30 += remainingAmount
          invoicesGrouped.dpd_1_30.push(detailInvoice)
        } else if (diffDays <= 45) {
          dpd_31_45 += remainingAmount
          invoicesGrouped.dpd_31_45.push(detailInvoice)
        } else if (diffDays <= 60) {
          dpd_46_60 += remainingAmount
          invoicesGrouped.dpd_46_60.push(detailInvoice)
        } else if (diffDays <= 90) {
          dpd_61_90 += remainingAmount
          invoicesGrouped.dpd_61_90.push(detailInvoice)
        } else {
          dpd_90_plus += remainingAmount
          invoicesGrouped.dpd_90_plus.push(detailInvoice)
        }
      })

      // Determine customer risk profile level based on the oldest outstanding invoice:
      // CRITICAL if >90 DPD, HIGH if >45 DPD, MEDIUM if >30 DPD, else LOW.
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW'
      if (maxDiffDays > 90) {
        riskLevel = 'CRITICAL'
      } else if (maxDiffDays > 45) {
        riskLevel = 'HIGH'
      } else if (maxDiffDays > 30) {
        riskLevel = 'MEDIUM'
      }

      return {
        id: customer.id,
        customerName: customer.name,
        riskLevel,
        current,
        dpd_1_30,
        dpd_31_45,
        dpd_46_60,
        dpd_61_90,
        dpd_90_plus,
        invoices: invoicesGrouped,
      }
    })

    // Filter out rows that ended up with 0 remaining balance across all buckets
    const validRows = heatmapRows.filter(
      (row) =>
        row.current > 0 ||
        row.dpd_1_30 > 0 ||
        row.dpd_31_45 > 0 ||
        row.dpd_46_60 > 0 ||
        row.dpd_61_90 > 0 ||
        row.dpd_90_plus > 0
    )

    return apiSuccess(validRows)
  } catch (err: any) {
    console.error('Error in Aging Heatmap API:', err)
    return apiError('INTERNAL_SERVER_ERROR', err.message || String(err), 500)
  }
}
