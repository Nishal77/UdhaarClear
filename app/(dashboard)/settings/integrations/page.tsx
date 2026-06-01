import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import IntegrationsClient from '@/components/settings/IntegrationsClient'
import { revalidatePath } from 'next/cache'

export default async function IntegrationsSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const business = dbUser.ownedBusiness

  // Server Action to save WhatsApp credentials to Prisma
  async function saveWhatsAppCredentials(wabaId: string, waPhoneId: string, connected: boolean) {
    'use server'
    const supabaseClient = await createClient()
    const { data: { user: authUser } } = await supabaseClient.auth.getUser()
    if (!authUser) return { success: false }

    const userRecord = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
      include: { ownedBusiness: true }
    })
    if (!userRecord?.ownedBusiness) return { success: false }

    try {
      await prisma.business.update({
        where: { id: userRecord.ownedBusiness.id },
        data: {
          wabaId: wabaId || null,
          waPhoneId: waPhoneId || null,
          waConnected: connected,
        }
      })
      revalidatePath('/settings/integrations')
      return { success: true }
    } catch (err) {
      console.error('Error saving WhatsApp credentials:', err)
      return { success: false }
    }
  }

  return (
    <SettingsLayout
      title="Integrations"
      description="Connect third-party billing software, message gateways, and payment service providers."
    >
      <IntegrationsClient
        initialWabaId={business.wabaId}
        initialWaPhoneId={business.waPhoneId}
        initialWaConnected={business.waConnected}
        onSaveWhatsApp={saveWhatsAppCredentials}
      />
    </SettingsLayout>
  )
}
