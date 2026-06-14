import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import SettingsClient from './SettingsClient'
import { headers } from 'next/headers'

async function getSessionInfo() {
  let ip = '—'
  let userAgent = ''

  try {
    const h = await headers()
    const forwarded = h.get('x-forwarded-for')
    const realIp = h.get('x-real-ip')
    userAgent = h.get('user-agent') || ''

    if (forwarded) ip = forwarded.split(',')[0].trim()
    else if (realIp) ip = realIp
  } catch {
    // non-fatal
  }

  const ua = userAgent.toLowerCase()

  let device = 'Desktop'
  if (ua.includes('iphone') || ua.includes('ipad')) device = 'iPhone'
  else if (ua.includes('android')) device = 'Android'
  else if (ua.includes('windows')) device = 'Windows'
  else if (ua.includes('macintosh') || ua.includes('mac os')) device = 'Mac'
  else if (ua.includes('linux')) device = 'Linux'

  let browser = 'Browser'
  if (ua.includes('firefox')) browser = 'Firefox'
  else if (ua.includes('edg')) browser = 'Edge'
  else if (ua.includes('chrome') && !ua.includes('chromium')) browser = 'Chrome'
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari'

  let location = ''
  let isp = ''
  let isVpn = false

  const isLocal =
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.')

  try {
    const geoUrl = isLocal ? 'http://ip-api.com/json/' : `http://ip-api.com/json/${ip}`
    const res = await fetch(geoUrl, { next: { revalidate: 60 } })
    if (res.ok) {
      const data = await res.json()
      if (data?.status === 'success') {
        ip = data.query || ip
        location = [data.city, data.country].filter(Boolean).join(', ')
        isp = data.isp || data.org || ''
        const vpnSignals = ['vpn', 'proxy', 'hosting', 'datacenter', 'cloudflare',
          'digitalocean', 'amazon', 'aws', 'google cloud', 'gce', 'mullvad',
          'nordvpn', 'expressvpn', 'tor exit', 'ovh', 'linode', 'vultr', 'm247']
        isVpn = vpnSignals.some(s => isp.toLowerCase().includes(s))
      }
    }
  } catch {
    // non-fatal — GeoIP is best-effort
  }

  return { device, browser, ip, location, isp, isVpn }
}

export default async function MySettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true, caProfile: true },
  })
  if (!dbUser) redirect('/login')

  const businessName = dbUser.ownedBusiness?.name ?? 'My Business'
  const planTier = dbUser.ownedBusiness?.planTier ?? 'FREE'

  let userRole: 'Owner' | 'CA Auditor' | 'Accounts Executive' = 'Accounts Executive'
  if (dbUser.caProfile) userRole = 'CA Auditor'
  else if (dbUser.ownedBusiness) userRole = 'Owner'

  const currentSession = await getSessionInfo()

  async function updatePersonalDetailsAction(name: string, phone: string) {
    'use server'
    try {
      const supabaseClient = await createClient()
      const { data: { user: authUser } } = await supabaseClient.auth.getUser()
      if (!authUser) return { success: false, error: 'Not authenticated' }

      await prisma.user.update({
        where: { supabaseId: authUser.id },
        data: { name, phone: phone || null },
      })

      return { success: true }
    } catch (err: any) {
      console.error('Failed to update personal details:', err)
      return { success: false, error: err.message || 'Failed to update details' }
    }
  }

  return (
    <SettingsLayout
      title="Settings"
      description="Manage your profile, business details, reminder rules, and billing."
    >
      <SettingsClient
        dbUser={{
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          phone: dbUser.phone,
          createdAt: dbUser.createdAt,
        }}
        businessName={businessName}
        planTier={planTier}
        userRole={userRole}
        currentSession={currentSession}
        initialAvatarUrl={user.user_metadata?.avatar_url ?? ''}
        identities={user.identities ?? []}
        initialTab={tab}
        updateAction={updatePersonalDetailsAction}
      />
    </SettingsLayout>
  )
}
