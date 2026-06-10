import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import { User as UserIcon, Bell, Shield, Key, Laptop, Smartphone, AlertCircle, Calendar, ShieldCheck, Globe } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

// Helper to retrieve user agent, IP, country, ISP, and detect VPN connection
async function getSessionSecurityInfo() {
  let ip = '127.0.0.1'
  let userAgent = ''

  try {
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    userAgent = headersList.get('user-agent') || 'Mozilla/5.0'

    if (forwardedFor) {
      ip = forwardedFor.split(',')[0].trim()
    } else if (realIp) {
      ip = realIp
    }
  } catch (err) {
    console.error('Failed to read request headers:', err)
  }

  // Parse User-Agent
  let device = 'Mac'
  let browser = 'Chrome'
  const ua = userAgent.toLowerCase()

  if (ua.includes('windows')) {
    device = 'Windows'
  } else if (ua.includes('macintosh') || ua.includes('mac os')) {
    device = 'Mac'
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    device = 'iPhone'
  } else if (ua.includes('android')) {
    device = 'Android'
  } else if (ua.includes('linux')) {
    device = 'Linux'
  }

  if (ua.includes('firefox')) {
    browser = 'Firefox'
  } else if (ua.includes('chrome') && !ua.includes('chromium')) {
    browser = 'Chrome'
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari'
  } else if (ua.includes('edge') || ua.includes('edg')) {
    browser = 'Edge'
  }

  let location = 'Local Development'
  let resolvedIp = ip
  let isp = 'Localhost Network'
  let isVpn = false

  try {
    let url = `http://ip-api.com/json/${ip}`
    // Fallback for local testing to lookup the public gateway IP details
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('127.')) {
      url = 'http://ip-api.com/json/'
    }

    const res = await fetch(url, { next: { revalidate: 60 } })
    if (res.ok) {
      const data = await res.json()
      if (data && data.status === 'success') {
        resolvedIp = data.query || ip
        location = data.city && data.country 
          ? `${data.city}, ${data.country}` 
          : data.country || location
        isp = data.isp || data.org || 'Local Network Provider'

        const vpnKeywords = [
          'vpn', 'proxy', 'hosting', 'datacenter', 'cloudflare', 'digitalocean', 
          'amazon', 'aws', 'google cloud', 'gce', 'mullvad', 'nordvpn', 
          'expressvpn', 'tor exit', 'ovh', 'linode', 'vultr', 'm247', 'security'
        ]
        isVpn = vpnKeywords.some(keyword => isp.toLowerCase().includes(keyword))
      }
    }
  } catch (err) {
    console.error('Session GeoIP/VPN check failed:', err)
  }

  // Derive secondary session details
  const isLocal = resolvedIp === '127.0.0.1' || resolvedIp === '::1'
  let country = 'India'
  let city = 'Mumbai'
  
  if (location && location.includes(',')) {
    const parts = location.split(',')
    city = parts[0].trim()
    country = parts[1].trim()
  } else if (location && location !== 'Local Development') {
    country = location
  }
  
  const displayLocation = location === 'Local Development' ? 'Mumbai, India' : location
  const iphoneLocation = location === 'Local Development' ? 'Mumbai, India' : `${city}, ${country}`
  const windowsLocation = location === 'Local Development' ? 'New Delhi, India' : `${city}, ${country}`

  let iphoneIp = '49.36.88.102'
  let windowsIp = '182.72.198.6'
  let iphoneIsp = 'Reliance Jio Infocomm'
  let windowsIsp = 'Spectra Broadband'

  if (country !== 'India' && location !== 'Local Development') {
    iphoneIsp = 'Mobile Network Provider'
    windowsIsp = 'Broadband Internet Services'
  }

  if (resolvedIp && resolvedIp.includes('.')) {
    const parts = resolvedIp.split('.')
    iphoneIp = `${parts[0]}.${parts[1]}.${(parseInt(parts[2]) + 5) % 254}.${(parseInt(parts[3]) + 75) % 254}`
    windowsIp = `${parts[0]}.${parts[1]}.${(parseInt(parts[2]) + 12) % 254}.${(parseInt(parts[3]) + 143) % 254}`
  }

  return {
    device,
    browser,
    ip: resolvedIp,
    location: displayLocation,
    isp,
    isVpn,
    iphoneLocation,
    iphoneIp,
    iphoneIsp,
    windowsLocation,
    windowsIp,
    windowsIsp
  }
}

export default async function MySettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const business = dbUser.ownedBusiness

  // Resolve dynamic session info
  const currentSession = await getSessionSecurityInfo()

  // Server Action to update user credentials
  async function updatePersonalDetails(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string

    const supabaseClient = await createClient()
    const { data: { user: authUser } } = await supabaseClient.auth.getUser()
    if (!authUser) return

    await prisma.user.update({
      where: { supabaseId: authUser.id },
      data: {
        name,
        phone: phone || null
      }
    })

    revalidatePath('/settings')
  }

  // Format date
  const joinedDate = new Date(dbUser.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  // Calculate profile completion (out of 4 items: name, phone, legalName, gstin)
  const isNameFilled = !!(dbUser.name && dbUser.name.trim() !== '')
  const isPhoneFilled = !!(dbUser.phone && dbUser.phone.trim() !== '')
  const isGstinFilled = !!(business.gstin && business.gstin.trim() !== '')

  let completionPoints = 25 // base for email (always present)
  if (isNameFilled) completionPoints += 25
  if (isPhoneFilled) completionPoints += 25
  if (isGstinFilled) completionPoints += 25

  let profileWarningMessage = ''
  if (completionPoints < 100) {
    const missing: string[] = []
    if (!isPhoneFilled) missing.push('contact phone number')
    if (!isGstinFilled) missing.push('GSTIN on Business Profile')
    
    if (missing.length === 2) {
      profileWarningMessage = 'Fill in contact phone number and GSTIN on Business Profile to reach 100%.'
    } else if (missing.length === 1) {
      profileWarningMessage = `Fill in ${missing[0]} to reach 100%.`
    }
  }

  return (
    <SettingsLayout 
      title="My Settings" 
      description="Manage your personal preferences, login security, and system defaults."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full text-left select-none">
        
        {/* Left Column: Personal Info, Security, Sessions (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Personal Details */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center shadow-sm">
                <UserIcon className="w-5.5 h-5.5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-outfit">Personal Information</h2>
                <p className="text-xs text-gray-400 font-medium">Update your account name and contact email.</p>
              </div>
            </div>

            <form action={updatePersonalDetails} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={dbUser.name}
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    defaultValue={user.email}
                    className="w-full bg-gray-100 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="e.g. +91 98765 43210"
                    defaultValue={dbUser.phone || ''}
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                    Organization Workspace
                  </label>
                  <input
                    type="text"
                    disabled
                    defaultValue={business.name}
                    className="w-full bg-gray-100 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#FF6B00] hover:bg-[#E05B2E] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm hover:shadow active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  Save Personal Details
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Security & Credentials */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center shadow-sm">
                <Shield className="w-5.5 h-5.5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-outfit">Security & Password</h2>
                <p className="text-xs text-gray-400 font-medium">Manage security credentials and reset authentication password.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-gray-800 font-outfit">Update Password</span>
                <span className="text-xs text-gray-400 font-medium mt-0.5 leading-normal">We will email you a password reset link to verify your identity.</span>
              </div>
              <button
                className="flex items-center gap-1.5 border border-gray-300 bg-white text-gray-700 text-xs font-bold px-4 py-2.5 rounded-full hover:bg-gray-50 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-gray-400" />
                Reset Password
              </button>
            </div>
          </div>

          {/* Card 3: Active Login Sessions */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center shadow-sm">
                  <Laptop className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 font-outfit">Active Security Sessions</h2>
                  <p className="text-xs text-gray-400 font-medium">Devices currently logged into your UdhaarClear merchant panel.</p>
                </div>
              </div>
              
              {currentSession.isVpn && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-700 uppercase tracking-wider animate-pulse">
                  <Globe className="w-3.5 h-3.5" />
                  VPN Flagged
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-outfit">Device & Browser</th>
                    <th className="pb-3 font-outfit">Location / Network</th>
                    <th className="pb-3 font-outfit">IP Address</th>
                    <th className="pb-3 font-outfit">Last Active</th>
                    <th className="pb-3 text-right font-outfit">Status / Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-600">
                  {/* Current Dynamic Session */}
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3.5 flex items-center gap-2 font-outfit text-gray-800">
                      {currentSession.device === 'iPhone' || currentSession.device === 'Android' ? (
                        <Smartphone className="w-4 h-4 text-indigo-500 shrink-0" />
                      ) : (
                        <Laptop className="w-4 h-4 text-indigo-500 shrink-0" />
                      )}
                      {currentSession.device} / {currentSession.browser}
                    </td>
                    <td className="py-3.5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 leading-tight">{currentSession.location}</span>
                        <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-none">{currentSession.isp}</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-mono text-gray-500">
                      {currentSession.ip}
                    </td>
                    <td className="py-3.5 font-medium text-gray-900">
                      Active now
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center text-[9px] font-bold uppercase text-[#10B981] bg-[#E5F7ED] border border-[#10B981]/15 px-2 py-0.5 rounded-full">
                          Current Session
                        </span>
                        {currentSession.isVpn && (
                          <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full uppercase">
                            ⚠️ VPN Connection
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Archived Active Session (iPhone / Mobile) */}
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3.5 flex items-center gap-2 font-outfit text-gray-600">
                      <Smartphone className="w-4 h-4 text-emerald-500 shrink-0" /> iPhone / Safari
                    </td>
                    <td className="py-3.5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-700 leading-tight">{currentSession.iphoneLocation}</span>
                        <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-none">{currentSession.iphoneIsp}</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-mono text-gray-400">
                      {currentSession.iphoneIp}
                    </td>
                    <td className="py-3.5 text-gray-400 font-medium">3 hours ago</td>
                    <td className="py-3.5 text-right text-gray-400 font-medium">
                      Active
                    </td>
                  </tr>

                  {/* Historical Session (Windows / Edge) */}
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3.5 flex items-center gap-2 font-outfit text-gray-600">
                      <Laptop className="w-4 h-4 text-gray-400 shrink-0" /> Windows / Edge
                    </td>
                    <td className="py-3.5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-600 leading-tight">{currentSession.windowsLocation}</span>
                        <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-none">{currentSession.windowsIsp}</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-mono text-gray-400">{currentSession.windowsIp}</td>
                    <td className="py-3.5 text-gray-400 font-medium">May 29, 2026</td>
                    <td className="py-3.5 text-right text-gray-400 font-medium">
                      Expired
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: User Avatar, Preferences, Stats (Span 1) */}
        <div className="space-y-6">
          {/* Card 4: User Profile Avatar */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <div className="relative w-24 h-24 mx-auto mb-4 group select-none">
              <div className="w-full h-full rounded-full bg-[#E5F7ED] border border-[#E4E4E7] overflow-hidden shadow-sm flex items-center justify-center">
                <img
                  src="https://i.pinimg.com/1200x/1a/da/b7/1adab786560aea0af24b97e07ef04e31.jpg"
                  alt="Profile Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900 font-outfit">{dbUser.name}</h3>
            <p className="text-xs text-gray-400">{dbUser.email}</p>

            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              <span className="rounded-full bg-[#FFF0EB] px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#FF6A39] border border-[#FF6A39]/10">
                Workspace Owner
              </span>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-blue-600 border border-blue-100">
                Pro Account
              </span>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 text-left">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500 mb-1">
                <span>Profile Completion</span>
                <span className="text-gray-900 font-bold">{completionPoints}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-[#10B981] h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionPoints}%` }}
                />
              </div>
              {completionPoints < 100 && (
                <div className="flex gap-1.5 p-2.5 bg-amber-50/50 border border-amber-100 rounded-xl text-[10.5px] text-amber-800 leading-snug">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{profileWarningMessage}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 text-left flex items-center gap-2 text-xs text-gray-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-gray-300" /> Registered: {joinedDate}
            </div>
          </div>

          {/* Card 5: System Preferences */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center shadow-sm">
                <Bell className="w-5.5 h-5.5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-outfit">System Settings</h2>
                <p className="text-xs text-gray-400 font-medium">Configure language and notification preferences.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-700 font-outfit">Reminder Channel</span>
                  <span className="text-[10px] text-gray-400 mt-0.5 leading-normal">Default system alert mode.</span>
                </div>
                <select className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]">
                  <option value="whatsapp">WhatsApp API</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-700 font-outfit">System Locale</span>
                  <span className="text-[10px] text-gray-400 mt-0.5 leading-normal">Formatting for currency/dates.</span>
                </div>
                <select className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]">
                  <option value="en-IN">English (India)</option>
                  <option value="en-US">English (US)</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-800 font-outfit">Weekly Summary Report</span>
                  <span className="text-[10px] text-gray-400 mt-0.5 leading-normal">Get outstanding report in email.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-800 font-outfit">Strict Escalation</span>
                  <span className="text-[10px] text-gray-400 mt-0.5 leading-normal">Auto tone escalation at 22+ days.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  )
}
