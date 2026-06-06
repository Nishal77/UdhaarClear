'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  WhatsappIcon,
  Invoice03Icon,
  BotIcon,
  WavingHand01Icon,
  BriefcaseBusinessIcon,
  Wallet01Icon,
  CheckmarkCircle01Icon,
  LockIcon,
  Building02Icon,
  TruckIcon,
  FactoryIcon,
  InvoiceIcon,
  Briefcase01Icon,
  Layers01Icon,
  CreditCardIcon,
  BankIcon,
  Tick01Icon,
  ArrowRight02Icon,
  ArrowLeft02Icon,
  UserAdd01Icon
} from '@hugeicons/core-free-icons'

// ─── Types ────────────────────────────────────────────────────────────────────

type BizType = 'Retailer' | 'Distributor' | 'Manufacturer' | 'CA / Firm' | 'Services' | 'Other'

interface FormState {
  // Step 1 — personal
  name: string
  phone: string
  email: string
  // Step 2 — business
  businessName: string
  city: string
  bizPhone: string
  gstin: string
  bizType: BizType
  // Step 3 — payment
  upiId: string
  bankAccountNo: string
  bankIfsc: string
  bankAccountName: string
}

// ─── Step 1 — Personal Info ────────────────────────────────────────────────────

function StepPersonal({ form, onChange }: { form: FormState; onChange: (k: keyof FormState, v: string) => void }) {
  return (
    <div className="space-y-6">
      {/* Feature grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: <HugeiconsIcon icon={WhatsappIcon} size={18} className="text-emerald-600 animate-pulse-soft" />,
            title: 'WhatsApp reminders',
            sub: 'We send from our number'
          },
          {
            icon: <HugeiconsIcon icon={Invoice03Icon} size={18} className="text-[#FF6A39]" />,
            title: 'Payment links',
            sub: 'Money goes to your UPI'
          },
          {
            icon: <HugeiconsIcon icon={BotIcon} size={18} className="text-indigo-500" />,
            title: 'Auto escalation',
            sub: 'Gentle to firm to legal'
          },
        ].map((item) => (
          <div key={item.title} className="flex flex-col items-start gap-2.5 rounded-xl border border-[#EBEAE6] bg-[#FAFAF8] px-3.5 py-4">
            <span className="p-1.5 rounded-lg bg-gray-100/80 flex items-center justify-center">{item.icon}</span>
            <div>
              <p className="text-[12.5px] font-bold text-gray-900 leading-tight">{item.title}</p>
              <p className="text-[11px] text-gray-500 mt-1 leading-snug">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-gray-600 flex items-center">
            Your full name <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Nishal Poojary"
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-gray-600 flex items-center">
            Mobile number <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="e.g. +91 98765 43210"
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-bold text-gray-600">Email address</label>
        <input
          type="email"
          value={form.email}
          readOnly
          className="h-11 rounded-xl border border-[#EBEAE6] bg-[#FAFAF8] px-4 text-[14px] text-gray-400 cursor-not-allowed"
        />
        <p className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
          <HugeiconsIcon icon={LockIcon} size={14} className="text-gray-400 flex-shrink-0" />
          Pre-filled from your login. Your data is encrypted and never shared.
        </p>
      </div>
    </div>
  )
}

// ─── Step 2 — Business Details ─────────────────────────────────────────────────

const BIZ_TYPES: { label: BizType; icon: any }[] = [
  { label: 'Retailer', icon: Building02Icon },
  { label: 'Distributor', icon: TruckIcon },
  { label: 'Manufacturer', icon: FactoryIcon },
  { label: 'CA / Firm', icon: InvoiceIcon },
  { label: 'Services', icon: Briefcase01Icon },
  { label: 'Other', icon: Layers01Icon },
]

function StepBusiness({ form, onChange }: { form: FormState; onChange: (k: keyof FormState, v: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-gray-600 flex items-center">
            Business name <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={form.businessName}
            onChange={(e) => onChange('businessName', e.target.value)}
            placeholder="e.g. Poojary Traders"
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-gray-600 flex items-center">
            City <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="e.g. Mumbai"
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-gray-600 flex items-center">
            Business phone <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="tel"
            value={form.bizPhone}
            onChange={(e) => onChange('bizPhone', e.target.value)}
            placeholder="e.g. +91 80000 00000"
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-bold text-gray-600">GSTIN</label>
            <span className="text-[10px] font-medium text-gray-400 border border-[#EBEAE6] bg-[#FAFAF8] rounded-md px-1.5 py-0.5">optional</span>
          </div>
          <input
            type="text"
            value={form.gstin}
            onChange={(e) => onChange('gstin', e.target.value.toUpperCase())}
            placeholder="e.g. 27AAAAA0000A1Z5"
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="text-[12px] font-bold text-gray-600">What kind of business do you run?</label>
        <div className="grid grid-cols-3 gap-2">
          {BIZ_TYPES.map(({ label, icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => onChange('bizType', label)}
              className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3.5 text-left transition-all cursor-pointer ${
                form.bizType === label
                  ? 'border-[#FF6A39] bg-[#FFF7F4] text-[#c2410c]'
                  : 'border-[#EBEAE6] bg-[#FAFAF8] text-gray-600 hover:border-gray-300 hover:bg-white'
              }`}
            >
              <HugeiconsIcon icon={icon} size={18} className={form.bizType === label ? 'text-[#FF6A39]' : 'text-gray-400'} />
              <span className="text-[12.5px] font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step 3 — Payment Setup ────────────────────────────────────────────────────

function StepPayment({ form, onChange }: { form: FormState; onChange: (k: keyof FormState, v: string) => void }) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.upi-container')) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [])

  const handleUpiChange = (val: string) => {
    onChange('upiId', val)
    
    const atIndex = val.indexOf('@')
    if (atIndex !== -1) {
      const afterAt = val.substring(atIndex + 1)
      const handles = ['ybl', 'ibl', 'axl', 'okaxis', 'okicici', 'okhdfcbank', 'oksbi', 'paytm', 'upi']
      
      const filtered = handles.filter(h => h.startsWith(afterAt.toLowerCase()))
      if (filtered.length > 0) {
        setSuggestions(filtered)
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (handle: string) => {
    const val = form.upiId
    const atIndex = val.indexOf('@')
    if (atIndex !== -1) {
      const beforeAt = val.substring(0, atIndex)
      onChange('upiId', beforeAt + '@' + handle)
    }
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-4">
      {/* UPI Section */}
      <div className="rounded-2xl border border-[#EBEAE6] p-5 bg-[#FAFAF8]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
              <HugeiconsIcon icon={CreditCardIcon} size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-gray-900">UPI — for quick payments</p>
              <p className="text-[11.5px] text-gray-500">Works with GPay, PhonePe, Paytm, any UPI app</p>
            </div>
          </div>
          <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
            Up to ₹1 lakh
          </span>
        </div>
        <div className="flex flex-col gap-1.5 relative upi-container">
          <label className="text-[12px] font-semibold text-gray-800">Your UPI ID</label>
          <input
            type="text"
            value={form.upiId}
            onChange={(e) => handleUpiChange(e.target.value)}
            onFocus={() => {
              if (form.upiId.includes('@')) {
                handleUpiChange(form.upiId)
              }
            }}
            placeholder="e.g. yournumber@ybl or business@okicici"
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-[68px] left-0 right-0 z-50 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
              <p className="text-[10px] font-bold text-gray-400 px-2.5 py-1 tracking-wider uppercase">UPI Handle Suggestions</p>
              {suggestions.map((handle) => (
                <button
                  key={handle}
                  type="button"
                  onClick={() => selectSuggestion(handle)}
                  className="w-full text-left px-2.5 py-2 text-[13px] text-gray-700 hover:bg-[#FFF7F4] hover:text-[#FF6A39] rounded-lg transition-colors font-medium flex items-center justify-between cursor-pointer"
                >
                  <span>
                    {form.upiId.substring(0, form.upiId.indexOf('@'))}
                    <span className="text-[#FF6A39] font-semibold">@{handle}</span>
                  </span>
                  <span className="text-[10.5px] text-gray-400 bg-gray-50 border border-gray-100 rounded-md px-1.5 py-0.5">Quick insert</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-3.5">
          {[
            { name: 'GPay', logo: 'https://mhcfgxpfsdvcwwbkmyzh.supabase.co/storage/v1/object/sign/icons/googlepay.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjc3ODY3Ny1iMjBhLTQ4OGYtYmY2My1mZGE0NzE2NzE1NzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9nb29nbGVwYXkucG5nIiwiaWF0IjoxNzgwNzMzMjQxLCJleHAiOjMzNTc1MzMyNDF9.o672uwWbfPpObBpuwy1nudUwVh-_C6v5-WbwG3Z5Aw0' },
            { name: 'PhonePe', logo: 'https://mhcfgxpfsdvcwwbkmyzh.supabase.co/storage/v1/object/sign/icons/phonepe.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjc3ODY3Ny1iMjBhLTQ4OGYtYmY2My1mZGE0NzE2NzE1NzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9waG9uZXBlLnBuZyIsImlhdCI6MTc4MDczMzMxMCwiZXhwIjozMzU3NTMzMzEwfQ.Zw0RDoG6QkdymprBfRkC0n8HwQ_K9chkPX0U75u1Nss' },
            { name: 'Paytm', logo: 'https://mhcfgxpfsdvcwwbkmyzh.supabase.co/storage/v1/object/sign/icons/paytm.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjc3ODY3Ny1iMjBhLTQ4OGYtYmY2My1mZGE0NzE2NzE1NzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9wYXl0bS5wbmciLCJpYXQiOjE3ODA3MzMyNzIsImV4cCI6MTc4NTA1MzI3Mn0.q9oZo2Pazb7OKq3Hi6ILoUqhVE7sAvc80Td31_6c-Zg' },
            { name: 'BHIM', logo: 'https://mhcfgxpfsdvcwwbkmyzh.supabase.co/storage/v1/object/sign/icons/bhim.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjc3ODY3Ny1iMjBhLTQ4OGYtYmY2My1mZGE0NzE2NzE1NzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpY29ucy9iaGltLnBuZyIsImlhdCI6MTc4MDczMzI5MSwiZXhwIjoxNzg1MDUzMjkxfQ.KJbXRy8Fq9ehBJJ-LBevNxu3s95zBq54lq2OAhABOns' },
            { name: 'any UPI app', dot: 'bg-[#10B981]', border: 'border-emerald-100/80', bg: 'bg-[#ECFDF5]/60', text: 'text-emerald-700' },
          ].map((app) => (
            <span
              key={app.name}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11.5px] font-medium tracking-tight select-none transition-all border-gray-200`}
            >
              {app.logo ? (
                <img src={app.logo} alt={app.name} className="h-3.5 w-auto object-contain flex-shrink-0" />
              ) : (
                <span className={`w-1.5 h-1.5 rounded-full ${app.dot}`} />
              )}
              {app.name}
            </span>
          ))}
        </div>
      </div>

      {/* Bank Section */}
      <div className="rounded-2xl border border-[#EBEAE6] p-5 bg-[#FAFAF8]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <HugeiconsIcon icon={BankIcon} size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-gray-900">Bank transfer — for large invoices</p>
              <p className="text-[11.5px] text-gray-500">NEFT / RTGS — no upper limit</p>
            </div>
          </div>
          <span className="text-[10.5px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-full">
            Any amount
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-gray-600">Account number</label>
            <input
              type="text"
              value={form.bankAccountNo}
              onChange={(e) => onChange('bankAccountNo', e.target.value)}
              placeholder="e.g. 000000123456789"
              className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-gray-600">IFSC code</label>
            <input
              type="text"
              value={form.bankIfsc}
              onChange={(e) => onChange('bankIfsc', e.target.value.toUpperCase())}
              placeholder="e.g. HDFC0001234"
              className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all uppercase"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-gray-600">Account holder name</label>
          <input
            type="text"
            value={form.bankAccountName}
            onChange={(e) => onChange('bankAccountName', e.target.value)}
            placeholder="e.g. Poojary Traders Pvt Ltd"
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all"
          />
        </div>
      </div>

      {/* WhatsApp Preview */}
      <div className="rounded-2xl border border-[#EBEAE6] p-5 bg-[#FAFAF8]">
        <label className="text-[11px] font-semibold text-gray-900 tracking-wider uppercase block mb-3">
          WHAT YOUR CUSTOMER SEES IN WHATSAPP
        </label>
        
        {/* Chat box container */}
        <div className="rounded-2xl bg-[#efeae2] p-4 border border-[#EBEAE6]">
          <div className="max-w-[85%] bg-[#d9fdd3] border border-[#c4ebba] rounded-2xl rounded-tl-none p-3.5 text-gray-800">
            <p className="text-[13.5px] leading-relaxed">
              Hi Ramesh ji, invoice <span className="font-semibold text-[#FF6A39] font-mono">INV-2026-0012</span> for <span className="font-semibold text-emerald-700">₹45,000</span> from <span className="font-semibold text-[#FF6A39]">{form.businessName || 'Poojary Traders'}</span> is due. Please pay to avoid a late notice.
            </p>
            <div className="mt-3">
              <div className="w-full py-2.5 bg-[#FF6A39] text-white rounded-xl text-center text-[13px] font-semibold cursor-pointer">
                Pay ₹45,000 now
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-[12px] text-gray-600 mt-3 flex items-center gap-1.5">
          <span className="text-[#FF6A39]">➔</span> Customer taps ➔ opens GPay / PhonePe ➔ pays to your UPI instantly
        </p>
      </div>
    </div>
  )
}

// ─── Step 4 — Done ─────────────────────────────────────────────────────────────

function StepDone({ businessName, form }: { businessName: string; form: FormState }) {
  const hasUpi = form.upiId.trim().length > 3
  const hasBank = form.bankAccountNo.trim().length > 5 && form.bankIfsc.trim().length === 11

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="text-emerald-600" />, label: 'Business profile', sub: businessName || 'Your business', done: true },
          { icon: <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="text-emerald-600" />, label: 'UPI payments', sub: hasUpi ? 'Ready to receive money' : (hasBank ? 'Bank set up' : 'Not added — skip for now'), done: hasUpi || hasBank },
          { icon: <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="text-emerald-600" />, label: 'WhatsApp reminders', sub: 'Active from day 1', done: true },
          { icon: <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="text-emerald-600" />, label: 'Auto escalation', sub: 'Gentle → Firm → Legal', done: true },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3.5 rounded-xl border border-[#EBEAE6] px-4 py-3.5 bg-[#FAFAF8]">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-50 border border-emerald-100`}>
              <HugeiconsIcon icon={Tick01Icon} size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-900 leading-tight">{item.label}</p>
              <p className="text-[11.5px] text-gray-500 mt-1 leading-snug truncate max-w-[170px]" title={item.sub}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* First action nudge */}
      <div className="flex items-center gap-4 rounded-2xl border border-[#FF6A39]/30 bg-[#FFF7F4] px-5 py-4.5 group cursor-pointer hover:bg-[#FFEBE5] transition-all">
        <div className="w-11 h-11 rounded-xl bg-[#FF6A39]/10 border border-[#FF6A39]/20 flex items-center justify-center flex-shrink-0">
          <HugeiconsIcon icon={UserAdd01Icon} size={20} className="text-[#FF6A39]" />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-gray-900">Add your first customer</p>
          <p className="text-[12px] text-gray-500 mt-0.5">Just their name and phone number. Takes 30 seconds.</p>
        </div>
        <HugeiconsIcon icon={ArrowRight02Icon} size={20} className="text-[#FF6A39] flex-shrink-0 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  )
}

// ─── Step config ────────────────────────────────────────────────────────────────

const STEPS = [
  { icon: <HugeiconsIcon icon={WavingHand01Icon} size={24} className="text-[#FF6A39]" />, title: 'Welcome to UdhaarClear', desc: "Stop chasing payments manually. Add your business details and we start sending WhatsApp reminders to your customers automatically." },
  { icon: <HugeiconsIcon icon={BriefcaseBusinessIcon} size={24} className="text-[#FF6A39]" />, title: 'About your business', desc: 'This shows on every reminder message your customers receive.' },
  { icon: <HugeiconsIcon icon={Wallet01Icon} size={24} className="text-[#FF6A39]" />, title: 'Where should customers pay you?', desc: 'When customers click the payment link, money goes directly to your account — UdhaarClear never holds your funds.' },
  { icon: <HugeiconsIcon icon={CheckmarkCircle01Icon} size={24} className="text-emerald-600" />, title: "You're all set!", desc: "Your account is ready. Add your first customer and UdhaarClear starts chasing payments so you don't have to." },
]

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [checkingOnboard, setCheckingOnboard] = useState(true)

  const [form, setForm] = useState<FormState>({
    name: '', phone: '', email: '',
    businessName: '', city: '', bizPhone: '', gstin: '', bizType: 'Distributor',
    upiId: '', bankAccountNo: '', bankIfsc: '', bankAccountName: '',
  })

  // Pre-fill email and check database onboarding status
  useEffect(() => {
    async function checkStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.replace('/login')
          return
        }

        // Fetch onboarding status from our endpoint
        const res = await fetch('/api/onboarding')
        const json = await res.json()

        if (res.ok && json.data?.onboarded) {
          // Synchronize/Update Supabase Auth metadata and redirect to dashboard
          await supabase.auth.updateUser({
            data: { onboarded: true }
          })
          router.replace('/dashboard')
        } else {
          setForm((f) => ({
            ...f,
            email: user.email ?? '',
            name: user.user_metadata?.full_name ?? f.name,
            phone: user.user_metadata?.phone ?? f.phone,
          }))
          setCheckingOnboard(false)
        }
      } catch (err) {
        console.error('Failed to retrieve onboarding state:', err)
        setCheckingOnboard(false)
      }
    }

    checkStatus()
  }, [router, supabase])

  const update = useCallback((k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
  }, [])

  // ── Validation per step
  const canProceed = () => {
    if (step === 0) return form.name.trim().length > 1 && form.phone.trim().length > 8
    if (step === 1) return form.businessName.trim().length > 1 && form.city.trim().length > 1 && form.bizPhone.trim().length > 8
    if (step === 2) return form.upiId.trim().length > 3 || (form.bankAccountNo.trim().length > 5 && form.bankIfsc.trim().length === 11)
    return true
  }

  // ── Step 1+2: create user + business via /api/onboarding
  const handleCreateBusiness = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseId: user.id,
          name: form.name.trim(),
          email: form.email,
          businessName: form.businessName.trim(),
          phone: form.phone.trim(),
          bizPhone: form.bizPhone.trim(),
          city: form.city.trim(),
          gstin: form.gstin.trim(),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Failed to create business')
      
      setStep(2)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 3: save payment details
  const handleSavePayment = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/businesses/payment-details', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          upiId: form.upiId.trim() || undefined,
          bankAccountNo: form.bankAccountNo.trim() || undefined,
          bankIfsc: form.bankIfsc.trim() || undefined,
          bankAccountName: form.bankAccountName.trim() || undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Failed to save payment details')
      
      setStep(3)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 4: Finalize and sync Supabase Metadata
  const handleFinalize = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { onboarded: true }
      })
      if (error) throw error
      
      router.push('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = async () => {
    if (step === 0) { setStep(1); return }
    if (step === 1) { await handleCreateBusiness(); return }
    if (step === 2) { await handleSavePayment(); return }
    if (step === 3) { await handleFinalize(); return }
  }

  const handleSkip = () => {
    if (step === 2) { setStep(3); return }
  }

  if (checkingOnboard) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-gray-500">
        <svg className="w-8 h-8 animate-spin text-[#FF6A39]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="text-[14px] font-semibold tracking-wide text-gray-500 font-outfit">Setting up your experience...</p>
      </div>
    )
  }

  const barWidth = ((step + 1) / STEPS.length) * 100

  return (
    <div className="w-full max-w-[560px] bg-white overflow-hidden">
      <div className="px-0 py-2">
        {/* Step chip + icon */}
        <div className="flex items-center justify-between mb-5">
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[#c2410c] bg-[#FFF7F4] border border-[#FF6A39]/20 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A39]" />
            Step {step + 1} of {STEPS.length}
          </span>
        </div>

        {/* Heading */}
        <div className="flex items-start gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-[#FAFAF8] border border-[#EBEAE6] flex items-center justify-center flex-shrink-0 shadow-sm">
            {STEPS[step].icon}
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 leading-tight font-outfit">{STEPS[step].title}</h1>
            <p className="text-[13.5px] text-gray-500 mt-1.5 leading-relaxed">{STEPS[step].desc}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#EBEAE6] my-6" />

        {/* Step content */}
        <div className="min-h-[220px]">
          {step === 0 && <StepPersonal form={form} onChange={update} />}
          {step === 1 && <StepBusiness form={form} onChange={update} />}
          {step === 2 && <StepPayment form={form} onChange={update} />}
          {step === 3 && <StepDone businessName={form.businessName} form={form} />}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 mt-8 pt-5 border-t border-[#EBEAE6]">
          {step > 0 && step < 3 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              disabled={loading}
              className="h-11 px-5 rounded-xl border border-[#EBEAE6] text-[13.5px] font-bold text-gray-600 bg-white hover:bg-[#FAFAF8] transition-all disabled:opacity-40 flex-shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} size={16} /> Back
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={loading || (!canProceed() && step !== 3)}
            className="flex-1 h-11 rounded-xl bg-[#FF6A39] hover:bg-[#E05B2E] text-white text-[14px] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-md border-0 hover:shadow-lg"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Saving...
              </>
            ) : step === 3 ? (
              <>Go to dashboard <HugeiconsIcon icon={ArrowRight02Icon} size={16} /></>
            ) : (
              <>Save & continue <HugeiconsIcon icon={ArrowRight02Icon} size={16} /></>
            )}
          </button>

          {step === 2 && (
            <button
              type="button"
              onClick={handleSkip}
              disabled={loading}
              className="h-11 px-5 rounded-xl border border-[#EBEAE6] text-[13.5px] font-bold text-gray-500 bg-white hover:bg-[#FAFAF8] transition-all disabled:opacity-40 flex-shrink-0 cursor-pointer"
            >
              Skip
            </button>
          )}
        </div>

        {/* Bottom trust line */}
        {step < 3 && (
          <p className="text-center text-[11.5px] text-gray-400 mt-5 flex items-center justify-center gap-1.5">
            <HugeiconsIcon icon={LockIcon} size={14} className="text-gray-400" />
            Your data is encrypted and stored securely. We never share it.
          </p>
        )}
      </div>
    </div>
  )
}
