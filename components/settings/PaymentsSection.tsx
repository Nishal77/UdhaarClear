"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Building2,
  Zap,
  ChevronDown,
  ChevronUp,
  Check,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";
import { toast } from "sonner";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B00]" />
    </label>
  );
}

export default function PaymentsSection() {
  // UPI
  const [upiId, setUpiId] = useState("");

  // Bank
  const [holderName, setHolderName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [showBank, setShowBank] = useState(false);

  // Razorpay connection
  const [rzpConnected, setRzpConnected] = useState(false);
  const [rzpKey, setRzpKey] = useState("");
  const [rzpSecret, setRzpSecret] = useState("");
  const [showRzpForm, setShowRzpForm] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  // Preferences
  const [allowPartial, setAllowPartial] = useState(false);
  const [settlementAlerts, setSettlementAlerts] = useState(true);

  const [saving, setSaving] = useState(false);

  const handleConnectRazorpay = () => {
    if (!rzpKey.trim() || !rzpSecret.trim()) {
      toast.error("Enter both your Razorpay Account ID and secret key");
      return;
    }
    setRzpConnected(true);
    setShowRzpForm(false);
    toast.success("Razorpay connected — payments will auto-confirm from now on");
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: POST /api/businesses/payment-details
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success("Payment settings saved");
  };

  return (
    <div className="space-y-4 w-full max-w-3xl animate-in fade-in duration-200">

      {/* ── Header ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <div className="flex items-center gap-3.5 pb-4 mb-4 border-b border-gray-50">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100/20 text-[#FF6B00] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 font-outfit">How do customers pay you?</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Set up where money comes in. All options are optional — add what you use.
            </p>
          </div>
        </div>

        {/* ── UPI ── */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/40">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="text-sm font-bold text-gray-900">UPI — Pay with Google Pay, PhonePe, Paytm</h3>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">Zero fee</span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium mb-3 leading-relaxed">
                Customer scans a QR code or types your UPI ID to pay. Money lands in your bank instantly. No middlemen.
              </p>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Your UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@okaxis  or  yourname@ybl"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-all"
                />
                <p className="text-[10px] text-gray-400 font-medium mt-1.5">
                  Find this in your GPay / PhonePe / Paytm → Profile. Looks like <span className="font-mono font-semibold text-gray-500">name@bank</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── Bank account (collapsible) ── */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowBank(!showBank)}
              className="w-full flex items-center gap-3 p-4 bg-gray-50/40 hover:bg-gray-50 transition-colors text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">Bank Transfer — For large amounts</h3>
                  {holderName && accountNo && (
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-gray-400 font-medium">
                  Shown to customers paying above ₹50,000. Direct NEFT / RTGS to your account.
                </p>
              </div>
              {showBank ? (
                <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
              )}
            </button>

            {showBank && (
              <div className="p-4 border-t border-gray-100 space-y-4 bg-white">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Account holder name</label>
                  <input
                    type="text"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    placeholder="e.g. Acme Traders Pvt Ltd"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Account number</label>
                    <input
                      type="text"
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      placeholder="e.g. 012345678901"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#FF6B00] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">
                      Bank code (IFSC)
                    </label>
                    <input
                      type="text"
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value.toUpperCase())}
                      placeholder="e.g. HDFC0001234"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#FF6B00] transition-all"
                    />
                    <p className="text-[10px] text-gray-400 font-medium mt-1">
                      Printed on your chequebook or find it in your banking app.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Razorpay connection ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.015)]">

        <div className="flex items-center gap-3 p-5 border-b border-gray-50">
          {/* Razorpay logo mark */}
          <div className="w-10 h-10 rounded-2xl bg-[#2A68FF]/8 border border-[#2A68FF]/15 flex items-center justify-center shrink-0 overflow-hidden">
            <svg viewBox="0 0 40 40" width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 5L8 15.5V28L20 35L32 28V15.5L20 5Z" fill="#2A68FF" opacity="0.15"/>
              <path d="M14 20L20 11L26 22H22L24 29L18 19H22L20 11L14 20Z" fill="#2A68FF"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">Razorpay</h3>
              {rzpConnected ? (
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">Connected</span>
              ) : (
                <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wide">Optional</span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Customers pay online via a link — UdhaarClear auto-confirms the payment for you.
            </p>
          </div>
          {rzpConnected ? (
            <button
              type="button"
              onClick={() => { setRzpConnected(false); setRzpKey(""); setRzpSecret(""); toast.success("Razorpay disconnected"); }}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 px-3.5 py-2 rounded-xl border border-rose-100 hover:bg-rose-50 transition-all cursor-pointer"
            >
              Disconnect
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowRzpForm(!showRzpForm)}
              className="text-[11px] font-bold text-[#2A68FF] hover:text-blue-700 px-3.5 py-2 rounded-xl border border-[#2A68FF]/20 hover:bg-blue-50 transition-all cursor-pointer"
            >
              {showRzpForm ? "Cancel" : "Connect"}
            </button>
          )}
        </div>

        {/* What Razorpay does — always visible */}
        <div className="px-5 py-3.5 bg-blue-50/40 border-b border-blue-100/50">
          <div className="flex items-start gap-2.5">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-[11px] text-blue-800 font-semibold leading-relaxed space-y-0.5">
              <p><strong>Without Razorpay:</strong> Customer pays via UPI or bank transfer → you have to manually tick "payment received" on each invoice.</p>
              <p><strong>With Razorpay:</strong> Customer clicks a payment link → money is confirmed automatically, no follow-up needed. Razorpay charges ~2% per payment and takes 2 business days to settle to your bank.</p>
            </div>
          </div>
        </div>

        {/* Connection form */}
        {!rzpConnected && showRzpForm && (
          <div className="p-5 space-y-4">
            <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-xl text-[11px] text-amber-800 font-semibold leading-relaxed">
              Get these from your <strong>Razorpay Dashboard → Settings → API Keys</strong>. Use test keys first.
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Razorpay Account ID</label>
              <input
                type="text"
                value={rzpKey}
                onChange={(e) => setRzpKey(e.target.value)}
                placeholder="rzp_live_…"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#2A68FF] transition-all"
              />
              <p className="text-[10px] text-gray-400 font-medium mt-1">Starts with <span className="font-mono">rzp_live_</span> or <span className="font-mono">rzp_test_</span></p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Secret Password</label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={rzpSecret}
                  onChange={(e) => setRzpSecret(e.target.value)}
                  placeholder="Your Razorpay secret key"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#2A68FF] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 font-medium mt-1">Never share this with anyone. We store it encrypted.</p>
            </div>

            <button
              type="button"
              onClick={handleConnectRazorpay}
              className="w-full py-2.5 bg-[#2A68FF] hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all cursor-pointer active:scale-[0.98]"
            >
              Connect Razorpay Account
            </button>
          </div>
        )}
      </div>

      {/* ── Payment preferences ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <h3 className="text-sm font-bold text-gray-900 font-outfit mb-4">Payment Preferences</h3>

        <div className="space-y-0 divide-y divide-gray-50">
          <div className="flex items-start justify-between py-3.5 gap-4">
            <div>
              <p className="text-[12.5px] font-bold text-gray-900">Allow customers to pay in parts</p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-relaxed">
                If a customer can't pay the full amount at once, let them pay in smaller chunks over time. You still get notified for each payment.
              </p>
            </div>
            <Toggle checked={allowPartial} onChange={setAllowPartial} />
          </div>

          <div className="flex items-start justify-between py-3.5 gap-4">
            <div>
              <p className="text-[12.5px] font-bold text-gray-900">Alert me the moment someone pays</p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-relaxed">
                Send a WhatsApp message to your registered number instantly when any customer settles an invoice.
              </p>
            </div>
            <Toggle checked={settlementAlerts} onChange={setSettlementAlerts} />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#FF6B00] hover:bg-[#E05B2E] text-white text-sm font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm"
        >
          {saving ? "Saving..." : "Save Payment Settings"}
        </button>
      </div>
    </div>
  );
}
