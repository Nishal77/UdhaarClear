import Link from 'next/link'

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: ['10 customers', '30 invoices', 'WhatsApp reminders', 'UPI payment links', 'Basic dashboard'],
    cta: 'Start Free',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '₹799',
    period: '/month',
    features: ['25 customers', '100 active invoices', 'All Free features', 'Legal notice generator', 'Email receipts'],
    cta: 'Get Started',
    href: '/signup?plan=starter',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '₹1,999',
    period: '/month',
    features: ['100 customers', 'Unlimited invoices', 'All Starter features', 'Collection analytics', 'Priority support'],
    cta: 'Most Popular',
    href: '/signup?plan=growth',
    highlighted: true,
  },
  {
    name: 'CA Pro',
    price: '₹4,999',
    period: '/month',
    features: ['20 business clients', 'Unlimited everything', 'White-label reports', 'Client portal', 'Bulk reports'],
    cta: 'For CAs',
    href: '/signup?plan=ca_pro',
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white font-bold text-sm">UC</div>
          <span className="text-lg font-bold text-gray-900">UdhaarClear</span>
        </Link>
        <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign In</Link>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-gray-600 mb-4">Save 2 months with annual billing</p>
        <p className="text-sm text-gray-500 mb-12">All prices in INR. GST extra.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 text-left flex flex-col ${
                plan.highlighted
                  ? 'bg-brand-500 text-white shadow-xl ring-4 ring-brand-200'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <p className={`text-sm font-semibold ${plan.highlighted ? 'text-brand-100' : 'text-gray-500'}`}>
                {plan.name}
              </p>
              <div className="mt-3">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span className={`text-sm ${plan.highlighted ? 'text-brand-100' : 'text-gray-400'}`}>{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className={plan.highlighted ? 'text-brand-100' : 'text-brand-500'}>✓</span>
                    <span className={plan.highlighted ? 'text-white' : 'text-gray-700'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 block rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-white text-brand-600 hover:bg-brand-50'
                    : 'bg-brand-500 text-white hover:bg-brand-600'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-gray-500">
          Annual plans save 2 months (pay 10, get 12). All plans include SSL, 99.9% uptime SLA, and WhatsApp Business API.
        </p>
      </div>
    </div>
  )
}
