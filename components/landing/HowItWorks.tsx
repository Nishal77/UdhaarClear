"use client";

import React from "react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32 overflow-hidden ">
      {/* Decorative background grid and lights */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at bottom right, rgba(0, 73, 255, 0.04), transparent 500px),
            radial-gradient(circle at top left, rgba(99, 102, 241, 0.03), transparent 500px)
          `
        }}
      />

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 text-center">
        {/* Heading */}
        <h2 className="text-[2.75rem] md:text-[3.25rem] font-medium text-gray-900 tracking-tight leading-[1.15] font-outfit max-w-4xl mx-auto">
          Add the Invoice. We Follow Up. You Track the Payment.
        </h2>
        <p className="text-gray-500 font-medium text-sm md:text-base mt-4 mb-16 max-w-2xl mx-auto">
          UdhaarClear turns every pending invoice into a simple recovery flow — reminders go out, payment links are shared, and every status stays clear in one dashboard.
        </p>

        {/* Dashboard Grid Frame */}
        <div className="relative border border-gray-200/70 bg-white max-w-[1280px] mx-auto overflow-hidden">

          {/* Blueprint Divider Ticks - Desktop Only */}
          <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-[1.2px] w-3.5 h-[2.5px] bg-blue-600 z-20 hidden lg:block" />
          <div className="absolute bottom-0 left-1/4 -translate-x-1/2 translate-y-[1.2px] w-3.5 h-[2.5px] bg-blue-600 z-20 hidden lg:block" />

          <div className="absolute top-0 left-2/4 -translate-x-1/2 -translate-y-[1.2px] w-3.5 h-[2.5px] bg-blue-600 z-20 hidden lg:block" />
          <div className="absolute bottom-0 left-2/4 -translate-x-1/2 translate-y-[1.2px] w-3.5 h-[2.5px] bg-blue-600 z-20 hidden lg:block" />

          <div className="absolute top-0 left-3/4 -translate-x-1/2 -translate-y-[1.2px] w-3.5 h-[2.5px] bg-blue-600 z-20 hidden lg:block" />
          <div className="absolute bottom-0 left-3/4 -translate-x-1/2 translate-y-[1.2px] w-3.5 h-[2.5px] bg-blue-600 z-20 hidden lg:block" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x lg:divide-x divide-gray-200/60 items-stretch">

            {/* Step 1 Column */}
            <div className="p-6 md:p-8 flex flex-col justify-between min-h-[460px]">
              {/* Visual Element */}
              <div className="relative w-full h-[220px] flex flex-col items-center justify-center gap-6">
                {/* Rounded Web address bar */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-full px-5 py-2 flex items-center gap-2.5 shadow-sm text-gray-700 select-none animate-pulse">
                  <span className="text-[11px] font-mono tracking-tight text-blue-900">www.webaccessibility.com</span>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                </div>

                {/* Input Box Card */}
                <div className="relative bg-white border border-gray-150 rounded-2xl p-2.5 flex items-center justify-between shadow-lg shadow-gray-100/50 w-[90%] max-w-[280px] z-10">
                  <span className="text-xs text-gray-400 font-medium ml-2 select-none">Enter product link</span>
                  <button className="bg-blue-600 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-blue-700 active:scale-95 transition-all duration-150 border-none cursor-pointer">
                    Upload
                  </button>
                </div>

                {/* Pointer and 'You' Badge Overlay */}
                <div className="absolute bottom-6 right-6 z-20 flex flex-col items-center select-none pointer-events-none">
                  {/* SVG Cursor Pointer pointing to Upload button */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-blue-600 drop-shadow-md transform rotate-[25deg] -translate-x-1.5 translate-y-1">
                    <path d="M4.5 3V17.5L9.2 12.8L15 21L18 19L12.3 11L17.5 9.2L4.5 3Z" fill="currentColor" />
                  </svg>
                  {/* You Badge */}
                  <div className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-500/40 mt-1">
                    You
                  </div>
                </div>
              </div>

              {/* Text Section */}
              <div className="text-left mt-6">
                <div className="inline-flex items-center  text-blue-600 text-[14px] font-bold tracking-tight font-outfit mb-1 select-none">
                  Step 1
                </div>
                <h4 className="text-xl font-semibold text-gray-900 font-outfit mb-2">You Add the Invoice</h4>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium">
                  Add customer details, invoice amount, and due date in one simple flow.
                </p>
              </div>
            </div>

            {/* Step 2 Column */}
            <div className="p-6 md:p-8 flex flex-col justify-between min-h-[460px]">
              {/* Visual Element */}
              <div className="relative w-full h-[220px] flex items-center justify-center">
                {/* Glow behind the card */}
                <div className="absolute w-40 h-40 bg-blue-500/10 rounded-full blur-2xl z-0" />

                {/* Perceivable Agent Card */}
                <div className="relative z-10 bg-white border border-gray-100/80 rounded-3xl p-5 shadow-xl w-[90%] max-w-[240px] border-b-[5px] border-b-blue-600/10 flex flex-col gap-3.5">
                  <div className="text-xs font-bold text-gray-900 tracking-tight font-outfit select-none">
                    Perceivable Agent
                  </div>

                  {/* Check Rows */}
                  <div className="flex flex-col gap-3">
                    {/* Row 1: Contrast (Completed) */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-gray-800 font-outfit">Contrast</span>
                      <span className="w-4.5 h-4.5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    </div>

                    {/* Row 2: Images & Alt (Completed) */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-gray-800 font-outfit">Images & Alt</span>
                      <span className="w-4.5 h-4.5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    </div>

                    {/* Row 3: Media & Audio (Scanning) */}
                    <div className="flex items-center justify-between opacity-80">
                      <span className="text-[11px] font-medium text-gray-400 font-outfit">Media & Audio</span>
                      <span className="w-4 h-4 rounded-full border border-blue-600 border-t-transparent animate-spin shrink-0" />
                    </div>

                    {/* Row 4: Layout & Reflow (Scanning) */}
                    <div className="flex items-center justify-between opacity-60">
                      <span className="text-[11px] font-medium text-gray-400 font-outfit">Layout & Reflow</span>
                      <span className="w-4 h-4 rounded-full border border-blue-600/60 border-t-transparent animate-spin shrink-0" />
                    </div>

                    {/* Row 5: Color/Sensory (Scanning) */}
                    <div className="flex items-center justify-between opacity-40">
                      <span className="text-[11px] font-medium text-gray-400 font-outfit">Color/Sensory</span>
                      <span className="w-4 h-4 rounded-full border border-blue-600/40 border-t-transparent animate-spin shrink-0" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Section */}
              <div className="text-left mt-6">
                <div className="inline-flex items-center text-blue-600 text-[14px] font-bold tracking-tight font-outfit mb-1 select-none">
                  Step 2
                </div>
                <h4 className="text-xl font-semibold text-gray-900 font-outfit mb-2">We Send the Reminder</h4>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium">
                  Send a professional WhatsApp reminder with a clear payment link.
                </p>
              </div>
            </div>

            {/* Step 3 Column */}
            <div className="p-6 md:p-8 flex flex-col justify-between min-h-[460px]">
              {/* Visual Element */}
              <div className="relative w-full h-[220px] flex flex-col justify-center items-start px-4 gap-3 relative overflow-hidden">
                {/* Pill 1: Red Issue */}
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5 shadow-sm transform -rotate-[1deg] hover:scale-105 transition-transform duration-200 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Body text 3.2:1 on #FAFAFA</span>
                </div>

                {/* Pill 2: Green Suggestion */}
                <div className="bg-emerald-50/40 border border-emerald-200 text-emerald-700 px-3.5 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5 shadow-sm self-end transform rotate-[1.5deg] hover:scale-105 transition-transform duration-200 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Suggest <span className="font-bold text-emerald-800">#1F1F1F</span> or <span className="font-bold">+weight</span></span>
                </div>

                {/* Pill 3: Amber Issue */}
                <div className="bg-amber-50/50 border border-amber-200 text-amber-700 px-3.5 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5 shadow-sm transform -rotate-[1.5deg] hover:scale-105 transition-transform duration-200 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Media is not showing in About us</span>
                </div>

                {/* Pill 4: Green Score (Large) */}
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-700 px-4 py-2 rounded-full text-[10.5px] font-bold flex items-center gap-1.5 shadow-md shadow-emerald-50/60 self-end transform rotate-[0.5deg] hover:scale-105 transition-transform duration-200 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Overall accessibility score is <span className="text-emerald-800 font-extrabold">98%</span></span>
                </div>
              </div>

              {/* Text Section */}
              <div className="text-left mt-6">
                <div className="inline-flex items-center  text-blue-600 text-[14px] font-bold tracking-tight font-outfit mb-1 select-none">
                  Step 3
                </div>
                <h4 className="text-xl font-semibold text-gray-900 font-outfit mb-2">Customer Pays Easily</h4>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium">
                  Payment is completed through a clear and secure link.
                </p>
              </div>
            </div>

            {/* Step 4 Column */}
            <div className="p-6 md:p-8 flex flex-col justify-between min-h-[460px]">
              {/* Visual Element */}
              <div className="relative w-full h-[220px] flex items-center justify-center bg-[#FAFAFA]/50 rounded-2xl border border-gray-100/50 shadow-inner overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* Invoice Settled Payout Card */}
                <div className="relative z-10 bg-white border border-gray-150 rounded-2xl p-4 shadow-xl w-[90%] max-w-[210px] flex flex-col items-center justify-center text-center gap-2.5 hover:scale-105 transition-all duration-300">
                  {/* Success Circle check */}
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-gray-900 leading-tight">Invoice Settled</h5>
                    <p className="text-[9px] text-gray-400 font-semibold mt-1">INV-456789 marked as PAID</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-250 text-[8px] font-bold tracking-tight select-none">
                    Auto Reconciled
                  </span>
                </div>
              </div>

              {/* Text Section */}
              <div className="text-left mt-6">
                <div className="inline-flex items-center  text-blue-600 text-[14px] font-bold tracking-tight font-outfit mb-1 select-none">
                  Step 4
                </div>
                <h4 className="text-xl font-semibold text-gray-900 font-outfit mb-2">You Track Everything</h4>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium">
                  See pending, paid, delayed, and followed-up invoices clearly.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
