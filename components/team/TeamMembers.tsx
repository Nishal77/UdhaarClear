'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { MoreHorizontal, UserX, UserCheck, Trash2 } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'

interface Member {
  id: string
  name: string
  email: string
  role: 'OWNER' | 'MANAGER' | 'AGENT' | 'AUDITOR'
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED'
  permissions: string[]
}

const permissionLabels: Record<string, string> = {
  'All Features': 'All Features',
  'billing': 'View Billing Info',
  'billing_edit': 'Modify Billing Settings',
  'all_customers': 'Access Customer Ledgers',
  'send_reminders': 'Trigger Manual Reminders',
  'edit_reminders': 'Configure Tone Rules',
  'view_invoices': 'Read Invoice Records',
  'view_reports': 'View Analytics & Heatmaps',
  'audit_logs': 'Read Activity Logs'
}

export function TeamMembers() {
  const [members, setMembers] = useState<Member[]>([
    { id: 'm-1', name: 'Nishal Poojary', email: 'nishal@udhaarclear.com', role: 'OWNER', status: 'ACTIVE', permissions: ['All Features', 'billing', 'billing_edit'] },
    { id: 'm-2', name: 'Rohan Sharma', email: 'rohan@udhaarclear.com', role: 'MANAGER', status: 'ACTIVE', permissions: ['all_customers', 'send_reminders', 'edit_reminders'] },
    { id: 'm-3', name: 'Priya Patel', email: 'priya@udhaarclear.com', role: 'AGENT', status: 'ACTIVE', permissions: ['view_invoices', 'send_reminders'] },
    { id: 'm-4', name: 'Amit Kumar', email: 'amit@udhaarclear.com', role: 'AUDITOR', status: 'ACTIVE', permissions: ['view_reports', 'audit_logs'] },
    { id: 'm-5', name: 'Kiran Mehta', email: 'kiran@udhaarclear.com', role: 'AGENT', status: 'INVITED', permissions: ['view_invoices', 'send_reminders'] }
  ])

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id))
    toast.success('Team member removed successfully')
  }

  // Invite member state
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState<'OWNER' | 'MANAGER' | 'AGENT' | 'AUDITOR'>('AGENT')
  const [invitePermissions, setInvitePermissions] = useState<string[]>(['view_invoices', 'send_reminders'])

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail || !inviteName) {
      toast.error('Please fill in all fields')
      return
    }

    const newMember: Member = {
      id: `m-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'INVITED',
      permissions: invitePermissions
    }

    setMembers([...members, newMember])
    setInviteEmail('')
    setInviteName('')
    setInviteRole('AGENT')
    setInviteOpen(false)
    toast.success(`Invitation dispatched to ${inviteEmail}`)
  }

  const handleToggleSuspend = (id: string) => {
    setMembers(
      members.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED'
          toast.success(`User access ${nextStatus === 'SUSPENDED' ? 'suspended' : 'restored'}`)
          return { ...m, status: nextStatus }
        }
        return m
      })
    )
  }

  const handlePermissionCheckbox = (perm: string) => {
    if (invitePermissions.includes(perm)) {
      setInvitePermissions(invitePermissions.filter((p) => p !== perm))
    } else {
      setInvitePermissions([...invitePermissions, perm])
    }
  }

  return (
    <div className="space-y-4">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 select-none">
        <div className="flex flex-col text-left">
          <nav className="flex items-center gap-1.5 text-[12px] text-gray-400">
            <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gray-400">Team & Access</span>
            <span>›</span>
            <span className="text-gray-600 font-medium">Team Members</span>
          </nav>
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight mt-1">Team Access Control</h1>
          <p className="mt-1 text-[13px] text-gray-400 font-medium">
            Manage team seat configurations, select role permissions, and suspension controls.
          </p>
        </div>
        <div className="flex items-center justify-end sm:pb-1 shrink-0">
          <button
            onClick={() => setInviteOpen(true)}
            className="bg-[#FF6A39] hover:bg-[#E05B2E] text-white text-xs font-bold py-2 px-5 rounded-xl transition-all shadow-3xs cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <span>+ Invite Member</span>
          </button>
        </div>
      </div>

      {/* ── Team Scorecard Panel (Unified Premium Layout) ── */}
      <div className="bg-white border border-[#EBEAE6] rounded-[22px] overflow-hidden select-none">
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x text-left">

          {/* Metric 1: Seats occupied */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Seats occupied</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                {members.length} / 8 Seats
              </span>
              <span className="inline-flex items-center text-blue-700 text-[11.5px] font-medium whitespace-nowrap">
                {8 - members.length} Invites Left
              </span>
            </div>
          </div>

          {/* Metric 2: Team dispatches (Today) */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Team dispatches (Today)</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                185 Notices
              </span>
              <span className="inline-flex items-center text-emerald-700 text-[11.5px] font-medium whitespace-nowrap">
                ▲ +8.2% vs Yest.
              </span>
            </div>
          </div>

          {/* Metric 3: Avg Response time */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Avg response time</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                15 Mins
              </span>
              <span className="inline-flex items-center text-orange-600 text-[11.5px] font-medium whitespace-nowrap">
                ▼ -2m Imp.
              </span>
            </div>
          </div>

          {/* Metric 4: Security clearances */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Access Clearance</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                100% Secure
              </span>
              <span className="inline-flex items-center text-violet-700 text-[11.5px] font-medium whitespace-nowrap">
                2FA Active
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Seat Allocation List Table ── */}
      <div className="rounded-[22px] bg-white border border-[#EBEAE6] overflow-hidden select-none">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#EBEAE6] select-none bg-[#FAF9F6]/40 text-left">
                <th className="px-6 py-4.5 text-[13.5px] font-bold text-gray-600">Name & Email</th>
                <th className="px-6 py-4.5 text-[13px] font-bold text-gray-600 w-[130px]">Status</th>
                <th className="px-6 py-4.5 text-[13px] font-bold text-gray-600">Access Permissions</th>
                <th className="px-6 py-4.5 text-right text-[13px] font-bold text-gray-600 w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEAE6]/60 text-left">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-6 py-5">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[14.5px] font-bold text-gray-955 leading-tight">{m.name}</span>
                        <span className="text-[12.5px] text-gray-400 font-semibold font-sans">
                          ({m.role === 'OWNER' ? 'Owner' : m.role === 'MANAGER' ? 'Manager' : m.role === 'AGENT' ? 'Agent' : 'Auditor'})
                        </span>
                      </div>
                      <span className="text-[12px] text-gray-500 font-medium block mt-1 font-sans">{m.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 select-none">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${m.status === 'ACTIVE'
                          ? 'bg-emerald-500'
                          : m.status === 'INVITED'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`} />
                      <span className={`text-[13px] font-bold whitespace-nowrap ${m.status === 'ACTIVE'
                          ? 'text-emerald-700'
                          : m.status === 'INVITED'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}>
                        {m.status === 'ACTIVE' ? 'Active' : m.status === 'INVITED' ? 'Invited' : 'Suspended'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {m.permissions.map((p) => (
                        <span key={p} className="text-[11px] font-semibold bg-[#FAF9F6] text-gray-600 border border-[#EBEAE6] px-2 py-0.5 rounded-lg shadow-3xs">
                          {permissionLabels[p] || p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right whitespace-nowrap">
                    {m.role !== 'OWNER' ? (
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === m.id ? null : m.id)}
                          className="p-2 rounded-xl hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all text-gray-500 cursor-pointer active:scale-95 inline-flex items-center justify-center"
                          title="Manage Access Options"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        {activeMenuId === m.id && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                            <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[#EBEAE6] rounded-2xl shadow-lg z-40 py-1.5 text-left select-none animate-in fade-in slide-in-from-top-1 duration-100">
                              <div className="px-3.5 py-1 text-[12.5px] font-semibold text-gray-600 tracking-tight border-b border-gray-100/50 pb-1.5 mb-1">
                                Access Control
                              </div>
                              <button
                                onClick={() => {
                                  handleToggleSuspend(m.id)
                                  setActiveMenuId(null)
                                }}
                                className={`w-full px-3.5 py-2 text-xs font-semibold hover:bg-gray-50 flex items-center justify-between transition-colors cursor-pointer ${
                                  m.status === 'SUSPENDED' ? 'text-emerald-700' : 'text-gray-700'
                                }`}
                              >
                                {m.status === 'SUSPENDED' ? (
                                  <>
                                    <div className="flex items-center gap-2.5">
                                      <UserCheck size={14} className="text-emerald-500" />
                                      <span>Activate Access</span>
                                    </div>
                                    <HugeiconsIcon icon={ArrowRight01Icon} className="text-emerald-500" size={16} />
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-2.5">
                                      <UserX size={14} className="text-rose-500" />
                                      <span>Suspend Access</span>
                                    </div>
                                    <HugeiconsIcon icon={ArrowRight01Icon} className="text-rose-500" size={16} />
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to remove ${m.name} from the team?`)) {
                                    handleRemoveMember(m.id)
                                  }
                                  setActiveMenuId(null)
                                }}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center justify-between transition-colors cursor-pointer border-t border-gray-100/60 mt-1"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Trash2 size={14} className="text-red-500" />
                                  <span>Remove Member</span>
                                </div>
                                <HugeiconsIcon icon={ArrowRight01Icon} className="text-red-500" size={16} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-[13px] font-medium text-gray-500 tracking-tight select-none bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                        System Owner
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── INVITE MEMBER DRAWER ── */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setInviteOpen(false)} />

          <div className="relative z-10 w-full max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col h-full border-l border-[#EBEAE6]">

            <div className="p-5 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold text-[#FF6A39] uppercase tracking-widest">Team Access Portal</span>
                <h3 className="text-[16px] font-bold text-gray-900 mt-0.5 leading-tight">Invite New Team Member</h3>
              </div>
              <button
                onClick={() => setInviteOpen(false)}
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={inviteSubmit => handleInviteSubmit(inviteSubmit)} className="p-5 overflow-y-auto flex-1 space-y-5 text-left">

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">Member Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full h-10 bg-white rounded-xl px-3.5 text-xs text-gray-800 border border-[#EBEAE6] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/20 transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. rohan@udhaarclear.com"
                  className="w-full h-10 bg-white rounded-xl px-3.5 text-xs text-gray-800 border border-[#EBEAE6] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/20 transition-all"
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">Access Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full h-10 bg-white rounded-xl px-3 text-xs text-gray-800 border border-[#EBEAE6] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/20 transition-all cursor-pointer"
                >
                  <option value="MANAGER">MANAGER (Can edit reminder schedules)</option>
                  <option value="AGENT">AGENT (Can trigger manual alerts)</option>
                  <option value="AUDITOR">AUDITOR (Read-only reports access)</option>
                </select>
              </div>

              {/* Scope Checkboxes */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">Feature Permissions</label>
                <div className="bg-white border border-[#EBEAE6] rounded-xl p-4 space-y-3">
                  {[
                    { id: 'view_invoices', label: 'View Ledger Invoices' },
                    { id: 'send_reminders', label: 'Trigger reminders manually' },
                    { id: 'edit_reminders', label: 'Edit tone engine schedules' },
                    { id: 'view_reports', label: 'View accounting reports & heatmap' }
                  ].map((perm) => (
                    <div key={perm.id} className="flex gap-2.5 items-center">
                      <input
                        type="checkbox"
                        id={perm.id}
                        checked={invitePermissions.includes(perm.id)}
                        onChange={() => handlePermissionCheckbox(perm.id)}
                        className="h-4 w-4 rounded border-gray-300 text-[#FF6A39] focus:ring-[#FF6A39]/30 focus:outline-none cursor-pointer"
                      />
                      <label htmlFor={perm.id} className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                        {perm.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-[#FF6A39] hover:bg-[#E05B2E] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-3xs cursor-pointer text-center"
              >
                Send Invite Dispatch
              </button>

            </form>

            <div className="p-5 bg-white border-t border-gray-100">
              <button
                onClick={() => setInviteOpen(false)}
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                Cancel Invitation
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
