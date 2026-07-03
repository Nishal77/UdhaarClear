import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { formatINR } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'
import { buildReferralLink } from '@/lib/ca/referral'
import { getMonthlyEarningRate } from '@/lib/ca/earnings'
import { ReferralLinkCard } from '@/components/ca/ReferralLinkCard'

const VERIFICATION_BADGE: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Verification pending', className: 'bg-gray-100 text-gray-600' },
  OTP_SENT: { label: 'Verification pending', className: 'bg-gray-100 text-gray-600' },
  VERIFIED: { label: 'Verified partner', className: 'bg-emerald-50 text-emerald-700' },
  MANUAL_REVIEW: { label: 'Under review', className: 'bg-amber-50 text-amber-700' },
  REJECTED: { label: 'Registration rejected', className: 'bg-red-50 text-red-700' },
}

export default async function CADashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      caProfile: {
        include: {
          clients: { orderBy: { createdAt: 'desc' } },
          payouts: { orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }] },
        },
      },
    },
  })

  if (!dbUser?.caProfile) redirect('/ca/onboarding')
  const ca = dbUser.caProfile

  const [earningsAgg, unpaidEarningsAgg] = await Promise.all([
    prisma.cAEarning.aggregate({ where: { caId: ca.id }, _sum: { amount: true } }),
    prisma.cAEarning.aggregate({ where: { caId: ca.id, payoutId: null }, _sum: { amount: true } }),
  ])

  const totalEarnedLifetime = Number(earningsAgg._sum.amount ?? 0)
  const pendingThisMonth = Number(unpaidEarningsAgg._sum.amount ?? 0)
  const activePayingClients = ca.clients.filter((c) => getMonthlyEarningRate(c.planTier) > 0).length

  const referralLink = buildReferralLink(ca.referralCode, process.env.NEXT_PUBLIC_APP_URL ?? 'https://udhaarclear.in')
  const badge = VERIFICATION_BADGE[ca.verificationStatus] ?? VERIFICATION_BADGE.PENDING

  return (
    <div className="min-h-screen bg-[#F9F8F6] px-4 py-8">
      <div className="mx-auto max-w-[880px] space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900">{ca.firmName}</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">CA Partner Dashboard</p>
          </div>
          <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-semibold ${badge.className}`}>
            {badge.label}
          </span>
        </div>

        {ca.verificationStatus === 'MANUAL_REVIEW' && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200/60 px-5 py-4 text-[13px] text-amber-800">
            Your ICAI membership is being manually verified by our team. Your referral link already works — clients you refer now will still be credited to you once verification completes.
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#EBEAE6] bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-500">Active paying clients</p>
            <p className="mt-1.5 text-[26px] font-bold text-gray-900">{activePayingClients}</p>
          </div>
          <div className="rounded-2xl border border-[#EBEAE6] bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-500">Pending payout</p>
            <p className="mt-1.5 text-[26px] font-bold text-gray-900">{formatINR(pendingThisMonth)}</p>
          </div>
          <div className="rounded-2xl border border-[#EBEAE6] bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-500">Total earned lifetime</p>
            <p className="mt-1.5 text-[26px] font-bold text-gray-900">{formatINR(totalEarnedLifetime)}</p>
          </div>
        </div>

        <ReferralLinkCard referralLink={referralLink} />

        {/* Clients */}
        <div className="rounded-2xl border border-[#EBEAE6] bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-[#EBEAE6]">
            <h2 className="text-[15px] font-bold text-gray-900">Referred clients ({ca.clients.length})</h2>
          </div>
          {ca.clients.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-gray-400">
              No clients yet — share your referral link above to start earning.
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11.5px] font-semibold text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-2.5">Business</th>
                  <th className="px-5 py-2.5">Plan</th>
                  <th className="px-5 py-2.5 text-right">Your monthly earning</th>
                  <th className="px-5 py-2.5 text-right">Referred on</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ca.clients.map((client) => (
                  <tr key={client.id} className="text-[13px]">
                    <td className="px-5 py-3 font-semibold text-gray-900">{client.name}</td>
                    <td className="px-5 py-3 text-gray-600">{client.planTier}</td>
                    <td className="px-5 py-3 text-right text-gray-900">
                      {formatINR(getMonthlyEarningRate(client.planTier))}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-500">{formatDate(client.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Payout history */}
        <div className="rounded-2xl border border-[#EBEAE6] bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-[#EBEAE6]">
            <h2 className="text-[15px] font-bold text-gray-900">Payout history</h2>
          </div>
          {ca.payouts.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-gray-400">
              No payouts yet — earnings are paid out monthly after your first billing cycle closes.
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11.5px] font-semibold text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-2.5">Period</th>
                  <th className="px-5 py-2.5 text-right">Gross</th>
                  <th className="px-5 py-2.5 text-right">TDS</th>
                  <th className="px-5 py-2.5 text-right">Net paid</th>
                  <th className="px-5 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ca.payouts.map((payout) => (
                  <tr key={payout.id} className="text-[13px]">
                    <td className="px-5 py-3 font-semibold text-gray-900">
                      {String(payout.periodMonth).padStart(2, '0')}/{payout.periodYear}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-600">{formatINR(Number(payout.grossAmount))}</td>
                    <td className="px-5 py-3 text-right text-gray-600">{formatINR(Number(payout.tdsAmount))}</td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900">{formatINR(Number(payout.netAmount))}</td>
                    <td className="px-5 py-3 text-right text-gray-500">{payout.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}
