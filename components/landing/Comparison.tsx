"use client";

import React from "react";
import { X, Check } from "lucide-react";

export default function Comparison() {
  const udhaarclearPoints = [
    "8-Second Invoice Upload",
    "Automated WhatsApp & SMS Reminders",
    "One-Click UPI & Netbanking Pay-links",
    "Automated MSME Legal Escalation",
    "Instantly Recovered & Reconciled Funds"
  ];

  const traditionalPoints = [
    "Awkward & Manual Phone Calls",
    "Ignored Manual Emails & Letters",
    "Complex Manual Payment Checkouts",
    "Slow & Expensive Legal Actions",
    "Excel Sheet Tracking & Constant Hoping"
  ];

  return (
    <section id="comparison" className="relative w-full bg-white py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      </div>

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-blue-200/60 bg-blue-50/40 text-[#0047FF] text-sm font-medium tracking-tight font-outfit mb-6 select-none shadow-sm">
          Traditional vs UdhaarClear
        </div>

        {/* Heading */}
        <h2 className="text-[2.75rem] md:text-[3.25rem] font-normal text-gray-950 tracking-tight leading-[1.15] font-outfit max-w-4xl mx-auto mb-16">
          Stop Chasing Payments Manually.
        </h2>

        {/* Outer Flex Container for Cards */}
        <div className="max-w-[1040px] mx-auto flex flex-col md:flex-row gap-8 items-stretch text-left">
          
          {/* Traditional Column Card */}
          <div className="flex-1 bg-[#F5F3EB] rounded-[32px] p-8 md:p-10 flex flex-col gap-8 select-none">
            {/* Header */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center text-gray-500 shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <span className="text-[18px] font-bold tracking-tight text-gray-900 font-outfit">Traditional Method</span>
            </div>

            {/* Checkpoints */}
            <div className="flex flex-col gap-5">
              {traditionalPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 stroke-[3.5]" />
                  </div>
                  <span className="text-gray-500 text-[15px] md:text-[16px] font-normal leading-tight font-sans">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* UdhaarClear Column (Highlighted Card) */}
          <div className="flex-1 bg-zinc-950 rounded-[32px] p-8 md:p-10 flex flex-col gap-8 shadow-[0_24px_60px_rgba(16,185,129,0.06)] relative overflow-hidden select-none border border-zinc-900">
            {/* Ambient inner Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Brand Header */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0">
                <span className="text-[#FFC72C] font-black text-[15px] tracking-tight">U</span>
              </div>
              <span className="text-[18px] font-bold tracking-tight text-white font-outfit">UdhaarClear</span>
            </div>

            {/* Checkpoints */}
            <div className="flex flex-col gap-5">
              {udhaarclearPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                  </div>
                  <span className="text-gray-300 text-[15px] md:text-[16px] font-normal leading-tight font-sans">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
