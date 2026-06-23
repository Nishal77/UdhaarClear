"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#FAF9F6] border-t border-black/[0.04]">

      {/* 1. REDESIGNED FULL-WIDTH CTA SECTION */}
      <div className="w-full relative overflow-hidden bg-gradient-to-r from-[#012f1a] via-[#097b44] to-[#a3e635] text-white py-20 md:py-24 select-none">

        {/* Fractal SVG Noise Layer */}
        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        <div className="max-w-[1340px] mx-auto px-6 md:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 relative z-10">

          {/* Left Text Column */}
          <div className="flex flex-col items-start gap-4 max-w-3xl text-left">
            <span className="font-mono text-[10.5px] font-extrabold tracking-[0.22em] text-[#CCFC7D] uppercase">
              TAKE CONTROL OF YOUR CASH FLOW
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-[2.85rem] font-bold tracking-tight leading-[1.12] font-outfit text-white">
              The Work Is Done.
              Now Let's Get You Paid.
            </h2>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-row flex-wrap items-center gap-4.5 shrink-0">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-950 px-7 py-4 rounded-full font-bold hover:bg-gray-50 active:scale-95 transition-all duration-200 text-[14.5px] font-sans shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            >
              <span>Start recovering</span>
              <svg className="w-4 h-4 text-gray-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-gray-950 text-white px-7 py-4 rounded-full font-bold hover:bg-zinc-900 active:scale-95 transition-all duration-200 text-[14.5px] font-sans shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-white/5"
            >
              <span>Contact sales</span>
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

        </div>
      </div>

      {/* 2. DIRECTORY COLUMNS SECTION WITH VERTICAL BORDERS */}
      <div className="w-full bg-[#FAF9F6] border-t border-black/[0.04] z-10 relative">
        <div className="max-w-[1340px] mx-auto px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch select-none py-16 md:py-20 lg:py-24 gap-y-12 gap-x-0">

          {/* Column 1: Products */}
          <div className="flex flex-col gap-6 text-left sm:pr-8 sm:border-r border-black/[0.04] pb-8 sm:pb-0">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit">Products</h4>
            <ul className="flex flex-col gap-3.5 text-[14.5px] font-medium text-gray-700 font-outfit">
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Collections Engine</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">WhatsApp Sequences</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Payment Links</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">MSME notices</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Accounting Sync</Link></li>
              <li><Link href="/pricing" className="hover:text-emerald-600 transition-colors duration-200">Pricing</Link></li>
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div className="flex flex-col gap-6 text-left sm:pl-8 sm:pr-8 lg:border-r border-black/[0.04] pt-8 sm:pt-0 border-t sm:border-t-0 border-black/[0.04]">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit">Solutions</h4>
            <ul className="flex flex-col gap-3.5 text-[14.5px] font-medium text-gray-700 font-outfit">
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Manufacturers</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Wholesalers</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Distributors</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Service Providers</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">MSME Samadhaan Guide</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Surat Textile Hub</Link></li>
            </ul>
          </div>

          {/* Column 3: Why UdhaarClear */}
          <div className="flex flex-col gap-6 text-left sm:pr-8 lg:pl-8 lg:border-r border-black/[0.04] pt-8 sm:pt-0 border-t sm:border-t-0 border-black/[0.04]">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit">Why UdhaarClear</h4>
            <ul className="flex flex-col gap-3.5 text-[14.5px] font-medium text-gray-700 font-outfit">
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">About us</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Careers</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Press room</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Security & Trust</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Our methodology</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Brand assets</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col gap-6 text-left sm:pl-8 pt-8 sm:pt-0 border-t sm:border-t-0 border-black/[0.04]">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit">Legal</h4>
            <ul className="flex flex-col gap-3.5 text-[14.5px] font-medium text-gray-700 font-outfit">
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Privacy choices</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Data agreement (DPA)</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors duration-200">Legal notice</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. FOOTER BOTTOM SECTION (SOCIALS, BADGES, WATERMARK LOGO) */}
      <div className="w-full bg-[#FAF9F6] border-t border-black/[0.04] z-10 relative overflow-hidden">
        <div className="max-w-[1340px] mx-auto px-6 md:px-8 relative pt-12 pb-16 flex flex-col md:flex-row items-center justify-between gap-8 z-10">

          {/* Left: Social Media Links */}
          <div className="flex items-center gap-5 z-20">
            {/* LinkedIn */}
            <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors duration-200">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </Link>
            {/* X */}
            <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors duration-200">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            {/* YouTube */}
            <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors duration-200">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </Link>
            {/* Discord */}
            <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors duration-200">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
              </svg>
            </Link>
            {/* Reddit */}
            <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors duration-200">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.29-1.72l1.41-4.52 3.86.83c.03.95.82 1.71 1.79 1.71 1 0 1.81-.81 1.81-1.81s-.81-1.81-1.81-1.81c-.88 0-1.62.63-1.77 1.46L13 2.18c-.18-.04-.37.07-.42.25L11.08 7c-2.49.04-4.74.67-6.4 1.7C4.1 7.94 3.16 7.5 2.19 7.5c-1.65 0-3 1.35-3 3 0 1.21.72 2.24 1.77 2.7-.08.41-.12.82-.12 1.24 0 3.82 4.41 6.94 9.81 6.94s9.81-3.12 9.81-6.94c0-.42-.04-.83-.12-1.24 1.05-.46 1.77-1.49 1.77-2.7zm-18.77 2.22c-.62 0-1.12-.51-1.12-1.13s.5-1.12 1.12-1.12 1.13.5 1.13 1.12-.51 1.13-1.13 1.13zm11.37 3.51c-1.6 1.6-4.63 1.6-6.23 0-.17-.17-.17-.44 0-.61.17-.17.44-.17.61 0 1.27 1.27 3.74 1.27 5.01 0 .17-.17.44-.17.61 0 .17.17.17.44 0 .61zm-.08-4.76c-.62 0-1.12-.51-1.12-1.13s.5-1.12 1.12-1.12 1.13.5 1.13 1.12-.51 1.13-1.13 1.13z" />
              </svg>
            </Link>
          </div>

          {/* Right: Download badges */}
          <div className="flex flex-row flex-wrap items-center gap-4.5 z-20">
            <span className="text-xs font-semibold text-gray-500 font-sans tracking-wide">
              Get UdhaarClear Vibe
            </span>
            {/* App Store Badge */}
            <Link href="#" className="hover:opacity-95 transition-opacity shrink-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on App Store"
                className="h-10 w-auto"
              />
            </Link>
            {/* Google Play Badge */}
            <Link href="#" className="hover:opacity-95 transition-opacity shrink-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Center Bottom Watermark Logo U (anchor bottom, rising up, cut off, solid color on desktop, hidden on mobile) */}
          <div className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-100 hidden md:flex items-end justify-center z-0 overflow-hidden w-full h-[220px]">
            <svg className="w-56 h-56 text-[#0B0D17]/[0.9] dark:text-gray-950" viewBox="0 0 5 5" fill="currentColor">
              {/* Left Column */}
              <rect x="0" y="0" width="1" height="1" />
              <rect x="0" y="1" width="1" height="1" />
              <rect x="0" y="2" width="1" height="1" />
              <rect x="0" y="3" width="1" height="1" />
              {/* Right Column */}
              <rect x="4" y="0" width="1" height="1" />
              <rect x="4" y="1" width="1" height="1" />
              <rect x="4" y="2" width="1" height="1" />
              <rect x="4" y="3" width="1" height="1" />
              {/* Bottom Row */}
              <rect x="0" y="4" width="5" height="1" />
            </svg>
          </div>

        </div>

        {/* Final Copyright & Language Selector row */}
        <div className="border-t border-black/[0.04] py-8 flex flex-row items-center justify-between w-full max-w-[1340px] mx-auto px-6 md:px-8 z-10 relative">
          <div className="text-xs text-gray-400 font-medium font-sans">
            UdhaarClear © 2026
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-black/[0.05] bg-[#F5F3EB]/30 hover:bg-[#F5F3EB]/60 text-gray-500 text-xs font-semibold select-none cursor-pointer tracking-wide font-sans">
            <span>Select language</span>
            <span className="text-gray-900 font-bold ml-1">English</span>
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

    </footer>
  );
}
