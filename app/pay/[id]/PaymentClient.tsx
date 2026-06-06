'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { formatINR } from '@/lib/utils/currency'

type PayMode = 'upi' | 'split' | 'rtgs'

interface Props {
  invoiceId: string
  invoiceNumber: string
  amount: number
  formattedAmount: string
  formattedDue: string
  formattedInvoice: string
  customerName: string
  businessName: string
  businessPhone: string
  businessCity: string
  upiId: string | null
  upiLink: string | null
  bankAccountNo: string | null
  bankIfsc: string | null
  bankAccountName: string | null
  payMode: PayMode
  parts: number[]
  isPaid: boolean
  description: string
}

// ─── Copy Button ─────────────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={copy}
      className="ml-auto flex items-center gap-1.5 text-[12px] font-semibold text-[#FF6A39] hover:text-[#E05B2E] transition-colors flex-shrink-0"
    >
      {copied ? (
        <>
          <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
            <path d="M4 10l4.5 4.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
            <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4 14V4a1 1 0 0 1 1-1h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Copy {label}
        </>
      )}
    </button>
  )
}

// ─── UPI App Button ───────────────────────────────────────────────────────────

function UpiAppBtn({ name, scheme, upiLink }: { name: string; scheme: string; upiLink: string }) {
  const appLink = upiLink.replace('upi://', `${scheme}://`)
  return (
    <a
      href={appLink}
      className="flex flex-col items-center gap-2 rounded-2xl border border-[#EBEAE6] bg-white px-4 py-3.5 text-[13px] font-semibold text-gray-800 hover:border-gray-300 hover:bg-[#FAFAF8] transition-all active:scale-95"
    >
      <span className="text-2xl" aria-hidden="true">
        {name === 'GPay' ? '🟢' : name === 'PhonePe' ? '🟣' : name === 'Paytm' ? '🔵' : '🟡'}
      </span>
      {name}
    </a>
  )
}

// ─── Bank Detail Row ─────────────────────────────────────────────────────────

function BankRow({ label, value, copyLabel }: { label: string; value: string; copyLabel: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#EBEAE6]/60 last:border-b-0">
      <div>
        <p className="text-[11.5px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-[14px] font-semibold text-gray-900 font-mono">{value}</p>
      </div>
      <CopyButton text={value} label={copyLabel} />
    </div>
  )
}

// ─── Transfer Verification Modal ─────────────────────────────────────────────

function VerifyModal({ invoiceId, amount, onClose }: { invoiceId: string; amount: number; onClose: () => void }) {
  const [ref, setRef] = useState('')
  const [name, setName] = useState('')
  const [bank, setBank] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    if (!ref.trim()) { toast.error('Please enter your UTR / transaction reference'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/pay/${invoiceId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transferRef: ref.trim(), transferredAmount: amount, payerName: name.trim() || undefined, payerBank: bank.trim() || undefined }),
      })
      if (!res.ok) throw new Error('Failed')
      setDone(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl">
        {done ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-emerald-600" aria-hidden="true">
                <path d="M4 12l5 5 11-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Transfer recorded!</h2>
            <p className="text-[13.5px] text-gray-500 leading-relaxed">We've notified {'{business}'}. They will confirm receipt within 1 business day. You'll get a WhatsApp confirmation once verified.</p>
            <button onClick={onClose} className="mt-5 w-full h-11 rounded-xl bg-[#FF6A39] text-white font-semibold text-[14px]">Close</button>
          </div>
        ) : (
          <>
            <h2 className="text-[18px] font-semibold text-gray-900 mb-1">Confirm your transfer</h2>
            <p className="text-[13px] text-gray-500 mb-5">Enter your UTR number so we can match the payment quickly.</p>

            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-gray-600">UTR / Transaction reference <span className="text-[#FF6A39]">*</span></label>
                <input
                  type="text"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="e.g. HDFC4823910293847"
                  className="h-11 rounded-xl border border-[#EBEAE6] bg-[#FAFAF8] px-4 text-[13.5px] font-mono text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-gray-600">Your name <span className="text-gray-400">(optional)</span></label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ramesh Traders" className="h-11 rounded-xl border border-[#EBEAE6] bg-[#FAFAF8] px-4 text-[13.5px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-gray-600">Your bank <span className="text-gray-400">(optional)</span></label>
                  <input type="text" value={bank} onChange={(e) => setBank(e.target.value)} placeholder="HDFC Bank" className="h-11 rounded-xl border border-[#EBEAE6] bg-[#FAFAF8] px-4 text-[13.5px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-[#EBEAE6] text-[13.5px] font-semibold text-gray-600 bg-white hover:bg-[#FAFAF8]">Cancel</button>
              <button onClick={submit} disabled={loading} className="flex-1 h-11 rounded-xl bg-[#FF6A39] text-white text-[13.5px] font-semibold disabled:opacity-40 hover:bg-[#E05B2E]">
                {loading ? 'Saving...' : 'Confirm transfer'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PaymentClient({
  invoiceId, invoiceNumber, amount, formattedAmount, formattedDue, formattedInvoice,
  customerName, businessName, businessPhone, businessCity,
  upiId, upiLink, bankAccountNo, bankIfsc, bankAccountName,
  payMode, parts, isPaid, description,
}: Props) {

  const [showVerify, setShowVerify] = useState(false)
  const [activePartIdx, setActivePartIdx] = useState(0)

  const partUpiLink = (partAmount: number) =>
    upiId
      ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(businessName)}&am=${partAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Invoice ${invoiceNumber} Part ${activePartIdx + 1}`)}`
      : null

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center py-8 px-4">

      {/* Header */}
      <div className="w-full max-w-[460px] mb-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#FF6A39] flex items-center justify-center">
            <span className="text-white text-[14px] font-bold">U</span>
          </div>
          <span className="text-[14px] font-bold text-gray-900">UdhaarClear</span>
          <span className="ml-1 text-[11px] text-gray-400 border border-[#EBEAE6] rounded-full px-2 py-0.5">Secure payment</span>
        </div>
        <p className="text-[12px] text-gray-400">Payment request from <span className="font-semibold text-gray-600">{businessName}</span></p>
      </div>

      {/* Invoice card */}
      <div className="w-full max-w-[460px] rounded-[24px] bg-white border border-[#EBEAE6]/80 shadow-[0_4px_24px_rgba(0,0,0,0.05)] overflow-hidden">

        {/* Top amount banner */}
        <div className="bg-[#FF6A39] px-7 py-6">
          <p className="text-[12.5px] font-semibold text-white/70 mb-1">Amount due</p>
          <p className="text-[38px] font-bold text-white leading-none tracking-tight">{formattedAmount}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[12px] text-white/70">Invoice {invoiceNumber}</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="text-[12px] text-white/70">Due {formattedDue}</span>
          </div>
        </div>

        {/* Already paid state */}
        {isPaid && (
          <div className="p-7 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-emerald-600" aria-hidden="true">
                <path d="M4 12l5 5 11-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment received!</h2>
            <p className="text-[13.5px] text-gray-500">This invoice has already been fully settled. Thank you!</p>
          </div>
        )}

        {/* Payment options */}
        {!isPaid && (
          <div className="p-6 space-y-5">

            {/* ── MODE: UPI only (< ₹1L) ── */}
            {payMode === 'upi' && (
              <>
                <div>
                  <p className="text-[13px] font-semibold text-gray-700 mb-3">Pay instantly via UPI</p>
                  {upiLink && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {[
                        { name: 'GPay', scheme: 'gpay' },
                        { name: 'PhonePe', scheme: 'phonepe' },
                        { name: 'Paytm', scheme: 'paytmmp' },
                        { name: 'BHIM', scheme: 'bhim' },
                      ].map((app) => (
                        <UpiAppBtn key={app.name} name={app.name} scheme={app.scheme} upiLink={upiLink} />
                      ))}
                    </div>
                  )}
                  {upiId && (
                    <div className="flex items-center gap-3 rounded-xl border border-[#EBEAE6] bg-[#FAFAF8] px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">UPI ID</p>
                        <p className="text-[14px] font-mono font-semibold text-gray-900 truncate">{upiId}</p>
                      </div>
                      <CopyButton text={upiId} label="UPI ID" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-400">
                  <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true">
                    <path d="M4 12l5 5 11-10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Open any UPI app → Scan or paste UPI ID → Enter ₹{amount.toLocaleString('en-IN')} → Pay
                </div>
              </>
            )}

            {/* ── MODE: Split UPI + NEFT (₹1L – ₹10L) ── */}
            {payMode === 'split' && (
              <>
                <div className="rounded-xl bg-amber-50 border border-amber-200/60 px-4 py-3 flex items-start gap-2.5">
                  <span className="text-[16px] flex-shrink-0">⚠️</span>
                  <p className="text-[12.5px] text-amber-800 leading-relaxed">
                    UPI has a ₹1 lakh limit per transaction. Pay in {parts.length} parts, or use bank transfer below.
                  </p>
                </div>

                {/* UPI in parts */}
                {upiId && (
                  <div>
                    <p className="text-[13px] font-semibold text-gray-700 mb-3">Option 1 — Pay in {parts.length} UPI transfers</p>
                    <div className="space-y-2 mb-3">
                      {parts.map((partAmt, i) => {
                        const pl = partUpiLink(partAmt)
                        return (
                          <div key={i} className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${activePartIdx === i ? 'border-[#FF6A39] bg-[#FFF7F4]' : 'border-[#EBEAE6] bg-[#FAFAF8]'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${activePartIdx > i ? 'bg-emerald-100 text-emerald-700' : activePartIdx === i ? 'bg-[#FF6A39] text-white' : 'bg-gray-100 text-gray-400'}`}>
                              {activePartIdx > i ? '✓' : i + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-[13px] font-semibold text-gray-900">Part {i + 1} — {formatINR(partAmt)}</p>
                              <p className="text-[11.5px] text-gray-500">via GPay / PhonePe / any UPI app</p>
                            </div>
                            {activePartIdx === i && pl && (
                              <a href={pl} onClick={() => setActivePartIdx(i + 1)} className="h-8 px-4 rounded-full bg-[#FF6A39] text-white text-[12px] font-semibold flex items-center hover:bg-[#E05B2E]">
                                Pay now
                              </a>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    {upiId && (
                      <div className="flex items-center gap-3 rounded-xl border border-[#EBEAE6] bg-[#FAFAF8] px-4 py-3">
                        <div className="flex-1"><p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">UPI ID</p><p className="text-[13.5px] font-mono font-semibold text-gray-900">{upiId}</p></div>
                        <CopyButton text={upiId} label="UPI ID" />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#EBEAE6]" />
                  <span className="text-[12px] text-gray-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-[#EBEAE6]" />
                </div>

                {/* NEFT Section */}
                {bankAccountNo && (
                  <div>
                    <p className="text-[13px] font-semibold text-gray-700 mb-3">Option 2 — Bank transfer (NEFT)</p>
                    <div className="rounded-xl border border-[#EBEAE6] bg-white divide-y divide-[#EBEAE6]/60 overflow-hidden">
                      <BankRow label="Account holder" value={bankAccountName ?? ''} copyLabel="Name" />
                      <BankRow label="Account number" value={bankAccountNo} copyLabel="Account no." />
                      <BankRow label="IFSC code" value={bankIfsc ?? ''} copyLabel="IFSC" />
                      <div className="px-4 py-3"><p className="text-[11.5px] text-gray-400">Transfer type: <span className="font-semibold text-gray-600">NEFT</span> · Amount: <span className="font-semibold text-gray-900">{formattedAmount}</span></p></div>
                    </div>
                    <button onClick={() => setShowVerify(true)} className="mt-3 w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-[13.5px] font-semibold transition-all flex items-center justify-center gap-2">
                      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true"><path d="M4 10l4.5 4.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      I&apos;ve made the NEFT transfer
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── MODE: RTGS only (> ₹10L) ── */}
            {payMode === 'rtgs' && (
              <>
                <div className="rounded-xl bg-blue-50 border border-blue-200/60 px-4 py-3 flex items-start gap-2.5">
                  <span className="text-[16px] flex-shrink-0">🏦</span>
                  <div>
                    <p className="text-[13px] font-semibold text-blue-900">RTGS recommended for this amount</p>
                    <p className="text-[12px] text-blue-700 mt-0.5 leading-relaxed">Amounts above ₹10 lakh use RTGS for same-day guaranteed settlement. UPI is not available for this transaction.</p>
                  </div>
                </div>

                {bankAccountNo ? (
                  <>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-700 mb-3">RTGS bank details</p>
                      <div className="rounded-xl border border-[#EBEAE6] bg-white divide-y divide-[#EBEAE6]/60 overflow-hidden">
                        <BankRow label="Account holder" value={bankAccountName ?? ''} copyLabel="Name" />
                        <BankRow label="Account number" value={bankAccountNo} copyLabel="Account no." />
                        <BankRow label="IFSC code" value={bankIfsc ?? ''} copyLabel="IFSC" />
                        <div className="px-4 py-3">
                          <p className="text-[11.5px] text-gray-400">Transfer type: <span className="font-semibold text-blue-700">RTGS</span> · Amount: <span className="font-semibold text-gray-900">{formattedAmount}</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#FAFAF8] border border-[#EBEAE6] p-4 space-y-2">
                      <p className="text-[12.5px] font-semibold text-gray-700">How RTGS works</p>
                      {[
                        "Log in to your bank's net banking or visit the branch",
                        `Add ${businessName} as a beneficiary (takes ~30 min for first-time)`,
                        `Initiate RTGS for ${formattedAmount} using the details above`,
                        'Note your UTR number — click "I\'ve made the transfer" below',
                        'Settlement confirmed within 1 business day',
                      ].map((step, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-[12px] text-gray-600">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                          {step}
                        </div>
                      ))}
                    </div>

                    <button onClick={() => setShowVerify(true)} className="w-full h-12 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-[14px] font-semibold transition-all flex items-center justify-center gap-2">
                      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true"><path d="M4 10l4.5 4.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      I&apos;ve made the RTGS transfer
                    </button>
                  </>
                ) : (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-4 text-center">
                    <p className="text-[13px] text-red-700 font-semibold">Bank details not available</p>
                    <p className="text-[12px] text-red-600 mt-1">Please contact {businessName} at {businessPhone} to arrange payment.</p>
                  </div>
                )}
              </>
            )}

            {/* ─ Divider ─ */}
            <div className="h-px bg-[#EBEAE6]/60" />

            {/* Invoice detail */}
            <div className="space-y-2 text-[13px]">
              {[
                { label: 'From', value: businessName },
                { label: 'Invoice no.', value: invoiceNumber },
                { label: 'Invoice date', value: formattedInvoice },
                ...(description ? [{ label: 'Description', value: description }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-gray-400 flex-shrink-0">{label}</span>
                  <span className="font-semibold text-gray-900 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="mt-6 text-[12px] text-gray-400 text-center">
        🔒 Secured by UdhaarClear · Questions? Call {businessPhone}
      </p>

      {showVerify && (
        <VerifyModal invoiceId={invoiceId} amount={amount} onClose={() => setShowVerify(false)} />
      )}
    </div>
  )
}
