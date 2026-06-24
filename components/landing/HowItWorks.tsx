"use client";

import React from "react";
import { Check, UploadCloud, MessageSquare, CreditCard, Mail, Gavel, Zap } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, WhatsappIcon, Invoice03Icon, Legal01Icon, Comment01Icon, UserGroup02Icon } from "@hugeicons/core-free-icons";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32 overflow-hidden scroll-mt-24">
      {/* Top full-width horizontal divider with soft gradient fade */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent z-10" />
      
      {/* Bottom full-width horizontal divider with soft gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent z-10" />
      
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
          
          {/* Centered Unpaid Invoice Card and Label */}
          <div className="relative w-full flex flex-col items-center justify-center select-none z-10">
            
            {/* Centered Unpaid Invoice Card */}
            <div className="w-full max-w-[280px] shrink-0 rounded-2xl overflow-hidden">
              <img 
                src="https://i.pinimg.com/736x/7a/f3/1f/7af31fad90bee16c78500049d49707e9.jpg"
                alt="Unpaid Invoice Status"
                className="w-full h-auto block"
              />
            </div>

            {/* Desktop layout: absolutely positioned to the right of the center card */}
            <div className="hidden lg:flex absolute left-[50%] ml-[160px] top-[50%] -translate-y-1/2 items-center gap-4">
              {/* Hand-drawn Arrow pointing right */}
              <svg className="w-16 h-8 text-emerald-500 rotate-[2deg] shrink-0" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12C15 8 35 6 52 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M44 5C46 8 50 10 53 11C50 12 46 14 44 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* Premium Text Box / Callout */}
              <div className="px-5 py-4 max-w-[520px] text-left relative">
                <p className="text-base font-medium text-emerald-950 leading-relaxed font-outfit">
                  Upload Invoice and Details
                </p>
              </div>
            </div>

            {/* Mobile/Tablet layout: stack vertically below */}
            <div className="flex lg:hidden flex-col items-center gap-3 mt-4 w-full">
              {/* Hand-drawn Arrow pointing down */}
              <svg className="w-8 h-12 text-emerald-500 shrink-0" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4C8 12 6 25 11 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M5 28C8 30 10 32 11 35C12 32 14 30 18 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* Premium Text Box / Callout */}
              <div className="px-5 py-4 max-w-[280px] text-center relative w-full">
                <p className="text-sm font-semibold text-emerald-950 leading-relaxed font-outfit">
                  Upload Invoice and Details
                </p>
              </div>
            </div>

          </div>

          {/* Dotted Arrow Down to UdhaarClear Badge */}
          <div className="flex flex-col items-center">
            <svg className="w-6 h-16 text-gray-300" viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0V60" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M8 54L12 60L16 54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* UdhaarClear Brand Mark Engine Box and Callout */}
          <div className="relative w-full flex flex-col items-center justify-center select-none z-10 my-2">
            
            {/* Centered UdhaarClear Brand Mark Engine Box */}
            <div className="relative flex items-center gap-3 bg-[#151515] text-white px-6 py-4 rounded-2xl select-none shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 shrink-0">
                <span className="text-[#FFC72C] font-black text-lg tracking-tight">U</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[15px] font-medium tracking-tight leading-none text-white font-outfit">UdhaarClear</span>
                <span className="text-[9.5px] font-normal text-emerald-400 tracking-tight mt-1">Ai Automation Engine</span>
              </div>
            </div>

            {/* Desktop layout: absolutely positioned to the left of the engine box */}
            <div className="hidden lg:flex absolute right-[50%] mr-[160px] top-[50%] -translate-y-1/2 items-center gap-4">
              {/* Premium Text Box / Callout */}
              <div className="px-5 py-4 max-w-[320px] text-right relative">
                <p className="text-base font-medium text-emerald-950 leading-relaxed font-outfit">
                  We will handle everything. You don&apos;t have to worry about anything.
                </p>
              </div>
              {/* Hand-drawn Arrow pointing right (towards UdhaarClear badge) */}
              <svg className="w-16 h-8 text-emerald-500 rotate-[2deg] shrink-0" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12C15 8 35 6 52 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M44 5C46 8 50 10 53 11C50 12 46 14 44 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Mobile/Tablet layout: stack vertically below */}
            <div className="flex lg:hidden flex-col items-center gap-3 mt-4 w-full">
              {/* Hand-drawn Arrow pointing down */}
              <svg className="w-8 h-12 text-emerald-500 shrink-0" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4C8 12 6 25 11 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M5 28C8 30 10 32 11 35C12 32 14 30 18 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* Premium Text Box / Callout */}
              <div className="px-5 py-4 max-w-[280px] text-center relative w-full">
                <p className="text-sm font-medium text-emerald-950 leading-relaxed font-outfit">
                  We will handle everything. You don&apos;t have to worry about anything.
                </p>
              </div>
            </div>

          </div>

          {/* 5 Premium Branching Curved Connectors (Desktop Only - Height increased to h-28 for clean vertical spacing) */}
          <div className="w-full max-w-[1240px] mx-auto select-none relative z-0 h-28 hidden lg:block">
            <svg className="w-full h-full text-gray-500" viewBox="0 0 1200 112" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="glow-grad" x1="600" y1="0" x2="600" y2="112" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFC72C" />
                  <stop offset="35%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#D1D5DB" />
                </linearGradient>
              </defs>
              
              {/* Primary Source Drop */}
              <path d="M 600 0 L 600 25" stroke="url(#glow-grad)" strokeWidth="2" strokeDasharray="3 3" />
              
              {/* Curved Branch to Card 1 (Email @ 120px) */}
              <path d="M 600 25 C 600 55, 120 40, 120 80 L 120 112" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 116 106 L 120 112 L 124 106" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Curved Branch to Card 2 (WhatsApp @ 360px) */}
              <path d="M 600 25 C 600 55, 360 40, 360 80 L 360 112" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 356 106 L 360 112 L 364 106" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Vertical Branch to Card 3 (SMS @ 600px) */}
              <path d="M 600 25 L 600 112" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 596 106 L 600 112 L 604 106" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Curved Branch to Card 4 (Link @ 840px) */}
              <path d="M 600 25 C 600 55, 840 40, 840 80 L 840 112" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 836 106 L 840 112 L 844 106" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Curved Branch to Card 5 (Legal @ 1080px) */}
              <path d="M 600 25 C 600 55, 1080 40, 1080 80 L 1080 112" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 1076 106 L 1080 112 L 1084 106" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          {/* Mobile/Tablet Vertical Divider Spacing */}
          <div className="w-px h-12 bg-gradient-to-b from-gray-300 via-gray-200 to-transparent block lg:hidden my-6" />

          {/* Full-width premium horizontal line ABOVE the cards */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8" />

          {/* Wrapper for 5 target cards and background crossing lines */}
          <div className="relative w-full max-w-[1240px] mx-auto z-10 px-4 lg:px-0">
            
            {/* Background Crossing Lines behind the cards (Desktop Only) */}
            <div className="absolute inset-0 z-0 pointer-events-none hidden sm:grid grid-cols-5 gap-4 select-none">
              {/* Col 1 */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute top-[40px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent to-gray-200/50" />
                <div className="w-[1px] h-[160px] bg-gradient-to-b from-transparent via-gray-200/50 to-transparent" />
              </div>
              {/* Col 2 */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute top-[40px] left-0 right-0 h-[1px] bg-gray-200/50" />
                <div className="w-[1px] h-[160px] bg-gradient-to-b from-transparent via-gray-200/50 to-transparent" />
              </div>
              {/* Col 3 */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute top-[40px] left-0 right-0 h-[1px] bg-gray-200/50" />
                <div className="w-[1px] h-[160px] bg-gradient-to-b from-transparent via-gray-200/50 to-transparent" />
              </div>
              {/* Col 4 */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute top-[40px] left-0 right-0 h-[1px] bg-gray-200/50" />
                <div className="w-[1px] h-[160px] bg-gradient-to-b from-transparent via-gray-200/50 to-transparent" />
              </div>
              {/* Col 5 */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute top-[40px] left-0 right-0 h-[1px] bg-gradient-to-l from-transparent to-gray-200/50" />
                <div className="w-[1px] h-[160px] bg-gradient-to-b from-transparent via-gray-200/50 to-transparent" />
              </div>
            </div>

            {/* 5 Connected Target Cards Grid - Reduced box sizes for premium spacing and aesthetic */}
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-5 gap-4 w-full relative z-10">

              {/* Card 1: Email */}
              <div className="bg-[#FAF9F6] rounded-2xl px-5 py-4 flex items-center justify-center gap-2.5 min-h-[80px] border border-gray-100">
                <HugeiconsIcon icon={Mail01Icon} className="w-7 h-7 text-[#EA4335] shrink-0" />
                <span className="text-base md:text-lg font-medium text-gray-900 font-outfit">
                  Email
                </span>
              </div>

              {/* Card 2: WhatsApp */}
              <div className="bg-[#FAF9F6] rounded-2xl px-5 py-4 flex items-center justify-center gap-2.5 min-h-[80px] border border-gray-100">
                <HugeiconsIcon icon={WhatsappIcon} className="w-7 h-7 text-[#25D366] shrink-0" />
                <span className="text-base md:text-lg font-medium text-gray-900 font-outfit">
                  WhatsApp
                </span>
              </div>

              {/* Card 3: SMS */}
              <div className="bg-[#FAF9F6] rounded-2xl px-5 py-4 flex items-center justify-center gap-2.5 min-h-[80px] border border-gray-100">
                <HugeiconsIcon icon={Comment01Icon} className="w-7 h-7 text-[#F59E0B] shrink-0" />
                <span className="text-base md:text-lg font-medium text-gray-900 font-outfit">
                  SMS
                </span>
              </div>

              {/* Card 4: Link */}
              <div className="bg-[#FAF9F6] rounded-2xl px-5 py-4 flex items-center justify-center gap-2.5 min-h-[80px] border border-gray-100">
                <HugeiconsIcon icon={Invoice03Icon} className="w-7 h-7 text-[#0047FF] shrink-0" />
                <span className="text-base md:text-lg font-medium text-gray-900 font-outfit">
                  Payment Link
                </span>
              </div>

              {/* Card 5: Legal */}
              <div className="bg-[#FAF9F6] rounded-2xl px-5 py-4 flex items-center justify-center gap-2.5 min-h-[80px] border border-gray-100">
                <HugeiconsIcon icon={Legal01Icon} className="w-7 h-7 text-[#EF4444] shrink-0" />
                <span className="text-base md:text-lg font-medium text-gray-900 font-outfit">
                  Legal
                </span>
              </div>

            </div>
          </div>

          {/* Full-width premium horizontal line BELOW the cards */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8" />

          {/* Convergence of 5 Options to "Customer Pays" (Desktop Only - Height increased to h-20 for vertical breathing room) */}
          <div className="w-full max-w-[1240px] mx-auto select-none relative z-0 h-20 hidden lg:block">
            <svg className="w-full h-full text-gray-500" viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Curve from Email @ 120px to Center 600px */}
              <path d="M 120 0 L 120 15 C 120 45, 600 35, 600 60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Curve from WhatsApp @ 360px to Center 600px */}
              <path d="M 360 0 L 360 15 C 360 45, 600 35, 600 60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Straight drop from SMS @ 600px to Center 600px */}
              <path d="M 600 0 L 600 60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Curve from Link @ 840px to Center 600px */}
              <path d="M 840 0 L 840 15 C 840 45, 600 35, 600 60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Curve from Legal @ 1080px to Center 600px */}
              <path d="M 1080 0 L 1080 15 C 1080 45, 600 35, 600 60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              
              {/* Final segment leading to target */}
              <path d="M 600 60 L 600 80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 596 74 L 600 80 L 604 74" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          {/* Mobile/Tablet Vertical Divider Spacing */}
          <div className="w-px h-12 bg-gradient-to-b from-gray-300 via-gray-200 to-transparent block lg:hidden my-6" />

          {/* Centered Customer Pays and Callout */}
          <div className="relative w-full flex flex-col items-center justify-center select-none z-10">
            
            {/* Centered Customer Pays Card */}
            <div className="bg-[#FAF9F6] rounded-2xl px-5 py-4 flex items-center justify-center gap-2.5 min-h-[80px] w-full max-w-[280px] select-none shrink-0 border border-gray-100">
              <div className="w-7 h-7 flex items-center justify-center text-black shrink-0">
                <HugeiconsIcon icon={UserGroup02Icon} className="w-8 h-8" />
              </div>
              <span className="text-base md:text-lg font-medium text-gray-900 font-outfit whitespace-nowrap">
                Customer Pays
              </span>
            </div>

            {/* Desktop layout: absolutely positioned to the left of the customer pays card */}
            <div className="hidden lg:flex absolute right-[50%] mr-[160px] top-[50%] -translate-y-1/2 items-center gap-4">
              {/* Premium Text Box / Callout */}
              <div className="px-5 py-4 max-w-[400px] text-right relative">
                <p className="text-sm font-medium text-emerald-950 leading-relaxed font-outfit">
                  Customers pay via UPI, Bank Transfer, or NEFT using secure links sent via WhatsApp, SMS, or Email.
                </p>
              </div>
              {/* Hand-drawn Arrow pointing right (towards Customer Pays badge) */}
              <svg className="w-16 h-8 text-emerald-500 rotate-[2deg] shrink-0" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12C15 8 35 6 52 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M44 5C46 8 50 10 53 11C50 12 46 14 44 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Mobile/Tablet layout: stack vertically below */}
            <div className="flex lg:hidden flex-col items-center gap-3 mt-4 w-full">
              {/* Hand-drawn Arrow pointing down */}
              <svg className="w-8 h-12 text-emerald-500 shrink-0" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4C8 12 6 25 11 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M5 28C8 30 10 32 11 35C12 32 14 30 18 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* Premium Text Box / Callout */}
              <div className="px-5 py-4 max-w-[280px] text-center relative w-full">
                <p className="text-sm font-semibold text-emerald-950 leading-relaxed font-outfit">
                  Customers pay via UPI, Bank Transfer, or NEFT using secure links sent via WhatsApp, SMS, or Email.
                </p>
              </div>
            </div>

          </div>

          {/* Dotted Arrow Down to Money In Bank - Height increased to h-24 for spacious vertical breathing room */}
          <div className="flex flex-col items-center">
            <svg className="w-6 h-24 text-gray-300" viewBox="0 0 24 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0V92" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M8 86 L12 92 L16 86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Centered Money In Bank and No-Commission Callout */}
          <div className="relative w-full flex flex-col items-center justify-center select-none z-10">
            
            {/* Centered Money In Bank Card (Image + Text Below) */}
            <div className="flex flex-col items-center gap-3 w-full max-w-[280px] shrink-0">
              <div className="w-full rounded-2xl overflow-hidden select-none">
                <img 
                  src="https://i.pinimg.com/736x/56/77/45/56774530c8af4ed2b2bd5812977dddb4.jpg"
                  alt="Money in Bank Status"
                  className="w-full h-auto block"
                />
              </div>
            </div>

            {/* Desktop layout: absolutely positioned to the right of the center card */}
            <div className="hidden lg:flex absolute left-[50%] ml-[160px] top-[50%] -translate-y-1/2 items-center gap-4">
              {/* Hand-drawn Arrow pointing right */}
              <svg className="w-16 h-8 text-emerald-500 rotate-[2deg] shrink-0" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12C15 8 35 6 52 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M44 5C46 8 50 10 53 11C50 12 46 14 44 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* Premium Text Box / Callout */}
              <div className=" px-5 py-4 max-w-[520px] text-left relative">
                <p className="text-base font-medium text-emerald-950 leading-relaxed font-outfit">
                  Money in Bank. We don&apos;t charge any commission or percentage. 100% of the recovered amount belongs to you.
                </p>
              </div>
            </div>

            {/* Mobile/Tablet layout: stack vertically below */}
            <div className="flex lg:hidden flex-col items-center gap-3 mt-4 w-full">
              {/* Hand-drawn Arrow pointing down */}
              <svg className="w-8 h-12 text-emerald-500 shrink-0" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4C8 12 6 25 11 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M5 28C8 30 10 32 11 35C12 32 14 30 18 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* Premium Text Box / Callout */}
              <div className="px-5 py-4 max-w-[280px] text-center relative w-full">
                <p className="text-sm font-semibold text-emerald-950 leading-relaxed font-outfit">
                  Money in Bank. We don&apos;t charge any commission or percentage. 100% of the recovered amount belongs to you.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
