import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import WebhooksClient from '@/components/settings/WebhooksClient'

export default async function WebhooksSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <SettingsLayout
      title="API & Webhooks"
      description="Connect your ERP, custom billing platform, or CRM using developer API keys and real-time webhook listeners."
    >
      <WebhooksClient />
    </SettingsLayout>
  )
}
