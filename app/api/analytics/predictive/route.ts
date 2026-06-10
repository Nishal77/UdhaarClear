import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'


export async function GET(request: Request) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const businessId = session.businessId

  try {
    // 1. Check if cached AI insights exist and are from the same calendar day (once per day)
    const cachedInsight = await prisma.aiInsight.findUnique({
      where: { businessId },
    })

    const now = new Date()
    if (cachedInsight) {
      const cachedDate = new Date(cachedInsight.updatedAt)
      const isSameDay =
        cachedDate.getFullYear() === now.getFullYear() &&
        cachedDate.getMonth() === now.getMonth() &&
        cachedDate.getDate() === now.getDate()

      if (isSameDay) {
        const parsedInsights = cachedInsight.insights as any
        // Generate Collections Runway Forecast dynamically from the cached predictions and current outstanding invoices
        const runway = await generateRunwayForecast(businessId, parsedInsights.debtorProfiles)
        return apiSuccess({
          ...parsedInsights,
          runway,
        })
      }
    }

    // 2. Fetch all customers, invoices, and reminder logs to build behavioral context
    const customers = await prisma.customer.findMany({
      where: { businessId, isBlocked: false },
      include: {
        invoices: {
          include: {
            reminders: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    })

    // 3. Filter only customers that have outstanding invoices or recent history
    const activeDebtors = customers.filter((c) => c.invoices.length > 0)

    if (activeDebtors.length === 0) {
      // Fallback empty dataset if no invoice records exist
      const fallback = {
        metrics: {
          projected30dRecoveries: 0,
          avgProbability: 0,
          projectedBadDebt: 0,
          mlOptimizationsCount: 0,
          mlOptimizationsValue: 0,
          aiSuggestionText: 'Log outstanding invoices and reminders to generate collections predictions and behavioral insights.',
        },
        debtorProfiles: [],
      }
      const runway = await generateRunwayForecast(businessId, [])
      return apiSuccess({
        ...fallback,
        runway,
      })
    }

    // 4. Construct a concise debtor behavior profile for the AI context
    const debtorDataForAi = activeDebtors.map((c) => {
      const paidInvoices = c.invoices.filter((i) => i.status === 'PAID')
      const unpaidInvoices = c.invoices.filter((i) => i.status !== 'PAID' && i.status !== 'WRITTEN_OFF')

      // Compute average delay days for paid invoices
      let avgDelayDays = 0
      if (paidInvoices.length > 0) {
        const delays = paidInvoices.map((i) => {
          if (!i.paidAt) return 0
          const diffMs = i.paidAt.getTime() - i.dueDate.getTime()
          return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)))
        })
        avgDelayDays = Math.round(delays.reduce((sum, d) => sum + d, 0) / delays.length)
      }

      // Count reminders by channel
      let whatsappSentCount = 0
      let emailSentCount = 0
      c.invoices.forEach((i) => {
        i.reminders.forEach((r) => {
          if (r.channel === 'WHATSAPP') whatsappSentCount++
          else if (r.channel === 'EMAIL') emailSentCount++
        })
      })

      // Analyze correlation between reminders and payments to extract responsiveness patterns
      const reminderCorrelations: Array<{
        channel: string
        tone: string
        daysToPayAfterReminder: number
      }> = []

      c.invoices.forEach((inv) => {
        if (inv.status === 'PAID' && inv.paidAt) {
          const priorReminders = inv.reminders.filter((r) => r.createdAt < inv.paidAt!)
          if (priorReminders.length > 0) {
            priorReminders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            const lastReminder = priorReminders[0]
            const diffMs = inv.paidAt.getTime() - lastReminder.createdAt.getTime()
            const daysToPay = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)))
            reminderCorrelations.push({
              channel: lastReminder.channel,
              tone: lastReminder.tone,
              daysToPayAfterReminder: daysToPay,
            })
          }
        }
      })

      return {
        customerId: c.id,
        customerName: c.name,
        totalBilled: c.invoices.reduce((sum, i) => sum + Number(i.amount), 0),
        avgDelayDays,
        remindersSent: { whatsapp: whatsappSentCount, email: emailSentCount },
        activeUnpaidCount: unpaidInvoices.length,
        activeUnpaidBalance: unpaidInvoices.reduce((sum, i) => sum + (Number(i.amount) - Number(i.paidAmount ?? 0)), 0),
        invoicesList: unpaidInvoices.map((i) => {
          const daysOverdue = Math.max(0, Math.round((now.getTime() - i.dueDate.getTime()) / (1000 * 60 * 60 * 24)))
          return {
            invoiceNumber: i.invoiceNumber,
            amount: Number(i.amount) - Number(i.paidAmount ?? 0),
            daysOverdue,
          }
        }),
        historicalReminderResponsePatterns: reminderCorrelations,
      }
    })

    // 5. Query OpenAI ChatGPT API using fetch
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined in environment variables')
    }

    const systemPrompt = `You are UdhaarClear's AI Collections and Debtor Behavioral Analyst.
Analyze the payment behavior and historical reminder response patterns of the debtors provided.
Use 'historicalReminderResponsePatterns' to understand their response triggers (e.g. if a customer pays within 1-2 days of a GENTLE WhatsApp reminder vs ignoring Email reminders).
For each debtor:
1. Estimate the collection payment probability (0 to 100).
2. Predict the risk level ('LOW', 'MEDIUM', 'HIGH', or 'CRITICAL') based on invoice delay days, overdue timelines, and reminder counts.
3. Formulate an expected pay date string (e.g. '15 Jun 2026 (±2d)' or 'Default threat (>90d late)'). Base this on the current date: ${now.toDateString()}.
4. Suggest a concrete, actionable collections strategy (e.g. 'Shift to WhatsApp Friday Reminders', 'Trigger Friendly WhatsApp Notice', 'File MSME Samadhaan pre-notice', 'Claim 3x RBI compound interest'). Recommend actions that maximize outcome based on their response patterns.
5. Recommend a target route in our system for optimization ('/tone-engine', '/msme-samadhaan', or '/settings').
6. Provide a 'predictedPayDelayDays' number representing the expected total days past due they will take to pay active invoices.
7. Write an 'mlSummary' summarizing their payment behavior pattern (e.g. "Customer typically clears ledger on Friday afternoons after a WhatsApp reminder.").

Also compute overall statistics:
- 'projected30dRecoveries': expected collections in the next 30 days based on probability-weighted outstanding balances.
- 'avgProbability': average payment probability across active debtors.
- 'projectedBadDebt': percentage of total outstanding AR projected to default.
- 'mlOptimizationsCount': number of recommended actions.
- 'mlOptimizationsValue': estimated recovery impact value from suggestions.
- 'aiSuggestionText': A clear, high-impact paragraph (2-3 sentences) detailing the single most critical daily revenue protection insight. Explain exactly what the user can do for the best outcome (e.g. which channel, tone, or timing to use for specific debtors), providing the context of *why* this works based on their historical response patterns (or noting if no reminders have been sent yet).

Return your response as a strict JSON object conforming to this TypeScript shape:
{
  "metrics": {
    "projected30dRecoveries": number,
    "avgProbability": number,
    "projectedBadDebt": number,
    "mlOptimizationsCount": number,
    "mlOptimizationsValue": number,
    "aiSuggestionText": string
  },
  "debtorProfiles": Array<{
    "customerId": string,
    "customerName": string,
    "balance": number,
    "probability": number,
    "predictedDate": string,
    "riskLevel": 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    "recommendedAction": string,
    "recommendedRoute": string,
    "predictedPayDelayDays": number,
    "behavior": {
      "avgDelayDays": number,
      "responseRates": Array<{ "name": string, "value": number }>,
      "mlSummary": string
    }
  }>
}`

    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(debtorDataForAi) },
        ],
      }),
    })

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text()
      console.error('OpenAI Error:', errorText)
      throw new Error(`OpenAI API responded with status ${chatResponse.status}`)
    }

    const chatData = await chatResponse.json()
    const rawContent = chatData.choices?.[0]?.message?.content
    if (!rawContent) {
      throw new Error('OpenAI returned an empty completions response')
    }

    const aiResult = JSON.parse(rawContent)

    // Save/Update the AI Insights cache in the database
    await prisma.aiInsight.upsert({
      where: { businessId },
      create: {
        businessId,
        insights: aiResult,
      },
      update: {
        insights: aiResult,
        updatedAt: new Date(),
      },
    })

    // Generate runway cash forecast
    const runway = await generateRunwayForecast(businessId, aiResult.debtorProfiles)

    return apiSuccess({
      ...aiResult,
      runway,
    })
  } catch (err: any) {
    console.error('Error generating predictive insights:', err)
    return apiError('AI_GENERATION_FAILED', err.message || String(err), 500)
  }
}

/**
 * Calculates a dynamic 90-day cash forecast collections runway.
 */
async function generateRunwayForecast(businessId: string, debtorProfiles: any[]) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  // Fetch all active unpaid invoices
  const invoices = await prisma.invoice.findMany({
    where: {
      businessId,
      status: { in: ['PENDING', 'DUE', 'OVERDUE', 'PENDING_CONFIRMATION', 'PARTIALLY_PAID'] },
    },
    select: {
      amount: true,
      paidAmount: true,
      dueDate: true,
      customerId: true,
    },
  })

  // Map debtor profiles to a lookup map for quick access to probability & delay days
  const profileMap = new Map<string, { probability: number; delayDays: number }>()
  debtorProfiles.forEach((p) => {
    profileMap.set(p.customerId, {
      probability: p.probability ?? 70,
      delayDays: p.predictedPayDelayDays ?? 15,
    })
  })

  // Create a 90-day timeline array
  const dailyRunwayData: Array<{ date: string; baseline: number; worstCase: number; outstanding: number }> = []

  // Compute forecast for each of the next 90 days
  for (let i = 0; i < 90; i++) {
    const day = new Date(now)
    day.setDate(now.getDate() + i)
    const dateStr = day.toISOString().split('T')[0]

    let totalOutstanding = 0
    let cumulativeBaseline = 0
    let cumulativeWorstCase = 0

    invoices.forEach((inv) => {
      const remainingBalance = Number(inv.amount) - Number(inv.paidAmount ?? 0)
      const p = profileMap.get(inv.customerId)
      const probability = p ? p.probability : 70
      const delayDays = p ? p.delayDays : 15

      // expectedPayDate = dueDate + delayDays
      let expectedPayDate = new Date(inv.dueDate)
      expectedPayDate.setDate(expectedPayDate.getDate() + delayDays)
      
      // If the expected pay date is in the past, adjust it to be in the future (relative to today)
      // so that collections project realistically instead of showing flat curves.
      if (expectedPayDate.getTime() < now.getTime()) {
        // Lower probability means it takes longer to recover
        let recoveryDelay = 5
        if (probability >= 80) recoveryDelay = 3
        else if (probability >= 60) recoveryDelay = 8
        else recoveryDelay = 15

        expectedPayDate = new Date(now)
        expectedPayDate.setDate(now.getDate() + recoveryDelay)
      }
      expectedPayDate.setHours(0, 0, 0, 0)

      // Outstanding AR on this date: the invoice is unpaid and the expected pay date is in the future
      if (expectedPayDate.getTime() > day.getTime()) {
        totalOutstanding += remainingBalance
      }

      // Cumulative recoveries on or before this day
      if (expectedPayDate.getTime() <= day.getTime()) {
        cumulativeBaseline += remainingBalance * (probability / 100)
        // Worst case recovery: count only high-confidence items (prob > 75%), or scale down
        if (probability >= 75) {
          cumulativeWorstCase += remainingBalance * (probability / 100) * 0.7
        } else if (probability >= 50) {
          cumulativeWorstCase += remainingBalance * (probability / 100) * 0.4
        }
      }
    })

    dailyRunwayData.push({
      date: dateStr,
      baseline: Math.round(cumulativeBaseline),
      worstCase: Math.round(cumulativeWorstCase),
      outstanding: Math.round(totalOutstanding),
    })
  }

  return dailyRunwayData
}
