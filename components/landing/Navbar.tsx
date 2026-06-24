"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBannerClosed, setIsBannerClosed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bannerHeight = 36; // Height of banner in pixels
  const translateStyle = !isBannerClosed && isScrolled
    ? { transform: `translateY(-${bannerHeight}px)` }
    : { transform: "translateY(0)" };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-out"
      style={translateStyle}
    >
      {/* Banner */}
      {!isBannerClosed && (
        <div 
          className="bg-gradient-to-r from-[#CCFC7D] to-[#0D8A4F] text-black px-4 py-1.5 text-xs md:text-sm font-medium flex items-center justify-between relative overflow-hidden select-none border-b border-white/5"
          style={{ height: `${bannerHeight}px` }}
        >
          <div className="flex-1 flex items-center justify-center gap-2">
            <span className="inline-flex items-center justify-center bg-[#082107]/20 text-[#082107] text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border border-[#E2FF38]/20 shrink-0">
              New
            </span>
            <span className="text-black truncate max-w-[calc(100vw-120px)] md:max-w-none">
              Introducing UdhaarClear Automations — recover payments 3x faster with AI-powered WhatsApp sequences.
            </span>
            <Link href="#features" className="text-black hover:text-[#E2FF38] underline font-medium ml-1 transition-colors whitespace-nowrap shrink-0">
              Learn more
            </Link>
          </div>
        </div>
      )}

      {/* Navbar Container */}
      <nav className="w-full bg-white/95 backdrop-blur-md select-none transition-colors duration-200">
        <div className="max-w-[1340px] mx-auto w-full px-6 md:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-7.5 h-7.5 rounded-lg bg-gray-900 shrink-0">
                <span className="text-[#FFC72C] font-black text-[15.5px] tracking-tight">U</span>
              </div>
              <span className="text-[17px] font-medium tracking-tight text-gray-950">UdhaarClear</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-7">
              <Link href="/#how-it-works" className="text-[14.5px] font-medium text-gray-700 hover:text-gray-950 transition-colors">
                How It Works
              </Link>
              <Link href="/pricing" className="text-[14.5px] font-medium text-gray-700 hover:text-gray-950 transition-colors">
                Pricing
              </Link>
              <Link href="/msme-samadhaan" className="text-[14.5px] font-medium text-gray-700 hover:text-gray-950 transition-colors">
                MSME Guide
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4.5">
            <Link href="/login" className="text-[13.5px] font-medium text-gray-700 hover:text-gray-950 px-1 py-2 transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bg-[#B5F670] inline-flex items-center justify-center px-5.5 py-2.5 text-[13.5px] font-medium text-black rounded-2xl shrink-0 select-none"
            >
             Create account
            </Link>
          </div>

        </div>
      </nav>
    </header>
  );
}