"use client";

import Link from "next/link";

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
          <span className="flex items-center gap-1 text-[13.5px] font-semibold text-gray-700 hover:text-gray-950 transition-colors cursor-pointer">
            Product
            <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors translate-y-[0.5px] group-hover:rotate-180 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>

          {/* Premium Dropdown Card */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[380px] bg-white border border-gray-100 rounded-2xl shadow-xl p-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
            <div className="flex flex-col gap-2">
              
              <a href="#how-we-recover" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0047FF] shrink-0 shadow-sm border border-blue-100/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-[12.5px] font-bold text-gray-900">Collections Engine</h5>
                  <p className="text-[10.5px] text-gray-500 mt-0.5 leading-normal">Automated WhatsApp, SMS & IVR recovery tracks.</p>
                </div>
              </a>

              <a href="#features" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 shadow-sm border border-amber-100/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-[12.5px] font-bold text-gray-900">Smart Escalations</h5>
                  <p className="text-[10.5px] text-gray-500 mt-0.5 leading-normal">Seamless transition from polite alerts to draft legal notices.</p>
                </div>
              </a>

              <a href="#integrations" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0 shadow-sm border border-green-100/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-[12.5px] font-bold text-gray-900">UPI FastPay</h5>
                  <p className="text-[10.5px] text-gray-500 mt-0.5 leading-normal">Embedded one-click UPI links in every payment alert.</p>
                </div>
              </a>

            </div>
          </div>
        </div>

        <Link href="#how-it-works" className="text-[13.5px] font-medium text-gray-700 hover:text-gray-950 transition-colors">
          How it works
        </Link>

        <Link href="#integrations" className="text-[13.5px] font-medium text-gray-700 hover:text-gray-950 transition-colors">
          Tally & Zoho Sync
        </Link>

        {/* MSME & Legal Hub Dropdown */}
        <div className="relative group py-2">
          <span className="flex items-center gap-1 text-[13.5px] font-semibold text-gray-700 hover:text-gray-950 transition-colors cursor-pointer">
            MSME Hub
            <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors translate-y-[0.5px] group-hover:rotate-180 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>

          {/* Premium Dropdown Card */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[380px] bg-white border border-gray-100 rounded-2xl shadow-xl p-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
            <div className="flex flex-col gap-2">
              
              <a href="#" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 shadow-sm border border-orange-100/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-[12.5px] font-bold text-gray-900">MSME Dues Calculator</h5>
                  <p className="text-[10.5px] text-gray-500 mt-0.5 leading-normal">Calculate legally compound interest owed under Section 16 of the MSME Act.</p>
                </div>
              </a>

              <a href="#" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm border border-indigo-100/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-[12.5px] font-bold text-gray-900">CA & Accountant Portal</h5>
                  <p className="text-[10.5px] text-gray-500 mt-0.5 leading-normal">Export court-ready interest certificates and delayed ledger reports.</p>
                </div>
              </a>

            </div>
          </div>
        </div>

        <Link href="#pricing" className="text-[13.5px] font-medium text-gray-700 hover:text-gray-950 transition-colors">
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