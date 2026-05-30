import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { PageHeader } from '@/components/layout/PageHeader'

export default async function WhatsAppSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: true },
  })
  if (!dbUser?.ownedBusiness) redirect('/dashboard')

  const business = dbUser.ownedBusiness
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/whatsapp`

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="WhatsApp Setup"
        description="Connect your WhatsApp Business account to send automated reminders"
      />

      <div className="rounded-xl bg-white border border-gray-200 p-6 space-y-6">
        {/* Status */}
        <div className="flex items-center gap-3 rounded-lg border p-4 ${business.waConnected ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}">
          <div className={`h-3 w-3 rounded-full ${business.waConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <p className="text-sm font-medium">
            {business.waConnected ? 'WhatsApp connected and ready' : 'WhatsApp not connected yet'}
          </p>
        </div>

        {/* Setup steps */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Setup Steps</h3>

          {[
            {
              step: 1,
              title: 'Create WhatsApp Business Account',
              description: 'Go to Meta Business Suite and create a WhatsApp Business Account (WABA). You\'ll need a Facebook Business account.',
            },
            {
              step: 2,
              title: 'Add WhatsApp Phone Number',
              description: 'In Meta Developer Console, add a phone number and get your Phone Number ID and WABA ID.',
            },
            {
              step: 3,
              title: 'Register Webhook URL',
              description: `Register this URL in Meta Developer Console as your webhook endpoint:`,
              extra: webhookUrl,
            },
            {
              step: 4,
              title: 'Submit Message Templates',
              description: 'Submit the payment_reminder_gentle, payment_reminder_firm, payment_reminder_legal, and payment_confirmed templates for Meta approval (24-48 hours).',
            },
            {
              step: 5,
              title: 'Save Your Credentials',
              description: 'Add your WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_BUSINESS_ACCOUNT_ID to your environment variables.',
            },
          ].map(({ step, title, description, extra }) => (
            <div key={step} className="flex gap-4">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 text-xs font-bold">
                {step}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{description}</p>
                {extra && (
                  <code className="mt-1 block rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-700">
                    {extra}
                  </code>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-xs text-blue-800">
            <strong>For development/testing:</strong> Use Meta&apos;s test phone number from the Meta Developer Console.
            Test messages don&apos;t need template approval but recipients must be added as test numbers.
          </p>
        </div>
      </div>
    </div>
  )
}
