import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { Settings02Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons'

export default async function ReminderCustomisationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  // Static mock stats for customizations
  const stats = {
    whatsappActive: 'Active',
    emailActive: 'Active',
    smsBackup: 'Disabled',
    dailyLimits: 'Unlimited'
  }

  const customisableSettings = [
    {
      title: 'WhatsApp Template Custom Variables',
      description: 'Configure standard placeholder parameters such as client name, invoice number, due date, outstanding amounts, and payment handles.',
      tags: ['Template ID', 'Auto Reconciled']
    },
    {
      title: 'Reminder Dispatch Frequency Intervals',
      description: 'Set custom escalation intervals. The engine defaults to Day 1, Day 8, Day 15, Day 22, and Day 30 following invoice overdue dates.',
      tags: ['Schedules', 'Time Windows']
    },
    {
      title: 'Active Dispatch Time Windows',
      description: 'Restrict automated recovery dispatches strictly between 10:00 AM and 7:00 PM on weekdays to comply with commercial communication guidelines.',
      tags: ['Business Hours Only', 'Do Not Disturb']
    },
    {
      title: 'Email Signature & Custom Reconciler',
      description: 'Attach your formal business legal name, contact credentials, and custom bank transfer payment instructions at the footer of recovery emails.',
      tags: ['Trust Factors', 'KYC Approved']
    }
  ]

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col select-none">
        <nav className="flex items-center gap-1.5 text-[12px] text-gray-400">
          <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">Customise Reminders</span>
        </nav>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight">Customise Reminders</h1>
          <button
            className="flex items-center gap-2 rounded-xl bg-[#FF6A39] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#E05B2E] transition-all cursor-not-allowed opacity-90"
            disabled
          >
            <HugeiconsIcon icon={Settings02Icon} size={15} />
            Save Customizations
          </button>
        </div>
        <p className="mt-1 text-[13px] text-gray-400">
          Modify notification frequencies, active hours, and template bodies
        </p>
      </div>

      {/* ── Stat Cards (Unified split card) ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] overflow-hidden select-none">
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x">

          {/* Column 1: WhatsApp Channel */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">WhatsApp Channel</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[23px] font-bold text-emerald-600 tracking-tight leading-none">
                {stats.whatsappActive}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium whitespace-nowrap">
                Default primary
              </span>
            </div>
          </div>

          {/* Column 2: Email Channel */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Email Channel</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[23px] font-bold text-emerald-600 tracking-tight leading-none">
                {stats.emailActive}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium whitespace-nowrap">
                Backup active
              </span>
            </div>
          </div>

          {/* Column 3: SMS Backup */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">SMS Backup</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[23px] font-bold text-gray-400 tracking-tight leading-none">
                {stats.smsBackup}
              </span>
              <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                Channels limited
              </span>
            </div>
          </div>

          {/* Column 4: Daily Limits */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Recovery Dispatch Limits</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[23px] font-bold text-gray-900 tracking-tight leading-none">
                {stats.dailyLimits}
              </span>
              <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                Unlimited collection alerts
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Customisable Settings Modules ── */}
      <div className="rounded-2xl bg-white border border-[#EBEAE6]/60 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-[16px] font-bold text-gray-900 select-none">Reminder Engine Configuration</h2>
          <p className="text-[12.5px] text-gray-400 mt-1 select-none">Custom rules applied when the dispatch engine aggregates unpaid balances.</p>
        </div>

        <div className="divide-y divide-gray-50">
          {customisableSettings.map((set, idx) => (
            <div key={set.title} className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-gray-50/20 transition-colors">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[12px] font-bold text-gray-400 font-mono select-none">
                    0{idx + 1}
                  </span>
                  <h3 className="text-[15px] font-bold text-gray-900 leading-tight">
                    {set.title}
                  </h3>
                </div>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed select-none">
                  {set.description}
                </p>
                <div className="flex items-center gap-2 pt-1 flex-wrap select-none">
                  {set.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-center self-stretch shrink-0">
                <button
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-gray-700 hover:text-[#FF6A39] transition-all select-none group/btn cursor-not-allowed opacity-90"
                  disabled
                >
                  <span>Configure Settings</span>
                  <HugeiconsIcon 
                    icon={ArrowRight02Icon} 
                    size={14} 
                    className="text-gray-400 group-hover/btn:translate-x-0.5 transition-transform duration-200" 
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
