'use client'

import React, { useState } from 'react'
import { Users, UserPlus, Trash2, Mail, Shield, ShieldCheck, Check } from 'lucide-react'

interface TeamClientProps {
  ownerName: string
  ownerEmail: string
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Manager' | 'Viewer'
  status: 'Active' | 'Pending'
}

export default function TeamClient({ ownerName, ownerEmail }: TeamClientProps) {
  const [members, setMembers] = useState<TeamMember[]>([
    { id: 'owner', name: ownerName, email: ownerEmail, role: 'Owner', status: 'Active' },
    { id: '2', name: 'Aarav Sharma', email: 'aarav@example.com', role: 'Manager', status: 'Active' },
    { id: '3', name: 'Neha Patel', email: 'neha@example.com', role: 'Viewer', status: 'Pending' },
  ])

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'Manager' | 'Viewer'>('Viewer')
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState('')

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    // Simple email check
    if (!inviteEmail.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    // Check if user already exists
    if (members.some(m => m.email.toLowerCase() === inviteEmail.toLowerCase())) {
      alert('A user with this email is already part of the team')
      return
    }

    const name = inviteEmail.split('@')[0]
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1)

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: formattedName,
      email: inviteEmail.toLowerCase(),
      role: inviteRole,
      status: 'Pending'
    }

    setMembers([...members, newMember])
    setInviteEmail('')
    setNotificationMsg(`Invitation sent to ${inviteEmail}`)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleRemove = (id: string) => {
    if (id === 'owner') return
    if (confirm('Are you sure you want to remove this team member?')) {
      const removed = members.find(m => m.id === id)
      setMembers(members.filter(m => m.id !== id))
      if (removed) {
        setNotificationMsg(`Removed ${removed.name} from team`)
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 3000)
      }
    }
  }

  const handleRoleChange = (id: string, newRole: 'Manager' | 'Viewer') => {
    setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m))
    setNotificationMsg(`Updated role to ${newRole}`)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  return (
    <div className="space-y-4 w-full">
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-full border border-gray-800 shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notificationMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Active Members List (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 text-left flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 font-outfit">Active Members</h2>
              <p className="text-xs text-gray-400">People who have access to this business workspace.</p>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs font-semibold">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-outfit">User</th>
                  <th className="pb-3 font-outfit">Role</th>
                  <th className="pb-3 font-outfit">Status</th>
                  <th className="pb-3 text-right font-outfit">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-600">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EDEDED] text-gray-600 flex items-center justify-center font-bold font-outfit uppercase text-xs">
                          {member.name.slice(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-800 font-outfit">{member.name}</span>
                          <span className="text-[11px] text-gray-400 font-medium">{member.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      {member.role === 'Owner' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600 font-bold uppercase">
                          <ShieldCheck className="w-3.5 h-3.5" /> Primary Owner
                        </span>
                      ) : (
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value as 'Manager' | 'Viewer')}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                        >
                          <option value="Manager">Manager</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      )}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase border px-2.5 py-0.5 rounded-full ${
                        member.status === 'Active'
                          ? 'text-[#10B981] bg-[#E5F7ED] border-[#10B981]/15'
                          : 'text-[#FF6B00] bg-[#FFF0EB] border-[#FF6B00]/15 animate-pulse'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {member.role !== 'Owner' ? (
                        <button
                          onClick={() => handleRemove(member.id)}
                          className="text-gray-400 hover:text-rose-600 p-1.5 rounded-full hover:bg-rose-50 transition-colors"
                          title="Remove user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium pr-2">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Invite Form (1/3 width) */}
        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-outfit">Invite Collaborator</h2>
                <p className="text-xs text-gray-400">Add staff to help manage dues.</p>
              </div>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. staff@business.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                  Permission Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'Manager' | 'Viewer')}
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                >
                  <option value="Manager">Manager (Edit invoices & send alerts)</option>
                  <option value="Viewer">Viewer (View reports & check balances)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF6B00] hover:bg-[#E05B2E] text-white text-xs font-semibold py-2.5 px-4 rounded-full shadow-sm hover:shadow active:scale-95 transition-all duration-200 mt-2 flex items-center justify-center gap-1.5 cursor-pointer border-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Send Invitation
              </button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-50">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role Permissions:</h4>
            <div className="space-y-2">
              <div className="text-[11px] font-medium text-gray-500 leading-normal">
                <span className="font-bold text-gray-700">Manager:</span> Can edit clients, import invoices, toggle follow-ups, and trigger WhatsApp notifications.
              </div>
              <div className="text-[11px] font-medium text-gray-500 leading-normal">
                <span className="font-bold text-gray-700">Viewer:</span> Read-only access to dashboard statistics, aging sheets, and customer profiles.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
