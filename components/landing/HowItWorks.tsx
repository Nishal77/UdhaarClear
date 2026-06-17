"use client";

import React from "react";
import { Check, UploadCloud, MessageSquare, CreditCard, ShieldCheck, Mail, FileText, Gavel, Zap } from "lucide-react";

export default function HowItWorks() {
  const pills = [
    "MSME Samadhaan",
    "WhatsApp API",
    "Tally Sync",
    "Zoho Books API",
    "Razorpay API",
    "Auto-Reconcile",
    "Smart Escalation",
    "UPI Autopay"
  ];

  return (
    <section id="how-it-works" className="relative w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32 overflow-hidden scroll-mt-24">
      {/* Decorative ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-50/20 blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-emerald-50/20 blur-[80px]" />
      </div>

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 w-full">
        {/* Header Block (Left-Aligned & Proportional Width) */}
        <div className="flex flex-col items-start text-left max-w-5xl mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-blue-200/60 bg-blue-50/40 text-[#0047FF] text-sm font-medium tracking-tight font-outfit mb-6 select-none shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#0047FF]">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            How It Works
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-[3.55rem] font-normal text-gray-950 tracking-tight leading-[1.15] font-outfit">
          What Happens Between An Unpaid Invoice And Money In Your Bank? UdhaarClear Handles Everything In Between.
          </h2>
          {/* Subheading */}
          <p className="text-gray-500 font-normal text-sm md:text-base mt-4 leading-relaxed max-w-xl">
           Upload an invoice once and let UdhaarClear manage reminders, collections, and escalation until payment arrives.
          </p>
        </div>

        {/* The 4 Grid Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-2 text-left">
          
          {/* Card 1: Invoice Upload */}
          <div className="bg-white border border-gray-150/70 rounded-[32px] p-6 shadow-md shadow-gray-150/25 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div>
              <h3 className="text-[20px] font-bold text-gray-900 tracking-tight font-outfit mb-1">
                Invoice Upload
              </h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6 font-medium">
                Sync with accounting systems or upload PDF/Excel invoices in seconds
              </p>
            </div>

            {/* Gradient Green-Blue Visual Card Mockup with Chip & Contactless */}
            <div className="bg-gradient-to-tr from-emerald-300 via-teal-400 to-cyan-400 rounded-3xl h-[240px] relative overflow-hidden flex flex-col justify-end p-6 select-none shadow-inner">
              
              {/* Floating Chip */}
              <div className="absolute top-[35%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-11 h-9 bg-amber-100/90 border border-amber-200 rounded-lg p-1.5 flex flex-col justify-between shadow-inner">
                <div className="flex gap-1">
                  <div className="w-2.5 h-1.5 bg-amber-800/10 rounded-sm" />
                  <div className="w-2.5 h-1.5 bg-amber-800/10 rounded-sm" />
                </div>
                <div className="w-6 h-1 bg-amber-800/15 rounded-sm" />
                <div className="flex gap-1">
                  <div className="w-2.5 h-1.5 bg-amber-800/10 rounded-sm" />
                  <div className="w-2.5 h-1.5 bg-amber-800/10 rounded-sm" />
                </div>
              </div>

              {/* Contactless waves symbol */}
              <svg className="absolute top-[35%] left-[73%] w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12a7 7 0 0 1 7-7" />
                <path d="M5 12a11 11 0 0 1 11-11" />
                <path d="M5 12a3 3 0 0 1 3-3" />
              </svg>

              {/* Upload Cloud overlay inside gradient */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 w-full">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="leading-tight text-white">
                  <span className="text-[10px] font-bold block uppercase tracking-wider">Sync Active</span>
                  <span className="text-[9px] font-medium opacity-80 block">PDF / Excel / Accounting</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Automated Reminders */}
          <div className="bg-white border border-gray-150/70 rounded-[32px] p-6 shadow-md shadow-gray-150/25 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div>
              <h3 className="text-[20px] font-bold text-gray-900 tracking-tight font-outfit mb-1">
                Automated Reminders
              </h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6 font-medium">
                Polite follow-ups sent automatically via WhatsApp, SMS, and Email
              </p>
            </div>

            {/* Gradient Pink-Orange Background with Payment form overlay */}
            <div className="bg-gradient-to-tr from-[#FF6E7F] via-[#FF8095] to-[#BFE9FF] rounded-3xl h-[240px] relative overflow-hidden flex items-center justify-center shadow-inner">
              
              {/* Payment Checkout Mockup Form */}
              <div className="relative z-10 bg-white border border-gray-150/80 rounded-2xl p-4 shadow-xl w-[88%] flex flex-col gap-2 select-none">
                <div className="flex justify-between items-center pb-1 border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <span>RECOVERY SEQUENCE</span>
                  <span className="text-emerald-500 flex items-center gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE
                  </span>
                </div>

                <div className="flex justify-between items-baseline my-0.5">
                  <span className="text-base font-extrabold text-gray-950 font-outfit">₹78,500</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">#INV-9824</span>
                </div>

                {/* Subtitle / channel info */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[9px] font-bold text-gray-600">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                    WhatsApp
                  </span>
                  <span>SENDING IN 1d</span>
                </div>

                {/* Confirm Action Button */}
                <button className="w-full bg-zinc-950 text-white font-bold text-[9.5px] py-2 rounded-xl text-center shadow-sm select-none mt-1 cursor-pointer">
                  Activate Follow-up
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: One-Click Pay */}
          <div className="bg-white border border-gray-150/70 rounded-[32px] p-6 shadow-md shadow-gray-150/25 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div>
              <h3 className="text-[20px] font-bold text-gray-900 tracking-tight font-outfit mb-1">
                One-Click Pay
              </h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6 font-medium">
                Direct UPI & bank settlement links embedded in every reminder
              </p>
            </div>

            {/* Orange-Yellow Gradient background with Approval card and card chip details */}
            <div className="bg-gradient-to-tr from-amber-400 via-orange-400 to-[#FFF3B0] rounded-3xl h-[240px] relative overflow-hidden p-4 select-none flex flex-col justify-between shadow-inner">
              
              {/* Overlapping Credit Approval Mockup Card */}
              <div className="relative z-10 bg-white border border-gray-150/80 rounded-2xl p-4 shadow-xl w-[92%] mx-auto flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                  </div>
                  <div className="leading-tight text-left">
                    <span className="text-[10px] font-bold text-gray-900 block leading-none">Invoice Settled!</span>
                    <span className="text-[7.5px] text-gray-400 font-bold block mt-0.5">Cleared via UPI</span>
                  </div>
                </div>

                {/* Substats */}
                <div className="grid grid-cols-3 gap-1 divide-x divide-gray-100 text-left">
                  <div className="pl-1">
                    <span className="text-[7.5px] text-gray-400 font-bold block">RECOVERED</span>
                    <span className="text-[10px] font-bold text-gray-950 block">₹78,500</span>
                  </div>
                  <div className="pl-1.5">
                    <span className="text-[7.5px] text-gray-400 font-bold block">RATE</span>
                    <span className="text-[10px] font-bold text-emerald-600 block">100%</span>
                  </div>
                  <div className="pl-1.5">
                    <span className="text-[7.5px] text-gray-400 font-bold block">TALLY SYNC</span>
                    <span className="text-[10px] font-bold text-[#0047FF] block">Active</span>
                  </div>
                </div>
              </div>

              {/* Bottom Orange Card overlay element */}
              <div className="relative w-full flex justify-end pr-2 pb-1 opacity-90">
                <div className="w-14 h-9 bg-white/20 border border-white/20 rounded-lg p-1.5 flex flex-col justify-between">
                  <div className="flex gap-0.5">
                    <div className="w-2 h-1 bg-white/40 rounded-sm" />
                    <div className="w-2 h-1 bg-white/40 rounded-sm" />
                  </div>
                  <div className="w-5 h-0.5 bg-white/40 rounded-sm" />
                  <div className="flex gap-0.5">
                    <div className="w-2 h-1 bg-white/40 rounded-sm" />
                    <div className="w-2 h-1 bg-white/40 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Legal Escalation */}
          <div className="bg-white border border-gray-150/70 rounded-[32px] p-6 shadow-md shadow-gray-150/25 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div>
              <h3 className="text-[20px] font-bold text-gray-900 tracking-tight font-outfit mb-1">
                Legal Escalation
              </h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6 font-medium">
                Auto-drafted MSME notice and professional legal follow-ups when needed
              </p>
            </div>

            {/* Gradient Cyan-Emerald Card stack listing Rails */}
            <div className="bg-gradient-to-tr from-emerald-300 via-teal-300 to-cyan-300 rounded-3xl h-[240px] relative overflow-hidden p-4 select-none flex flex-col justify-between shadow-inner">
              
              {/* Floating Rails List Mockup */}
              <div className="w-full space-y-2 relative z-10">
                
                {/* Rail Item 1 */}
                <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 flex items-center justify-between text-[9.5px] font-bold text-gray-800 shadow-sm w-full">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>UPI Pay-links</span>
                  </div>
                  <span className="text-gray-400 text-[8px] tracking-wider font-extrabold uppercase">Fast</span>
                </div>

                {/* Rail Item 2 */}
                <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 flex items-center justify-between text-[9.5px] font-bold text-gray-800 shadow-sm w-full">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                    <span>WhatsApp Follow-up</span>
                  </div>
                  <span className="text-emerald-500 text-[8px] tracking-wider font-extrabold uppercase">Direct</span>
                </div>

                {/* Rail Item 3 */}
                <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 flex items-center justify-between text-[9.5px] font-bold text-gray-800 shadow-sm w-full">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Email Reminder</span>
                  </div>
                  <span className="text-gray-400 text-[8px] tracking-wider font-extrabold uppercase">Draft</span>
                </div>

                {/* Rail Item 4 */}
                <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 flex items-center justify-between text-[9.5px] font-bold text-gray-800 shadow-sm w-full">
                  <div className="flex items-center gap-1.5">
                    <Gavel className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>MSME notice draft</span>
                  </div>
                  <span className="text-rose-500 text-[8px] tracking-wider font-extrabold uppercase">Legal</span>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Tree Connection Line Diagram (Desktop Only) */}
        <div className="w-full max-w-[1340px] mx-auto select-none mt-2 relative z-0">
          <svg className="w-full h-16 text-gray-200/90 hidden lg:block" viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 4 Vertical inputs matching Card Centers (150, 450, 750, 1050) */}
            <path d="M 150 0 L 150 25 M 450 0 L 450 25 M 750 0 L 750 25 M 1050 0 L 1050 25" stroke="currentColor" strokeWidth="1.2" />
            {/* Horizontal Bridge Line */}
            <path d="M 150 25 L 1050 25" stroke="currentColor" strokeWidth="1.2" />
            {/* 8 downward branching paths matching Pill Centers (75, 225, 375, 525, 675, 825, 975, 1125) */}
            <path d="M 75 25 L 75 60 
                     M 225 25 L 225 60 
                     M 375 25 L 375 60 
                     M 525 25 L 525 60 
                     M 675 25 L 675 60 
                     M 825 25 L 825 60 
                     M 975 25 L 975 60 
                     M 1125 25 L 1125 60" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Core Engine Pills (Bottom row) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 max-w-[1340px] mx-auto mt-4 px-4 select-none relative z-10">
          {pills.map((pill, idx) => (
            <div 
              key={idx} 
              className="bg-gray-50 border border-gray-200/60 text-gray-800 text-[12px] font-semibold font-outfit py-2.5 px-2 rounded-2xl text-center shadow-[0_2px_6px_rgba(0,0,0,0.01)] hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shrink-0"
            >
              {pill}
            </div>
          ))}
        </div>

        {/* Symmetrical Convergence Line Diagram (Desktop Only) */}
        <div className="w-full max-w-[1340px] mx-auto select-none relative z-0">
          <svg className="w-full h-20 text-gray-200/90 hidden lg:block" viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 8 curved lines converging to center (600, 75) */}
            <path d="M 75 0 C 75 40, 600 30, 600 75" stroke="currentColor" strokeWidth="1.2" />
            <path d="M 225 0 C 225 40, 600 30, 600 75" stroke="currentColor" strokeWidth="1.2" />
            <path d="M 375 0 C 375 40, 600 30, 600 75" stroke="currentColor" strokeWidth="1.2" />
            <path d="M 525 0 C 525 40, 600 30, 600 75" stroke="currentColor" strokeWidth="1.2" />
            <path d="M 675 0 C 675 40, 600 30, 600 75" stroke="currentColor" strokeWidth="1.2" />
            <path d="M 825 0 C 825 40, 600 30, 600 75" stroke="currentColor" strokeWidth="1.2" />
            <path d="M 975 0 C 975 40, 600 30, 600 75" stroke="currentColor" strokeWidth="1.2" />
            <path d="M 1125 0 C 1125 40, 600 30, 600 75" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Central Brand Mark Circle Icon */}
        <div className="flex justify-center items-center -mt-1.5 relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-lime-300 via-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-white/40 select-none animate-pulse">
            <svg className="w-7 h-7 text-zinc-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5 L12 19 M8 9 L16 15 M8 15 L16 9" />
              <circle cx="12" cy="5" r="2" fill="currentColor" />
              <circle cx="12" cy="19" r="2" fill="currentColor" />
              <circle cx="8" cy="9" r="1.5" fill="currentColor" />
              <circle cx="16" cy="15" r="1.5" fill="currentColor" />
              <circle cx="8" cy="15" r="1.5" fill="currentColor" />
              <circle cx="16" cy="9" r="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Bottom Heading and Subheading */}
        <div className="mt-8 text-center max-w-2xl mx-auto">
          <h3 className="text-3xl md:text-[2.25rem] font-semibold text-gray-950 tracking-tight font-outfit mb-3">
            Built on a Unified Platform
          </h3>
          <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
            Most recovery systems are fragmented. UdhaarClear was built as one unified engine.
          </p>
        </div>

      </div>
    </section>
  );
}
