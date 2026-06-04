'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  UserMultipleIcon,
  Megaphone02Icon,
  HourglassIcon,
  Shield01Icon,
  UserGroupIcon
} from '@hugeicons/core-free-icons'

interface Member {
  id: string
  name: string
  email: string
  role: 'OWNER' | 'MANAGER' | 'AGENT' | 'AUDITOR'
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED'
  permissions: string[]
}

export function TeamMembers() {
  const [members, setMembers] = useState<Member[]>([
    { id: 'm-1', name: 'Nishal Poojary', email: 'nishal@udhaarclear.com', role: 'OWNER', status: 'ACTIVE', permissions: ['All Features', 'billing', 'billing_edit'] },
    { id: 'm-2', name: 'Rohan Sharma', email: 'rohan@udhaarclear.com', role: 'MANAGER', status: 'ACTIVE', permissions: ['all_customers', 'send_reminders', 'edit_reminders'] },
    { id: 'm-3', name: 'Priya Patel', email: 'priya@udhaarclear.com', role: 'AGENT', status: 'ACTIVE', permissions: ['view_invoices', 'send_reminders'] },
    { id: 'm-4', name: 'Amit Kumar', email: 'amit@udhaarclear.com', role: 'AUDITOR', status: 'ACTIVE', permissions: ['view_reports', 'audit_logs'] },
    { id: 'm-5', name: 'Kiran Mehta', email: 'kiran@udhaarclear.com', role: 'AGENT', status: 'INVITED', permissions: ['view_invoices', 'send_reminders'] }
  ])

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

      {/* ── Team Metrics Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        
        {/* Metric 1: Seats occupied */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Seats occupied</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <HugeiconsIcon icon={UserMultipleIcon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block">
              {members.length} / 8 Seats
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ● 3 Invites available
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Reminders Sent */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Team dispatches (Today)</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <HugeiconsIcon icon={Megaphone02Icon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block">
              185 Notices
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ▲ +8.2% vs Yesterday
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Avg Response time */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Avg response time</span>
            <span className="p-1.5 rounded-lg bg-orange-50 text-[#FF6A39]">
              <HugeiconsIcon icon={HourglassIcon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block">
              15 Mins
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ▼ -2m Improvement
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Security clearances */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Access Clearance</span>
            <span className="p-1.5 rounded-lg bg-violet-50 text-violet-600">
              <HugeiconsIcon icon={Shield01Icon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block">
              100% Secure
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ● 2-Factor Auth Active
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Table Toolbar Controls ── */}
      <div className="bg-white border border-[#EBEAE6] rounded-xl p-4 select-none shadow-xs text-left">
        <div className="flex items-center justify-between gap-4">
          <div className="text-left space-y-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Ledger access control</span>
            <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight">Team Members directory</h3>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="bg-[#FF6A39] hover:bg-[#E05B2E] text-white text-xs font-bold py-1.5 px-4 rounded-xl transition-all shadow-3xs cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <span>+ Invite Member</span>
          </button>
        </div>
      </div>

      {/* ── Seat Allocation List Table ── */}
      <div className="rounded-xl bg-white border border-[#EBEAE6] shadow-xs overflow-hidden select-none">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#EBEAE6] select-none bg-gray-50/50 text-left">
                <th className="px-5 py-3.5 text-[12px] font-bold text-gray-500">Name & Email</th>
                <th className="px-4 py-3.5 text-[12px] font-bold text-gray-500">Role</th>
                <th className="px-4 py-3.5 text-[12px] font-bold text-gray-500">Status</th>
                <th className="px-4 py-3.5 text-[12px] font-bold text-gray-500 w-[240px]">Access permissions</th>
                <th className="px-5 py-3.5 text-right text-[12px] font-bold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEAE6]/60 text-left">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <span className="text-[13px] font-bold text-gray-900 block leading-tight">{m.name}</span>
                      <span className="text-[10.5px] text-gray-400 font-semibold block mt-1 font-mono">{m.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-[10px] font-bold border border-gray-150 text-gray-700">
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9.5px] font-bold whitespace-nowrap ${
                      m.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                        : m.status === 'INVITED'
                          ? 'bg-amber-50 text-amber-700 border border-amber-250'
                          : 'bg-rose-50 text-rose-700 border border-rose-250'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 max-w-[240px]">
                    <div className="flex flex-wrap gap-1">
                      {m.permissions.map((p) => (
                        <span key={p} className="text-[9px] font-bold bg-[#FAF9F6] text-gray-500 border border-[#EBEAE6] px-1.5 py-0.2 rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    {m.role !== 'OWNER' && (
                      <button
                        onClick={() => handleToggleSuspend(m.id)}
                        className={`text-xs font-bold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                          m.status === 'SUSPENDED'
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                        }`}
                      >
                        {m.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Role permissions Guide Card ── */}
      <div className="bg-[#FAF9F6] border border-[#EBEAE6] rounded-[22px] p-5 text-left select-none shadow-3xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-orange-100 text-[#FF6A39]">
            <HugeiconsIcon icon={UserGroupIcon} size={16} />
          </span>
          <h3 className="text-[14.5px] font-extrabold text-gray-900 uppercase tracking-wider">
            Access Role Permissions Matrix
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#EBEAE6]/65 p-4 rounded-xl space-y-1">
            <span className="text-xs font-extrabold text-gray-950 block">OWNER / ADMIN</span>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
              Full administrative privileges. Manage business profiles, edit billing details, integrate API webhooks, invite members, and toggle organization configurations.
            </p>
          </div>
          <div className="bg-white border border-[#EBEAE6]/65 p-4 rounded-xl space-y-1">
            <span className="text-xs font-extrabold text-blue-700 block">MANAGER</span>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
              Full collection operations capabilities. Modify tone engine settings, configure auto-reminder channels, download petition packs, and manage debtor profiles.
            </p>
          </div>
          <div className="bg-white border border-[#EBEAE6]/65 p-4 rounded-xl space-y-1">
            <span className="text-xs font-extrabold text-emerald-700 block">AGENT / AUDITOR</span>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
              Read-only audits and manual reminder triggers. Dispatch messages manually, audit aging heatmap values, and track active Facilitation Council case hearings.
            </p>
          </div>
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
