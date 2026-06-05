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

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "w-8 h-8"}>
    <g clipPath="url(#clip0_4083_2339)">
      <path d="M7.08822 20.6472L7.47602 20.8411C9.09208 21.8107 10.9019 22.2632 12.7118 22.2632C18.4 22.2632 23.054 17.6092 23.054 11.921C23.054 9.20622 21.9551 6.55603 20.016 4.61685C18.0768 2.67767 15.4912 1.57886 12.7118 1.57886C7.02363 1.57886 2.36958 6.23282 2.43426 11.9857C2.43426 13.9248 3.01601 15.7994 3.98555 17.4152L4.24408 17.8031L3.20995 21.6168L7.08822 20.6472Z" fill="#00E676"/>
      <path d="M21.1149 3.58263C18.9171 1.32033 15.8791 0.0921631 12.7765 0.0921631C6.18343 0.0921631 0.883039 5.45714 0.947626 11.9856C0.947626 14.054 1.52937 16.0579 2.49901 17.8677L0.818359 24.0084L7.08829 22.3924C8.83353 23.3621 10.7726 23.8145 12.7119 23.8145C19.2404 23.8145 24.5407 18.4495 24.5407 11.9211C24.5407 8.75375 23.3125 5.78035 21.1149 3.58263ZM12.7765 21.8108C11.0312 21.8108 9.28601 21.3584 7.7993 20.4534L7.4115 20.2595L3.6625 21.229L4.63204 17.5447L4.37351 17.1568C1.52937 12.5675 2.88681 6.49136 7.54077 3.64722C12.1947 0.803175 18.2061 2.16061 21.0503 6.81457C23.8943 11.4685 22.5369 17.4799 17.883 20.3241C16.3962 21.2936 14.5864 21.8107 12.7765 21.8107V21.8108ZM18.4647 14.636L17.7537 14.3128C17.7537 14.3128 16.7195 13.8603 16.0731 13.5371C16.0084 13.5371 15.9438 13.4724 15.8791 13.4724C15.6852 13.4724 15.5559 13.5371 15.4267 13.6018C15.4267 13.6018 15.3621 13.6663 14.4571 14.7006C14.3924 14.8298 14.2632 14.8945 14.1339 14.8945H14.0692C14.0046 14.8945 13.8754 14.8298 13.8107 14.7652L13.4875 14.636C12.7765 14.3128 12.1301 13.9249 11.613 13.4078C11.4837 13.2785 11.2898 13.1493 11.1605 13.02C10.708 12.5675 10.2555 12.0504 9.93243 11.4686L9.86775 11.3394C9.80316 11.2747 9.80316 11.2101 9.73848 11.0808C9.73848 10.9516 9.73848 10.8223 9.80316 10.7576C9.80316 10.7576 10.0617 10.4344 10.2555 10.2405C10.3849 10.1112 10.4495 9.91734 10.5788 9.78807C10.708 9.59412 10.7727 9.33559 10.708 9.14165C10.6434 8.81843 9.86775 7.0732 9.6739 6.6854C9.54454 6.49145 9.41536 6.42687 9.22142 6.36219H8.51041C8.38105 6.36219 8.25187 6.42687 8.12251 6.42687L8.05783 6.49145C7.92857 6.55613 7.7993 6.6854 7.67004 6.74999C7.54077 6.87934 7.47609 7.00852 7.34682 7.13788C6.89434 7.71962 6.63581 8.43063 6.63581 9.14165C6.63581 9.65871 6.76508 10.1759 6.95902 10.6283L7.0237 10.8223C7.60545 12.0504 8.38105 13.1493 9.41536 14.1188L9.6739 14.3774C9.86775 14.5713 10.0617 14.7006 10.191 14.8944C11.5484 16.058 13.0997 16.8983 14.8449 17.3508C15.0389 17.4153 15.2974 17.4153 15.4913 17.48H16.1377C16.4609 17.48 16.8487 17.3508 17.1073 17.2215C17.3012 17.0922 17.4304 17.0922 17.5597 16.963L17.6891 16.8336C17.8183 16.7043 17.9476 16.6397 18.0769 16.5105C18.2061 16.3812 18.3354 16.2519 18.4001 16.1226C18.5293 15.8641 18.5939 15.5408 18.6586 15.2177V14.7652C18.6586 14.7652 18.5939 14.7006 18.4647 14.636Z" fill="white"/>
    </g>
    <defs>
      <clipPath id="clip0_4083_2339">
        <rect width="23.722" height="24" fill="white" transform="translate(0.818359 0.0921631)"/>
      </clipPath>
    </defs>
  </svg>
)

const GmailIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "w-10 h-10"}>
    <g clipPath="url(#clip0_4083_2397)">
      <path d="M2.09569 24.0921H6.99003V12.2058L-0.00195312 6.96179V21.9946C-0.00195312 23.1535 0.936728 24.0922 2.09569 24.0922V24.0921Z" fill="#4285F4"/>
      <path d="M23.7754 24.0923H28.6698C29.8287 24.0923 30.7674 23.1537 30.7674 21.9948V6.96204L23.7754 12.206V24.0923Z" fill="#34A853"/>
      <path d="M23.7754 3.11628V12.2058L30.7674 6.96186V4.1651C30.7674 1.57282 27.8081 0.0922772 25.7331 1.64799L23.7754 3.11628Z" fill="#FBBC04"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.99219 12.206V3.11639L15.3825 9.4092L23.7728 3.11639V12.206L15.3825 18.4987L6.99219 12.206Z" fill="#EA4335"/>
      <path d="M-0.00195312 4.16504V6.9618L6.99003 12.2058V3.11622L5.03227 1.64793C2.95734 0.0922189 -0.00195312 1.57277 -0.00195312 4.16492V4.16504Z" fill="#C5221F"/>
    </g>
    <defs>
      <clipPath id="clip0_4083_2397">
        <rect width="30.7646" height="24" fill="white" transform="translate(-0.00390625 0.0921631)"/>
      </clipPath>
    </defs>
  </svg>
)

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
      icon: WhatsAppIcon,
      iconColor: '',
      bgColor: 'bg-transparent'
    },
    {
      id: 'email',
      name: 'Standard Email Alerts',
      category: 'messaging',
      description: 'Send automated, professional payment notices and invoice PDFs directly to your customers inboxes',
      connected: true, // Active by default
      icon: GmailIcon,
      iconColor: '',
      bgColor: 'bg-transparent'
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
                  <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center ${item.iconColor} shrink-0 ${item.bgColor.includes('bg-transparent') ? '' : 'shadow-sm'} overflow-hidden`}>
                    {typeof item.icon === 'string' ? (
                      <img src={item.icon} alt={item.name} className="w-12 h-12 object-contain" />
                    ) : (
                      React.createElement(item.icon, { 
                        className: item.id === 'whatsapp' 
                          ? 'w-8 h-8 object-contain' 
                          : item.id === 'email' 
                            ? 'w-9.5 h-7.5 object-contain' 
                            : 'w-5.5 h-5.5' 
                      })
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
