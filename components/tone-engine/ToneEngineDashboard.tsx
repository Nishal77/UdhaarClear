'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Settings02Icon,
  ArrowRight02Icon,
  WhatsappIcon,
  Megaphone02Icon,
  TickDouble01Icon,
} from '@hugeicons/core-free-icons'
import { toast } from 'sonner'

export interface EscalationPhase {
  id: number
  phase: string
  daysStart: number
  daysEnd: number | 'unlimited'
  description: string
  sampleTextWhatsapp: string
  sampleTextEmail: string
  sampleTextSms: string
  statusColor: string
  badgeColor: string
  statsReadRate: string
  statsResponseTime: string
  enabled: boolean
  channels: ('WHATSAPP' | 'EMAIL' | 'SMS')[]
}

const DEFAULT_PHASES = (): EscalationPhase[] => [
  {
    id: 1,
    phase: 'Gentle / Courteous Tone',
    daysStart: 1,
    daysEnd: 7,
    description: 'Polite reminder sent immediately following payment delay. Designed to assume a lapse in attention.',
    sampleTextWhatsapp: 'Hi! Just a friendly reminder that invoice *{{invoiceRef}}* for *{{amount}}* was due recently. You can settle it instantly here: {{link}}. Thank you!',
    sampleTextEmail: 'Dear {{customerName}},\n\nWe hope you are doing well. This is a quick note to remind you that Invoice {{invoiceRef}} for {{amount}} was due recently.\n\nYou can review and pay online here: {{link}}.\n\nLet us know if you have any questions.\n\nRegards,\nUdhaarClear Alerts',
    sampleTextSms: 'UdhaarClear: Friendly reminder that invoice {{invoiceRef}} of {{amount}} was due. Settle here: {{link}}',
    statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/50',
    badgeColor: 'bg-emerald-500 text-white',
    statsReadRate: '94.2%',
    statsResponseTime: '4.8 hours',
    enabled: true,
    channels: ['WHATSAPP', 'EMAIL', 'SMS']
  },
  {
    id: 2,
    phase: 'Firm / Assertive Tone',
    daysStart: 8,
    daysEnd: 21,
    description: 'Formal notification highlighting late fee warnings, due balance, and overdue days. Direct call-to-action.',
    sampleTextWhatsapp: 'Dear partner, your invoice *{{invoiceRef}}* for *{{amount}}* is now *{{overdueDays}} days* overdue. A late fee interest rate of 1.5% may apply. Please settle your dues: {{link}}',
    sampleTextEmail: 'Dear {{customerName}},\n\nYour invoice {{invoiceRef}} for {{amount}} is now {{overdueDays}} days overdue.\n\nPlease note that a late interest rate of 1.5% may be applied under terms of service.\n\nPlease pay immediately via this link: {{link}}\n\nRegards,\nUdhaarClear Support',
    sampleTextSms: 'UdhaarClear Alert: Invoice {{invoiceRef}} of {{amount}} is {{overdueDays}} days overdue. Interest may apply. Pay now: {{link}}',
    statusColor: 'text-amber-700 bg-amber-50 border-amber-200/50',
    badgeColor: 'bg-amber-500 text-white',
    statsReadRate: '81.5%',
    statsResponseTime: '12.4 hours',
    enabled: true,
    channels: ['WHATSAPP', 'EMAIL', 'SMS']
  },
  {
    id: 3,
    phase: 'Urgent / Demand Tone',
    daysStart: 22,
    daysEnd: 30,
    description: 'High-priority demand notice indicating pending collections escalation. Direct and uncompromising tone.',
    sampleTextWhatsapp: 'URGENT NOTICE: *{{customerName}}*, invoice *{{invoiceRef}}* of *{{amount}}* is *{{overdueDays}} days* overdue. Continued delay will result in credit rating reviews. Settle instantly: {{link}}',
    sampleTextEmail: 'URGENT NOTICE:\n\nDear {{customerName}},\n\nOutstanding invoice {{invoiceRef}} is {{overdueDays}} days overdue. We have attempted multiple notifications. If payment is not received, we may begin formal collection proceedings.\n\nSettle immediately to prevent escalation: {{link}}\n\nRegards,\nUdhaarClear Collections',
    sampleTextSms: 'UdhaarClear URGENT: INV-2026-003 is {{overdueDays}} days overdue. Settle immediately to avoid credit reviews: {{link}}',
    statusColor: 'text-orange-700 bg-orange-50 border-orange-200/50',
    badgeColor: 'bg-orange-500 text-white',
    statsReadRate: '62.8%',
    statsResponseTime: '24.1 hours',
    enabled: true,
    channels: ['WHATSAPP', 'EMAIL', 'SMS']
  },
  {
    id: 4,
    phase: 'Legal Notice Warning',
    daysStart: 31,
    daysEnd: 'unlimited',
    description: 'Final warning notice drafted by legal counsel before generating formal demand drafts or filing MSME Samadhaan disputes.',
    sampleTextWhatsapp: 'FINAL LEGAL WARNING: *{{customerName}}*, invoice *{{invoiceRef}}* (*{{amount}}*) is *{{overdueDays}} days* overdue. Recovery action will commence under MSME Samadhaan rules. Clear immediately: {{link}}',
    sampleTextEmail: 'FINAL DEMAND NOTICE:\n\nDear {{customerName}},\n\nLegal proceedings will commence if outstanding balance of {{amount}} under Invoice {{invoiceRef}} is not cleared within 48 hours.\n\nYour failure to respond will result in a formal dispute filed on MSME Samadhaan, claiming compound interest under MSME Development Act.\n\nClear immediately: {{link}}',
    sampleTextSms: 'UdhaarClear LEGAL: Final notice for {{invoiceRef}} ({{amount}}). Legal action commences if unpaid within 48h: {{link}}',
    statusColor: 'text-red-700 bg-red-50 border-red-200/50',
    badgeColor: 'bg-red-500 text-white',
    statsReadRate: '95.0%',
    statsResponseTime: '48.0 hours',
    enabled: true,
    channels: ['EMAIL']
  }
]

export function ToneEngineDashboard({
  businessName = 'UdhaarClear'
}: {
  businessName?: string
}) {
  const [phases, setPhases] = useState<EscalationPhase[]>(DEFAULT_PHASES())
  const [activeIdx, setActiveIdx] = useState<number>(0)
  const [activeChannel, setActiveChannel] = useState<'WHATSAPP' | 'EMAIL' | 'SMS'>('WHATSAPP')
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState('')

  const activePhase = phases[activeIdx]

  // Ensure selected channel is available for the active phase
  const getSelectedChannel = () => {
    if (activePhase.channels.includes(activeChannel)) return activeChannel
    return activePhase.channels[0]
  };

  const currentChannel = getSelectedChannel();

  // Get current active template text
  const getTemplateText = () => {
    if (currentChannel === 'WHATSAPP') return activePhase.sampleTextWhatsapp
    if (currentChannel === 'EMAIL') return activePhase.sampleTextEmail
    return activePhase.sampleTextSms
  };

  // Toggle active state
  const handleTogglePhase = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setPhases(phases.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))
    toast.success(`Phase ${id} status updated`)
  }

  // Update day ranges
  const handleDayChange = (id: number, field: 'daysStart' | 'daysEnd', val: number) => {
    setPhases(phases.map(p => {
      if (p.id === id) {
        return { ...p, [field]: val }
      }
      return p
    }))
  }

  // Enter edit mode
  const startEdit = () => {
    setEditedText(getTemplateText())
    setIsEditing(true)
  }

  // Save template edit
  const saveEdit = () => {
    setPhases(phases.map((p, idx) => {
      if (idx === activeIdx) {
        if (currentChannel === 'WHATSAPP') return { ...p, sampleTextWhatsapp: editedText }
        if (currentChannel === 'EMAIL') return { ...p, sampleTextEmail: editedText }
        return { ...p, sampleTextSms: editedText }
      }
      return p
    }))
    setIsEditing(false)
    toast.success('Communication template updated locally!')
  }

  // Render WhatsApp ticks
  const renderWhatsAppTicks = () => {
    if (activeIdx === 0) {
      return <span className="text-[#34B7F1] font-bold text-[10px]">✓✓</span>
    } else if (activeIdx === 1) {
      return <span className="text-[#34B7F1] font-bold text-[10px]">✓✓</span>
    } else if (activeIdx === 2) {
      return <span className="text-gray-400 font-bold text-[10px]">✓✓</span>
    }
    return <span className="text-gray-400 font-bold text-[10px]">✓</span>
  }

  // Helper to format preview tokens
  const formatTokens = (txt: string) => {
    if (!txt) return ''
    let processed = txt
      .replaceAll('{{invoiceRef}}', 'INV-2026-003')
      .replaceAll('{{amount}}', '₹88,500')
      .replaceAll('{{customerName}}', 'Ramesh Traders')
      .replaceAll('{{overdueDays}}', activeIdx === 1 ? '10' : activeIdx === 2 ? '25' : '35')
      .replaceAll('{{link}}', 'https://udhaarclear.com/pay/inv-003')

    // Bold tags formatting
    return processed.split('*').map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-bold text-gray-900">{part}</strong>
      }
      return part
    })
  }

  return (
    <div className="space-y-4">
      
      {/* ── Stats Bar inside Bg Gray Panel ── */}
      <div className="bg-[#F8F9FA] border border-[#EBEAE6] p-1.5 rounded-[22px] overflow-hidden select-none shadow-3xs">
        <div className="bg-white rounded-[16px] border border-gray-100">
          <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x text-left">
            
            {/* Stat 1 */}
            <div className="px-5 py-3 flex flex-col justify-center">
              <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Total Pipeline Phases</span>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-[22px] font-bold text-gray-900 leading-none">
                  {phases.filter(p => p.enabled).length} / {phases.length}
                </span>
                <span className="text-[10.5px] text-emerald-600 font-semibold">All active</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="px-5 py-3 flex flex-col justify-center">
              <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Auto-Escalation</span>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-[22px] font-bold text-gray-900 leading-none">Enabled</span>
                <span className="text-[10.5px] text-gray-400 font-medium">Based on DPD trigger</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="px-5 py-3 flex flex-col justify-center">
              <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Pipeline Conversion</span>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-[22px] font-bold text-emerald-600 leading-none">94.2%</span>
                <span className="text-[10.5px] text-emerald-600 font-semibold">Overdue cleared</span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="px-5 py-3 flex flex-col justify-center">
              <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Active Days Range</span>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-[22px] font-bold text-gray-900 leading-none">1 - 30+ Days</span>
                <span className="text-[10.5px] text-gray-400 font-medium font-semibold">Overdue trigger</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Two Column Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: Visual Escalation Pipeline (60%) */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Streamlined Header Block */}
          <div className="px-1 pt-1 pb-0.5 select-none text-left">
            <h2 className="text-[17px] font-extrabold text-gray-950 leading-tight">Escalation Flow Builder</h2>
            <p className="text-[12.5px] text-gray-500 mt-0.5">
              Select a phase card to customize triggers, templates, and view live simulations.
            </p>
          </div>

          {/* New Creative Explanatory Banner: "How It Works" */}
          <div className="bg-[#FFF8F5] border border-[#FF6A39]/20 rounded-2xl p-4 text-left select-none relative group overflow-hidden">
            <div className="absolute right-3 bottom-0 translate-y-3 opacity-5 pointer-events-none text-[#FF6A39] font-bold text-5xl">
              ⚙️
            </div>
            <div className="flex gap-3">
              <span className="text-lg">💡</span>
              <div className="space-y-1">
                <h4 className="text-[13px] font-extrabold text-[#E05B2E]">How Automated Escalation Works</h4>
                <p className="text-[12px] text-gray-600 leading-relaxed font-medium">
                  When an invoice is overdue, UdhaarClear automatically transitions it through the timeline below. 
                  It starts with courteous nudges, raises urgency if ignored, and warns of legal dispute filing. 
                  <strong className="text-gray-950 font-bold block mt-1.5">✓ Once the customer pays, all automated messages stop instantly.</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="relative pl-4 space-y-3">
            
            {/* Visual solid gradient connector line representing tone escalation intensity */}
            <div className="absolute left-[36px] top-6 bottom-6 w-[3px] bg-gradient-to-b from-emerald-400 via-amber-400 to-red-500 rounded-full opacity-80 pointer-events-none" />

            {phases.map((phase, idx) => {
              const isActive = activeIdx === idx
              const lastPhase = idx === phases.length - 1

              return (
                <div key={phase.id} className="relative space-y-2">
                  
                  {/* Phase Card */}
                  <div
                    onClick={() => {
                      setActiveIdx(idx)
                      setIsEditing(false)
                    }}
                    className={`relative flex flex-col md:flex-row items-start justify-between gap-4 p-4.5 rounded-2xl cursor-pointer transition-all duration-200 select-none ${
                      isActive
                        ? 'bg-white border-2 border-[#FF6A39] shadow-md ring-4 ring-[#FF6A39]/5'
                        : phase.enabled
                          ? 'bg-white border border-[#EBEAE6] hover:border-gray-300 shadow-3xs'
                          : 'bg-gray-50/70 border border-gray-200/60 opacity-60'
                    }`}
                  >
                    
                    {/* Visual Node Dot with pulsing ring for the active node */}
                    <div className={`absolute left-[-22px] md:left-[-25px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all z-10 ${
                      isActive 
                        ? 'border-[#FF6A39] ring-4 ring-[#FF6A39]/20 scale-110 shadow-sm' 
                        : phase.enabled ? 'border-gray-400' : 'border-gray-300'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-[#FF6A39]' : phase.enabled ? 'bg-gray-400' : 'bg-gray-300'
                      }`} />
                      {isActive && (
                        <span className="absolute -inset-1 rounded-full border border-[#FF6A39]/30 animate-ping opacity-75 pointer-events-none" />
                      )}
                    </div>

                    {/* Card Content Left */}
                    <div className="space-y-1.5 max-w-lg text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11.5px] font-bold text-gray-400 font-mono">
                          0{phase.id}
                        </span>
                        <h3 className="text-[14.5px] font-extrabold text-gray-900 leading-tight">
                          {phase.phase}
                        </h3>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-bold whitespace-nowrap ring-1 ring-inset ${
                          phase.enabled ? phase.statusColor : 'text-gray-500 bg-gray-100 ring-gray-200'
                        }`}>
                          {phase.daysStart === 31 ? 'Active: 31+ Days Late' : `Active: ${phase.daysStart} to ${phase.daysEnd} Days Late`}
                        </span>
                      </div>

                      <p className="text-[12.5px] text-gray-500 font-medium leading-relaxed">
                        {phase.description}
                      </p>

                      {/* Performance analytics & Active channels row */}
                      {phase.enabled ? (
                        <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium flex-wrap pt-0.5">
                          <span className="flex items-center gap-1">
                            <span className="h-1 w-1 bg-emerald-500 rounded-full" />
                            Conversion open rate: <strong className="text-gray-700">{phase.statsReadRate}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="h-1 w-1 bg-amber-500 rounded-full" />
                            Avg response: <strong className="text-gray-700">{phase.statsResponseTime}</strong>
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-red-500 font-bold block pt-0.5">
                          ⚠️ This phase is paused. Invoices in this range will receive no automatic nudge.
                        </span>
                      )}
                    </div>

                    {/* Card Content Right (Toggles) */}
                    <div className="flex md:flex-col items-center md:items-end justify-between self-stretch shrink-0 pt-0.5">
                      
                      {/* Custom styled Toggle Switch */}
                      <button
                        onClick={(e) => handleTogglePhase(phase.id, e)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          phase.enabled ? 'bg-[#FF6A39]' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                            phase.enabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>

                      {/* Select Indicator */}
                      <div className="hidden md:flex items-center gap-1 mt-4 text-[11.5px] font-bold text-[#FF6A39] opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Inspect</span>
                        <HugeiconsIcon icon={ArrowRight02Icon} size={12} />
                      </div>
                    </div>

                  </div>

                  {/* Visual Connector Logic Label (between cards - tightened spacing) */}
                  {!lastPhase && phase.enabled && (
                    <div className="relative left-12 my-1 text-[10px] font-bold text-gray-400 select-none flex items-center gap-2">
                      <span className="bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200/50">
                        {`If unpaid after Day ${phase.daysEnd} → Auto-escalate to next phase`}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}

          </div>
        </div>

        {/* RIGHT COLUMN: Live Simulator & Config Editor (40%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
          
          {/* Simulator Panel Container */}
          <div className="bg-white border border-[#EBEAE6] rounded-2xl p-4.5 shadow-sm space-y-3.5">
            
            {/* Simulator Header */}
            <div className="border-b border-gray-100 pb-2.5 flex items-center justify-between select-none">
              <div className="text-left">
                <span className="text-[10px] font-bold text-[#FF6A39] uppercase tracking-wider">
                  Real-time Simulator
                </span>
                <h3 className="text-[14px] font-bold text-gray-900 leading-tight mt-0.5">
                  Inspection: Phase {activePhase.id}
                </h3>
              </div>
              
              {/* Channel Tabs */}
              <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg">
                {activePhase.channels.map((chan) => (
                  <button
                    key={chan}
                    onClick={() => {
                      setActiveChannel(chan)
                      setIsEditing(false)
                    }}
                    className={`px-2 py-1 text-[9.5px] font-bold rounded-md transition-colors ${
                      currentChannel === chan ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {chan === 'WHATSAPP' ? 'WhatsApp' : chan === 'EMAIL' ? 'Email' : 'SMS'}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Simulated Mock View - scaled down for sticky container height */}
            <div className="py-2.5 flex justify-center bg-gray-50 rounded-xl border border-gray-100/70 p-3 min-h-[310px] flex-col justify-between">
              
              {currentChannel === 'WHATSAPP' && (
                /* smartphone WhatsApp mock */
                <div className="relative mx-auto w-full max-w-[240px] rounded-[24px] border-[5px] border-gray-800 bg-[#E5DDD5] shadow-lg overflow-hidden aspect-[9/16] flex flex-col">
                  
                  {/* WhatsApp Header bar */}
                  <div className="bg-[#075E54] text-white px-2.5 py-1.5 flex items-center gap-1 shrink-0 pt-2">
                    <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[9px] text-white">
                      UC
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-0.5">
                        <span className="text-[10px] font-bold truncate leading-tight">UdhaarClear Alerts</span>
                        <span className="h-2 w-2 bg-[#25D366] rounded-full flex items-center justify-center text-[6px] font-black text-white shrink-0">
                          ✓
                        </span>
                      </div>
                      <span className="text-[7.5px] text-emerald-100 block leading-none">Official Business</span>
                    </div>
                  </div>

                  {/* Chat logs wallpaper body */}
                  <div className="flex-1 p-2 space-y-1.5 overflow-y-auto flex flex-col justify-end pb-2.5 bg-[#efeae2] select-none">
                    
                    {/* Chat Bubble */}
                    <div className="relative self-end bg-[#DCF8C6] text-[10px] text-gray-800 p-2 rounded-lg shadow-3xs max-w-[90%] border-b border-black/5 text-left">
                      <p className="whitespace-pre-line leading-relaxed pb-2">
                        {formatTokens(getTemplateText())}
                      </p>

                      {/* CTA link bubble */}
                      <div className="border-t border-[#c6dfb1] pt-1 mt-0.5 flex flex-col items-center">
                        <span className="bg-white text-[#007aff] font-semibold text-center py-1 px-2.5 rounded-full text-[8.5px] w-full block shadow-3xs">
                          💳 Pay Online Now
                        </span>
                      </div>

                      {/* WhatsApp ticks */}
                      <div className="flex items-center justify-end gap-0.5 mt-0.5 text-[7.5px] text-gray-400 select-none">
                        <span>10:18 AM</span>
                        {renderWhatsAppTicks()}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {currentChannel === 'EMAIL' && (
                /* Email client browser mockup */
                <div className="w-full border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden flex flex-col text-[10.5px]">
                  
                  {/* Chrome window header */}
                  <div className="bg-gray-50 px-2.5 py-1 border-b border-gray-200 flex items-center gap-1.5 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    <span className="text-[8.5px] text-gray-400 font-mono ml-auto">invoice-nudge.eml</span>
                    <div className="w-3" />
                  </div>

                  {/* Email fields */}
                  <div className="p-2 border-b border-gray-100 space-y-0.5 bg-gray-50/20 text-left">
                    <div><span className="text-gray-400 font-medium">From:</span> <span className="font-semibold text-gray-600">alerts@udhaarclear.com</span></div>
                    <div><span className="text-gray-400 font-medium">To:</span> <span className="font-semibold text-gray-700">ramesh.traders@example.com</span></div>
                    <div>
                      <span className="text-gray-400 font-medium">Subject:</span>{' '}
                      <span className="font-bold text-gray-900">
                        {activeIdx === 3 ? 'FINAL LEGAL NOTICE: Urgent payment required' : 'Payment Reminder: Overdue invoice'}
                      </span>
                    </div>
                  </div>

                  {/* Email body preview */}
                  <div className="p-3 bg-slate-100 overflow-y-auto max-h-[190px]">
                    <div className="bg-white border border-gray-100 rounded-md p-3 shadow-3xs text-left">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                        <span className="text-[10px] font-bold text-gray-900">UdhaarClear Alerts</span>
                        <span className="text-[8.5px] font-semibold text-gray-400">Payment Request</span>
                      </div>

                      <div className="whitespace-pre-line leading-relaxed text-gray-600 pb-2 border-b border-gray-100 mb-2">
                        {formatTokens(getTemplateText())}
                      </div>

                      {/* CTA */}
                      <span className="block text-center bg-[#FF6A39] text-white font-bold py-1.5 px-3 rounded text-[10px] w-full max-w-[125px] mx-auto select-none shadow-3xs cursor-default">
                        Review & Pay Invoice
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {currentChannel === 'SMS' && (
                /* SMS grey bubble simulation */
                <div className="border border-gray-200 rounded-xl bg-white p-2.5 max-w-[210px] mx-auto shadow-xs text-left">
                  <div className="flex items-center gap-1.5 mb-2 select-none">
                    <div className="h-4.5 w-4.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[7.5px] font-bold">
                      UC
                    </div>
                    <span className="text-[9px] font-bold text-gray-700">BP-UDHAAR</span>
                  </div>

                  <div className="bg-gray-100 border border-gray-200/50 rounded-xl p-2 relative">
                    <p className="text-[10.5px] text-gray-800 leading-relaxed">
                      {formatTokens(getTemplateText())}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Template Inline Editor with Placeholder Chips */}
            <div className="border-t border-gray-100 pt-3 space-y-2.5">
              
              {!isEditing ? (
                <div className="flex items-center justify-between select-none">
                  <span className="text-[11px] text-gray-400 font-medium text-left">
                    Adjust variables using {"{?"} brackets
                  </span>
                  <button
                    onClick={startEdit}
                    className="bg-gray-950 hover:bg-gray-900 text-white text-[11px] font-bold py-1 px-3 rounded-lg shadow-3xs transition-colors"
                  >
                    Edit Template
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 text-left">
                  <label className="block text-[11px] font-bold text-gray-700">
                    Edit {currentChannel.toLowerCase()} message body template:
                  </label>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-[11.5px] text-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/20"
                  />
                  
                  {/* Click-to-insert placeholder helper chips for easy variables insertion */}
                  <div className="space-y-1 select-none">
                    <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider block">
                      Insert Invoice Tags (Click to add):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { key: '{{customerName}}', label: 'Customer Name' },
                        { key: '{{invoiceRef}}', label: 'Invoice Number' },
                        { key: '{{amount}}', label: 'Amount Due' },
                        { key: '{{overdueDays}}', label: 'Days Late' },
                        { key: '{{link}}', label: 'Payment Link' },
                      ].map(t => (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => {
                            setEditedText(prev => prev + ' ' + t.key)
                            toast.success(`Added ${t.key} placeholder`)
                          }}
                          className="bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-bold px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer shadow-3xs"
                        >
                          + {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={saveEdit}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1 px-3.5 rounded-lg shadow-3xs transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-[11px] font-semibold py-1 px-3.5 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Simplified Overdue Triggers slider configuration */}
            <div className="border-t border-gray-100 pt-3 space-y-2 select-none text-left">
              <label className="block text-[11.5px] font-extrabold text-gray-800">
                Trigger Settings (When should this send?)
              </label>
              <p className="text-[10.5px] text-gray-400">
                Set when this message active range starts and stops relative to the due date.
              </p>

              <div className="grid grid-cols-2 gap-3.5 mt-1">
                <div>
                  <span className="text-[10px] font-semibold text-gray-500 block">Start sending when invoice is:</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="range"
                      min={1}
                      max={40}
                      value={activePhase.daysStart}
                      onChange={(e) => handleDayChange(activePhase.id, 'daysStart', parseInt(e.target.value))}
                      className="w-full accent-[#FF6A39]"
                    />
                    <span className="text-[11px] font-bold text-gray-900 min-w-[30px] text-right">
                      Day {activePhase.daysStart}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-gray-500 block">Stop sending when invoice is:</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="range"
                      min={activePhase.daysStart}
                      max={50}
                      disabled={activePhase.daysEnd === 'unlimited'}
                      value={activePhase.daysEnd === 'unlimited' ? 50 : activePhase.daysEnd}
                      onChange={(e) => handleDayChange(activePhase.id, 'daysEnd', parseInt(e.target.value))}
                      className="w-full accent-[#FF6A39] disabled:opacity-50"
                    />
                    <span className="text-[11px] font-bold text-gray-900 min-w-[30px] text-right">
                      {activePhase.daysEnd === 'unlimited' ? '30+ Days' : `Day ${activePhase.daysEnd}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}


