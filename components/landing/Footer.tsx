"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-white">
      
      {/* 1. CALL TO ACTION (CTA) SECTION */}
      <div className="relative w-full bg-gradient-to-b from-[#EFF4FF] via-[#EFF4FF]/80 to-white py-24 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden px-6">
        
        {/* Hand-Drawn "Off-Register" Golden Sun Illustration (top-left) */}
        <div className="absolute left-[8%] md:left-[15%] top-[15%] md:top-[20%] w-14 h-14 select-none pointer-events-none z-10 animate-pulse" style={{ animationDuration: '4s' }}>
          {/* Yellow solid sun circle */}
          <div className="absolute inset-1.5 bg-[#FBBF24] rounded-full" />
          {/* Misaligned hand-drawn stroke circle */}
          <svg className="absolute inset-0 w-full h-full text-gray-900 rotate-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M 24,4 C 35,4 44,13 44,24 C 44,35 35,44 24,44 C 13,44 4,35 4,24 C 4,13 13,4 24,4 Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>

        {/* Hand-Drawn Clouds Illustrations - Layered Bottom Left */}
        <div className="absolute bottom-0 left-0 w-[45%] md:w-[30%] lg:w-[25%] opacity-40 md:opacity-75 pointer-events-none select-none z-0">
          <svg className="w-full h-auto text-blue-200" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Primary cloud stroke and white semi-transparent fill */}
            <path 
              d="M 20,130 Q 10,105 25,85 Q 15,65 40,55 Q 55,20 95,30 Q 125,5 155,25 Q 185,15 205,45 Q 235,55 225,85 Q 245,105 225,130 Z" 
              fill="white" 
              fillOpacity="0.65" 
              stroke="currentColor" 
              strokeWidth="1.75" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Soft sketchy interior details */}
            <path d="M 45,90 Q 60,95 75,90" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 110,55 Q 130,65 150,55" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 175,75 Q 190,80 205,75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Hand-Drawn Clouds Illustrations - Layered Bottom Right */}
        <div className="absolute bottom-0 right-0 w-[45%] md:w-[30%] lg:w-[25%] opacity-40 md:opacity-75 pointer-events-none select-none z-0 scale-x-[-1]">
          <svg className="w-full h-auto text-blue-200" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M 20,130 Q 10,105 25,85 Q 15,65 40,55 Q 55,20 95,30 Q 125,5 155,25 Q 185,15 205,45 Q 235,55 225,85 Q 245,105 225,130 Z" 
              fill="white" 
              fillOpacity="0.65" 
              stroke="currentColor" 
              strokeWidth="1.75" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <path d="M 45,90 Q 60,95 75,90" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 110,55 Q 130,65 150,55" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 175,75 Q 190,80 205,75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>


        {/* CTA Content Container */}
        <div className="relative max-w-3xl mx-auto z-10 flex flex-col items-center">
          
          {/* Announcement Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-blue-200/60 bg-blue-50/60 text-[#0047FF] text-xs font-semibold tracking-wide uppercase font-outfit mb-6 select-none">
            Get Started Today
          </div>

          {/* Main Heading */}
          <h2 className="text-[2.75rem] md:text-[4rem] font-medium text-gray-900 tracking-tight leading-[1.1] font-outfit max-w-2xl text-center">
            Stop chasing. <br />
            <span className="text-[#0047FF]">Start collecting.</span>
          </h2>
          
          {/* Subheading */}
          <p className="text-gray-500 font-medium text-sm md:text-base mt-5 mb-10 max-w-xl mx-auto leading-relaxed">
            Join 2,400+ businesses that have already recovered over ₹120 crore. Your first reminder goes out in 60 seconds.
          </p>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#0047FF] rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 transition-all duration-200"
            >
              Start Free — 14 Days
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 hover:text-gray-950 transition-colors duration-200"
            >
              Schedule a Demo →
            </Link>
          </div>

          {/* Inline Value Props Note */}
          <p className="text-gray-400 text-xs md:text-sm font-medium mt-6 tracking-wide select-none">
            Setup in 10 minutes &middot; No credit card &middot; Cancel anytime &middot; First reminder in 60 seconds
          </p>

        </div>


      </div>

      {/* 2. FOOTER DIRECTORY SECTION */}
      <div className="bg-white border-t border-gray-100 py-16 md:py-24 px-6 md:px-8">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start text-left">
          
          {/* Logo & Description Column (Spans 5 on large) */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 pr-0 lg:pr-8">
            {/* Logo */}
            <Link href="#" className="flex items-center gap-2 group select-none self-start">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg text-[#0047FF]">
                <svg className="w-7 h-7 transform group-hover:rotate-6 transition-transform duration-300 ease-out" viewBox="0 0 32 32" fill="currentColor">
                  <rect x="7" y="14" width="5" height="14" rx="2.5" transform="rotate(-35 7 14)" />
                  <rect x="15" y="9.5" width="5" height="14" rx="2.5" transform="rotate(-35 15 9.5)" />
                </svg>
              </div>
              <span className="text-2xl font-medium tracking-tight text-gray-900 font-outfit">UdhaarClear</span>
            </Link>

            {/* Description Text */}
            <p className="text-gray-500 text-sm md:text-[15px] leading-relaxed max-w-sm font-medium">
              UdhaarClear, for a professional and seamless way of recovering B2B outstanding payments.
            </p>

            {/* Social Icons Badge Rows */}
            <div className="flex items-center gap-4 mt-2">
              {/* Facebook Icon */}
              <Link 
                href="#" 
                className="w-8 h-8 rounded-full border border-gray-200/60 bg-gray-50/50 hover:bg-gray-100/60 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.9 0-4 1.55-4 3.5V8z" />
                </svg>
              </Link>
              {/* Twitter/X Icon */}
              <Link 
                href="#" 
                className="w-8 h-8 rounded-full border border-gray-200/60 bg-gray-50/50 hover:bg-gray-100/60 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              {/* YouTube Icon */}
              <Link 
                href="#" 
                className="w-8 h-8 rounded-full border border-gray-200/60 bg-gray-50/50 hover:bg-gray-100/60 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.553a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.868.553 9.388.553 9.388.553s7.52 0 9.388-.553a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Structured Directory Links Columns (Spans 7 on large) */}
          <div className="col-span-1 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            
            {/* PRODUCT COLUMN */}
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider select-none font-outfit">
                Product
              </span>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="#features" className="text-[15px] font-medium text-gray-600 hover:text-[#0047FF] transition-colors duration-200">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#who-it-helps" className="text-[15px] font-medium text-gray-600 hover:text-[#0047FF] transition-colors duration-200">
                    Who it Helps
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-[15px] font-medium text-gray-600 hover:text-[#0047FF] transition-colors duration-200">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-[#0047FF] transition-colors duration-200">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-[#0047FF] transition-colors duration-200">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            {/* RESOURCES COLUMN */}
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider select-none font-outfit">
                Resources
              </span>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-[#0047FF] transition-colors duration-200">
                    Downloads
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-[#0047FF] transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-[#0047FF] transition-colors duration-200">
                    Recovery Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-[#0047FF] transition-colors duration-200">
                    WhatsApp Templates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-[#0047FF] transition-colors duration-200">
                    Payment Status
                  </Link>
                </li>
              </ul>
            </div>

            {/* COMPANY COLUMN */}
            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider select-none font-outfit">
                Company
              </span>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-[#0047FF] transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-[#0047FF] transition-colors duration-200">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-[#0047FF] transition-colors duration-200">
                    Todoist
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-[#0047FF] transition-colors duration-200">
                    We are hiring!
                  </Link>
                  <span className="inline-block bg-[#0047FF]/10 text-[#0047FF] text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider select-none">
                    New
                  </span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* 3. LEGAL BAR & LANGUAGE SELECTOR Bottom Row */}
      <div className="bg-[#FAFAFA] border-t border-gray-100 py-8 px-6 md:px-8">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Legal Links & Copyright */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-xs md:text-sm font-medium text-gray-500">
            <Link href="#" className="hover:text-gray-800 transition-colors">
              Security
            </Link>
            <span className="text-gray-200 hidden sm:inline">|</span>
            <Link href="#" className="hover:text-gray-800 transition-colors">
              Privacy
            </Link>
            <span className="text-gray-200 hidden sm:inline">|</span>
            <Link href="#" className="hover:text-gray-800 transition-colors">
              Terms
            </Link>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <span className="text-gray-400 select-none">
              &copy; {new Date().getFullYear()} UdhaarClear Inc.
            </span>
          </div>

          {/* Language Selector Dropdown Menus */}
          <div className="relative select-none shrink-0">
            <select 
              defaultValue="en" 
              className="appearance-none bg-white border border-gray-200 text-gray-600 hover:text-gray-900 font-medium text-xs rounded-lg py-2 pl-3 pr-8 shadow-sm cursor-pointer focus:outline-none focus:border-blue-500 transition-all duration-200"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
            {/* Custom chevron dropdown icon overlay */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}
