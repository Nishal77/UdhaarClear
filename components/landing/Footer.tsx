"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#212124]">

      {/* 1. CALL TO ACTION (CTA) SECTION */}
      <div className="w-full bg-[#FFFFFF] pb-8 px-4 md:px-8">

        {/* Premium CTA container card with beautiful landscape background image */}
        <div className="relative w-full max-w-[1280px] mx-auto rounded-t-3xl overflow-hidden py-20 md:py-28 flex flex-col items-center justify-center text-center px-6 bg-white">
          
          {/* Subtle top border highlight glow */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#4F46E5]/15 to-transparent pointer-events-none" />

          {/* Background Image with CSS Gradient Masking */}
          <img
            src="/images/footer.jpeg"
            alt="Footer landscape background"
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            style={{
              maskImage: "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0) 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0) 100%)"
            }}
            draggable={false}
          />

          {/* CTA Content Container */}
          <div className="relative max-w-3xl mx-auto z-10 flex flex-col items-center">

            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-indigo-100 bg-indigo-50/80 text-indigo-700 text-xs font-semibold tracking-wide uppercase font-outfit mb-6 select-none">
              Ready to stop chasing?
            </div>

            {/* Main Heading */}
            <h2 className="text-[2.75rem] md:text-[4rem] font-medium text-gray-900 tracking-tight leading-[1.1] font-outfit max-w-2xl text-center">
              Stop being a free lender
              to your own buyers. <br />

            </h2>

            {/* Subheading */}
            <p className="text-gray-800 font-medium text-sm md:text-base mt-5 mb-10 max-w-xl mx-auto leading-relaxed">
              Every day an invoice goes unpaid, you're handing someone an interest free loan. Under the MSME Act, they owe you, legally. We just make sure they know it.
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-[#262626] rounded-full hover:bg-[#393939] transition-all duration-200"
              >
                <span>Recover what’s yours</span>
                <HugeiconsIcon icon={ArrowRight02Icon} size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Inline Value Props Note */}
            <p className="text-gray-900 text-xs md:text-sm font-semibold mt-6 tracking-wide select-none">
            Join 500+ manufacturers, traders and distributors who stopped chasing.
            </p>

          </div>

        </div>

      </div>

      {/* 2. REDESIGNED DIRECTORY SECTION */}
      <div className="bg-[#FFFFFF] border-t border-slate-100 pt-20 pb-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-[1280px] mx-auto">

          {/* Top Row: Logo & Link Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8 pb-16 items-start">

            {/* Left Column: Logo, Tagline, Contact & Copyright */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <Link href="#" className="flex items-center gap-2 group select-none self-start">
                <span className="text-3xl font-bold tracking-tight text-slate-900 font-outfit lowercase transition-colors duration-200 hover:text-[#4F46E5]">
                  udhaarclear
                </span>
              </Link>
              {/* Newsletter Subscription Box */}
              <div className="flex flex-col gap-3 max-w-sm mt-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-outfit">
                  Get recovery playbooks in your inbox
                </p>
                <form 
                  onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}
                  className="relative flex items-center bg-slate-50 border border-slate-200 rounded-full p-1 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-500 transition-all duration-300"
                >
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    required 
                    className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none w-full font-outfit font-medium"
                  />
                  <button 
                    type="submit"
                    className="inline-flex items-center justify-center bg-slate-900 hover:bg-[#4F46E5] active:scale-95 text-white font-semibold text-xs px-4 py-2 rounded-full transition-all duration-200 cursor-pointer select-none"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Right Columns: Links (spans 8 on md) */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">

              {/* Column 1: Product */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-slate-900 tracking-wider uppercase font-outfit">Product</h4>
                <ul className="flex flex-col gap-3 text-sm text-slate-500 font-medium font-outfit">
                  <li>
                    <Link href="/collections-engine" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      Collections Engine
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal-notice" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      Legal Notice Generator
                    </Link>
                  </li>
                  <li>
                    <Link href="/escalations" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      Smart Escalations
                    </Link>
                  </li>
                  <li>
                    <Link href="/upi-pay" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      UPI FastPay Links
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      Recovery Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/sync" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      Tally & Zoho Sync
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: Who It's For */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-slate-900 tracking-wider uppercase font-outfit">Who It's For</h4>
                <ul className="flex flex-col gap-3 text-sm text-slate-500 font-medium font-outfit">
                  <li>
                    <Link href="/manufacturers" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      Manufacturers
                    </Link>
                  </li>
                  <li>
                    <Link href="/wholesalers" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      Wholesalers
                    </Link>
                  </li>
                  <li>
                    <Link href="/distributors" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      Distributors
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      Service Businesses
                    </Link>
                  </li>
                  <li>
                    <Link href="/msme" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      MSME Hub
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Company */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-slate-900 tracking-wider uppercase font-outfit">Company</h4>
                <ul className="flex flex-col gap-3 text-sm text-slate-500 font-medium font-outfit">
                  <li>
                    <Link href="/about" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-[#4F46E5] hover:translate-x-1 transition-all duration-200 inline-block">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Bottom Row: Disclaimer and Back to Top button */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-6">
            
            {/* Disclaimer */}
            <p className="text-xs text-slate-400 font-medium font-outfit order-2 sm:order-1 text-center sm:text-left">
              Disclaimer: UdhaarClear is a technology platform, not a legal advisory. Collection actions are managed under standard commercial credit protection frameworks.
            </p>

            {/* Back to top button */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-full py-2.5 px-5 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer border border-slate-200/50 order-1 sm:order-2 shrink-0"
            >
              <span className="font-semibold text-xs tracking-tight font-outfit">Back to top</span>
              <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0 group-hover:-translate-y-0.5 transition-transform duration-200">
                <svg className="w-2.5 h-2.5 stroke-current" fill="none" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </div>
            </button>

          </div>

        </div>
      </div>

    </footer>
  );
}
