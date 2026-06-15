"use client";

import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Building2,
  ChevronDown,
  ChevronUp,
  Check,
  Loader2,
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
  const [loading, setLoading] = useState(true);

  // UPI
  const [upiId, setUpiId] = useState("");

  // Bank
  const [holderName, setHolderName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [showBank, setShowBank] = useState(false);

  // Preferences
  const [allowPartial, setAllowPartial] = useState(false);
  const [settlementAlerts, setSettlementAlerts] = useState(true);

  const [saving, setSaving] = useState(false);

  // Load existing payment details on mount
  useEffect(() => {
    fetch("/api/businesses/payment-details")
      .then((r) => r.json())
      .then((data) => {
        if (data?.business) {
          const b = data.business;
          setUpiId(b.upiId || "");
          setHolderName(b.bankAccountName || "");
          setAccountNo(b.bankAccountNo || "");
          setBankCode(b.bankIfsc || "");
          if (b.bankAccountNo) setShowBank(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!upiId.trim() && !(holderName.trim() && accountNo.trim() && bankCode.trim())) {
      toast.error("Add a UPI ID or complete bank account details before saving.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/businesses/payment-details", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upiId: upiId.trim() || undefined,
          bankAccountName: holderName.trim() || undefined,
          bankAccountNo: accountNo.trim() || undefined,
          bankIfsc: bankCode.trim().toUpperCase() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save");
      toast.success("Payment details saved");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-3xl animate-in fade-in duration-200">

      {/* ── Where customers pay ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <div className="pb-4 mb-4 border-b border-gray-50">
          <h2 className="text-base font-bold text-gray-900 font-outfit">Where should customers pay you?</h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            This appears on the payment page customers see after clicking the reminder link.
          </p>
        </div>

        <div className="space-y-3">

          {/* UPI */}
          <div className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/40">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-gray-900">UPI — GPay, PhonePe, Paytm</h3>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">Zero fee · Instant</span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium mb-3 leading-relaxed">
                Customer taps a link → pays in GPay or any UPI app → money in your bank instantly. Free forever.
              </p>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Your UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@okaxis  or  yourname@ybl"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-all"
              />
              <p className="text-[10px] text-gray-400 font-medium mt-1.5">
                Find it in GPay → Profile, or PhonePe → My Details. Looks like <span className="font-mono font-semibold text-gray-500">name@bank</span>
              </p>
            </div>
          </div>

          {/* Bank account — collapsible */}
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
                  <h3 className="text-sm font-bold text-gray-900">Bank Transfer — For amounts above ₹50,000</h3>
                  {holderName && accountNo && bankCode && (
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-gray-400 font-medium">
                  Shown automatically when invoice amount is large. NEFT or RTGS.
                </p>
              </div>
              {showBank
                ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
              }
            </button>

            {showBank && (
              <div className="p-4 border-t border-gray-100 space-y-3 bg-white">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      {/* ── Preferences ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <h3 className="text-sm font-bold text-gray-900 font-outfit mb-4">Payment Preferences</h3>

        <div className="divide-y divide-gray-50">
          <div className="flex items-start justify-between py-3.5 gap-4">
            <div>
              <p className="text-[12.5px] font-bold text-gray-900">Allow customers to pay in parts</p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-relaxed">
                Customer can't pay the full amount at once? Let them pay in smaller parts. You get notified for each part.
              </p>
            </div>
            <Toggle checked={allowPartial} onChange={setAllowPartial} />
          </div>

          <div className="flex items-start justify-between py-3.5 gap-4">
            <div>
              <p className="text-[12.5px] font-bold text-gray-900">Alert me the moment someone pays</p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-relaxed">
                Get a WhatsApp message on your number the instant any customer settles an invoice.
              </p>
            </div>
            <Toggle checked={settlementAlerts} onChange={setSettlementAlerts} />
          </div>
        </div>
      </div>

      {/* ── How it works info ── */}
      <div className="rounded-2xl bg-blue-50/60 border border-blue-100 p-4">
        <p className="text-[12px] font-bold text-blue-900 mb-1.5">How payment confirmation works</p>
        <div className="space-y-1.5 text-[11.5px] text-blue-800 font-medium leading-relaxed">
          <p>• Customer gets reminder → taps payment link → sees your UPI QR + UPI ID</p>
          <p>• They pay via GPay / PhonePe → money directly in your bank</p>
          <p>• Customer enters their transaction ID on the page → you get notified</p>
          <p>• You confirm in the dashboard → invoice marked paid, reminders stop</p>
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
          {saving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </span>
          ) : "Save Payment Details"}
        </button>
      </div>
    </div>
  );
}
