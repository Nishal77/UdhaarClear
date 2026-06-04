import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import Link from 'next/link'
import { TeamMembers } from '@/components/team/TeamMembers'

export default async function TeamMembersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  return (
    <div className="space-y-4">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col select-none">
        <nav className="flex items-center gap-1.5 text-[12px] text-gray-400 text-left">
          <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-455">Team & Access</span>
          <span>›</span>
          <span className="text-gray-600 font-medium">Team Members</span>
        </nav>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight">Team Access Control</h1>
        </div>
        <p className="mt-1 text-[13px] text-gray-400 text-left font-medium">
          Manage team seat configurations, select role permissions, and suspension controls.
        </p>
      </div>

      {/* ── Interactive Workspace ── */}
      <TeamMembers />

    </div>
  )
}
