"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 mt-6 max-w-[1340px] mx-auto transition-all duration-300">
      {/* Logo */}
      <Link href="#" className="flex items-center gap-2 group select-none">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg text-[#0047FF]">
          <svg className="w-7 h-7 transform group-hover:rotate-6 transition-transform duration-300 ease-out" viewBox="0 0 32 32" fill="currentColor">
            {/* Left pill */}
            <rect x="7" y="14" width="5" height="14" rx="2.5" transform="rotate(-35 7 14)" />
            {/* Right pill */}
            <rect x="15" y="9.5" width="5" height="14" rx="2.5" transform="rotate(-35 15 9.5)" />
          </svg>
        </div>
        <span className="text-2xl font-medium tracking-tight text-gray-900">UdhaarClear</span>
      </Link>

      {/* Center Navigation Pill */}
      <div className="hidden md:flex items-center gap-1 bg-gray-200 rounded-full p-1.5">
        <Link
          href="#"
          className="flex items-center px-5 py-2 text-base font-medium text-[#0047FF] bg-[#EEF2FF] rounded-full transition-all duration-200"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0047FF] mr-2 shrink-0" />
          Product
        </Link>
        <Link
          href="#"  
          className="px-5 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200/30 rounded-full transition-all duration-200"
        >
        How it works
        </Link>
        <Link
          href="#"
          className="px-5 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200/30 rounded-full transition-all duration-200"
        >
          Features 
        </Link>
        <Link
          href="#"
          className="px-5 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200/30 rounded-full transition-all duration-200"
        >
          Pricing
        </Link>
        <Link
          href="#"
          className="px-5 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200/30 rounded-full transition-all duration-200"
        >
          For CAs
        </Link>
        <Link
          href="#"
          className="px-5 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200/30 rounded-full transition-all duration-200"
        >
          Resources
        </Link>
        {/* <Link
          href="#"
          className="px-5 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200/30 rounded-full transition-all duration-200"
        >
          Blog
        </Link>
        <Link
          href="#"
          className="px-5 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200/30 rounded-full transition-all duration-200"
        >
          All pages
        </Link> */}
      </div>

      {/* Get Template Button */}
      <div>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-1 px-7 py-3 text-base font-medium text-white bg-[#0140C1] rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all duration-200"
        >
          Login
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Link>
      </div>
    </nav>
  );
}
