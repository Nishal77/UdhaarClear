'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatINRCompact } from '@/lib/utils/currency'
import { toast } from 'sonner'

interface ChecklistItem {
  id: string
  task: string
  detail: string
  route: string
  routeLabel: string
  category: 'Legal Action' | 'AI Optimization' | 'Accounting' | 'Compliance'
  impact: string
  why: string
  completed: boolean
}

interface ActivityLog {
  id: string
  time: string
  customerName: string
  invoiceNumber: string
  channel: 'WhatsApp' | 'Email'
  status: 'SENT' | 'DELIVERED' | 'READ' | 'REPLIED'
  statusLabel: string
}

export function DailyDigest() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'task-1',
      task: 'File MSME Samadhaan pre-notices',
      detail: 'MegaVision Electronics (₹22.00 L) is aged over 72 days and payment probability has dropped below 42%.',
      route: '/msme-samadhaan',
      routeLabel: 'File Case',
      category: 'Legal Action',
      impact: 'Recover ₹22.00 L + claim 3x interest',
      why: 'MegaVision is 72 days late. A legal pre-notice is required to force payment and start MSME Facilitation Council proceedings.',
      completed: false
    },
    {
      id: 'task-2',
      task: 'Review assertive WhatsApp tone template',
      detail: 'The AI tone engine suggests editing the Week 3 WhatsApp notice to boost the read-to-pay rate by 15%.',
      route: '/tone-engine',
      routeLabel: 'Configure Tones',
      category: 'AI Optimization',
      impact: 'Speed up payments by 15%',
      why: 'Politely demanding payment with firmer language makes buyers take action. This change resolves pending disputes.',
      completed: false
    },
    {
      id: 'task-3',
      task: 'Reconcile payment settlements log',
      detail: 'Verify 3 digital payments (totaling ₹88.5K) that were auto-settled through Razorpay today.',
      route: '/payments',
      routeLabel: 'View Payments',
      category: 'Accounting',
      impact: 'Confirm ₹88.5K landed in bank',
      why: 'Ensures that digital collections initiated through customer reminders have successfully reached your bank account.',
      completed: false
    },
    {
      id: 'task-4',
      task: 'Update business Udyam registration',
      detail: 'Keep your MSME certificate details updated to guarantee Facilitation Council filing validity.',
      route: '/settings?tab=company',
      routeLabel: 'Open Profile',
      category: 'Compliance',
      impact: 'Maintain legal protection',
      why: 'A valid Udyam registration is legally required to claim statutory interest or file disputes against late-paying buyers.',
      completed: false
    }
  ])

  const [activities] = useState<ActivityLog[]>([
    {
      id: 'act-1',
      time: '11:15 AM',
      customerName: 'Reddy Enterprises',
      invoiceNumber: 'INV-2026-009',
      channel: 'WhatsApp',
      status: 'READ',
      statusLabel: 'Read by buyer'
    },
    {
      id: 'act-2',
      time: '10:45 AM',
      customerName: 'Tara Decoratives',
      invoiceNumber: 'INV-2026-007',
      channel: 'Email',
      status: 'DELIVERED',
      statusLabel: 'Delivered to inbox'
    },
    {
      id: 'act-3',
      time: '09:30 AM',
      customerName: 'MegaVision Electronics',
      invoiceNumber: 'INV-2026-006',
      channel: 'WhatsApp',
      status: 'SENT',
      statusLabel: 'Dispatched successfully'
    },
    {
      id: 'act-4',
      time: '09:00 AM',
      customerName: 'Bharat Steel Works',
      invoiceNumber: 'INV-2026-002',
      channel: 'Email',
      status: 'DELIVERED',
      statusLabel: 'Delivered to inbox'
    }
  ])

  const handleToggleChecklist = (id: string) => {
    setChecklist(
      checklist.map((item) => {
        if (item.id === id) {
          const nextState = !item.completed
          if (nextState) {
            toast.success(`Completed task: "${item.task}"`)
          }
          return { ...item, completed: nextState }
        }
        return item
      })
    )
  }

  // Formatting helpers for header date
  const getTodayDateString = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-4">

      {/* ── Conversational AI Morning Briefing Alert ── */}
      <div className="bg-[#FFFFFF] border border-[#EBEAE6] rounded-[22px] p-5 text-left select-none flex flex-col sm:flex-row gap-4 items-start">
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[15.5px] font-extrabold text-[#FF6A39] leading-tight block">
              AI Morning Briefing · {getTodayDateString()} (For Business Owners)
            </span>
          </div>
          <p className="text-[14px] text-gray-500 font-medium leading-relaxed">
            Good morning, Nishal. Today's collections runway is highly active. You have <strong className="text-gray-900">₹85,000</strong> in expected settlements scheduled to clear by afternoon. The AI tone engine has auto-escalated <strong className="text-gray-900">3 customer accounts</strong> to strict reminder levels due to consecutive payment delays. WhatsApp response rates remain high at <strong className="text-emerald-700">85%</strong>, whereas Email responses are hitting a ceiling. We recommend filing 1 MSME Samadhaan dispute and reviewing today's 4 priority action items.
          </p>
        </div>
      </div>

      {/* ── Daily Scorecard Panel (Unified Premium Layout) ── */}
      <div className="bg-white border border-[#EBEAE6] rounded-[22px] overflow-hidden select-none">
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x text-left">

          {/* Metric 1: Invoices Logged Today */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Invoices Logged Today</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                {formatINRCompact(185000)}
              </span>
              <span className="inline-flex items-center text-blue-700 text-[11.5px] font-medium whitespace-nowrap">
                5 New Invoices
              </span>
            </div>
          </div>

          {/* Metric 2: Collected Today */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Collected Today</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                {formatINRCompact(88500)}
              </span>
              <span className="inline-flex items-center text-emerald-700 text-[11.5px] font-medium whitespace-nowrap">
                ▲ 3 Cleared Payments
              </span>
            </div>
          </div>

          {/* Metric 3: Reminders Dispatched */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Reminders Dispatched</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                42 Sent
              </span>
              <span className="inline-flex items-center text-orange-600 text-[11.5px] font-medium whitespace-nowrap">
                91% Delivery Rate
              </span>
            </div>
          </div>

          {/* Metric 4: Critical Accounts */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Critical Accounts</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-red-600 leading-none whitespace-nowrap block">
                2 Accounts
              </span>
              <span className="inline-flex items-center text-red-700 text-[11.5px] font-medium whitespace-nowrap">
                &gt;60 Days Overdue
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Double-Column Action/Feed Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Daily Collection Action Checklist */}
        <div className="bg-white border border-[#EBEAE6] rounded-[22px] p-6 text-left select-none shadow-3xs space-y-5">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
              Priority Tasks
            </span>
            <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight mt-0.5">
              Daily Collections Checklist
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Verify outstanding alerts and trigger optimization workflows across your accounts ledger.
            </p>
          </div>

          <div className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item.id}
                className={`p-4.5 rounded-2xl border transition-all duration-300 space-y-3.5 ${
                  item.completed
                    ? 'bg-gray-50/50 border-gray-100 opacity-60'
                    : 'bg-white border-gray-100 hover:border-gray-300 shadow-3xs'
                }`}
              >
                {/* Header row: Category & Impact */}
                <div className="flex items-center justify-between gap-2 flex-wrap text-left">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide border ${
                      item.category === 'Legal Action'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : item.category === 'AI Optimization'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.category === 'Accounting'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}
                  >
                    {item.category === 'Legal Action' && '⚖️ '}
                    {item.category === 'AI Optimization' && '🤖 '}
                    {item.category === 'Accounting' && '💰 '}
                    {item.category === 'Compliance' && '📋 '}
                    {item.category}
                  </span>

                  <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5">
                    🎯 <strong className="text-gray-700 font-extrabold">{item.impact}</strong>
                  </span>
                </div>

                {/* Task Checkbox & Title */}
                <div className="flex gap-3 items-start text-left">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleChecklist(item.id)}
                    className="mt-0.5 h-4.5 w-4.5 rounded-full border-gray-300 text-[#FF6A39] focus:ring-[#FF6A39]/30 focus:outline-none transition-all cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-[13.5px] font-extrabold block leading-snug transition-all ${
                        item.completed ? 'line-through text-gray-400' : 'text-gray-900'
                      }`}
                    >
                      {item.task}
                    </span>
                  </div>
                </div>

                {/* Explanation Context */}
                <div className="pl-7.5 space-y-2.5 text-left">
                  <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                    {item.detail}
                  </p>

                  {/* Why this matters explanation */}
                  {!item.completed && (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-[11px] text-gray-600 leading-relaxed font-semibold flex gap-2">
                      <span className="text-sm shrink-0">💡</span>
                      <div>
                        <strong className="text-gray-800 block text-[11.5px] font-bold mb-0.5">Why this matters:</strong>
                        {item.why}
                      </div>
                    </div>
                  )}

                  {/* Action Link Button */}
                  {!item.completed && (
                    <div className="pt-1 select-none">
                      <Link
                        href={item.route}
                        className="inline-flex items-center justify-center bg-gray-950 hover:bg-gray-850 text-white font-bold py-1.5 px-3 rounded-lg text-[11px] transition-colors shadow-3xs cursor-pointer"
                      >
                        {item.routeLabel} →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Visual Activity Feed Timeline */}
        <div className="bg-white border border-[#EBEAE6] rounded-[22px] p-6 text-left select-none shadow-3xs space-y-5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
              automated feed
            </span>
            <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight mt-0.5">
              Today's Reminder Dispatches
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Live tracking log of automated reminders sent by UdhaarClear tone engines today.
            </p>
          </div>

          <div className="pt-2 flex-1 relative pl-6 space-y-6">
            {/* Timeline line */}
            <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-gray-100/80" />

            {activities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-3">
                {/* Timeline node */}
                <span className={`absolute left-[-21px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white ring-4 ${
                  act.status === 'READ'
                    ? 'bg-emerald-500 ring-emerald-500/10'
                    : act.status === 'DELIVERED'
                      ? 'bg-blue-500 ring-blue-500/10'
                      : 'bg-gray-355 ring-gray-200/20'
                }`} />

                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">
                      {act.customerName}
                    </h4>
                    <span className="text-[10.5px] text-gray-400 font-semibold block mt-1">
                      Invoice: <strong className="font-mono text-gray-500 font-bold">{act.invoiceNumber}</strong> · Channel: <strong className="text-gray-600">{act.channel}</strong>
                    </span>
                  </div>

                  <div className="text-right flex flex-col items-start sm:items-end select-none gap-1 shrink-0">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9.5px] font-extrabold border ${
                      act.status === 'READ'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : act.status === 'DELIVERED'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-gray-50 text-gray-500 border-gray-100'
                    }`}>
                      {act.status === 'READ' && '✓✓ '}
                      {act.status === 'DELIVERED' && '✓ '}
                      {act.statusLabel}
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold block mt-0.5 font-mono">
                      {act.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
