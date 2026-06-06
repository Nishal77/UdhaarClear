import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import { CreditCard, Check, ShieldAlert, Sparkles, Download, Receipt, CheckCircle2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { PlanTier } from '@prisma/client'
import { CancelSubscriptionButton } from '@/components/settings/CancelSubscriptionButton'

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

  // Server Action to cancel the subscription (downgrade to FREE)
  async function handleCancelSubscription() {
    'use server'
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
      data: { planTier: 'FREE' }
    })

    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    
    await prisma.subscription.create({
      data: {
        userId: userRecord.id,
        planTier: 'FREE',
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
      <div className="space-y-6 w-full select-none">
        
        {/* Modern 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT COLUMN: Current Plan & Change Plan */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Subscription Details Card */}
            <div className="bg-white border border-[#EBEAE6]/60 rounded-[24px] p-6 text-left flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.015)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50/30 to-transparent pointer-events-none rounded-bl-full" />
              
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                    <CreditCard className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 font-outfit">Active Subscription</h2>
                    <p className="text-xs text-gray-400 font-medium">Manage payment settings, invoices, and billing period.</p>
                  </div>
                </div>

                <div className="p-5 bg-[#F8F9FA] rounded-[20px] border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Plan Name</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <h3 className="text-lg font-bold text-gray-900 font-outfit leading-none">{currentPlan.name}</h3>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-500/15 px-2 py-0.5 rounded-full uppercase leading-none">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pricing Rate</span>
                    <p className="text-lg font-bold text-gray-900 font-outfit mt-0.5">
                      {currentPlan.price === 0 ? 'Free' : `${formatCurrency(currentPlan.price)} / mo`}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Plan Features included:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                    {currentPlan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                        <div className="w-4 h-4 rounded-full bg-[#E5F7ED] flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-[#10B981]" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Renewal Date & Cancel Anytime action */}
              <div className="mt-8 pt-5 border-t border-gray-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-[11px] text-gray-400 font-medium">
                  Renewal Date: <span className="font-bold text-gray-600">June 15, 2026</span> (Renews auto-monthly).
                </div>
                
                {currentTier !== 'FREE' ? (
                  <CancelSubscriptionButton onCancel={handleCancelSubscription} />
                ) : (
                  <span className="text-[11px] text-gray-400 font-medium italic">
                    Cancel anytime. Upgrade to unlock automation.
                  </span>
                )}
              </div>
            </div>

            {/* Change Plan Tier Selector */}
            <div className="bg-white border border-[#EBEAE6]/60 rounded-[24px] p-6 text-left shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
              <div className="mb-6">
                <h2 className="text-base font-bold text-gray-900 font-outfit">Upgrade / Downgrade Plan</h2>
                <p className="text-xs text-gray-400 font-medium">Select a pricing level that aligns with your volume of transactions.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {(Object.keys(PLAN_DETAILS) as PlanTier[]).map((tier) => {
                  const plan = PLAN_DETAILS[tier]
                  const isActive = currentTier === tier
                  return (
                    <div
                      key={tier}
                      className={`flex flex-col justify-between border rounded-[22px] p-6 transition-all duration-300 relative ${
                        isActive
                          ? 'border-[#FF6B00] bg-[#FFF0EB]/10 shadow-[0_8px_30px_rgba(255,107,0,0.03)]'
                          : 'border-gray-200/80 hover:border-gray-300 bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:-translate-y-0.5'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-[15px] font-bold text-gray-800 font-outfit">{plan.name}</h4>
                          {isActive && (
                            <span className="text-[9px] font-bold text-[#FF6B00] bg-[#FFF0EB] border border-[#FF6B00]/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-2xl font-black text-gray-900 font-outfit leading-none">
                          {plan.price === 0 ? '₹0' : formatCurrency(plan.price)}
                          <span className="text-xs font-normal text-gray-400 lowercase ml-1">/ mo</span>
                        </p>
                        
                        <div className="border-t border-gray-50 my-4" />
                        
                        <ul className="space-y-2.5">
                          {plan.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs font-semibold text-gray-500 leading-normal">
                              <Check className="w-3.5 h-3.5 text-[#10B981] mt-0.5 shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <form action={updatePlanTier} className="mt-7">
                        <input type="hidden" name="tier" value={tier} />
                        <button
                          type="submit"
                          disabled={isActive}
                          className={`w-full text-center text-xs font-bold py-3 px-4 rounded-full border transition-all duration-200 active:scale-95 cursor-pointer ${
                            isActive
                              ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-[#FF6B00] hover:bg-[#E05B2E] border-transparent text-white shadow-sm hover:shadow'
                          }`}
                        >
                          {isActive ? 'Current Active Tier' : `Select ${plan.name}`}
                        </button>
                      </form>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Usage Quotas & Invoice Receipts */}
          <div className="space-y-6">
            
            {/* Quota Limits Card */}
            <div className="bg-white border border-[#EBEAE6]/60 rounded-[24px] p-6 text-left flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
              <div>
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center shadow-sm">
                    <Sparkles className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 font-outfit">Usage Quotas</h2>
                    <p className="text-xs text-gray-400 font-medium">Limits based on current tier.</p>
                  </div>
                </div>

                <div className="space-y-5.5">
                  {/* Invoice usage progress bar */}
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

                  {/* Customer usage progress bar */}
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
                <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100/60 rounded-2xl text-left">
                  <p className="text-[11px] font-semibold text-blue-700 leading-relaxed flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
                    You are approaching limits. Upgrade your tier to enable automatic WhatsApp escalations and import spreadsheets.
                  </p>
                </div>
              )}
            </div>

            {/* Billing History Card - Stacked vertical receipts format */}
            <div className="bg-white border border-[#EBEAE6]/60 rounded-[24px] p-6 text-left shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center shadow-sm">
                  <Receipt className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 font-outfit">Billing History</h2>
                  <p className="text-xs text-gray-400 font-medium">Download previous invoice statements.</p>
                </div>
              </div>

              {mockBillingHistory.length > 0 ? (
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-0.5 scrollbar-thin">
                  {mockBillingHistory.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3.5 bg-gray-50/50 hover:bg-gray-50 rounded-2xl border border-gray-100/60 transition-all">
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-gray-800 font-mono">{invoice.id}</span>
                        <span className="text-[10.5px] text-gray-400 font-semibold mt-0.5">{invoice.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-2.5">
                        <div className="text-right flex flex-col justify-center">
                          <span className="text-xs font-bold text-gray-900 font-outfit leading-none">{formatCurrency(invoice.amount)}</span>
                          <span className="text-[9px] font-bold text-[#10B981] uppercase mt-1 tracking-wider leading-none">Paid</span>
                        </div>
                        <button className="p-2 border border-gray-200 hover:border-gray-300 rounded-full hover:bg-white active:scale-95 transition-all text-gray-400 hover:text-gray-600 cursor-pointer">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                  <p className="text-xs text-gray-400 font-semibold">No transactions billed yet</p>
                </div>
              )}
            </div>

          </div>
          
        </div>
      </div>
    </SettingsLayout>
  )
}
