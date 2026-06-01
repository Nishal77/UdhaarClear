import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import { CreditCard, Check, ShieldAlert, Sparkles, Download, FileText, CheckCircle2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { PlanTier } from '@prisma/client'

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

const PLAN_DETAILS = {
  FREE: {
    name: 'Free Plan',
    price: 0,
    features: ['Up to 5 invoices / month', 'Up to 3 active customers', 'Manual reminders only', 'Email support'],
    invoiceLimit: 5,
    customerLimit: 3,
  },
  STARTER: {
    name: 'Starter Plan',
    price: 999,
    features: ['Up to 100 invoices / month', 'Up to 50 active customers', 'Standard WhatsApp reminders', 'Priority email support'],
    invoiceLimit: 100,
    customerLimit: 50,
  },
  GROWTH: {
    name: 'Growth Plan',
    price: 2999,
    features: ['Unlimited invoices', 'Unlimited customers', 'Automated reminders escalation', 'Dedicated account manager', 'GSTIN reconciliation'],
    invoiceLimit: 999999,
    customerLimit: 999999,
  },
  CA_PRO: {
    name: 'CA Pro Plan',
    price: 5999,
    features: ['Multi-client business workspace', 'Chartered Accountant dashboard', 'Direct GST API portal link', 'Premium 24/7 phone support'],
    invoiceLimit: 999999,
    customerLimit: 999999,
  }
}

export default async function BillingSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const business = dbUser.ownedBusiness
  const currentTier = business.planTier as PlanTier
  const currentPlan = PLAN_DETAILS[currentTier] || PLAN_DETAILS.FREE

  // Get current customer and invoice counts to render usage quotas
  const customerCount = await prisma.customer.count({
    where: { businessId: business.id }
  })
  const invoiceCount = await prisma.invoice.count({
    where: { businessId: business.id }
  })

  // Server Action to update the subscription/plan tier
  async function updatePlanTier(formData: FormData) {
    'use server'
    const newTier = formData.get('tier') as PlanTier
    if (!Object.keys(PLAN_DETAILS).includes(newTier)) return

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
      data: { planTier: newTier }
    })

    // Also update/create subscription record if appropriate
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    
    await prisma.subscription.create({
      data: {
        userId: userRecord.id,
        planTier: newTier,
        billingCycle: 'MONTHLY',
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: nextMonth,
      }
    })

    revalidatePath('/settings/billing')
  }

  // Mock Invoice History
  const mockBillingHistory = [
    { id: 'INV-2026-003', date: 'May 15, 2026', amount: PLAN_DETAILS[currentTier].price, plan: currentPlan.name, status: 'Paid' },
    { id: 'INV-2026-002', date: 'Apr 15, 2026', amount: PLAN_DETAILS[currentTier].price, plan: currentPlan.name, status: 'Paid' },
    { id: 'INV-2026-001', date: 'Mar 15, 2026', amount: PLAN_DETAILS[currentTier].price, plan: currentPlan.name, status: 'Paid' },
  ].filter(inv => inv.amount > 0) // only show if paid plans

  return (
    <SettingsLayout
      title="Billing & Plans"
      description="Manage your subscription details, check usage quotas, and inspect transaction invoices."
    >
      <div className="space-y-4 w-full">
        {/* Main Grid: Overview & Usage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Current Plan Overview */}
          <div className="md:col-span-2 bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 font-outfit">Active Subscription</h2>
                  <p className="text-xs text-gray-400">Current billing details and features</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50/60 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Plan Name</span>
                  <h3 className="text-lg font-bold text-gray-900 font-outfit mt-0.5">{currentPlan.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pricing</span>
                  <p className="text-lg font-bold text-gray-900 font-outfit mt-0.5">
                    {currentPlan.price === 0 ? 'Free' : `${formatCurrency(currentPlan.price)}/mo`}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Included Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {currentPlan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-600">
                      <div className="w-4 h-4 rounded-full bg-[#E5F7ED] flex items-center justify-center text-[#2563EB] shrink-0">
                        <Check className="w-2.5 h-2.5 text-[#10B981]" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 text-[11px] text-gray-400 font-medium">
              Renewal Date: <span className="font-bold text-gray-600">June 15, 2026</span> (Auto-renews monthly via card/UPI).
            </div>
          </div>

          {/* Card 2: Quota Limits Usage */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 font-outfit">Usage Quotas</h2>
                  <p className="text-xs text-gray-400">Current tier limits</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Invoice usage */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5 font-outfit">
                    <span>Invoices Created</span>
                    <span className="text-gray-400">
                      {invoiceCount} / {currentPlan.invoiceLimit === 999999 ? '∞' : currentPlan.invoiceLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#4F46E5] h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (invoiceCount / (currentPlan.invoiceLimit || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Customer usage */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5 font-outfit">
                    <span>Active Debtors</span>
                    <span className="text-gray-400">
                      {customerCount} / {currentPlan.customerLimit === 999999 ? '∞' : currentPlan.customerLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#FF6B00] h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (customerCount / (currentPlan.customerLimit || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {currentTier === 'FREE' && (
              <div className="mt-6 p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-left">
                <p className="text-[11px] font-medium text-blue-700 leading-normal flex items-start gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  You are approaching limits. Upgrade your tier below to continue printing reminders and syncing GST records.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Plan Upgrade Selector Card */}
        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 text-left">
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 font-outfit">Change Plan Tier</h2>
            <p className="text-xs text-gray-400">Select a pricing level that aligns with your volume of transactions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(PLAN_DETAILS) as PlanTier[]).map((tier) => {
              const plan = PLAN_DETAILS[tier]
              const isActive = currentTier === tier
              return (
                <div
                  key={tier}
                  className={`flex flex-col justify-between border rounded-[18px] p-5 transition-all duration-200 ${
                    isActive
                      ? 'border-[#FF6B00] bg-[#FFF0EB]/20'
                      : 'border-gray-200/80 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-sm font-bold text-gray-800 font-outfit">{plan.name}</h4>
                      {isActive && (
                        <span className="text-[9px] font-bold text-[#FF6B00] bg-[#FFF0EB] border border-[#FF6B00]/25 px-2 py-0.5 rounded-full uppercase">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xl font-black text-gray-900 font-outfit">
                      {plan.price === 0 ? '₹0' : formatCurrency(plan.price)}
                      <span className="text-xs font-normal text-gray-400">/mo</span>
                    </p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] font-semibold text-gray-500 leading-tight">
                          <Check className="w-3 h-3 text-[#10B981] mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <form action={updatePlanTier} className="mt-6">
                    <input type="hidden" name="tier" value={tier} />
                    <button
                      type="submit"
                      disabled={isActive}
                      className={`w-full text-center text-xs font-semibold py-2.5 px-4 rounded-full border transition-all duration-200 active:scale-95 cursor-pointer ${
                        isActive
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-[#FF6B00] hover:bg-[#E05B2E] border-transparent text-white shadow-sm hover:shadow'
                      }`}
                    >
                      {isActive ? 'Current Plan' : 'Select Plan'}
                    </button>
                  </form>
                </div>
              )
            })}
          </div>
        </div>

        {/* Invoice List (Mock Billing History) */}
        {mockBillingHistory.length > 0 && (
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-outfit">Billing History</h2>
                <p className="text-xs text-gray-400">Download previous transaction receipts and invoice statements.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-outfit">Receipt ID</th>
                    <th className="pb-3 font-outfit">Date</th>
                    <th className="pb-3 font-outfit">Plan</th>
                    <th className="pb-3 font-outfit">Amount</th>
                    <th className="pb-3 font-outfit">Status</th>
                    <th className="pb-3 text-right font-outfit">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-600">
                  {mockBillingHistory.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 font-mono">{invoice.id}</td>
                      <td className="py-3.5">{invoice.date}</td>
                      <td className="py-3.5 font-bold text-gray-800">{invoice.plan}</td>
                      <td className="py-3.5">{formatCurrency(invoice.amount)}</td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#10B981] bg-[#E5F7ED] border border-[#10B981]/15 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> {invoice.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button className="inline-flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-50 active:scale-95 transition-all">
                          <Download className="w-3 h-3 text-gray-400" />
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SettingsLayout>
  )
}
