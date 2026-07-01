"use client";

import React from "react";
import Link from "next/link";

const FrownIcon = () => (
  <svg className="w-[22px] h-[22px] shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#FF8A7A" />
    <circle cx="9" cy="10" r="1.2" fill="#2D1E1B" />
    <circle cx="15" cy="10" r="1.2" fill="#2D1E1B" />
    <path
      d="M8 16.5 C9.5 14.5, 14.5 14.5, 16 16.5"
      stroke="#2D1E1B"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const SmileIcon = () => (
  <svg className="w-[22px] h-[22px] shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#B5F670" />
    <circle cx="9" cy="10" r="1.2" fill="#1C300A" />
    <circle cx="15" cy="10" r="1.2" fill="#1C300A" />
    <path
      d="M8 14.5 C9.5 17, 14.5 17, 16 14.5"
      stroke="#1C300A"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export default function Comparison() {
  const traditionalPoints = [
    "Manual Invoice Follow-ups",
    "Awkward Collection Phone Calls",
    "Ignored Payment Reminder Emails",
    "Slow & Expensive Legal Notices",
    "Error-Prone Excel Sheet Tracking",
    "No Instant Payment Links",
    "High Risk of Bad Debts",
    "Constant Stress & Cash Flow Gaps"
  ];

  const udhaarclearPoints = [
    "Automated Invoicing (8-Sec Upload)",
    "Smart WhatsApp & SMS Sequences",
    "AI-Driven Tone & Frequency Engine",
    "Auto MSME Samadhaan File Preparation",
    "1-Click UPI & Card Payment Links",
    "Real-time Status & Ledger Sync",
    "Automated Reconciliation & Settlements",
    "Steady Cash Flow & Zero Tension"
  ];

  return (
    <section id="comparison" className="relative w-full bg-white py-20 md:py-28 lg:py-32 overflow-hidden select-none">
      <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 z-10 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-[#B5F670]/40 bg-[#B5F670]/40 text-black text-sm font-medium tracking-tight font-outfit mb-6 select-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#B5F670]">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          AI-Powered Collections. Zero Headaches
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-[3.55rem] font-normal text-gray-950 tracking-tight leading-[1.12] md:leading-[1.08] mx-auto mb-4">
         From Manual Headaches To <br/> Automated <span className="bg-gradient-to-r from-black to-[#B5F670] bg-clip-text text-transparent font-normal"> Happiness</span> 
        </h2>
        
        {/* Subheading */}
        <p className="text-sm md:text-base text-zinc-500 max-w-2xl mx-auto mb-16 font-sans font-normal leading-relaxed">
         UdhaarClear AI handles the follow-ups, reminder and paper work. So you can focus on growing business.
        </p>

        {/* Outer Container for Cards */}
        <div className="max-w-[1040px] mx-auto flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 items-start justify-center text-left">
          
          {/* Traditional Column Card */}
          <div className="w-full md:w-1/2 flex-1 bg-[#F8F9FA]/80 border border-zinc-100 rounded-[2.5rem] p-8 md:p-10 lg:p-12 flex flex-col justify-between gap-6 transition-all duration-300">
            <div>
              {/* Header */}
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-900 font-outfit text-center mb-2">
                The Old Way
              </h3>
              <p className="text-sm md:text-base text-zinc-500 max-w-2xl mx-auto mb-8 font-sans font-normal leading-relaxed text-center">
                Time consuming. Stressful. Inefficient.
              </p>

              {/* Checkpoints */}
              <div className="flex flex-col gap-3.5">
                {traditionalPoints.map((point, index) => (
                  <div key={index} className="bg-white rounded-full py-3.5 px-5 flex items-center gap-3.5 border border-zinc-100 hover:border-zinc-200/60 transition-all duration-200">
                    <FrownIcon />
                    <span className="text-zinc-700 text-sm md:text-[15px] font-medium leading-tight font-sans">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* UdhaarClear AI Highlighted Card */}
          <div className="w-full md:w-1/2 flex-1 bg-[#08080C] border border-zinc-900 rounded-[2.5rem] p-8 md:p-10 lg:p-12 pb-14 md:pb-16 lg:pb-20 flex flex-col justify-between gap-10 shadow-[0_24px_60px_rgba(181,246,112,0.06)] relative overflow-hidden transition-all duration-300">
            {/* Ambient inner Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B5F670]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Brand Header */}
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white font-outfit text-center mb-2">
                 The <span className="text-[#B5F670]">UdhaarClear AI</span> Way
                </h3>
                <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto mb-8 font-sans font-normal leading-relaxed text-center">
                 Smart. Fast. Automated. Results.
                </p>

                {/* Checkpoints */}
                <div className="flex flex-col gap-3.5">
                  {udhaarclearPoints.map((point, index) => (
                    <div key={index} className="bg-[#12131A] border border-zinc-800/40 rounded-full py-3.5 px-5 flex items-center gap-3.5 hover:border-zinc-800 transition-all duration-200">
                      <SmileIcon />
                      <span className="text-zinc-200 text-sm md:text-[15px] font-medium leading-tight font-sans">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Button */}
              <Link
                href="/signup"
                className="w-full py-4 bg-[#B5F670] hover:bg-[#A3E635] text-black font-semibold rounded-2xl text-sm transition-all duration-200 active:scale-95 text-center mt-8 block shadow-[0_8px_30px_rgba(181,246,112,0.15)] cursor-pointer"
              >
                Get Started for Free
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
