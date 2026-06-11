"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { 
  Settings, 
  TrendingUp, 
  Scale, 
  QrCode, 
  LayoutDashboard, 
  Factory, 
  Store, 
  Truck, 
  Briefcase, 
  Calculator,
  Calendar,
  FileText,
  Gavel
} from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[95%] max-w-[1140px] z-50 flex items-center justify-between pl-6 pr-2 py-2 rounded-2xl bg-white/[0.8] hover:bg-white/[0.9] backdrop-blur-md border border-black/[0.08] hover:border-black/[0.15] shadow-[0_12px_32px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] select-none transition-all duration-300">
      
      {/* Logo */}
      <Link href="#" className="flex items-center gap-2.5 group">
        <div className="flex items-center justify-center w-7.5 h-7.5 rounded-lg bg-gray-900 shrink-0">
          <span className="text-[#FFC72C] font-black text-[15.5px] tracking-tight">U</span>
        </div>
        <span className="text-[17px] font-bold tracking-tight text-gray-950">UdhaarClear</span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-7">
        
        {/* Product Dropdown */}
        <div className="relative group py-2">
          <span className="flex items-center gap-1 text-[14.5px] font-medium text-gray-700 hover:text-gray-950 transition-colors cursor-pointer">
            Product
            <HugeiconsIcon 
              icon={ArrowDown01Icon} 
              size={11} 
              className="text-gray-500 group-hover:text-gray-600 transition-transform group-hover:rotate-180 duration-200 translate-y-[0.5px]" 
            />
          </span>

          {/* Premium Dropdown Card */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[380px] bg-white border border-gray-200/60 rounded-[24px] shadow-[0_16px_48px_rgba(0,0,0,0.06)] p-5 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
            <div className="px-3 mb-2">
              <span className="text-[15.5px] font-medium text-gray-500 tracking-tight font-medium">
                Solutions
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              
              <a href="#how-it-works" className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item">
                <div className="w-9 h-9 rounded-xl border border-gray-200/60 bg-white flex items-center justify-center text-gray-700 shrink-0 transition-colors">
                  <Settings className="w-4.5 h-4.5 text-gray-700" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h5 className="text-[13.5px] font-medium text-black group-hover/item:text-black transition-colors leading-tight">Collections Engine</h5>
                  <p className="text-[12.5px] text-gray-500 mt-0.5 leading-tight truncate">Automated WhatsApp, SMS & IVR recovery.</p>
                </div>
              </a>

              <a href="#features" className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item">
                <div className="w-9 h-9 rounded-xl border border-gray-200/60 bg-white flex items-center justify-center text-gray-700 shrink-0 transition-colors">
                  <TrendingUp className="w-4.5 h-4.5 text-gray-700" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h5 className="text-[13.5px] font-medium text-black group-hover/item:text-black transition-colors leading-tight">Smart Escalations</h5>
                  <p className="text-[12.5px] text-gray-500 mt-0.5 leading-tight truncate">Automatic escalations from polite to strict.</p>
                </div>
              </a>

              <a href="#features" className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item">
                <div className="w-9 h-9 rounded-xl border border-gray-200/60 bg-white flex items-center justify-center text-gray-700 shrink-0 transition-colors">
                  <Scale className="w-4.5 h-4.5 text-gray-700" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h5 className="text-[13.5px] font-medium text-black group-hover/item:text-black transition-colors leading-tight">Legal Notice Generator</h5>
                  <p className="text-[12.5px] text-gray-500 mt-0.5 leading-tight truncate">Auto-draft legal notice PDFs instantly.</p>
                </div>
              </a>

              <a href="#features" className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item">
                <div className="w-9 h-9 rounded-xl border border-gray-200/60 bg-white flex items-center justify-center text-gray-700 shrink-0 transition-colors">
                  <QrCode className="w-4.5 h-4.5 text-gray-700" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h5 className="text-[13.5px] font-medium text-black group-hover/item:text-black transition-colors leading-tight">UPI FastPay Links</h5>
                  <p className="text-[12.5px] text-gray-500 mt-0.5 leading-tight truncate">One-click UPI links inside payment alerts.</p>
                </div>
              </a>

              <a href="/dashboard" className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item">
                <div className="w-9 h-9 rounded-xl border border-gray-200/60 bg-white flex items-center justify-center text-gray-700 shrink-0 transition-colors">
                  <LayoutDashboard className="w-4.5 h-4.5 text-gray-700" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h5 className="text-[13.5px] font-medium text-black group-hover/item:text-black transition-colors leading-tight">Recovery Dashboard</h5>
                  <p className="text-[12.5px] text-gray-500 mt-0.5 leading-tight truncate">Real-time recovery tracking & heatmaps.</p>
                </div>
              </a>

            </div>
          </div>
        </div>

        {/* Who It's For Dropdown */}
        <div className="relative group py-2">
          <span className="flex items-center gap-1 text-[15.5px] font-medium text-gray-700 hover:text-gray-950 transition-colors cursor-pointer">
            Who It's For
            <HugeiconsIcon 
              icon={ArrowDown01Icon} 
              size={11} 
              className="text-gray-500 group-hover:text-gray-600 transition-transform group-hover:rotate-180 duration-200 translate-y-[0.5px]" 
            />
          </span>

          {/* Premium Dropdown Card */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[340px] bg-white border border-gray-200/60 rounded-[24px] shadow-[0_16px_48px_rgba(0,0,0,0.06)] p-5 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
            <div className="px-3 mb-2">
              <span className="text-[15.5px] font-medium text-gray-500 font-medium">
                Businesses
              </span>
            </div>

            <div className="flex flex-col gap-1">

              <a href="#who-it-helps" className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item">
                <div className="w-9 h-9 rounded-xl border border-gray-200/60 bg-white flex items-center justify-center text-gray-700 shrink-0 transition-colors">
                  <Factory className="w-4.5 h-4.5 text-gray-700" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h5 className="text-[13px] font-semibold text-gray-900 group-hover/item:text-black transition-colors leading-tight">Manufacturers</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight truncate">Secure raw material supply chain cycles.</p>
                </div>
              </a>

              <a href="#who-it-helps" className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item">
                <div className="w-9 h-9 rounded-xl border border-gray-200/60 bg-white flex items-center justify-center text-gray-700 shrink-0 transition-colors">
                  <Store className="w-4.5 h-4.5 text-gray-700" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h5 className="text-[13px] font-semibold text-gray-900 group-hover/item:text-black transition-colors leading-tight">Wholesalers & Traders</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight truncate">Recover outstanding retail buyer bills.</p>
                </div>
              </a>

              <a href="#who-it-helps" className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item">
                <div className="w-9 h-9 rounded-xl border border-gray-200/60 bg-white flex items-center justify-center text-gray-700 shrink-0 transition-colors">
                  <Truck className="w-4.5 h-4.5 text-gray-700" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h5 className="text-[13px] font-semibold text-gray-900 group-hover/item:text-black transition-colors leading-tight">Distributors</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight truncate">Track dealer ledger cycles and balances.</p>
                </div>
              </a>

              <a href="#who-it-helps" className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item">
                <div className="w-9 h-9 rounded-xl border border-gray-200/60 bg-white flex items-center justify-center text-gray-700 shrink-0 transition-colors">
                  <Briefcase className="w-4.5 h-4.5 text-gray-700" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h5 className="text-[13px] font-semibold text-gray-900 group-hover/item:text-black transition-colors leading-tight">Service Firms</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight truncate">Collect design, agency, and retainer fees.</p>
                </div>
              </a>

              <a href="#who-it-helps" className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item">
                <div className="w-9 h-9 rounded-xl border border-gray-200/60 bg-white flex items-center justify-center text-gray-700 shrink-0 transition-colors">
                  <Calculator className="w-4.5 h-4.5 text-gray-700" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h5 className="text-[13px] font-semibold text-gray-900 group-hover/item:text-black transition-colors leading-tight">CAs & Accountants</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight truncate">Monitor recoveries for all client books.</p>
                </div>
              </a>

            </div>
          </div>
        </div>

        {/* MSME Legal Hub Dropdown */}
        <div className="relative group py-2">
          <span className="flex items-center gap-1 text-[14.5px] font-medium text-gray-700 hover:text-gray-950 transition-colors cursor-pointer">
            MSME Legal Hub
            <HugeiconsIcon 
              icon={ArrowDown01Icon} 
              size={11} 
              className="text-gray-400 group-hover:text-gray-600 transition-transform group-hover:rotate-180 duration-200 translate-y-[0.5px]" 
            />
          </span>

          {/* Premium Dropdown Card */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[360px] bg-white border border-gray-200/60 rounded-[24px] shadow-[0_16px_48px_rgba(0,0,0,0.06)] p-5 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                Compliance
              </span>
            </div>

            <div className="flex flex-col gap-1">

              <a href="#msme-hub" className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item">
                <div className="w-9 h-9 rounded-xl border border-gray-200/60 bg-white flex items-center justify-center text-gray-700 shrink-0 transition-colors">
                  <Calendar className="w-4.5 h-4.5 text-gray-700" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h5 className="text-[13px] font-semibold text-gray-900 group-hover/item:text-black transition-colors leading-tight">45-Day Payment Rule</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight truncate">Section 15 compliance rules & timelines.</p>
                </div>
              </a>

              <a href="#pricing" className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item">
                <div className="w-9 h-9 rounded-xl border border-gray-200/60 bg-white flex items-center justify-center text-gray-700 shrink-0 transition-colors">
                  <Calculator className="w-4.5 h-4.5 text-gray-700" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h5 className="text-[13px] font-semibold text-gray-900 group-hover/item:text-black transition-colors leading-tight">Interest Calculator</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight truncate">Calculate compound interest under Sec 16.</p>
                </div>
              </a>

              <a href="#pricing" className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item">
                <div className="w-9 h-9 rounded-xl border border-gray-200/60 bg-white flex items-center justify-center text-gray-700 shrink-0 transition-colors">
                  <FileText className="w-4.5 h-4.5 text-gray-700" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h5 className="text-[13px] font-semibold text-gray-900 group-hover/item:text-black transition-colors leading-tight">Legal Notice Templates</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight truncate">Court-ready legal notice template drafts.</p>
                </div>
              </a>

              <a href="/msme-samadhaan" className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item">
                <div className="w-9 h-9 rounded-xl border border-gray-200/60 bg-white flex items-center justify-center text-gray-700 shrink-0 transition-colors">
                  <Gavel className="w-4.5 h-4.5 text-gray-700" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h5 className="text-[13px] font-semibold text-gray-900 group-hover/item:text-black transition-colors leading-tight">File at MSME Samadhaan</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight truncate">Auto-prep official delayed payment filings.</p>
                </div>
              </a>

            </div>
          </div>
        </div>

        <Link href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-gray-950 transition-colors">
          How It Works
        </Link>

        <Link href="#pricing" className="text-sm font-medium text-gray-700 hover:text-gray-950 transition-colors">
          Pricing
        </Link>

      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-[13.5px] font-medium text-gray-700 hover:text-gray-950 px-3 py-2 transition-colors">
          Sign in
        </Link>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 text-[12.5px] font-medium text-white bg-[#262624] hover:bg-gray-800 active:scale-95 rounded-full transition-all duration-200 shrink-0"
        >
          <span>Create account</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="translate-y-[0.5px]">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </nav>
  );
}