'use client'

import React, { useState } from 'react'
import { Puzzle, CheckCircle2, MessageSquare, Landmark, FileSpreadsheet, CreditCard } from 'lucide-react'

interface IntegrationsClientProps {
  initialWabaId: string | null
  initialWaPhoneId: string | null
  initialWaConnected: boolean
  onSaveWhatsApp: (wabaId: string, waPhoneId: string, connected: boolean) => Promise<{ success: boolean }>
}

type Category = 'all' | 'messaging' | 'accounting' | 'payments' | 'data'

interface Integration {
  id: string
  name: string
  category: Category
  description: string
  connected: boolean
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  bgColor: string
}

export default function IntegrationsClient({
  initialWabaId,
  initialWaPhoneId,
  initialWaConnected,
  onSaveWhatsApp
}: IntegrationsClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  // Mock states for other integrations (WhatsApp is active by default and permanent)
  const [zohoConnected, setZohoConnected] = useState(false)
  const [tallyConnected, setTallyConnected] = useState(false)
  const [stripeConnected, setStripeConnected] = useState(false)
  const [razorpayConnected, setRazorpayConnected] = useState(false)
  const [excelConnected, setExcelConnected] = useState(false)

  // Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Generic mock connection toggle
  const toggleMockConnection = (id: string, currentStatus: boolean, setter: React.Dispatch<React.SetStateAction<boolean>>, name: string) => {
    if (currentStatus) {
      if (confirm(`Disconnect ${name}?`)) {
        setter(false)
        triggerToast(`Disconnected from ${name}.`)
      }
    } else {
      setter(true)
      triggerToast(`Connected to ${name} successfully!`)
    }
  }

  const integrationsList: Integration[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Automated Reminders',
      category: 'messaging',
      description: 'Automatically send payment links, reminder alerts, and invoice PDFs to your customers via WhatsApp.',
      connected: true, // Permanent
      icon: MessageSquare,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 'zoho',
      name: 'Zoho Books Sync',
      category: 'accounting',
      description: 'Import your invoices, customer details, and past payments automatically from Zoho Books.',
      connected: zohoConnected,
      icon: Puzzle,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'tally',
      name: 'Tally Prime Sync',
      category: 'accounting',
      description: 'Hourly database sync of ledger files, pending sales, and customer profiles from Tally.',
      connected: tallyConnected,
      icon: Landmark,
      iconColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      id: 'razorpay',
      name: 'Razorpay Payments',
      category: 'payments',
      description: 'Include automatic Razorpay payment links in reminders to let customers pay instantly.',
      connected: razorpayConnected,
      icon: CreditCard,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      category: 'payments',
      description: 'Accept credit card payments from international clients and domestic customers seamlessly.',
      connected: stripeConnected,
      icon: CreditCard,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'excel',
      name: 'Excel / CSV Import',
      category: 'data',
      description: 'Bulk upload customer statements, invoice list, and past due files using offline sheets.',
      connected: excelConnected,
      icon: FileSpreadsheet,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ]

  const filteredIntegrations = activeCategory === 'all'
    ? integrationsList
    : integrationsList.filter(item => item.category === activeCategory)

  return (
    <div className="space-y-6 w-full select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-full border border-gray-800 shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Category Toggles */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Connections' },
          { key: 'messaging', label: 'Messaging & Alerts' },
          { key: 'accounting', label: 'Accounting Software' },
          { key: 'payments', label: 'Payment Gateways' },
          { key: 'data', label: 'Excel & Sheet Imports' },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key as Category)}
            className={`px-4.5 py-2 text-xs font-bold rounded-full border transition-all duration-200 cursor-pointer ${
              activeCategory === cat.key
                ? 'bg-gray-900 border-transparent text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIntegrations.map((item) => {
          const IconComponent = item.icon
          return (
            <div 
              key={item.id} 
              className={`flex flex-col justify-between bg-white border rounded-[24px] p-6 text-left transition-all duration-300 ${
                item.connected 
                  ? 'border-emerald-500/30 shadow-[0_8px_30px_rgba(16,185,129,0.03)]' 
                  : 'border-[#EBEAE6]/60 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:border-gray-200/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4.5">
                  {/* Icon Frame */}
                  <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center ${item.iconColor} shrink-0 shadow-sm`}>
                    <IconComponent className="w-5.5 h-5.5" />
                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase border px-3 py-1 rounded-full tracking-wider ${
                    item.connected
                      ? 'text-[#10B981] bg-[#E5F7ED] border-[#10B981]/15'
                      : 'text-gray-400 bg-gray-50 border-gray-200/80'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.connected ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    {item.connected ? 'Active' : 'Not Connected'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 font-outfit leading-tight">{item.name}</h3>
                <p className="mt-2 text-[13px] text-gray-400 font-medium leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Actions Footer */}
              <div>
                {item.id === 'whatsapp' ? (
                  <div className="pt-3 border-t border-gray-50 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Included & active in your plan</span>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-gray-50 flex justify-start">
                    <button
                      onClick={() => {
                        if (item.id === 'zoho') toggleMockConnection('zoho', zohoConnected, setZohoConnected, item.name)
                        if (item.id === 'tally') toggleMockConnection('tally', tallyConnected, setTallyConnected, item.name)
                        if (item.id === 'stripe') toggleMockConnection('stripe', stripeConnected, setStripeConnected, item.name)
                        if (item.id === 'razorpay') toggleMockConnection('razorpay', razorpayConnected, setRazorpayConnected, item.name)
                        if (item.id === 'excel') toggleMockConnection('excel', excelConnected, setExcelConnected, item.name)
                      }}
                      className={`text-xs font-bold px-5 py-2.5 rounded-full border transition-all duration-200 active:scale-95 cursor-pointer ${
                        item.connected
                          ? 'border-gray-200 text-rose-600 bg-white hover:bg-rose-50/40'
                          : 'bg-gray-900 border-transparent text-white shadow-sm hover:bg-gray-800'
                      }`}
                    >
                      {item.connected ? 'Disconnect' : 'Connect Tool'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
