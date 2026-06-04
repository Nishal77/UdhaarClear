import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { Settings02Icon } from '@hugeicons/core-free-icons'
import { ToneEngineDashboard } from '@/components/tone-engine/ToneEngineDashboard'

export default async function ToneEnginePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const businessName = dbUser.ownedBusiness.name

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col select-none">
        <nav className="flex items-center gap-1.5 text-[12px] text-gray-400 text-left">
          <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">Tone Engine</span>
        </nav>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight">AI Tone Escalation Engine</h1>
          <Link
            href="/reminder-customisation"
            className="flex items-center gap-2 rounded-xl bg-[#FF6A39] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#E05B2E] transition-all"
          >
            <HugeiconsIcon icon={Settings02Icon} size={15} />
            Configure Custom Tones
          </Link>
        </div>
        <p className="mt-1 text-[13px] text-gray-400 text-left">
          Automate collections by auto-transitioning debtor accounts through communication channels and message severity
        </p>
      </div>

      {/* ── Interactive Tone Dashboard Workspace ── */}
      <ToneEngineDashboard businessName={businessName} />

    </div>
  )
}
