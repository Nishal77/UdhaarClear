import { prisma } from '@/lib/prisma/client'
import { getMonthlyEarningRate } from '@/lib/ca/earnings'
import { calculateTDS, getFinancialYearStart } from '@/lib/ca/tds'
import { ensureContactAndFundAccount, createPayout } from '@/lib/ca/payouts'
import { formatINR } from '@/lib/utils/currency'

export interface CAMonthlyPayoutResult {
  earningsCreated: number
  payoutsCreated: number
  payoutsPaid: number
  payoutsFailed: number
  errors: string[]
}

/** The most recently closed calendar month, as (1-12, year) — this job runs on the 1st, processing the month that just ended. */
function getPreviousPeriod(now: Date): { periodMonth: number; periodYear: number } {
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return { periodMonth: previousMonthDate.getMonth() + 1, periodYear: previousMonthDate.getFullYear() }
}

/**
 * Step 1 of the monthly job: for every verified CA, create one CAEarning row
 * per referred client that's on a paying plan this month. Upsert-based, so
 * re-running the cron for a month that already ran is a safe no-op.
 */
async function generateMonthlyEarnings(periodMonth: number, periodYear: number): Promise<number> {
  const verifiedCAs = await prisma.cAProfile.findMany({
    where: { verificationStatus: { in: ['VERIFIED', 'MANUAL_REVIEW'] } },
    include: { clients: true },
  })

  let created = 0

  for (const ca of verifiedCAs) {
    for (const client of ca.clients) {
      const amount = getMonthlyEarningRate(client.planTier)
      if (amount <= 0) continue // free-plan clients earn the CA nothing

      const alreadyExists = await prisma.cAEarning.findUnique({
        where: {
          caId_businessId_periodMonth_periodYear: {
            caId: ca.id,
            businessId: client.id,
            periodMonth,
            periodYear,
          },
        },
        select: { id: true },
      })
      if (alreadyExists) continue // this cron run already processed this CA+client+period

      await prisma.cAEarning.create({
        data: {
          caId: ca.id,
          businessId: client.id,
          planTier: client.planTier,
          amount,
          periodMonth,
          periodYear,
        },
      })
      created++
    }
  }

  return created
}

/**
 * Step 2 of the monthly job: for every CA with unpaid earnings, batch them
 * into a CAPayout for the period, apply TDS based on their financial-year
 * cumulative total, and attempt the actual bank transfer. A CA with no bank
 * details on file gets a PENDING payout row (earnings are safely held, not
 * lost) rather than a failed transfer attempt.
 */
async function processPayoutsForPeriod(periodMonth: number, periodYear: number): Promise<{
  payoutsCreated: number
  payoutsPaid: number
  payoutsFailed: number
  errors: string[]
}> {
  const errors: string[] = []
  let payoutsCreated = 0
  let payoutsPaid = 0
  let payoutsFailed = 0

  const casWithUnpaidEarnings = await prisma.cAProfile.findMany({
    where: { earnings: { some: { payoutId: null, periodMonth, periodYear } } },
  })

  for (const ca of casWithUnpaidEarnings) {
    try {
      const unpaidEarnings = await prisma.cAEarning.findMany({
        where: { caId: ca.id, payoutId: null, periodMonth, periodYear },
      })
      const grossAmount = unpaidEarnings.reduce((sum, e) => sum + Number(e.amount), 0)
      if (grossAmount <= 0) continue

      const fyStart = getFinancialYearStart(new Date(periodYear, periodMonth - 1, 1))
      const priorPayoutsThisFY = await prisma.cAPayout.aggregate({
        where: { caId: ca.id, createdAt: { gte: fyStart } },
        _sum: { grossAmount: true },
      })
      const cumulativeBefore = Number(priorPayoutsThisFY._sum.grossAmount ?? 0)
      const { tdsAmount, netAmount } = calculateTDS(cumulativeBefore, grossAmount)

      const payout = await prisma.cAPayout.create({
        data: {
          caId: ca.id,
          periodMonth,
          periodYear,
          grossAmount,
          tdsAmount,
          netAmount,
          status: 'PENDING',
        },
      })
      await prisma.cAEarning.updateMany({
        where: { id: { in: unpaidEarnings.map((e) => e.id) } },
        data: { payoutId: payout.id },
      })
      payoutsCreated++

      const hasBankDetails = ca.bankAccountNo && ca.bankIfsc && ca.bankAccountName
      if (!hasBankDetails) {
        errors.push(`CA ${ca.id}: payout of ${formatINR(netAmount)} created but held — no bank details on file`)
        continue
      }

      const { razorpayFundAccountId } = await ensureContactAndFundAccount(
        {
          caProfileId: ca.id,
          name: ca.firmName,
          phone: ca.phone,
          bankAccountNo: ca.bankAccountNo!,
          bankIfsc: ca.bankIfsc!,
          bankAccountName: ca.bankAccountName!,
        },
        { razorpayContactId: ca.razorpayContactId, razorpayFundAccountId: ca.razorpayFundAccountId }
      )

      if (razorpayFundAccountId !== ca.razorpayFundAccountId) {
        await prisma.cAProfile.update({
          where: { id: ca.id },
          data: { razorpayFundAccountId, razorpayContactId: ca.razorpayContactId },
        })
      }

      const payoutResult = await createPayout({
        fundAccountId: razorpayFundAccountId,
        amountRupees: netAmount,
        narration: `UdhaarClear commission ${String(periodMonth).padStart(2, '0')}/${periodYear}`,
        referenceId: payout.id, // idempotency: retrying this payout reuses the same reference
      })

      await prisma.cAPayout.update({
        where: { id: payout.id },
        data: {
          status: 'PAID',
          razorpayPayoutId: payoutResult.razorpayPayoutId,
          paidAt: new Date(),
        },
      })
      payoutsPaid++
    } catch (err) {
      payoutsFailed++
      const reason = err instanceof Error ? err.message : String(err)
      errors.push(`CA ${ca.id}: payout failed — ${reason}`)
      await prisma.cAPayout
        .updateMany({
          where: { caId: ca.id, periodMonth, periodYear, status: 'PENDING' },
          data: { status: 'FAILED', failureReason: reason },
        })
        .catch(() => {})
    }
  }

  return { payoutsCreated, payoutsPaid, payoutsFailed, errors }
}

export async function runCAMonthlyPayoutJob(now: Date = new Date()): Promise<CAMonthlyPayoutResult> {
  const { periodMonth, periodYear } = getPreviousPeriod(now)

  const earningsCreated = await generateMonthlyEarnings(periodMonth, periodYear)
  const { payoutsCreated, payoutsPaid, payoutsFailed, errors } = await processPayoutsForPeriod(periodMonth, periodYear)

  return { earningsCreated, payoutsCreated, payoutsPaid, payoutsFailed, errors }
}
