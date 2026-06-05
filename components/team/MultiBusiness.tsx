'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatINRCompact } from '@/lib/utils/currency'
import { toast } from 'sonner'
import { Plus, X, Briefcase, Globe, AlertCircle, Sparkles } from 'lucide-react'

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
  
  // Add Business Form State
  const [addBusinessOpen, setAddBusinessOpen] = useState(false)
  const [newBusinessName, setNewBusinessName] = useState('')
  const [newBusinessDomain, setNewBusinessDomain] = useState('')
  const [newBusinessOutstanding, setNewBusinessOutstanding] = useState('')

  const [logs, setLogs] = useState<AuditLog[]>([
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

  const handleAddBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBusinessName || !newBusinessDomain) {
      toast.error('Please fill in all required fields')
      return
    }

    const outstandingNum = parseFloat(newBusinessOutstanding) || 0
    const newId = `b-${Date.now()}`
    const cleanDomain = `${newBusinessDomain.toLowerCase().replace(/\s+/g, '')}.udhaarclear.com`

    const newEntity: BusinessEntity = {
      id: newId,
      name: newBusinessName,
      outstanding: outstandingNum,
      invoicesCount: 0,
      successRate: 100,
      primary: false,
      domain: cleanDomain
    }

    setEntities([...entities, newEntity])

    // Add audit log
    const newLog: AuditLog = {
      id: `l-${Date.now()}`,
      time: 'Just Now',
      entityName: newBusinessName,
      action: 'Workspace Registered',
      details: `Registered custom organization profile with domain ${cleanDomain}`
    }
    setLogs([newLog, ...logs])

    // Reset fields
    setNewBusinessName('')
    setNewBusinessDomain('')
    setNewBusinessOutstanding('')
    setAddBusinessOpen(false)

    toast.success(`Business "${newBusinessName}" registered successfully!`)
  }

  // Calculate Aggregates
  const totalReceivables = entities.reduce((s, e) => s + e.outstanding, 0)

  return (
    <div className="bg-white border border-[#EBEAE6] rounded-[24px] p-6 md:p-8 space-y-6 text-left select-none">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div className="text-left">
          <nav className="flex items-center gap-1.5 text-[12px] text-gray-400">
            <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gray-455">Team & Access</span>
            <span>›</span>
            <span className="text-gray-600 font-medium">Multi Business</span>
          </nav>
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight mt-1">Multi Business Manager</h1>
          <p className="mt-1 text-[13px] text-gray-400 font-medium">
            Switch active workspaces, manage multiple business profiles, and monitor consolidated receivables.
          </p>
        </div>
        <div className="flex items-center justify-end sm:pb-1 shrink-0">
          <button
            onClick={() => setAddBusinessOpen(true)}
            className="bg-[#FF6A39] hover:bg-[#E05B2E] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-3xs cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add Business</span>
          </button>
        </div>
      </div>

      {/* ── Layperson Info Banner ── */}
      <div className="bg-amber-50/50 border border-amber-100/80 rounded-[20px] p-4 flex gap-3 text-[12.5px] text-amber-900 leading-relaxed font-semibold">
        <AlertCircle size={16} className="text-[#FF6A39] shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-amber-955 block mb-0.5">How multi-business switchboard works:</span>
          Your account has access to multiple legal business entities. Switching your active workspace below dynamically loads the specific organization's ledgers, settings, API keys, and notification channels.
        </div>
      </div>

      {/* ── Multi Business Scorecard Panel (Unified Premium Layout) ── */}
      <div className="bg-white border border-[#EBEAE6] rounded-[22px] overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x text-left">

          {/* Metric 1: Total Businesses */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Active Entities</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                {entities.length} Businesses
              </span>
              <span className="inline-flex items-center text-blue-700 text-[11.5px] font-medium whitespace-nowrap">
                Unified access ledger
              </span>
            </div>
          </div>

          {/* Metric 2: Aggregated Receivables */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Aggregated AR</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                {formatINRCompact(totalReceivables)}
              </span>
              <span className="inline-flex items-center text-emerald-700 text-[11.5px] font-medium whitespace-nowrap">
                Across all entities
              </span>
            </div>
          </div>

          {/* Metric 3: Top Performing */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Top Org (Recovery)</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block truncate max-w-[200px]">
                {entities.find(e => e.successRate === Math.max(...entities.map(o => o.successRate)))?.name.split(' ')[0] || 'Reddy Pharma'}
              </span>
              <span className="inline-flex items-center text-orange-600 text-[11.5px] font-medium whitespace-nowrap">
                {Math.max(...entities.map(e => e.successRate))}% success rate
              </span>
            </div>
          </div>

          {/* Metric 4: Gateway Health */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Gateway Integration</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                Razorpay API
              </span>
              <span className="inline-flex items-center text-violet-700 text-[11.5px] font-medium whitespace-nowrap">
                Active on {entities.length} entities
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
              className={`rounded-[22px] bg-white border p-6 flex flex-col justify-between min-h-[230px] transition-all duration-300 ${
                ent.primary
                  ? 'border-[#FF6A39] shadow-sm ring-1 ring-[#FF6A39]'
                  : 'border-[#EBEAE6] hover:border-gray-300 hover:shadow-xs'
              }`}
            >
              
              {/* Card Header info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`h-10 w-10 rounded-xl flex items-center justify-center font-extrabold text-[13px] ${
                    ent.primary ? 'bg-orange-50 text-[#FF6A39] border border-orange-100' : 'bg-slate-50 text-slate-700 border border-slate-100'
                  }`}>
                    {ent.name.split(' ').map((w) => w[0]).join('').substring(0, 2)}
                  </span>
                  {ent.primary && (
                    <span className="bg-[#FF6A39]/10 text-[#FF6A39] text-[9.5px] font-bold px-2.5 py-0.5 rounded-full border border-[#FF6A39]/25 flex items-center gap-1 select-none">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A39] animate-pulse" />
                      Active Primary
                    </span>
                  )}
                </div>
                <h4 className="text-[15px] font-extrabold text-gray-900 leading-snug pt-1 truncate">{ent.name}</h4>
                <span className="text-[11px] text-gray-400 font-semibold block truncate font-mono flex items-center gap-1">
                  <Globe size={11} className="text-gray-300" />
                  {ent.domain}
                </span>
              </div>

              {/* Card Body stats */}
              <div className="border-t border-gray-100/80 pt-3.5 mt-4 flex justify-between text-xs text-gray-500 font-semibold">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Overdue AR</span>
                  <span className="text-gray-900 font-extrabold text-[13px] font-mono">{formatINRCompact(ent.outstanding)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Recovery</span>
                  <span className="text-emerald-600 font-extrabold text-[13px]">{ent.successRate}%</span>
                </div>
              </div>

              {/* Switch Action */}
              <div className="pt-4 select-none">
                {ent.primary ? (
                  <button
                    disabled
                    className="w-full bg-[#FF6A39]/10 text-[#FF6A39] text-[12px] font-bold py-2 rounded-xl cursor-default text-center border border-[#FF6A39]/20"
                  >
                    Active Primary Organization
                  </button>
                ) : (
                  <button
                    onClick={() => handleSwitchWorkspace(ent.id, ent.name)}
                    disabled={switchingId !== null}
                    className="w-full bg-gray-950 hover:bg-gray-850 disabled:opacity-50 text-white text-[12px] font-bold py-2 rounded-xl transition-all duration-200 cursor-pointer text-center active:scale-95"
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
      <div className="rounded-[22px] bg-white border border-[#EBEAE6] shadow-xs p-5 select-none text-left space-y-4">
        <div>
          <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest block font-bold">audit trail</span>
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

      {/* ── ADD BUSINESS DRAWER ── */}
      {addBusinessOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setAddBusinessOpen(false)} />

          <div className="relative z-10 w-full max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col h-full border-l border-[#EBEAE6] animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="p-5 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold text-[#FF6A39] uppercase tracking-widest">Workspace Registration</span>
                <h2 className="text-[18px] font-black text-gray-900 mt-0.5">Register New Business</h2>
              </div>
              <button
                onClick={() => setAddBusinessOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddBusinessSubmit} className="p-5 overflow-y-auto flex-1 space-y-5 text-left">
              <div className="bg-blue-50/50 border border-blue-100/60 rounded-xl p-3.5 flex gap-2.5 text-[11.5px] text-blue-900 leading-relaxed font-semibold">
                <Sparkles size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  Adding a new business registers it under your multi-tenant portal. You can instantly toggle settings, configure API access, and audit ledger balances.
                </div>
              </div>

              {/* Business Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">Business / Org Name</label>
                <input
                  type="text"
                  required
                  value={newBusinessName}
                  onChange={(e) => setNewBusinessName(e.target.value)}
                  placeholder="e.g. Acme Enterprises Pvt. Ltd."
                  className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6A39] focus:border-[#FF6A39] transition-all"
                />
              </div>

              {/* Domain name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">Custom Workspace Domain</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={newBusinessDomain}
                    onChange={(e) => setNewBusinessDomain(e.target.value)}
                    placeholder="acme"
                    className="w-full h-10 pl-3 pr-36 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6A39] focus:border-[#FF6A39] transition-all font-mono"
                  />
                  <span className="absolute right-3 text-[11px] text-gray-400 font-bold font-mono pointer-events-none">
                    .udhaarclear.com
                  </span>
                </div>
              </div>

              {/* Initial Outstanding AR */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">Initial Outstanding AR (₹)</label>
                <input
                  type="number"
                  value={newBusinessOutstanding}
                  onChange={(e) => setNewBusinessOutstanding(e.target.value)}
                  placeholder="e.g. 500000"
                  className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6A39] focus:border-[#FF6A39] transition-all font-mono"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full h-10 bg-gray-950 hover:bg-gray-850 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer active:scale-98 flex items-center justify-center gap-1.5 mt-8 shadow-xs"
              >
                <Briefcase size={13} />
                <span>Create Workspace</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
