"use client";

import React, { useState } from "react";
import { CreditCard } from "lucide-react";

export default function PaymentsSection() {
  const [upiVpa, setUpiVpa] = useState("nishalpoojary@okaxis");
  const [razorpayKey, setRazorpayKey] = useState("rzp_live_8FjK93kd8sL");
  const [razorpaySecret, setRazorpaySecret] = useState("••••••••••••••••••••");
  const [showRzpSecret, setShowRzpSecret] = useState(false);
  const [cashfreeAppId, setCashfreeAppId] = useState("cf_live_92kL1d8s3j");
  const [cashfreeSecret, setCashfreeSecret] = useState("••••••••••••••••••••");
  const [showCfSecret, setShowCfSecret] = useState(false);
  const [allowPartial, setAllowPartial] = useState(false);
  const [settlementAlerts, setSettlementAlerts] = useState(true);

  return (
    <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] w-full max-w-3xl text-left animate-in fade-in duration-200">
      <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-gray-50">
        <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100/20 text-[#FF6B00] flex items-center justify-center shadow-sm shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 font-outfit">Payment Gateway Configuration</h2>
          <p className="text-xs text-gray-400 font-medium">Link payout destinations and API gateway keys to automate outstanding settlement confirmation.</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Direct UPI VPA Card */}
        <div className="p-4 bg-slate-50 border border-gray-200/50 rounded-2xl text-left">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-outfit">0% direct upi collection</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-[9px] font-bold text-emerald-600 border border-emerald-100/30 uppercase tracking-wider">Zero Fees</span>
          </div>
          <div className="space-y-1">
            <label className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-outfit">Virtual Payment Address (VPA)</label>
            <input
              type="text"
              value={upiVpa}
              onChange={(e) => setUpiVpa(e.target.value)}
              className="w-full bg-white border border-gray-200/80 rounded-xl px-4 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
            />
            <span className="block text-[9.5px] text-gray-400 font-semibold leading-normal mt-1">Routes instant debtor payments directly into your bank vault. Supports zero processing/settlement commission fees.</span>
          </div>
        </div>

        {/* Razorpay Integration */}
        <div className="p-4 border border-gray-200/50 rounded-2xl text-left">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-outfit mb-3">Razorpay Connector</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">Razorpay Key ID</label>
              <input
                type="text"
                value={razorpayKey}
                onChange={(e) => setRazorpayKey(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">Razorpay Key Secret</label>
              <div className="relative">
                <input
                  type={showRzpSecret ? "text" : "password"}
                  value={razorpaySecret}
                  onChange={(e) => setRazorpaySecret(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl pl-4 pr-10 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                />
                <button
                  type="button"
                  onClick={() => setShowRzpSecret(!showRzpSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-[10px] font-bold cursor-pointer"
                >
                  {showRzpSecret ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cashfree Integration */}
        <div className="p-4 border border-gray-200/50 rounded-2xl text-left">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-outfit mb-3">Cashfree Connector</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">Cashfree App ID</label>
              <input
                type="text"
                value={cashfreeAppId}
                onChange={(e) => setCashfreeAppId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">Cashfree Key Secret</label>
              <div className="relative">
                <input
                  type={showCfSecret ? "text" : "password"}
                  value={cashfreeSecret}
                  onChange={(e) => setCashfreeSecret(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl pl-4 pr-10 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                />
                <button
                  type="button"
                  onClick={() => setShowCfSecret(!showCfSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-[10px] font-bold cursor-pointer"
                >
                  {showCfSecret ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Settings Toggles */}
        <div className="space-y-4 pt-2 font-semibold text-slate-700">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 font-outfit">Allow Partial Invoice Settlement</span>
              <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-normal">If enabled, buyers can pay in manual parts/installments. If disabled, full payments only.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" checked={allowPartial} onChange={(e) => setAllowPartial(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B00]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 font-outfit">Instant Settlement alerts via WhatsApp</span>
              <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-normal">Dispatches direct alerts to your registered mobile number as soon as a customer settles an invoice.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" checked={settlementAlerts} onChange={(e) => setSettlementAlerts(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B00]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
