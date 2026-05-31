import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { Megaphone02Icon, Settings02Icon, ArrowRight02Icon, CheckmarkSquare01Icon } from '@hugeicons/core-free-icons'

export default async function ToneEnginePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  // Static mock stats for the tone engine dashboard
  const stats = {
    gentleActive: 4,
    firmActive: 3,
    legalActive: 2,
    abTestOpenRate: 94.2
  }

  const escalationPhases = [
    {
      phase: 'Phase 1: Gentle / Courteous Tone',
      days: 'Days 1 to 7 overdue',
      description: 'Polite reminder sent immediately following payment delay. Designed to assume a lapse in attention.',
      channel: 'WHATSAPP & EMAIL',
      sampleText: '"Hi! Just a friendly reminder that invoice INV-2026-003 was due recently. You can settle it instantly here: {{link}}. Thank you!"',
      statusColor: 'text-emerald-600 bg-emerald-50 ring-emerald-600/10',
    },
    {
      phase: 'Phase 2: Firm / Assertive Tone',
      days: 'Days 8 to 21 overdue',
      description: 'Formal notification highlighting late fee warnings, due balance, and overdue days. Direct call-to-action.',
      channel: 'WHATSAPP & EMAIL',
      sampleText: '"Dear partner, invoice INV-2026-001 is now 15 days overdue. A late interest rate of 1.5% may apply. Please settle your dues: {{link}}."',
      statusColor: 'text-amber-600 bg-amber-50 ring-amber-600/10',
    },
    {
      phase: 'Phase 3: Urgent / Demand Tone',
      days: 'Days 22 to 30 overdue',
      description: 'High-priority demand notice indicating pending collections escalation. Direct and uncompromising tone.',
      channel: 'WHATSAPP & EMAIL',
      sampleText: '"URGENT NOTICE: Outstanding invoice INV-2026-006 is 35 days overdue. Settle immediately to avoid credit rating downgrades: {{link}}."',
      statusColor: 'text-orange-600 bg-orange-50 ring-orange-600/10',
    },
    {
      phase: 'Phase 4: Legal Notice Warning',
      days: 'Days 30+ overdue',
      description: 'Final warning notice drafted by legal counsel before generating formal demand drafts or filing MSME Samadhaan disputes.',
      channel: 'EMAIL (REGISTERED)',
      sampleText: '"FINAL DEMAND NOTICE: Legal proceedings will commence if outstanding balance under INV-2026-002 is not cleared within 48 hours."',
      statusColor: 'text-red-600 bg-red-50 ring-red-600/10',
    }
  ]

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col select-none">
        <nav className="flex items-center gap-1.5 text-[12px] text-gray-400">
          <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">Tone Engine</span>
        </nav>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight">Tone Engine</h1>
          <Link
            href="/reminder-customisation"
            className="flex items-center gap-2 rounded-xl bg-[#FF6A39] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#E05B2E] transition-all"
          >
            <HugeiconsIcon icon={Settings02Icon} size={15} />
            Configure Custom Tones
          </Link>
        </div>
        <p className="mt-1 text-[13px] text-gray-400">
          Manage automated message tones, escalation levels, and delivery templates
        </p>
      </div>

      {/* ── Stat Cards (Unified split card) ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] overflow-hidden select-none">
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x">

          {/* Column 1: Gentle Templates */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Gentle Reminders</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                {stats.gentleActive}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium whitespace-nowrap">
                Active templates
              </span>
            </div>
          </div>

          {/* Column 2: Firm Templates */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Firm Reminders</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                {stats.firmActive}
              </span>
              <span className="text-[11px] text-amber-500 font-medium whitespace-nowrap">
                Assertive escalations
              </span>
            </div>
          </div>

          {/* Column 3: Legal Templates */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Legal Demand notices</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-red-600 tracking-tight leading-none">
                {stats.legalActive}
              </span>
              <span className="text-[11px] text-red-600 font-medium whitespace-nowrap">
                Demand drafts active
              </span>
            </div>
          </div>

          {/* Column 4: A/B Test Recovery */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Recovery Optimization</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-emerald-600 tracking-tight leading-none">
                {stats.abTestOpenRate}%
              </span>
              <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                Tone conversion rate
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Tone Escalation List ── */}
      <div className="rounded-2xl bg-white border border-[#EBEAE6]/60 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-[16px] font-bold text-gray-900 select-none">Escalation Phases & Tone Mapping</h2>
          <p className="text-[12.5px] text-gray-400 mt-1 select-none">Defaulters are automatically transitioned through recovery phases based on late duration.</p>
        </div>

        <div className="divide-y divide-gray-50">
          {escalationPhases.map((phase, idx) => (
            <div key={phase.phase} className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-gray-50/20 transition-colors">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[12px] font-bold text-gray-400 font-mono select-none">
                    0{idx + 1}
                  </span>
                  <h3 className="text-[15px] font-bold text-gray-900 leading-tight">
                    {phase.phase}
                  </h3>
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ring-1 ring-inset ${phase.statusColor}`}>
                    {phase.days}
                  </span>
                </div>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed select-none">
                  {phase.description}
                </p>
                <div className="pt-2">
                  <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 select-none">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Preview</span>
                    <p className="text-[12.5px] text-gray-600 font-mono italic">
                      {phase.sampleText}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-between self-stretch shrink-0">
                <span className="inline-flex items-center rounded-full bg-[#E8F8F0] px-2.5 py-0.5 text-[11px] font-semibold text-[#075E54] select-none">
                  {phase.channel}
                </span>
                
                <Link
                  href="/reminder-customisation"
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-gray-700 hover:text-[#FF6A39] transition-all select-none group/btn mt-4 md:mt-0"
                >
                  <span>Edit Template</span>
                  <HugeiconsIcon 
                    icon={ArrowRight02Icon} 
                    size={14} 
                    className="text-gray-400 group-hover/btn:translate-x-0.5 transition-transform duration-200" 
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
