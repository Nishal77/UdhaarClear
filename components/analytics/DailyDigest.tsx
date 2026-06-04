'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatINRCompact } from '@/lib/utils/currency'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  AiBrain01Icon,
  Coins01Icon,
  HourglassIcon,
  InvoiceIcon,
  Chart01Icon
} from '@hugeicons/core-free-icons'

interface ChecklistItem {
  id: string
  task: string
  detail: string
  route: string
  routeLabel: string
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
      completed: false
    },
    {
      id: 'task-2',
      task: 'Review assertive WhatsApp tone template',
      detail: 'The AI tone engine suggests editing the Week 3 WhatsApp notice to boost the read-to-pay rate by 15%.',
      route: '/tone-engine',
      routeLabel: 'Configure Tones',
      completed: false
    },
    {
      id: 'task-3',
      task: 'Reconcile payment settlements log',
      detail: 'Verify 3 digital payments (totaling ₹88.5K) that were auto-settled through Razorpay today.',
      route: '/payments',
      routeLabel: 'View Payments',
      completed: false
    },
    {
      id: 'task-4',
      task: 'Update business Udyam registration',
      detail: 'Keep your MSME certificate details updated to guarantee Facilitation Council filing validity.',
      route: '/settings/profile',
      routeLabel: 'Open Profile',
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
      <div className="bg-gradient-to-r from-orange-50/50 via-amber-50/30 to-blue-50/30 border border-[#EBEAE6] rounded-[22px] p-5 text-left select-none shadow-3xs flex flex-col sm:flex-row gap-4 items-start">
        <div className="h-10 w-10 rounded-xl bg-orange-100 text-[#FF6A39] flex items-center justify-center flex-shrink-0 text-lg shadow-3xs">
          🤖
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              AI Morning Briefing · {getTodayDateString()}
            </span>
          </div>
          <p className="text-[13px] text-gray-700 font-semibold leading-relaxed">
            Good morning, Nishal. Today's collections runway is highly active. You have <strong className="text-gray-900">₹85,000</strong> in expected settlements scheduled to clear by afternoon. The AI tone engine has auto-escalated <strong className="text-gray-900">3 customer accounts</strong> to strict reminder levels due to consecutive payment delays. WhatsApp response rates remain high at <strong className="text-emerald-700">85%</strong>, whereas Email responses are hitting a ceiling. We recommend filing 1 MSME Samadhaan dispute and reviewing today's 4 priority action items.
          </p>
        </div>
      </div>

      {/* ── Daily Scorecard Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        
        {/* Score 1: Invoices Logged Today */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Invoices Logged Today</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <HugeiconsIcon icon={InvoiceIcon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block">
              {formatINRCompact(185000)}
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ● 5 New Invoices
              </span>
            </div>
          </div>
        </div>

        {/* Score 2: Payments Collected Today */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Collected Today</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <HugeiconsIcon icon={Coins01Icon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block">
              {formatINRCompact(88500)}
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ▲ 3 Cleared Payments
              </span>
            </div>
          </div>
        </div>

        {/* Score 3: Reminders Sent Today */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Reminders Dispatched</span>
            <span className="p-1.5 rounded-lg bg-orange-50 text-[#FF6A39]">
              <HugeiconsIcon icon={HourglassIcon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block">
              42 Sent
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ⚡ 91% Delivery Rate
              </span>
            </div>
          </div>
        </div>

        {/* Score 4: Critical Accounts */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Critical Accounts</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-650">
              <HugeiconsIcon icon={Chart01Icon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-red-600 leading-none block">
              2 Accounts
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ⚠️ &gt;60 Days Overdue
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Double-Column Action/Feed Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Column: Daily Collection Action Checklist */}
        <div className="rounded-xl bg-white border border-[#EBEAE6] shadow-xs p-5 select-none text-left space-y-4">
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

          <div className="divide-y divide-gray-100 space-y-3">
            {checklist.map((item) => (
              <div key={item.id} className="pt-3 flex gap-3 items-start group">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleToggleChecklist(item.id)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#FF6A39] focus:ring-[#FF6A39]/30 focus:outline-none transition-all cursor-pointer"
                />
                <div className="flex-1 space-y-1">
                  <span className={`text-xs font-bold block leading-snug transition-all ${
                    item.completed ? 'line-through text-gray-400' : 'text-gray-900'
                  }`}>
                    {item.task}
                  </span>
                  <p className={`text-[11px] font-medium leading-relaxed transition-all ${
                    item.completed ? 'text-gray-350' : 'text-gray-500'
                  }`}>
                    {item.detail}
                  </p>
                  {!item.completed && (
                    <div className="pt-1 select-none">
                      <Link 
                        href={item.route}
                        className="text-[10px] text-blue-600 font-bold hover:underline"
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
        <div className="rounded-xl bg-white border border-[#EBEAE6] shadow-xs p-5 select-none text-left space-y-4 flex flex-col justify-between">
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
            <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-gray-100" />

            {activities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-3">
                {/* Timeline node */}
                <span className={`absolute left-[-21px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white ring-2 ${
                  act.status === 'READ'
                    ? 'bg-emerald-500 ring-emerald-500/20'
                    : act.status === 'DELIVERED'
                      ? 'bg-blue-500 ring-blue-500/20'
                      : 'bg-gray-300 ring-gray-300/20'
                }`} />

                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">
                      {act.customerName}
                    </h4>
                    <span className="text-[10.5px] text-gray-400 font-medium block mt-0.5">
                      Invoice: <strong className="font-mono">{act.invoiceNumber}</strong> · Channel: <strong className="text-gray-600">{act.channel}</strong>
                    </span>
                  </div>

                  <div className="text-right flex flex-col items-start sm:items-end select-none">
                    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold ${
                      act.status === 'READ'
                        ? 'bg-emerald-50 text-emerald-700'
                        : act.status === 'DELIVERED'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-gray-50 text-gray-500'
                    }`}>
                      {act.status}
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold block mt-1 font-mono">
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
