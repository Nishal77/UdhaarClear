import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import Link from 'next/link'
import { AiPredictiveInsights } from '@/components/analytics/AiPredictiveInsights'

export default async function AiPredictiveInsightsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  return (
    <div className="space-y-4">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col select-none">
        <nav className="flex items-center gap-1.5 text-[12px] text-gray-400 text-left">
          <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-455">Analytics</span>
          <span>›</span>
          <span className="text-gray-600 font-medium">AI Predictive Insights</span>
        </nav>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight">AI Predictive Insights</h1>
        </div>
        <p className="mt-1 text-[13px] text-gray-400 text-left font-medium">
          Leverage machine learning collections forecasting, payment probability analytics, and debtor optimization insights.
        </p>
      </div>

      {/* ── Interactive Workspace ── */}
      <AiPredictiveInsights />

    </div>
  )
}
