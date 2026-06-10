// Recompile trigger comment
import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'

export async function GET(request: Request) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const businessId = session.businessId
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get('timeRange') ?? '6_months'

  const now = new Date()
  let startDate = new Date()
  let prevStartDate = new Date()
  let prevEndDate = new Date()

  // Calculate the dates for the current and previous period of the same duration
  if (timeRange === '30_days') {
    startDate.setDate(now.getDate() - 30)
    prevStartDate.setDate(now.getDate() - 60)
    prevEndDate.setDate(now.getDate() - 30)
  } else if (timeRange === '90_days') {
    startDate.setDate(now.getDate() - 90)
    prevStartDate.setDate(now.getDate() - 180)
    prevEndDate.setDate(now.getDate() - 90)
  } else if (timeRange === '6_months') {
    startDate.setMonth(now.getMonth() - 6)
    prevStartDate.setMonth(now.getMonth() - 12)
    prevEndDate.setMonth(now.getMonth() - 6)
  } else if (timeRange === 'ytd') {
    startDate = new Date(now.getFullYear(), 0, 1)
    const durationMs = now.getTime() - startDate.getTime()
    prevStartDate = new Date(startDate.getTime() - durationMs)
    prevEndDate = new Date(startDate)
  } else {
    // default to 30 days
    startDate.setDate(now.getDate() - 30)
    prevStartDate.setDate(now.getDate() - 60)
    prevEndDate.setDate(now.getDate() - 30)
  }

  // Fetch all invoices for the business along with reminders
  const invoices = await prisma.invoice.findMany({
    where: { businessId },
    select: {
      id: true,
      amount: true,
      paidAmount: true,
      paidAt: true,
      invoiceDate: true,
      dueDate: true,
      status: true,
      legalNoticeSentAt: true,
      reminders: {
        select: {
          channel: true,
          tone: true,
          createdAt: true,
        },
      },
    },
  })

  // 1. Total Recovered (current vs previous)
  let totalRecovered = 0
  let prevTotalRecovered = 0

  for (const inv of invoices) {
    if (inv.paidAmount && inv.paidAt) {
      const pAmt = Number(inv.paidAmount)
      if (inv.paidAt >= startDate && inv.paidAt <= now) {
        totalRecovered += pAmt
      } else if (inv.paidAt >= prevStartDate && inv.paidAt < prevEndDate) {
        prevTotalRecovered += pAmt
      }
    }
  }

  let recoveredDiffPercent = 0
  if (prevTotalRecovered > 0) {
    recoveredDiffPercent = ((totalRecovered - prevTotalRecovered) / prevTotalRecovered) * 100
  } else if (totalRecovered > 0) {
    recoveredDiffPercent = 100 // 100% growth if there was no collection previously
  }

  const rangeSuffix = 
    timeRange === '30_days' ? '30d' :
    timeRange === '90_days' ? '90d' :
    timeRange === '6_months' ? '90d' : 'YTD' // Wait, the UI has "vs last 30d", "vs last 90d", etc.

  const recoveredDiffText = `${recoveredDiffPercent >= 0 ? '+' : ''}${recoveredDiffPercent.toFixed(1)}% vs last ${rangeSuffix}`

  // 2. Recovery Success Rate
  // Billed amounts in the current period
  let totalBilled = 0
  let totalPaidForBilled = 0
  for (const inv of invoices) {
    if (inv.invoiceDate >= startDate && inv.invoiceDate <= now) {
      totalBilled += Number(inv.amount)
      if (inv.paidAmount) {
        totalPaidForBilled += Number(inv.paidAmount)
      }
    }
  }
  const successRate = totalBilled > 0 ? Number(((totalPaidForBilled / totalBilled) * 100).toFixed(1)) : 0

  // 3. Avg Days to Collect (current vs previous)
  let currentCollectDaysSum = 0
  let currentCollectCount = 0
  let prevCollectDaysSum = 0
  let prevCollectCount = 0

  for (const inv of invoices) {
    if (inv.paidAt && (inv.status === 'PAID' || inv.status === 'PARTIALLY_PAID')) {
      const diffMs = inv.paidAt.getTime() - inv.invoiceDate.getTime()
      const diffDays = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)))

      if (inv.paidAt >= startDate && inv.paidAt <= now) {
        currentCollectDaysSum += diffDays
        currentCollectCount++
      } else if (inv.paidAt >= prevStartDate && inv.paidAt < prevEndDate) {
        prevCollectDaysSum += diffDays
        prevCollectCount++
      }
    }
  }

  const avgDaysToCollect = currentCollectCount > 0 ? Math.round(currentCollectDaysSum / currentCollectCount) : 0
  const prevAvgDaysToCollect = prevCollectCount > 0 ? Math.round(prevCollectDaysSum / prevCollectCount) : 0

  const daysDiff = avgDaysToCollect - prevAvgDaysToCollect
  let daysDiffText = '0 days change'
  if (daysDiff < 0) {
    daysDiffText = `${Math.abs(daysDiff)} days improvement`
  } else if (daysDiff > 0) {
    daysDiffText = `+${daysDiff} days increase`
  }

  // 4. Outstanding Queue (within the timeframe)
  let outstanding = 0
  for (const inv of invoices) {
    if (inv.invoiceDate >= startDate && inv.invoiceDate <= now) {
      if (inv.status !== 'PAID' && inv.status !== 'WRITTEN_OFF') {
        const remaining = Number(inv.amount) - Number(inv.paidAmount ?? 0)
        outstanding += Math.max(0, remaining)
      }
    }
  }

  // 5. Daily Trend (Billed vs Recovered)
  const dailyDataMap = new Map<string, { date: string, desktop: number, mobile: number }>()
  
  const tempDate = new Date(startDate)
  // Ensure time fields are clean for comparison
  tempDate.setHours(0, 0, 0, 0)
  const limitDate = new Date(now)
  limitDate.setHours(23, 59, 59, 999)

  while (tempDate <= limitDate) {
    const dateStr = tempDate.toISOString().split('T')[0]
    dailyDataMap.set(dateStr, {
      date: dateStr,
      desktop: 0,
      mobile: 0
    })
    tempDate.setDate(tempDate.getDate() + 1)
  }

  for (const inv of invoices) {
    const invDateStr = inv.invoiceDate.toISOString().split('T')[0]
    if (dailyDataMap.has(invDateStr)) {
      const data = dailyDataMap.get(invDateStr)!
      data.desktop += Number(inv.amount)
    }

    if (inv.paidAt && inv.paidAmount) {
      const paidDateStr = inv.paidAt.toISOString().split('T')[0]
      if (dailyDataMap.has(paidDateStr)) {
        const data = dailyDataMap.get(paidDateStr)!
        data.mobile += Number(inv.paidAmount)
      }
    }
  }

  const trend = Array.from(dailyDataMap.values())

  // 6. Channels Attribution (Total Recovered by Reminders/Notice channel)
  let whatsappVal = 0
  let emailVal = 0
  let legalVal = 0
  let msmeVal = 0

  for (const inv of invoices) {
    if (inv.paidAmount && inv.paidAt && inv.paidAt >= startDate && inv.paidAt <= now) {
      const amt = Number(inv.paidAmount)
      if (inv.legalNoticeSentAt) {
        legalVal += amt
      } else {
        const daysOverdueAtPayment = (inv.paidAt.getTime() - inv.dueDate.getTime()) / (1000 * 60 * 60 * 24)
        if (daysOverdueAtPayment > 45) {
          msmeVal += amt
        } else {
          // Check reminders sent for this invoice
          const sentReminders = inv.reminders.filter((r) => r.createdAt < inv.paidAt!)
          if (sentReminders.length > 0) {
            sentReminders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            const latest = sentReminders[0]
            if (latest.channel === 'EMAIL') {
              emailVal += amt
            } else {
              whatsappVal += amt
            }
          } else {
            // Default recovery attribution
            whatsappVal += amt
          }
        }
      }
    }
  }

  const channels = [
    { name: 'WhatsApp', value: whatsappVal },
    { name: 'Email', value: emailVal },
    { name: 'Legal Notices', value: legalVal },
    { name: 'MSME Samadhaan', value: msmeVal },
  ]

  // 7. Aging DPD Buckets of recovered debts
  let dpd0_30 = 0
  let dpd31_45 = 0
  let dpd46_60 = 0
  let dpd60_plus = 0

  for (const inv of invoices) {
    if (inv.paidAmount && inv.paidAt && inv.paidAt >= startDate && inv.paidAt <= now) {
      const amt = Number(inv.paidAmount)
      const dpd = (inv.paidAt.getTime() - inv.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      if (dpd <= 30) {
        dpd0_30 += amt
      } else if (dpd <= 45) {
        dpd31_45 += amt
      } else if (dpd <= 60) {
        dpd46_60 += amt
      } else {
        dpd60_plus += amt
      }
    }
  }

  const aging = [
    { name: '0-30 Days DPD', value: dpd0_30, colorClass: 'bg-gradient-to-r from-emerald-500/5 to-emerald-500/15' },
    { name: '31-45 Days DPD', value: dpd31_45, colorClass: 'bg-gradient-to-r from-blue-500/5 to-blue-500/15' },
    { name: '46-60 Days DPD', value: dpd46_60, colorClass: 'bg-gradient-to-r from-amber-500/5 to-amber-500/15' },
    { name: '>60 Days DPD', value: dpd60_plus, colorClass: 'bg-gradient-to-r from-rose-500/5 to-rose-500/15' },
  ]

  return apiSuccess({
    metrics: {
      totalRecovered,
      recoveredDiffPercent,
      recoveredDiffText,
      rate: successRate,
      daysToCollect: avgDaysToCollect,
      daysDiff,
      daysDiffText,
      outstanding,
    },
    trend,
    channels,
    aging,
  })
}
