'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  AiBrain01Icon,
  Shield01Icon,
  HourglassIcon,
  Coins01Icon
} from '@hugeicons/core-free-icons'

export function WhiteLabelBranding() {
  const [customDomain, setCustomDomain] = useState('billing.reddypharma.com')
  const [logoName, setLogoName] = useState('reddy_pharma_logo.svg')
  const [primaryColor, setPrimaryColor] = useState('#FF6A39') // default orange
  const [smtpSender, setSmtpSender] = useState('billing@reddypharma.com')
  const [smtpHost, setSmtpHost] = useState('smtp.reddypharma.com')
  
  const [isSaving, setIsSaving] = useState(false)
  const [dnsStatus, setDnsStatus] = useState<'VERIFIED' | 'PENDING'>('VERIFIED')

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Branding profiles compiled and deployed successfully!')
    }, 1200)
  }

  const handleTriggerDomainVerify = () => {
    setDnsStatus('PENDING')
    toast.info('Querying DNS servers for CNAME record matching...')
    
    setTimeout(() => {
      setDnsStatus('VERIFIED')
      toast.success('DNS CNAME verified successfully: billing.reddypharma.com → cname.udhaarclear.com')
    }, 1500)
  }

  const handleMockLogoUpload = () => {
    toast.success('Branding logo uploaded successfully!')
    setLogoName('reddy_pharma_logo_v2.svg')
  }

  return (
    <div className="space-y-4 text-left">
      
      {/* Split view Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        
        {/* Left Column: branding settings Form (Takes 3 columns) */}
        <form onSubmit={handleSaveBranding} className="lg:col-span-3 space-y-4">
          
          {/* Section 1: Domain Customizations */}
          <div className="rounded-xl bg-white border border-[#EBEAE6] p-5 shadow-xs space-y-3.5">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">domain setups</span>
              <h4 className="text-[14px] font-extrabold text-gray-900 leading-tight">Branding DNS details</h4>
            </div>

            <div className="space-y-3">
              {/* Custom Domain Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">Custom Subdomain</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="e.g. billing.mybusiness.com"
                    className="flex-1 h-10 bg-white rounded-xl px-3.5 text-xs text-gray-800 border border-[#EBEAE6] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleTriggerDomainVerify}
                    className="bg-gray-950 hover:bg-gray-850 text-white text-xs font-bold px-3.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Verify DNS
                  </button>
                </div>
              </div>

              {/* DNS Status Info */}
              <div className="bg-gray-50 border border-[#EBEAE6]/60 p-3 rounded-lg flex items-center justify-between text-xs font-semibold">
                <div className="space-y-0.5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">CNAME mapping</span>
                  <span className="text-gray-700 font-mono">cname.udhaarclear.com</span>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9.5px] font-bold whitespace-nowrap ${
                  dnsStatus === 'VERIFIED'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                    : 'bg-amber-50 text-amber-700 border border-amber-250 animate-pulse'
                }`}>
                  {dnsStatus === 'VERIFIED' ? 'DNS VERIFIED' : 'RESOLVING...'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Logo and Styling Customizations */}
          <div className="rounded-xl bg-white border border-[#EBEAE6] p-5 shadow-xs space-y-3.5">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Branding colors & assets</span>
              <h4 className="text-[14px] font-extrabold text-gray-900 leading-tight">Visual customisation</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Logo Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">Company Logo File</label>
                <div className="bg-gray-50 border border-[#EBEAE6]/60 rounded-xl p-3.5 flex flex-col items-center justify-center text-center space-y-2">
                  <span className="text-[11px] font-semibold text-gray-700 block font-mono truncate max-w-[150px]">
                    {logoName}
                  </span>
                  <button
                    type="button"
                    onClick={handleMockLogoUpload}
                    className="bg-gray-950 hover:bg-gray-850 text-white text-[10px] font-bold py-1 px-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Upload Asset
                  </button>
                </div>
              </div>

              {/* Color Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">Primary Brand Color</label>
                <div className="space-y-2.5">
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-9 w-9 rounded border border-[#EBEAE6] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 h-9 bg-white rounded-xl px-3 text-xs text-gray-800 border border-[#EBEAE6] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/20 transition-all font-mono"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {['#FF6A39', '#52BA84', '#3B82F6', '#8B5CF6', '#EC4899'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setPrimaryColor(c)}
                        className="h-5 w-5 rounded-full border border-white ring-1 ring-gray-250 cursor-pointer"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: SMTP Settings */}
          <div className="rounded-xl bg-white border border-[#EBEAE6] p-5 shadow-xs space-y-3.5">
            <div>
              <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest block">sender profiles</span>
              <h4 className="text-[14px] font-extrabold text-gray-900 leading-tight">SMTP Email Configuration</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">Sender Address</label>
                <input
                  type="email"
                  required
                  value={smtpSender}
                  onChange={(e) => setSmtpSender(e.target.value)}
                  placeholder="collections@mybusiness.com"
                  className="w-full h-10 bg-white rounded-xl px-3.5 text-xs text-gray-800 border border-[#EBEAE6] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/20 transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">SMTP Host Link</label>
                <input
                  type="text"
                  required
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="smtp.mybusiness.com"
                  className="w-full h-10 bg-white rounded-xl px-3.5 text-xs text-gray-800 border border-[#EBEAE6] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/20 transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#FF6A39] hover:bg-[#E05B2E] disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-3xs cursor-pointer text-center"
          >
            {isSaving ? 'Compiling Branding profiles...' : 'Save Whitelabel Settings'}
          </button>

        </form>

        {/* Right Column: Live Mock Payment Preview (Takes 2 columns) */}
        <div className="lg:col-span-2 rounded-xl bg-white border border-[#EBEAE6] shadow-xs p-5 select-none space-y-4 flex flex-col justify-between min-h-[400px]">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block font-bold">realtime sandbox</span>
            <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight">Branded Portal Live Preview</h3>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              This preview reflects what your debtors will see when accessing their payment link via your custom domain.
            </p>
          </div>

          {/* Smartphone mockup frame */}
          <div className="flex-1 mt-4 border border-[#EBEAE6] bg-[#FDFDFB] rounded-[24px] overflow-hidden flex flex-col shadow-3xs relative min-h-[300px]">
            
            {/* Mock browser address bar */}
            <div className="bg-gray-100/80 border-b border-[#EBEAE6] px-4 py-2 flex items-center gap-2">
              <span className="text-xs text-emerald-600">🔒</span>
              <span className="text-[10.5px] font-semibold text-gray-500 font-mono truncate">
                {customDomain || 'billing.company.com'}/invoice/INV-007
              </span>
            </div>

            {/* Custom Payment Screen mockup */}
            <div className="p-4 flex-1 flex flex-col justify-between text-left">
              
              {/* Branded Logo inside mockup */}
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <span 
                  className="h-6 w-6 rounded-md flex items-center justify-center font-bold text-[10px] text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {smtpSender.split('@')[1]?.substring(0, 2).toUpperCase() || 'CO'}
                </span>
                <span className="text-xs font-black text-gray-900 uppercase tracking-wide">
                  {smtpSender.split('@')[1]?.split('.')[0] || 'Company'}
                </span>
              </div>

              {/* Invoice Dues Box */}
              <div className="my-auto py-4 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">outstanding invoice balance</span>
                  <span className="text-[26px] font-black text-gray-900 leading-none block font-mono">
                    ₹1,20,000
                  </span>
                </div>
                
                <div className="bg-gray-50/60 border border-gray-150 p-2.5 rounded-lg text-[10px] text-gray-500 font-semibold space-y-1">
                  <div className="flex justify-between">
                    <span>Invoice Ref:</span>
                    <span className="text-gray-700">INV-2026-007</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span className="text-gray-700">12 Jun 2026</span>
                  </div>
                </div>
              </div>

              {/* Branded CTA Button inside preview mockup */}
              <div className="space-y-2">
                <div 
                  className="w-full text-center text-white text-[11px] font-bold py-2.5 rounded-xl shadow-3xs cursor-pointer select-none"
                  style={{ backgroundColor: primaryColor }}
                >
                  Pay Outstanding Balance
                </div>
                <div className="text-center">
                  <span className="text-[8.5px] text-gray-400 font-semibold block uppercase tracking-wide">
                    Secured & processed by Razorpay via UdhaarClear
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
