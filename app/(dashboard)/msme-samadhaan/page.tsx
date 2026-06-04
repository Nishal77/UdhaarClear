import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { GavelIcon } from '@hugeicons/core-free-icons'
import { MsmeSamadhaanDashboard } from '@/components/msme-samadhaan/MsmeSamadhaanDashboard'

export default async function MsmeSamadhaanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col select-none">
        <nav className="flex items-center gap-1.5 text-[12px] text-gray-400 text-left">
          <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">MSME Samadhaan</span>
        </nav>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight">MSME Samadhaan Case Manager</h1>
          <a
            href="https://samadhaan.msme.gov.in/MyMsme/MSME_Share/Homepage.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-gray-800 transition-all cursor-pointer"
          >
            <span>Official Samadhaan Portal ↗</span>
          </a>
        </div>
        <p className="mt-1 text-[13px] text-gray-400 text-left">
          Claim 3x RBI compound interest for payments delayed beyond 45 days and generate formal council petition packets.
        </p>
      </div>

      {/* ── Interactive MSME Samadhaan Dashboard Workspace ── */}
      <MsmeSamadhaanDashboard />

    </div>
  )
}
