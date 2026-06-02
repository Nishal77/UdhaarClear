"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GlobeIcon,
  Building02Icon,
  InvoiceIcon,
  CheckListIcon,
  Settings01Icon,
  Megaphone02Icon,
  Analytics01Icon,
  UserGroupIcon,
  DashboardSquare01Icon
} from "@hugeicons/core-free-icons";

// Premium Blueprint Plus marker (+) for sharp outer corners
const Crosshair = ({ className = "" }: { className?: string }) => (
  <div className={`absolute w-[19px] h-[19px] z-30 pointer-events-none ${className}`}>
    {/* Horizontal line */}
    <div className="absolute top-[9px] left-0 right-0 h-[1px] bg-slate-400/70" />
    {/* Vertical line */}
    <div className="absolute left-[9px] top-0 bottom-0 w-[1px] bg-slate-400/70" />
  </div>
);

export default function WhoItHelps() {
  const categories = [
    {
      title: "Wholesalers & Distributors",
      description: "Recover payments from retailers, dealers, and repeat buyers without calling them again and again.",
      bgClass: "bg-blue-50 text-blue-600 border-blue-100/50",
      icon: GlobeIcon
    },
    {
      title: "Manufacturers & Suppliers",
      description: "Track buyer dues, send reminders on time, and keep cash flow moving across regular orders.",
      bgClass: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
      icon: Building02Icon
    },
    {
      title: "Textile & Garment Businesses",
      description: "Manage credit cycles with dealers, boutiques, retailers, and bulk buyers more professionally.",
      bgClass: "bg-rose-50 text-rose-600 border-rose-100/50",
      icon: InvoiceIcon
    },
    {
      title: "Pharma & Medical Distributors",
      description: "Follow up with pharmacies, clinics, hospitals, and stockists without disturbing business relationships.",
      bgClass: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
      icon: CheckListIcon
    },
    {
      title: "Construction & Hardware Suppliers",
      description: "Recover payments from contractors, builders, vendors, and site owners with clear follow-ups.",
      bgClass: "bg-amber-50 text-amber-600 border-amber-100/50",
      icon: Settings01Icon
    },
    {
      title: "Service Businesses & Agencies",
      description: "Collect pending payments from clients after completing projects, retainers, repairs, or monthly work.",
      bgClass: "bg-teal-50 text-teal-600 border-teal-100/50",
      icon: Megaphone02Icon
    },
    {
      title: "CAs, Accountants & Collection Teams",
      description: "Manage payment follow-ups for clients or internal teams with organized tracking and reports.",
      bgClass: "bg-purple-50 text-purple-600 border-purple-100/50",
      icon: Analytics01Icon
    },
    {
      title: "Traders, Retail B2B & Local Businesses",
      description: "For any business that gives credit, sends invoices, or waits for customers to clear dues.",
      bgClass: "bg-cyan-50 text-cyan-600 border-cyan-100/50",
      icon: UserGroupIcon
    },
    {
      title: "FMCG & Consumer Brands",
      description: "Track and recover outstanding payments from B2B retail shops, supermarkets, and distributors.",
      bgClass: "bg-orange-50 text-orange-600 border-orange-100/50",
      icon: DashboardSquare01Icon
    },
    {
      title: "Logistics, Transport & Freight",
      description: "Manage shipping invoices, freight credit books, and B2B vehicle booking payments seamlessly.",
      bgClass: "bg-violet-50 text-violet-600 border-violet-100/50",
      icon: GlobeIcon
    }
  ];

  return (
    <section 
      id="who-it-helps" 
      className="relative w-full bg-[#EFF4FF] py-20 md:py-28 lg:py-32 rounded-t-[2.5rem] md:rounded-t-[3rem] overflow-hidden border-t border-blue-100/30"
    >
      {/* Decorative background grid and lighting */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at bottom right, rgba(99, 102, 241, 0.08), transparent 700px),
            radial-gradient(circle at top left, rgba(0, 73, 255, 0.05), transparent 700px),
            radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, auto, 24px 24px'
        }}
      />

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 text-center">
        
        {/* Announcement Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-blue-200/60 bg-blue-50/60 text-[#0047FF] text-sm font-medium tracking-tight font-outfit mb-6">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#0047FF]">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Who It Helps
        </div>

        {/* Heading */}
        <h2 className="text-[2.75rem] md:text-[3.25rem] font-medium text-gray-900 tracking-tight leading-[1.15] font-outfit max-w-4xl mx-auto">
          Built for Businesses Where Payments Don’t Always Come on Time.
        </h2>

        {/* Subheading */}
        <p className="text-gray-500 font-medium text-sm md:text-base mt-4 mb-16 max-w-3xl mx-auto leading-relaxed">
          If you sell on credit, raise invoices, or wait for customers to clear dues, UdhaarClear helps you follow up professionally and recover payments without wasting hours on calls.
        </p>

        {/* Outer Grid Border Frame with sharp corners and subtle shadow */}
        <div className="relative border border-gray-200/75 bg-white/60 max-w-[1280px] mx-auto">

          {/* Blueprint Corner Ticks (+ plus crosshairs matching reference image) */}
          <Crosshair className="-top-[9px] -left-[9px]" />
          <Crosshair className="-top-[9px] -right-[9px]" />
          <Crosshair className="-bottom-[9px] -left-[9px]" />
          <Crosshair className="-bottom-[9px] -right-[9px]" />

          {/* Clean 3-Column vertical blueprint grid - Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200/80 items-stretch">
            {categories.slice(0, 3).map((cat, idx) => (
              <div 
                key={idx}
                className="group relative p-6 md:p-8 flex flex-col justify-start text-left min-h-[220px] lg:min-h-[240px] bg-white/40 hover:bg-white/85 transition-all duration-300"
              >
                {/* Soft-tinted square icon badge using Hugeicons */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${cat.bgClass}`}>
                  <HugeiconsIcon icon={cat.icon} size={20} />
                </div>

                {/* Text content */}
                <h4 className="text-lg md:text-[19px] font-bold text-gray-900 font-outfit mt-5 mb-2 leading-tight select-none">
                  {cat.title}
                </h4>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>

          <div className="h-px w-full bg-gray-200/80 hidden lg:block" />

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200/80 items-stretch border-t border-gray-200/80 lg:border-t-0">
            {categories.slice(3, 6).map((cat, idx) => (
              <div 
                key={idx}
                className="group relative p-6 md:p-8 flex flex-col justify-start text-left min-h-[220px] lg:min-h-[240px] bg-white/40 hover:bg-white/85 transition-all duration-300"
              >
                {/* Soft-tinted square icon badge using Hugeicons */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${cat.bgClass}`}>
                  <HugeiconsIcon icon={cat.icon} size={20} />
                </div>

                {/* Text content */}
                <h4 className="text-lg md:text-[19px] font-bold text-gray-900 font-outfit mt-5 mb-2 leading-tight select-none">
                  {cat.title}
                </h4>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>

          <div className="h-px w-full bg-gray-200/80 hidden lg:block" />

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200/80 items-stretch border-t border-gray-200/80 lg:border-t-0">
            {categories.slice(6, 9).map((cat, idx) => (
              <div 
                key={idx}
                className="group relative p-6 md:p-8 flex flex-col justify-start text-left min-h-[220px] lg:min-h-[240px] bg-white/40 hover:bg-white/85 transition-all duration-300"
              >
                {/* Soft-tinted square icon badge using Hugeicons */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${cat.bgClass}`}>
                  <HugeiconsIcon icon={cat.icon} size={20} />
                </div>

                {/* Text content */}
                <h4 className="text-lg md:text-[19px] font-bold text-gray-900 font-outfit mt-5 mb-2 leading-tight select-none">
                  {cat.title}
                </h4>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Centered 10th Card at the very bottom spanning 1/3 desktop grid width */}
          <div className="flex justify-center bg-white/40 border-t border-gray-200/80">
            <div className="group relative w-full lg:w-1/3 p-6 md:p-8 flex flex-col justify-start text-left min-h-[220px] lg:min-h-[240px] hover:bg-white/85 transition-all duration-300 lg:border-l lg:border-r border-gray-200/80">
              {/* Soft-tinted square icon badge using Hugeicons */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${categories[9].bgClass}`}>
                <HugeiconsIcon icon={categories[9].icon} size={20} />
              </div>

              {/* Text content */}
              <h4 className="text-lg md:text-[19px] font-bold text-gray-900 font-outfit mt-5 mb-2 leading-tight select-none">
                {categories[9].title}
              </h4>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium">
                {categories[9].description}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

