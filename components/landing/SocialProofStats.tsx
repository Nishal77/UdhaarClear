"use client";

import React from "react";

export default function SocialProofStats() {
  const checklist = [
    "\"I'll pay tomorrow\"",
    "Forgot who owes what",
    "Notebook entries everywhere",
    "WhatsApp messages lost",
    "Constant follow-up calls",
    "Cash flow uncertainty"
  ];

  return (
    <section className="relative w-full overflow-hidden bg-white py-16 md:py-24 select-none">
      {/* Top full-width horizontal divider with soft gradient fade */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent z-10" />
      
      {/* Bottom full-width horizontal divider with soft gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent z-10" />
      
      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 w-full flex flex-col space-y-10">
        
        {/* Header - Left Aligned at the top */}
        <div className="w-full text-left">
          <h2 className="text-4xl md:text-5xl lg:text-[3.55rem] font-semibold tracking-tight leading-[1.15] font-outfit text-gray-950">
            Too Much Udhaar. <br />
            Too Much Confusion.
          </h2>
        </div>

        {/* Content split below the header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column - Questions & Checkboxes */}
          <div className="lg:col-span-5 flex flex-col text-left space-y-6">
            
            {/* Subtitle Question */}
            <p className="text-gray-950 font-bold text-lg md:text-xl font-outfit">
              Do any of these sound familiar?
            </p>

            {/* Custom Checkbox List */}
            <ul className="space-y-5">
              {checklist.map((item, index) => (
                <li key={index} className="flex items-center gap-3.5">
                  {/* Square Box Mock */}
                  <div className="w-5 h-5 rounded-[6px] border-2 border-slate-200 bg-white flex items-center justify-center shrink-0" />
                  <span className="text-slate-700 text-base md:text-[1.05rem] font-medium font-sans">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

          </div>

          {/* Right Column - Image only, placed below the header line */}
          <div className="lg:col-span-7 w-full flex items-center justify-center">
            <img 
              src="/images/image1.png" 
              alt="UdhaarClear Confusion Preview" 
              className="w-full max-w-[680px] h-auto rounded-[32px] border border-black/[0.04] shadow-[0_12px_40px_rgba(0,0,0,0.02)]"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
