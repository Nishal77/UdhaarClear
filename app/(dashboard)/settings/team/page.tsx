import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import TeamClient from '@/components/settings/TeamClient'

export default async function TeamSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  })
  if (!dbUser) redirect('/dashboard')

  return (
    <SettingsLayout
      title="Team Members"
      description="Collaborate with your finance department, auditors, or accountants on pending dues."
    >
      <TeamClient ownerName={dbUser.name} ownerEmail={dbUser.email} />
    </SettingsLayout>
  )
}
