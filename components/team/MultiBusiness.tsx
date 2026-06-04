'use client'

import { useState } from 'react'
import { formatINRCompact } from '@/lib/utils/currency'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Coins01Icon,
  HourglassIcon,
  InvoiceIcon,
  Chart01Icon
} from '@hugeicons/core-free-icons'

interface BusinessEntity {
  id: string
  name: string
  outstanding: number
  invoicesCount: number
  successRate: number
  primary: boolean
  domain: string
}

interface AuditLog {
  id: string
  time: string
  entityName: string
  action: string
  details: string
}

export function MultiBusiness() {
  const [entities, setEntities] = useState<BusinessEntity[]>([
    { id: 'b-1', name: 'Reddy Pharma LLC', outstanding: 1842000, invoicesCount: 12, successRate: 86.4, primary: true, domain: 'reddypharma.udhaarclear.com' },
    { id: 'b-2', name: 'Sunita Fabrics Pvt. Ltd.', outstanding: 1250000, invoicesCount: 8, successRate: 80.1, primary: false, domain: 'sunitafabrics.udhaarclear.com' },
    { id: 'b-3', name: 'Sunita Retailers Co.', outstanding: 1488000, invoicesCount: 10, successRate: 78.4, primary: false, domain: 'sunitaretailers.udhaarclear.com' }
  ])

  const [switchingId, setSwitchingId] = useState<string | null>(null)
  
  const [logs] = useState<AuditLog[]>([
    { id: 'l-1', time: '11:30 AM', entityName: 'Reddy Pharma LLC', action: 'WhatsApp Reminder Sent', details: 'Auto-reminded Sunita Fabrics regarding INV-2026-003 (₹88.5K)' },
    { id: 'l-2', time: '10:15 AM', entityName: 'Sunita Fabrics Pvt. Ltd.', action: 'Settlement Logged', details: 'Razorpay settled ₹47.0K invoice INV-2026-005' },
    { id: 'l-3', time: '09:00 AM', entityName: 'Sunita Retailers Co.', action: 'Tone Escalated', details: 'Auto-transitioned MegaVision Electronics DPD rules to Strict' }
  ])

  const handleSwitchWorkspace = (id: string, bName: string) => {
    if (switchingId) return
    setSwitchingId(id)
    
    // Simulate workspace shifting handshake
    setTimeout(() => {
      setEntities(
        entities.map((ent) => ({
          ...ent,
          primary: ent.id === id
        }))
      )
      setSwitchingId(null)
      toast.success(`Active workspace shifted to: ${bName}`)
    }, 1200)
  }

  // Calculate Aggregates
  const totalReceivables = entities.reduce((s, e) => s + e.outstanding, 0)

  return (
    <div className="space-y-4">

      {/* ── Aggregated Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        
        {/* Stat 1: Total Businesses */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Entities</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <HugeiconsIcon icon={InvoiceIcon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block">
              {entities.length} Businesses
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ● Unified access ledger
              </span>
            </div>
          </div>
        </div>

        {/* Stat 2: Aggregated Receivables */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Aggregated AR</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <HugeiconsIcon icon={Coins01Icon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block">
              {formatINRCompact(totalReceivables)}
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ● Across all entities
              </span>
            </div>
          </div>
        </div>

        {/* Stat 3: Top Performing */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Top Org (Recovery)</span>
            <span className="p-1.5 rounded-lg bg-orange-50 text-[#FF6A39]">
              <HugeiconsIcon icon={Chart01Icon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[23px] font-black text-gray-900 leading-none block truncate max-w-[200px]">
              Reddy Pharma
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                86.4% success rate
              </span>
            </div>
          </div>
        </div>

        {/* Stat 4: Gateway Health */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Gateway integration</span>
            <span className="p-1.5 rounded-lg bg-violet-50 text-violet-600">
              <HugeiconsIcon icon={HourglassIcon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block">
              Razorpay API
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ● Active on 3 entities
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Workspace Switcher Grid ── */}
      <div className="space-y-3.5 select-none text-left">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">multi-tenant switchboard</span>
          <h3 className="text-[15px] font-extrabold text-gray-900 mt-0.5">Select Active Organization</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {entities.map((ent) => (
            <div
              key={ent.id}
              className={`rounded-2xl bg-white border p-5 flex flex-col justify-between min-h-[220px] transition-all duration-300 ${
                ent.primary
                  ? 'border-[#FF6A39] shadow-sm ring-1 ring-[#FF6A39]'
                  : 'border-[#EBEAE6] hover:border-gray-300 hover:shadow-xs'
              }`}
            >
              
              {/* Card Header info */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-700">
                    {ent.name.split(' ').map((w) => w[0]).join('').substring(0, 2)}
                  </span>
                  {ent.primary && (
                    <span className="bg-[#FF6A39]/10 text-[#FF6A39] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#FF6A39]/25">
                      Active Primary
                    </span>
                  )}
                </div>
                <h4 className="text-[14px] font-extrabold text-gray-900 leading-snug pt-1 truncate">{ent.name}</h4>
                <span className="text-[10.5px] text-gray-400 font-semibold block truncate font-mono">{ent.domain}</span>
              </div>

              {/* Card Body stats */}
              <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between text-xs text-gray-500 font-semibold">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Overdue AR</span>
                  <span className="text-gray-900 font-extrabold text-[12.5px] font-mono">{formatINRCompact(ent.outstanding)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Recovery</span>
                  <span className="text-emerald-600 font-extrabold text-[12.5px]">{ent.successRate}%</span>
                </div>
              </div>

              {/* Switch Action */}
              <div className="pt-4 select-none">
                {ent.primary ? (
                  <button
                    disabled
                    className="w-full bg-[#FF6A39]/10 text-[#FF6A39] text-xs font-bold py-1.5 rounded-xl cursor-default text-center border border-[#FF6A39]/20"
                  >
                    Active Primary Organization
                  </button>
                ) : (
                  <button
                    onClick={() => handleSwitchWorkspace(ent.id, ent.name)}
                    disabled={switchingId !== null}
                    className="w-full bg-gray-950 hover:bg-gray-850 disabled:opacity-50 text-white text-xs font-bold py-1.5 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    {switchingId === ent.id ? 'Switching Workspace...' : 'Switch Workspace'}
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ── Multi-Tenant Activity Logs timeline ── */}
      <div className="rounded-xl bg-white border border-[#EBEAE6] shadow-xs p-5 select-none text-left space-y-4">
        <div>
          <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest block">audit trail</span>
          <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight mt-0.5">Cross-Entity Activity Logs</h3>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Reconciled tracking events happening across all your registered business profiles.
          </p>
        </div>

        <div className="relative pl-6 space-y-5">
          <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-gray-100" />

          {logs.map((log) => (
            <div key={log.id} className="relative flex items-start gap-3">
              <span className="absolute left-[-21px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white ring-2 bg-gray-300 ring-gray-200" />
              
              <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-tight">
                    {log.action}
                  </h4>
                  <span className="text-[10.5px] text-gray-400 font-medium block mt-0.5">
                    Business: <strong className="text-gray-700">{log.entityName}</strong> · {log.details}
                  </span>
                </div>
                <span className="text-[9px] text-gray-400 font-semibold font-mono whitespace-nowrap">
                  {log.time}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
