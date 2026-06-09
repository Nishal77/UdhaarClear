"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[95%] max-w-[1140px] z-50 flex items-center justify-between pl-6 pr-2 py-2 rounded-2xl bg-white/[0.8] hover:bg-white/[0.9] backdrop-blur-md border border-black/[0.08] hover:border-black/[0.15] shadow-[0_12px_32px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] select-none transition-all duration-300">
      {/* Logo */}
      <Link href="#" className="flex items-center gap-2.5 group">
        <div className="flex items-center justify-center w-7.5 h-7.5 rounded-lg bg-gray-900 shrink-0">
          {/* Yellow/Gold brand glyph matching Zite icon style but representing 'U' */}
          <span className="text-[#FFC72C] font-black text-[15.5px] tracking-tight">U</span>
        </div>
        <span className="text-[17px] font-bold tracking-tight text-gray-950">UdhaarClear</span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-7">
        <div className="relative group cursor-pointer">
          <span className="flex items-center gap-1 text-[13.5px] font-semibold text-gray-700 hover:text-gray-950 transition-colors">
            Product
            <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors translate-y-[0.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </div>

        <Link href="#how-it-works" className="text-[13.5px] font-medium text-gray-700 hover:text-gray-950 transition-colors">
          How it works
        </Link>

        <Link href="#features" className="text-[13.5px] font-medium text-gray-700 hover:text-gray-950 transition-colors">
          Features
        </Link>

        <Link href="#pricing" className="text-[13.5px] font-medium text-gray-700 hover:text-gray-950 transition-colors">
          Pricing
        </Link>

        <Link href="#who-it-helps" className="text-[13.5px] font-medium text-gray-700 hover:text-gray-950 transition-colors">
          For CAs
        </Link>

        <div className="relative group cursor-pointer">
          <span className="flex items-center gap-1 text-[13.5px] font-medium text-gray-700 hover:text-gray-950 transition-colors">
            Resources
            <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors translate-y-[0.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-[13.5px] font-medium text-gray-700 hover:text-gray-950 px-3 py-2 transition-colors">
          Sign in
        </Link>
        <Link
          href="/login"
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
