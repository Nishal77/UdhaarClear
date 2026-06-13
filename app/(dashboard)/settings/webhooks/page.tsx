import { redirect } from 'next/navigation'

export default function WebhooksSettingsPage() {
  redirect('/settings?tab=sync')
}
