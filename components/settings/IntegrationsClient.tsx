'use client'

import React, { useState } from 'react'
import { Puzzle, CheckCircle2, XCircle, ArrowRight, MessageSquare, Landmark, FileSpreadsheet, CreditCard, ChevronDown, ChevronUp, Save, HelpCircle, Loader2 } from 'lucide-react'

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
  hasConfig: boolean
}

export default function IntegrationsClient({
  initialWabaId,
  initialWaPhoneId,
  initialWaConnected,
  onSaveWhatsApp
}: IntegrationsClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  
  // WhatsApp DB-backed states
  const [waConnected, setWaConnected] = useState(initialWaConnected)
  const [wabaId, setWabaId] = useState(initialWabaId || '')
  const [waPhoneId, setWaPhoneId] = useState(initialWaPhoneId || '')
  const [showWaConfig, setShowWaConfig] = useState(false)
  const [waLoading, setWaLoading] = useState(false)

  // Mock states for other integrations
  const [zohoConnected, setZohoConnected] = useState(false)
  const [tallyConnected, setTallyConnected] = useState(false)
  const [stripeConnected, setStripeConnected] = useState(false)
  const [razorpayConnected, setRazorpayConnected] = useState(true) // Razorpay pre-connected for demo
  const [excelConnected, setExcelConnected] = useState(false)

  // Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Handle WhatsApp Connection submit
  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wabaId.trim() || !waPhoneId.trim()) {
      alert('Please fill out both WABA ID and Phone Number ID')
      return
    }

    setWaLoading(true)
    try {
      const result = await onSaveWhatsApp(wabaId, waPhoneId, true)
      if (result.success) {
        setWaConnected(true)
        setShowWaConfig(false)
        triggerToast('WhatsApp Business API connected successfully!')
      } else {
        alert('Failed to save WhatsApp settings.')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred while saving.')
    } finally {
      setWaLoading(false)
    }
  }

  const handleWhatsAppDisconnect = async () => {
    if (confirm('Are you sure you want to disconnect WhatsApp Business API? Reminders will revert to Email/SMS.')) {
      setWaLoading(true)
      try {
        const result = await onSaveWhatsApp('', '', false)
        if (result.success) {
          setWaConnected(false)
          setWabaId('')
          setWaPhoneId('')
          triggerToast('WhatsApp Business API disconnected.')
        }
      } catch (err) {
        console.error(err)
      } finally {
        setWaLoading(false)
      }
    }
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
      name: 'WhatsApp Business API',
      category: 'messaging',
      description: 'Official Meta API to send automated WhatsApp reminders and PDF invoices directly to debtors.',
      connected: waConnected,
      icon: MessageSquare,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      hasConfig: true
    },
    {
      id: 'zoho',
      name: 'Zoho Books',
      category: 'accounting',
      description: 'Auto-sync unpaid sales invoices, customer ledgers, and payments directly into UdhaarClear.',
      connected: zohoConnected,
      icon: Puzzle,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hasConfig: false
    },
    {
      id: 'tally',
      name: 'Tally Prime',
      category: 'accounting',
      description: 'Desktop companion app syncs your Tally XML database into UdhaarClear dashboard hourly.',
      connected: tallyConnected,
      icon: Landmark,
      iconColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      hasConfig: false
    },
    {
      id: 'razorpay',
      name: 'Razorpay UPI & Cards',
      category: 'payments',
      description: 'Attach customized Razorpay payment links to all reminder notifications for instant collection.',
      connected: razorpayConnected,
      icon: CreditCard,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      hasConfig: false
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      category: 'payments',
      description: 'Collect outstanding payments globally from foreign debtors using credit/debit cards.',
      connected: stripeConnected,
      icon: CreditCard,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hasConfig: false
    },
    {
      id: 'excel',
      name: 'Excel / CSV Import',
      category: 'data',
      description: 'Map and upload offline sheets of debtors and historical dues in bulk format.',
      connected: excelConnected,
      icon: FileSpreadsheet,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      hasConfig: false
    }
  ]

  const filteredIntegrations = activeCategory === 'all'
    ? integrationsList
    : integrationsList.filter(item => item.category === activeCategory)

  return (
    <div className="space-y-4 w-full">
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
          { key: 'all', label: 'All Integrations' },
          { key: 'messaging', label: 'Messaging & Alerts' },
          { key: 'accounting', label: 'Accounting Platforms' },
          { key: 'payments', label: 'Payment Gateways' },
          { key: 'data', label: 'Data & Sheets' },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key as Category)}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
              activeCategory === cat.key
                ? 'bg-gray-900 border-transparent text-white'
                : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIntegrations.map((item) => {
          const IconComponent = item.icon
          return (
            <div key={item.id} className="flex flex-col justify-between bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 text-left transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Icon Frame */}
                  <div className={`w-11 h-11 rounded-xl ${item.bgColor} flex items-center justify-center ${item.iconColor} shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase border px-2.5 py-0.5 rounded-full ${
                    item.connected
                      ? 'text-[#10B981] bg-[#E5F7ED] border-[#10B981]/15'
                      : 'text-gray-400 bg-gray-50 border-gray-200'
                  }`}>
                    {item.connected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 font-outfit">{item.name}</h3>
                <p className="mt-1.5 text-xs text-gray-400 font-medium leading-normal mb-6">
                  {item.description}
                </p>
              </div>

              {/* Actions Footer */}
              <div>
                {item.id === 'whatsapp' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                      {waConnected ? (
                        <>
                          <button
                            onClick={() => setShowWaConfig(!showWaConfig)}
                            className="text-xs font-semibold px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-1"
                          >
                            Configure {showWaConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={handleWhatsAppDisconnect}
                            disabled={waLoading}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-2"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setShowWaConfig(!showWaConfig)}
                          className="bg-[#FF6B00] hover:bg-[#E05B2E] text-white text-xs font-semibold px-5 py-2 rounded-full shadow-sm flex items-center gap-1 active:scale-95 transition-all border-0 cursor-pointer"
                        >
                          Connect WhatsApp
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* WhatsApp Configuration Form */}
                    {showWaConfig && (
                      <form onSubmit={handleWhatsAppSubmit} className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-150 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold uppercase tracking-wider">
                          <HelpCircle className="w-3.5 h-3.5" /> Meta API Setup Details
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-outfit">
                            WhatsApp Business Account ID (WABA ID)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 109283746561928"
                            value={wabaId}
                            onChange={(e) => setWabaId(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-outfit">
                            Phone Number ID
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 102938475612345"
                            value={waPhoneId}
                            onChange={(e) => setWaPhoneId(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowWaConfig(false)}
                            className="text-xs font-semibold text-gray-500 px-3 py-1.5 rounded-full hover:bg-gray-200/50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={waLoading}
                            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-sm border-0 cursor-pointer"
                          >
                            {waLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                            Save API Details
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="pt-2 border-t border-gray-50 flex justify-start">
                    <button
                      onClick={() => {
                        if (item.id === 'zoho') toggleMockConnection('zoho', zohoConnected, setZohoConnected, item.name)
                        if (item.id === 'tally') toggleMockConnection('tally', tallyConnected, setTallyConnected, item.name)
                        if (item.id === 'stripe') toggleMockConnection('stripe', stripeConnected, setStripeConnected, item.name)
                        if (item.id === 'razorpay') toggleMockConnection('razorpay', razorpayConnected, setRazorpayConnected, item.name)
                        if (item.id === 'excel') toggleMockConnection('excel', excelConnected, setExcelConnected, item.name)
                      }}
                      className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all active:scale-95 cursor-pointer ${
                        item.connected
                          ? 'border-gray-200 text-rose-600 hover:bg-rose-50/50'
                          : 'bg-gray-900 border-transparent text-white shadow-sm hover:shadow'
                      }`}
                    >
                      {item.connected ? 'Disconnect' : 'Connect API'}
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
