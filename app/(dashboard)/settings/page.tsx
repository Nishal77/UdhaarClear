import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import { User as UserIcon, Bell, Shield, Key, Laptop, Smartphone, AlertCircle, Calendar, ShieldCheck, Globe } from 'lucide-react'
import { revalidatePath } from 'next/cache'

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
    month: 'long',
    year: 'numeric'
  })

  // Calculate profile completion (out of 4 items: name, phone, legalName, gstin)
  let completionPoints = 25 // base for email
  if (dbUser.name) completionPoints += 25
  if (dbUser.phone) completionPoints += 25
  if (business.gstin) completionPoints += 25

  return (
    <SettingsLayout 
      title="My Settings" 
      description="Manage your personal preferences, login security, and system defaults."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full text-left">
        {/* Left Column: Personal Info, Security, Sessions (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Personal Details */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-outfit">Personal Information</h2>
                <p className="text-xs text-gray-400">Update your account name and contact email.</p>
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

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#FF6B00] hover:bg-[#E05B2E] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-sm hover:shadow active:scale-95 transition-all duration-200"
                >
                  Save Personal Details
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Security & Credentials */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-outfit">Security & Password</h2>
                <p className="text-xs text-gray-400">Manage security credentials and reset authentication password.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-gray-800 font-outfit">Update Password</span>
                <span className="text-xs text-gray-400">We will email you a password reset link to verify your identity.</span>
              </div>
              <button
                className="flex items-center gap-1.5 border border-gray-300 bg-white text-gray-700 text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-50 active:scale-95 transition-all duration-200"
              >
                <Key className="w-3.5 h-3.5" />
                Reset Password
              </button>
            </div>
          </div>

          {/* Card 3: Active Login Sessions */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-outfit">Active Security Sessions</h2>
                <p className="text-xs text-gray-400">Devices currently logged into your UdhaarClear merchant panel.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-outfit">Device & Browser</th>
                    <th className="pb-3 font-outfit">Location</th>
                    <th className="pb-3 font-outfit">IP Address</th>
                    <th className="pb-3 font-outfit">Last Active</th>
                    <th className="pb-3 text-right font-outfit">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-600">
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 flex items-center gap-2 font-outfit text-gray-800">
                      <Laptop className="w-4 h-4 text-indigo-500" /> Mac / Chrome
                    </td>
                    <td className="py-3">Mumbai, India</td>
                    <td className="py-3 font-mono">103.88.22.4</td>
                    <td className="py-3">Active now</td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center text-[9px] font-bold uppercase text-[#10B981] bg-[#E5F7ED] px-2 py-0.5 rounded-full">
                        Current Session
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 flex items-center gap-2 font-outfit text-gray-600">
                      <Smartphone className="w-4 h-4 text-emerald-500" /> iPhone / Safari
                    </td>
                    <td className="py-3">Mumbai, India</td>
                    <td className="py-3 font-mono">103.88.22.4</td>
                    <td className="py-3">3 hours ago</td>
                    <td className="py-3 text-right text-gray-400 font-medium">
                      Active
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 flex items-center gap-2 font-outfit text-gray-600">
                      <Laptop className="w-4 h-4 text-gray-400" /> Windows / Edge
                    </td>
                    <td className="py-3">New Delhi, India</td>
                    <td className="py-3 font-mono">182.72.198.6</td>
                    <td className="py-3">May 29, 2026</td>
                    <td className="py-3 text-right text-gray-400 font-medium">
                      Expired
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: User Avatar, Preferences, Stats (Span 1) */}
        <div className="space-y-4">
          {/* Card 4: User Profile Avatar */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 text-center">
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
                  <span>Fill in contact phone number and GSTIN on Business Profile to reach 100%.</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 text-left flex items-center gap-2 text-xs text-gray-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-gray-300" /> Registered: {joinedDate}
            </div>
          </div>

          {/* Card 5: System Preferences */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-outfit">System Settings</h2>
                <p className="text-xs text-gray-400">Configure language and notification preferences.</p>
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
