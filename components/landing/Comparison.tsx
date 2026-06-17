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
    <section id="comparison" className="relative w-full bg-[#030303] py-20 md:py-28 lg:py-32 overflow-hidden rounded-t-[40px] md:rounded-t-[60px] border-t border-white/5">
      {/* Decorative ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      </div>

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-white/10 bg-white/5 text-gray-400 text-sm font-medium tracking-tight font-outfit mb-6 select-none shadow-sm">
          Traditional vs UdhaarClear
        </div>

        {/* Heading */}
        <h2 className="text-[2.75rem] md:text-[3.25rem] font-medium text-white tracking-tight leading-[1.15] font-outfit max-w-4xl mx-auto mb-16">
          Stop Chasing Payments Manually.
        </h2>

        {/* Outer Border Box Container */}
        <div className="max-w-[1040px] mx-auto border border-white/10 rounded-[28px] p-4 md:p-6 bg-zinc-950/40 backdrop-blur-xl flex flex-col md:flex-row gap-6 items-stretch text-left">
          
          {/* Traditional Column */}
          <div className="flex-1 p-6 md:p-8 flex flex-col gap-8 justify-center">
            {/* Header */}
            <div className="flex items-center gap-2.5">
              <div className="w-7.5 h-7.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <span className="text-[17px] font-semibold tracking-tight text-gray-300 font-outfit">Traditional Method</span>
            </div>

            {/* Checkpoints */}
            <div className="flex flex-col gap-5">
              {traditionalPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3.5">
                  <div className="w-5.5 h-5.5 rounded-full border border-red-500/25 bg-red-950/10 flex items-center justify-center text-red-500/80 shrink-0">
                    <X className="w-3.5 h-3.5 stroke-[3.5]" />
                  </div>
                  <span className="text-gray-400 text-[14.5px] md:text-[15.5px] font-normal leading-tight font-sans">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* UdhaarClear Column (Highlighted Card) */}
          <div className="flex-1 bg-black border border-emerald-500/35 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(16,185,129,0.08)] flex flex-col gap-8 transition-all duration-300 hover:border-emerald-500/50">
            {/* Brand Header */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-7.5 h-7.5 rounded-lg bg-gray-900 border border-emerald-500/30 shrink-0">
                <span className="text-[#FFC72C] font-black text-[14.5px] tracking-tight">U</span>
              </div>
              <span className="text-[17px] font-semibold tracking-tight text-white font-outfit">UdhaarClear</span>
            </div>

            {/* Checkpoints */}
            <div className="flex flex-col gap-5">
              {udhaarclearPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3.5">
                  <div className="w-5.5 h-5.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                  </div>
                  <span className="text-white text-[14.5px] md:text-[15.5px] font-normal leading-tight font-sans">
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
