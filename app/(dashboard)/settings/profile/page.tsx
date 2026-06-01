import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import { Landmark, Phone, Building, FileText, CheckCircle2, MapPin, Upload, Briefcase } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function BusinessProfileSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const business = dbUser.ownedBusiness

  async function updateBusinessProfile(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const legalName = formData.get('legalName') as string
    const gstin = formData.get('gstin') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string

    const supabaseClient = await createClient()
    const { data: { user: authUser } } = await supabaseClient.auth.getUser()
    if (!authUser) return

    const userRecord = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
      include: { ownedBusiness: true }
    })
    if (!userRecord?.ownedBusiness) return

    await prisma.business.update({
      where: { id: userRecord.ownedBusiness.id },
      data: {
        name,
        legalName: legalName || null,
        gstin: gstin || null,
        phone,
        address: address || null,
        city: city || null,
        state: state || null,
      }
    })

    revalidatePath('/settings/profile')
  }

  return (
    <SettingsLayout 
      title="Business Profile" 
      description="Update your corporate details, tax profiles (GSTIN), and invoice branding information."
    >
      <form action={updateBusinessProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full text-left">
        {/* Left Columns (Span 2): Legal Registration & Address */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Company Registration */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-outfit">Company Registration</h2>
                <p className="text-xs text-gray-400">Fill in the fields below. These details are printed on all generated legal notices and payment requests.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                  Business Name (Trade Name)
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={business.name}
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                  Legal Entity Name
                </label>
                <input
                  type="text"
                  name="legalName"
                  placeholder="e.g. Acme Corporation Pvt Ltd"
                  defaultValue={business.legalName || ''}
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                  GSTIN (Tax ID Number)
                </label>
                <input
                  type="text"
                  name="gstin"
                  placeholder="e.g. 27AAAAA1111A1Z1"
                  pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
                  title="Please enter a valid 15-digit GSTIN number"
                  defaultValue={business.gstin || ''}
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                  WhatsApp Support Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="e.g. +91 99999 99999"
                  defaultValue={business.phone}
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Registered Business Address */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-outfit">Registered Address</h2>
                <p className="text-xs text-gray-400">Specify your corporate headquarters location for official communication.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="e.g. Suite 402, Trade Tower, Bandra Kurla Complex"
                  defaultValue={business.address || ''}
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Mumbai"
                    defaultValue={business.city || ''}
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                    State / Region
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="e.g. Maharashtra"
                    defaultValue={business.state || ''}
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Span 1): Logo, Default Settings & Bank Details */}
        <div className="space-y-4">
          {/* Card 3: Business Branding / Logo */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 text-center">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-800 font-outfit">Business Logo</h2>
              <span className="text-[10px] text-gray-400 font-medium">PNG, JPG up to 1MB</span>
            </div>

            <div className="border border-dashed border-gray-200 rounded-[18px] p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer">
              {business.logoUrl ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden mb-3">
                  <img src={business.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <Upload className="w-5 h-5" />
                </div>
              )}
              <span className="text-xs font-semibold text-gray-700">Upload corporate logo</span>
              <span className="text-[10px] text-gray-400 mt-0.5 font-medium">To put on payment reminder receipts</span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 text-left flex items-center justify-between text-xs text-gray-500 font-semibold">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-gray-400" /> Subscription Plan:
              </span>
              <span className="text-[#FF6B00] uppercase font-black">{business.planTier}</span>
            </div>
          </div>

          {/* Card 4: Invoice Default Options */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-outfit">Invoice Defaults</h2>
                <p className="text-xs text-gray-400">Default settings for customer notices.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-700 font-outfit">Default Credit Days</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Due date period allowance.</span>
                </div>
                <select className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]">
                  <option value="15">15 Days</option>
                  <option value="30" defaultValue="30">30 Days</option>
                  <option value="45">45 Days</option>
                  <option value="60">60 Days</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-700 font-outfit">MSME Legal Warning</span>
                  <span className="text-[10px] text-gray-400 mt-0.5 leading-normal">Show legal action notices.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Card 5: Invoicing Bank Account Details */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-outfit">Payout Bank Details</h2>
                <p className="text-xs text-gray-400">Printed on payment PDFs to allow direct RTGS/NEFT/IMPS bank transfers.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-outfit">
                  Beneficiary Account Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corporation Pvt Ltd"
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-outfit">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 50200012345678"
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-outfit">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0000123"
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 uppercase focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-outfit">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC Bank"
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action Box */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full bg-[#FF6B00] hover:bg-[#E05B2E] text-white text-xs font-semibold py-2.5 px-5 rounded-full shadow-sm hover:shadow active:scale-95 transition-all duration-200"
            >
              Save Business Profile
            </button>
          </div>
        </div>
      </form>
    </SettingsLayout>
  )
}
