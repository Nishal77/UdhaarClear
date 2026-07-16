"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { faqs } from "@/lib/seo";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32">
      {/* Decorative subtle background accents */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at bottom left, rgba(0, 71, 255, 0.03), transparent 500px),
            radial-gradient(circle at top right, rgba(99, 102, 241, 0.03), transparent 500px)
          `
        }}
      />

      {/* Main Container with max assigned width */}
      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10">
        
        {/* Main Grid: Left Side info and Right Side Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Heading & Help Card */}
          <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-28">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-medium tracking-tight font-outfit text-slate-900 leading-tight">
                Frequently Asked <br className="hidden md:inline" /> Questions!
              </h2>
            </div>
          </div>

          {/* Right Column: FAQ List Container */}
          <div className="lg:col-span-7 bg-slate-50/50 border border-slate-100 rounded-3xl p-6 md:p-8">
            <div className="divide-y divide-slate-100">
              {faqs.map((faq, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <div key={idx} className="first:pt-0 pt-2 pb-2 last:pb-0">
                    <button
                      onClick={() => toggleFAQ(idx)}
                      className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
                    >
                      <span className="text-base md:text-lg font-medium text-black pr-6 font-outfit">
                        <span className="text-gray-600 mr-2.5 font-medium">{idx + 1}.</span>
                        {faq.question}
                      </span>
                      
                      {/* Premium Custom Horizontal Lines (Equal-to-Close Icon) */}
                      <div className="relative w-5 h-5 flex flex-col justify-center items-center shrink-0">
                        <span className={`w-4 h-[2px] bg-slate-800 rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[1px]' : '-translate-y-[2px]'}`} />
                        <span className={`w-4 h-[2px] bg-slate-800 rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[1px]' : 'translate-y-[2px]'}`} />
                      </div>
                    </button>
                    
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? "max-h-[500px] opacity-100 pb-6" : "max-h-0 opacity-0 pointer-events-none"
                      }`}
                    >
                      <p className="text-sm md:text-base text-black/70 leading-relaxed font-outfit pl-7">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
