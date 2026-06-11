"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-white">
      
      {/* 1. CALL TO ACTION (CTA) SECTION */}
      <div className="relative w-full bg-[#212124] py-24 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden px-6 rounded-t-4xl">
        
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

      {/* 2. REDESIGNED DIRECTORY & MAILBOX FOOTER SECTION */}
      <div className="bg-white border-t border-gray-100 pt-20 pb-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-[1240px] mx-auto">
          
          {/* Top Row: Logo & Link Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8 pb-16 items-start">
            
            {/* Left Column: Logo & Tagline (spans 6 on md) */}
            <div className="md:col-span-6 flex flex-col gap-3">
              <Link href="#" className="flex items-center gap-2 group select-none self-start">
                <span className="text-3xl font-semibold tracking-tight text-gray-900 font-outfit lowercase">
                  udhaarclear
                </span>
              </Link>
              <p className="text-gray-400 text-sm md:text-base font-medium max-w-xs font-outfit">
                Automated payment recovery for Indian businesses.
              </p>
            </div>

            {/* Right Columns: Links (spans 6 on md) */}
            <div className="md:col-span-6 grid grid-cols-3 gap-6 text-left">
              
              {/* Column 1: Product / Process */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-gray-900 font-outfit">Product</h4>
                <ul className="flex flex-col gap-3 text-xs md:text-sm text-gray-500 font-medium">
                  <li>
                    <Link href="#how-it-works" className="hover:text-gray-900 transition-colors duration-200">
                      Process
                    </Link>
                  </li>
                  <li>
                    <Link href="#features" className="hover:text-gray-900 transition-colors duration-200">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link href="#who-it-helps" className="hover:text-gray-900 transition-colors duration-200">
                      Showcase
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="hover:text-gray-900 transition-colors duration-200">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: Connect */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-gray-900 font-outfit">Connect</h4>
                <ul className="flex flex-col gap-3 text-xs md:text-sm text-gray-500 font-medium">
                  <li>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors duration-200">
                      X
                    </a>
                  </li>
                  <li>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors duration-200">
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors duration-200">
                      YouTube
                    </a>
                  </li>
                  <li>
                    <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors duration-200">
                      Dribbble
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3: Legal */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-gray-900 font-outfit">Legal</h4>
                <ul className="flex flex-col gap-3 text-xs md:text-sm text-gray-500 font-medium">
                  <li>
                    <Link href="/terms" className="hover:text-gray-900 transition-colors duration-200">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-gray-900 transition-colors duration-200">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="hover:text-gray-900 transition-colors duration-200">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Bottom Row: Back to Top, Mailbox, and Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 gap-x-8 items-end pt-12 border-t border-gray-100">
            
            {/* Bottom-Left: Back to top button */}
            <div className="md:col-span-4 flex items-center justify-start">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-3 bg-gray-900 hover:bg-black text-white rounded-full py-3 px-6 shadow-md transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
              >
                <span className="font-semibold text-sm tracking-tight font-outfit">Back to top</span>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black shrink-0 group-hover:-translate-y-0.5 transition-transform duration-200">
                  <svg className="w-3 h-3 stroke-current" fill="none" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                </div>
              </button>
            </div>

            {/* Bottom-Middle: Newsletter/Mailbox Box */}
            <div className="md:col-span-5 flex flex-col gap-4 items-start w-full max-w-md">
              <div className="text-left font-outfit">
                <span className="block text-2xl font-bold text-gray-900 leading-tight">UdhaarClear</span>
                <span className="block text-2xl font-medium text-gray-400 leading-tight">in your mailbox</span>
              </div>
              <form 
                onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} 
                className="w-full flex items-center bg-gray-50 border border-gray-200/80 rounded-full p-1.5 focus-within:ring-2 focus-within:ring-gray-900/10 focus-within:border-gray-900 transition-all duration-300"
              >
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  required
                  className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none w-full font-outfit font-medium"
                />
                <button 
                  type="submit"
                  className="w-10 h-10 rounded-full bg-gray-900 hover:bg-black text-white flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>
            </div>

            {/* Bottom-Right: Contact Email & Copyright details */}
            <div className="md:col-span-3 flex flex-col items-start md:items-end text-left md:text-right gap-3 font-outfit">
              <a href="mailto:hello@udhaarclear.in" className="text-base font-bold text-gray-900 hover:underline">
                hello@udhaarclear.in
              </a>
              <div className="flex flex-col gap-0.5 text-xs text-gray-400 font-medium">
                <span>UdhaarClear</span>
                <span>2026 &copy; All rights reserved</span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </footer>
  );
}
