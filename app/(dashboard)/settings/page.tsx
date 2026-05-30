import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { PageHeader } from '@/components/layout/PageHeader'
import { PLAN_LIMITS, PLAN_PRICES } from '@/lib/plans'
import Link from 'next/link'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const business = dbUser.ownedBusiness
  const limits = PLAN_LIMITS[business.planTier]
  const [customerCount, invoiceCount] = await Promise.all([
    prisma.customer.count({ where: { businessId: business.id } }),
    prisma.invoice.count({ where: { businessId: business.id } }),
  ])

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" description="Manage your business profile and subscription" />

      <div className="rounded-xl bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Business Profile</h2>
        <dl className="grid grid-cols-2 gap-y-3 text-sm">
          <dt className="text-gray-500">Business Name</dt>
          <dd className="font-medium text-gray-900">{business.name}</dd>
          {business.legalName && (
            <>
              <dt className="text-gray-500">Legal Name</dt>
              <dd className="text-gray-900">{business.legalName}</dd>
            </>
          )}
          <dt className="text-gray-500">Phone</dt>
          <dd className="text-gray-900">{business.phone}</dd>
          {business.gstin && (
            <>
              <dt className="text-gray-500">GSTIN</dt>
              <dd className="font-mono text-gray-900">{business.gstin}</dd>
            </>
          )}
          <dt className="text-gray-500">WhatsApp Connected</dt>
          <dd className={business.waConnected ? 'text-green-600 font-medium' : 'text-red-500'}>
            {business.waConnected ? 'Connected' : 'Not connected'}
          </dd>
        </dl>
        <div className="pt-2">
          <Link
            href="/settings/whatsapp"
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            {business.waConnected ? 'Manage WhatsApp Settings →' : 'Set up WhatsApp →'}
          </Link>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Current Plan</h2>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
            {business.planTier}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Customers</p>
            <p className="font-medium">
              {customerCount} / {limits.customers === Infinity ? '∞' : limits.customers}
            </p>
            {limits.customers !== Infinity && (
              <div className="mt-1 h-1.5 rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full bg-brand-500"
                  style={{ width: `${Math.min((customerCount / limits.customers) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
          <div>
            <p className="text-gray-500">Active Invoices</p>
            <p className="font-medium">
              {invoiceCount} / {limits.invoices === Infinity ? '∞' : limits.invoices}
            </p>
          </div>
        </div>

        {business.planTier === 'FREE' && (
          <Link
            href="/pricing"
            className="block w-full rounded-lg bg-brand-500 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-600"
          >
            Upgrade Plan
          </Link>
        )}
      </div>
    </div>
  )
}
