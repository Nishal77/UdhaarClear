"use client";

import React from "react";
import { Check, UploadCloud, MessageSquare, CreditCard, Mail, Gavel, Zap } from "lucide-react";

export default function HowItWorks() {
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
          <div className="bg-[#F5F3EB] rounded-[32px] p-6 flex flex-col justify-between">
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
          <div className="bg-[#F5F3EB] rounded-[32px] p-6 flex flex-col justify-between">
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
          <div className="bg-[#F5F3EB] rounded-[32px] p-6 flex flex-col justify-between">
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
          <div className="bg-[#F5F3EB] rounded-[32px] p-6 flex flex-col justify-between">
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

        {/* Dynamic Branching Flowchart (Replaces Old Pills & Tree Diagram) */}
        {/* Reduced top spacing gap to mt-10 */}
        <div className="mt-10 flex flex-col items-center w-full relative">
          
          {/* Centered Unpaid Invoice Card */}
          <div className="relative z-10 w-full max-w-[280px] bg-[#F5F3EB] rounded-[32px] p-6 select-none">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-outfit">
                Invoice Status
              </span>
              <span className="text-[9px] font-bold text-gray-400 bg-white/60 px-2 py-0.5 rounded-md">
                #INV-48000
              </span>
            </div>
            
            <div className="mb-4">
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block mb-1">
                Unpaid Invoice
              </span>
              <div className="text-4xl font-extrabold text-gray-950 font-outfit tracking-tight leading-none">
                ₹48,000
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Overdue
              </span>
              <span className="text-[10px] font-medium text-gray-450">
                Action Required
              </span>
            </div>
          </div>

          {/* Dotted Arrow Down to UdhaarClear Badge */}
          <div className="flex flex-col items-center">
            <svg className="w-6 h-16 text-gray-300" viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0V60" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M8 54L12 60L16 54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* UdhaarClear Brand Mark Engine Box */}
          <div className="relative z-10 flex flex-col items-center -mt-1">
            {/* Soft Ambient Glow */}
            <div className="absolute inset-0 bg-[#FFC72C]/10 rounded-2xl blur-xl filter pointer-events-none scale-150" />
            
            <div className="relative flex items-center gap-3 bg-zinc-950 text-white px-6 py-4 rounded-2xl select-none">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 shrink-0">
                <span className="text-[#FFC72C] font-black text-lg tracking-tight">U</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[15px] font-bold tracking-tight leading-none text-white font-outfit">UdhaarClear</span>
                <span className="text-[9.5px] font-semibold text-emerald-400 tracking-wider uppercase mt-1">Smart Engine</span>
              </div>
            </div>
          </div>

          {/* 4 Premium Branching Curved Connectors (Desktop Only) */}
          <div className="w-full max-w-[1240px] mx-auto select-none relative z-0 h-20 hidden lg:block">
            <svg className="w-full h-full text-gray-300" viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="glow-grad" x1="600" y1="0" x2="600" y2="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFC72C" />
                  <stop offset="30%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#D1D5DB" />
                </linearGradient>
              </defs>
              
              {/* Primary Source Drop */}
              <path d="M 600 0 L 600 20" stroke="url(#glow-grad)" strokeWidth="2" strokeDasharray="3 3" />
              
              {/* Curved Branch to Card 1 (Email @ 150px) */}
              <path d="M 600 20 C 600 45, 150 25, 150 55 L 150 80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 146 74 L 150 80 L 154 74" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Curved Branch to Card 2 (WhatsApp @ 450px) */}
              <path d="M 600 20 C 600 45, 450 25, 450 55 L 450 80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 446 74 L 450 80 L 454 74" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Curved Branch to Card 3 (Link @ 750px) */}
              <path d="M 600 20 C 600 45, 750 25, 750 55 L 750 80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 746 74 L 750 80 L 754 74" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Curved Branch to Card 4 (Legal @ 1050px) */}
              <path d="M 600 20 C 600 45, 1050 25, 1050 55 L 1050 80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 1046 74 L 1050 80 L 1054 74" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          {/* Mobile/Tablet Vertical Divider Spacing */}
          <div className="w-px h-12 bg-gradient-to-b from-gray-300 via-gray-200 to-transparent block lg:hidden my-6" />

          {/* 4 Connected Target Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[1240px] mx-auto select-none mt-2 relative z-10 px-4 lg:px-0">
            
            {/* Card 1: Email */}
            <div className="bg-[#F5F3EB] rounded-[32px] px-6 py-6 flex items-center justify-center gap-3.5 min-h-[100px]">
              <svg className="w-10 h-10 text-[#EA4335] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span className="text-xl md:text-2xl font-bold text-gray-900 font-outfit">
                Email
              </span>
            </div>

            {/* Card 2: WhatsApp */}
            <div className="bg-[#F5F3EB] rounded-[32px] px-6 py-6 flex items-center justify-center gap-3.5 min-h-[100px]">
              <svg className="w-10 h-10 text-[#25D366] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.437 0 9.862-4.409 9.866-9.83.002-2.628-1.02-5.1-2.878-6.964-1.859-1.863-4.33-2.887-6.953-2.889-5.441 0-9.87 4.411-9.874 9.83-.001 1.764.469 3.486 1.36 5.048L1.763 22.25l6.084-1.596z"/>
              </svg>
              <span className="text-xl md:text-2xl font-bold text-gray-900 font-outfit">
                WhatsApp
              </span>
            </div>

            {/* Card 3: Link */}
            <div className="bg-[#F5F3EB] rounded-[32px] px-6 py-6 flex items-center justify-center gap-3.5 min-h-[100px]">
              <svg className="w-10 h-10 text-[#0047FF] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span className="text-xl md:text-2xl font-bold text-gray-900 font-outfit">
                Link
              </span>
            </div>

            {/* Card 4: Legal */}
            <div className="bg-[#F5F3EB] rounded-[32px] px-6 py-6 flex items-center justify-center gap-3.5 min-h-[100px]">
              <svg className="w-10 h-10 text-[#EF4444] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 17.5L3 6" />
                <path d="M13 3.5a2.5 2.5 0 0 1 5 0V6a2.5 2.5 0 0 1-5 0V3.5z" />
                <path d="M19 12.5a2.5 2.5 0 0 1 5 0V15a2.5 2.5 0 0 1-5 0v-2.5z" />
                <path d="M2.5 17.5h15" />
                <path d="M8.5 21.5h3" />
              </svg>
              <span className="text-xl md:text-2xl font-bold text-gray-900 font-outfit">
                Legal
              </span>
            </div>

          </div>

          {/* Convergence of 4 Options to "Customer Pays" (Desktop Only) */}
          <div className="w-full max-w-[1240px] mx-auto select-none relative z-0 h-16 hidden lg:block">
            <svg className="w-full h-full text-gray-300" viewBox="0 0 1200 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Curve from Email @ 150px to Center 600px */}
              <path d="M 150 0 L 150 15 C 150 40, 600 25, 600 50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Curve from WhatsApp @ 450px to Center 600px */}
              <path d="M 450 0 L 450 15 C 450 40, 600 25, 600 50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Curve from Link @ 750px to Center 600px */}
              <path d="M 750 0 L 750 15 C 750 40, 600 25, 600 50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Curve from Legal @ 1050px to Center 600px */}
              <path d="M 1050 0 L 1050 15 C 1050 40, 600 25, 600 50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Final segment leading to target */}
              <path d="M 600 50 L 600 64" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 596 58 L 600 64 L 604 58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          {/* Mobile/Tablet Vertical Divider Spacing */}
          <div className="w-px h-12 bg-gradient-to-b from-gray-300 via-gray-200 to-transparent block lg:hidden my-6" />

          {/* Centered Customer Pays Card */}
          <div className="bg-[#F5F3EB] rounded-[32px] px-8 py-6 flex items-center justify-center gap-3.5 min-h-[100px] w-full max-w-[280px] select-none z-10 relative">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
              <svg className="w-6 h-6 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-900 font-outfit whitespace-nowrap">
              Customer Pays
            </span>
          </div>

          {/* Dotted Arrow Down to Money In Bank */}
          <div className="flex flex-col items-center">
            <svg className="w-6 h-16 text-gray-300" viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0V60" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M8 54L12 60L16 54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Centered Money In Bank Card */}
          <div className="bg-[#F5F3EB] rounded-[32px] px-8 py-6 flex items-center justify-center gap-3.5 min-h-[100px] w-full max-w-[280px] select-none z-10 relative">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-900 font-outfit whitespace-nowrap">
              Money In Bank
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
