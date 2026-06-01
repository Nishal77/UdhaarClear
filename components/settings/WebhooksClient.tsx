'use client'

import React, { useState } from 'react'
import { Key, Eye, EyeOff, Copy, Check, Webhook, Globe, RefreshCw, AlertCircle, Save } from 'lucide-react'

export default function WebhooksClient() {
  // Key state
  const [isLiveMode, setIsLiveMode] = useState(false)
  const [showLiveKey, setShowLiveKey] = useState(false)
  const [showTestKey, setShowTestKey] = useState(false)
  const [liveKey, setLiveKey] = useState('uc_live_51P8zJ9dF0wLxKyTr7sP2m0k4n8v6x3w9b0a1c5d9')
  const [testKey, setTestKey] = useState('uc_test_99xR22eS1dKmNyUb5rQ1p7l3m6z5w2t8g4f3c7e0')
  const [copiedLive, setCopiedLive] = useState(false)
  const [copiedTest, setCopiedTest] = useState(false)

  // Webhook state
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourcompany.com/v1/webhooks/udhaarclear')
  const [showSecret, setShowSecret] = useState(false)
  const [signingSecret, setSigningSecret] = useState('whsec_77Dfg88KjH99LmPoIu77TRe21WqPzXsW')
  const [copiedSecret, setCopiedSecret] = useState(false)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'invoice.paid',
    'reminder.failed'
  ])

  // Notification state
  const [notification, setNotification] = useState<string | null>(null)

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleCopy = (text: string, type: 'live' | 'test' | 'secret') => {
    navigator.clipboard.writeText(text)
    if (type === 'live') {
      setCopiedLive(true)
      setTimeout(() => setCopiedLive(false), 2000)
    } else if (type === 'test') {
      setCopiedTest(true)
      setTimeout(() => setCopiedTest(false), 2000)
    } else {
      setCopiedSecret(true)
      setTimeout(() => setCopiedSecret(false), 2000)
    }
    showNotification('Copied to clipboard!')
  }

  const handleRegenerate = (mode: 'live' | 'test') => {
    if (confirm(`Are you sure you want to regenerate your ${mode} API key? Existing integrations using this key will break immediately.`)) {
      const randStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      const newKey = `uc_${mode}_${randStr}`
      if (mode === 'live') {
        setLiveKey(newKey)
      } else {
        setTestKey(newKey)
      }
      showNotification(`Regenerated ${mode} API key successfully!`)
    }
  }

  const toggleEvent = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter(e => e !== event))
    } else {
      setSelectedEvents([...selectedEvents, event])
    }
  }

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!webhookUrl.trim() || !webhookUrl.startsWith('http')) {
      alert('Please enter a valid HTTP/HTTPS endpoint URL')
      return
    }
    showNotification('Webhook endpoint configuration updated!')
  }

  return (
    <div className="space-y-4 w-full">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-full border border-gray-800 shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Toggle between Live and Test keys */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 font-outfit">API Credentials</h2>
              <p className="text-xs text-gray-400">Authenticate custom integrations or accounting plugins.</p>
            </div>
          </div>

          {/* Mode Switcher pill */}
          <div className="flex items-center bg-gray-100 p-1 rounded-full border border-gray-200/50 w-fit self-start md:self-auto">
            <button
              onClick={() => setIsLiveMode(false)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                !isLiveMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Test Mode
            </button>
            <button
              onClick={() => setIsLiveMode(true)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                isLiveMode ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500'
              }`}
            >
              Live Mode
            </button>
          </div>
        </div>

        {/* Display appropriate API Key */}
        {!isLiveMode ? (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium text-amber-700 leading-normal">
                You are viewing <span className="font-bold">Test Mode</span> credentials. Test API requests simulate reminders and invoice creations without billing your balance or sending actual WhatsApp messages.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                Test Secret API Key
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-mono text-xs text-gray-800 select-all overflow-x-auto whitespace-nowrap min-w-0">
                  {showTestKey ? testKey : '•'.repeat(testKey.length)}
                </div>
                <button
                  onClick={() => setShowTestKey(!showTestKey)}
                  className="bg-white border border-gray-200 hover:bg-gray-50 p-2.5 rounded-xl text-gray-500 transition-colors cursor-pointer"
                  title={showTestKey ? 'Hide key' : 'Show key'}
                >
                  {showTestKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleCopy(testKey, 'test')}
                  className="bg-white border border-gray-200 hover:bg-gray-50 p-2.5 rounded-xl text-gray-500 transition-colors cursor-pointer"
                  title="Copy key"
                >
                  {copiedTest ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleRegenerate('test')}
                  className="bg-white border border-gray-200 hover:bg-gray-50 p-2.5 rounded-xl text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                  title="Regenerate key"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium text-red-700 leading-normal">
                You are viewing <span className="font-bold">Live Mode</span> credentials. Treat these keys with absolute secrecy. Live API calls perform real-world actions and send active payments/messages.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                Live Secret API Key
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-mono text-xs text-gray-800 select-all overflow-x-auto whitespace-nowrap min-w-0">
                  {showLiveKey ? liveKey : '•'.repeat(liveKey.length)}
                </div>
                <button
                  onClick={() => setShowLiveKey(!showLiveKey)}
                  className="bg-white border border-gray-200 hover:bg-gray-50 p-2.5 rounded-xl text-gray-500 transition-colors cursor-pointer"
                  title={showLiveKey ? 'Hide key' : 'Show key'}
                >
                  {showLiveKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleCopy(liveKey, 'live')}
                  className="bg-white border border-gray-200 hover:bg-gray-50 p-2.5 rounded-xl text-gray-500 transition-colors cursor-pointer"
                  title="Copy key"
                >
                  {copiedLive ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleRegenerate('live')}
                  className="bg-white border border-gray-200 hover:bg-gray-50 p-2.5 rounded-xl text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                  title="Regenerate key"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Webhooks Section */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 text-left">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center">
            <Webhook className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 font-outfit">Webhook Listeners</h2>
            <p className="text-xs text-gray-400">Receive HTTP POST payloads automatically on system events.</p>
          </div>
        </div>

        <form onSubmit={handleSaveWebhook} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                Endpoint URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. https://yourdomain.com/webhooks/payments"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                Signing Secret (for payload signature verification)
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-mono text-xs text-gray-800 overflow-x-auto whitespace-nowrap min-w-0">
                  {showSecret ? signingSecret : '•'.repeat(signingSecret.length)}
                </div>
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="bg-white border border-gray-200 hover:bg-gray-50 p-2.5 rounded-xl text-gray-500 transition-colors cursor-pointer"
                  title={showSecret ? 'Hide secret' : 'Show secret'}
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(signingSecret, 'secret')}
                  className="bg-white border border-gray-200 hover:bg-gray-50 p-2.5 rounded-xl text-gray-500 transition-colors cursor-pointer"
                  title="Copy secret"
                >
                  {copiedSecret ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Event selection list */}
          <div className="pt-2">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 font-outfit">
              Subscribe to Event Triggers
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { key: 'invoice.created', desc: 'Triggered when a new invoice is registered.' },
                { key: 'invoice.paid', desc: 'Triggered when an invoice is fully marked as PAID.' },
                { key: 'reminder.sent', desc: 'Triggered when a WhatsApp/Email reminder dispatch completes.' },
                { key: 'reminder.failed', desc: 'Triggered when a reminder bounces due to bad contact or API errors.' },
              ].map((evt) => {
                const isSelected = selectedEvents.includes(evt.key)
                return (
                  <button
                    key={evt.key}
                    type="button"
                    onClick={() => toggleEvent(evt.key)}
                    className={`flex items-start gap-3 border rounded-[16px] p-3 text-left transition-all ${
                      isSelected
                        ? 'border-[#FF6B00] bg-[#FFF0EB]/10'
                        : 'border-gray-200/80 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#FF6B00] border-transparent text-white'
                        : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <p className="text-[12.5px] font-bold text-gray-800 font-mono">{evt.key}</p>
                      <p className="text-[10.5px] text-gray-400 font-medium leading-normal mt-0.5">{evt.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t border-gray-50">
            <button
              type="submit"
              className="bg-[#FF6B00] hover:bg-[#E05B2E] text-white text-xs font-semibold py-2.5 px-5 rounded-full shadow-sm hover:shadow active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer border-0"
            >
              <Save className="w-3.5 h-3.5" />
              Save Webhook Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
