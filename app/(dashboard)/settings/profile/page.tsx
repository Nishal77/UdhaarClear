import { redirect } from 'next/navigation'

export default function BusinessProfileSettingsPage() {
  redirect('/settings?tab=company')
}
