'use client'

import React, { useState } from 'react'
import { Puzzle, CheckCircle2, MessageSquare, Landmark, FileSpreadsheet, CreditCard, Mail } from 'lucide-react'

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
  icon: React.ComponentType<{ className?: string }> | string
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
      id: 'email',
      name: 'Standard Email Alerts',
      category: 'messaging',
      description: 'Send automated, professional payment notices and invoice PDFs directly to your customers inboxes',
      connected: true, // Active by default
      icon: Mail,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'zoho',
      name: 'Zoho Books',
      category: 'accounting',
      description: 'Import your invoices, customer details, and past payments automatically from Zoho Books.',
      connected: zohoConnected,
      icon: 'https://img.icons8.com/fluency/48/zoho-books.png',
      iconColor: '',
      bgColor: 'bg-transparent'
    },
    {
      id: 'tally',
      name: 'Tally Prime',
      category: 'accounting',
      description: 'Hourly database sync of ledger files, pending sales, and customer profiles from Tally.',
      connected: tallyConnected,
      icon: Landmark,
      iconColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      id: 'razorpay',
      name: 'UPI & Online Payments',
      category: 'payments',
      description: 'Allow customers to pay you immediately through UPI and online options right from their message alerts.',
      connected: razorpayConnected,
      icon: CreditCard,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
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
            className={`px-4.5 py-2 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer ${
              activeCategory === cat.key
                ? 'bg-gray-900 border-transparent text-white'
                : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredIntegrations.map((item) => {
          return (
            <div 
              key={item.id} 
              className={`flex flex-col justify-between bg-white border rounded-[24px] p-6 text-left transition-all ${
                item.connected 
                  ? 'border-gray-200' 
                  : 'border-[#EBEAE6]/60 hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4.5">
                  {/* Icon Frame */}
                  <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center ${item.iconColor} shrink-0 ${typeof item.icon === 'string' ? '' : 'shadow-sm'} overflow-hidden`}>
                    {typeof item.icon === 'string' ? (
                      <img src={item.icon} alt={item.name} className="w-12 h-12 object-contain" />
                    ) : (
                      React.createElement(item.icon, { className: 'w-5.5 h-5.5' })
                    )}
                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-medium border px-3 py-1 rounded-full tracking-tight ${
                    item.connected
                      ? 'text-[#10B981] bg-[#E5F7ED] border-[#10B981]/15'
                      : 'text-gray-400 bg-gray-50 border-gray-200/80'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.connected ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    {item.connected ? 'Active' : 'Not Connected'}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-gray-900 font-outfit leading-tight">{item.name}</h3>
                <p className="mt-2 text-[13px] text-gray-500 font-normal leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Actions Footer */}
              <div>
                {item.id === 'whatsapp' || item.id === 'email' ? (
                  <div className="pt-4 border-t border-gray-100/80 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Included & active by default</span>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-100/80 flex justify-start">
                    <button
                      onClick={() => {
                        if (item.id === 'zoho') toggleMockConnection('zoho', zohoConnected, setZohoConnected, item.name)
                        if (item.id === 'tally') toggleMockConnection('tally', tallyConnected, setTallyConnected, item.name)
                        if (item.id === 'stripe') toggleMockConnection('stripe', stripeConnected, setStripeConnected, item.name)
                        if (item.id === 'razorpay') toggleMockConnection('razorpay', razorpayConnected, setRazorpayConnected, item.name)
                        if (item.id === 'excel') toggleMockConnection('excel', excelConnected, setExcelConnected, item.name)
                      }}
                      className={`text-xs font-semibold px-5 py-2.5 rounded-full border transition-all duration-200 active:scale-95 cursor-pointer ${
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
