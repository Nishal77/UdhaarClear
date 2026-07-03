"use client";

import React from "react";

interface PhaseData {
  id: number;
  title: string;
  days: string;
  tone: string;
  description: string;
  messageType: "buyer" | "seller";
  messageText: string;
  buttonLabel: string;
  showHumanGateActions?: boolean;
}

const HorizontalArrow = () => (
  <div className="absolute right-[-24px] xl:right-[-32px] top-1/2 -translate-y-1/2 z-20 w-6 xl:w-8 h-6 text-[#82D42D]/80 pointer-events-none hidden md:block">
    <svg viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto animate-pulse" style={{ animationDuration: '3s' }}>
      <path 
        d="M2 8 Q 16 2, 28 8" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        fill="none"
      />
      <path 
        d="M20 4 C 23 5, 26 6, 28 8 C 25 10, 22 12, 19 13" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
    </svg>
  </div>
);

const LeftArrow = () => (
  <div className="absolute left-[-24px] xl:left-[-32px] top-1/2 -translate-y-1/2 z-20 w-6 xl:w-8 h-6 text-[#82D42D]/80 pointer-events-none hidden md:block">
    <svg viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto animate-pulse" style={{ animationDuration: '3s' }}>
      <path 
        d="M30 8 Q 16 2, 4 8" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        fill="none"
      />
      <path 
        d="M12 4 C 9 5, 6 6, 4 8 C 7 10, 10 12, 13 13" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
    </svg>
  </div>
);

const DownwardArrow = ({ mobileOnly = true }: { mobileOnly?: boolean }) => (
  <div className={`absolute bottom-[-22px] left-1/2 -translate-x-1/2 z-20 w-6 h-6 text-[#82D42D]/80 pointer-events-none ${mobileOnly ? 'md:hidden' : 'block'}`}>
    <svg viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto animate-pulse" style={{ animationDuration: '3s' }}>
      <path 
        d="M12 2 Q 19 12, 12 22" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        fill="none"
      />
      <path 
        d="M7 17 L 12 22 L 17 18" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
    </svg>
  </div>
);

export default function TonalLadder() {
  const phases: PhaseData[] = [
    {
      id: 1,
      title: "Polite Reminder",
      days: "Days 1–3",
      tone: "Polite & Friendly",
      description: "A soft alert sent right after the due date. Assumes simple oversight.",
      messageType: "buyer",
      messageText: "Hi Ramesh bhai, invoice #102 of Rs 15,000 was due today. Please pay at your convenience. 🙏",
      buttonLabel: "Pay Invoice (UPI/Card)"
    },
    {
      id: 2,
      title: "Gentle Nudge",
      days: "Days 7–10",
      tone: "Soft follow-up",
      description: "Reminds customer of due invoice, leveraging business goodwill.",
      messageType: "buyer",
      messageText: "Ramesh bhai, just a gentle reminder about Rs 15,000 pending since 7 days. We highly value our relationship.",
      buttonLabel: "Pay Invoice (UPI/Card)"
    },
    {
      id: 3,
      title: "Firm Follow-up",
      days: "Days 14–18",
      tone: "Formal & Direct",
      description: "Direct request warning of ledger accounts reconciliation disruption.",
      messageType: "buyer",
      messageText: "Ramesh bhai, invoice #102 of Rs 15,000 is 14 days overdue. Please settle at the earliest. [Pay Now]",
      buttonLabel: "Pay Invoice (UPI/Card)"
    },
    {
      id: 4,
      title: "Serious Notice",
      days: "Days 21–27",
      tone: "Urgent & Warning",
      description: "Formal demand warning of MSME Act interest penalty regulations.",
      messageType: "buyer",
      messageText: "Dear Ramesh, invoice #102 of Rs 15,000 is 21 days overdue. Under MSME Act, immediate payment is required.",
      buttonLabel: "Settle Overdue Invoice"
    },
    {
      id: 5,
      title: "Human Gate (Failsafe)",
      days: "Day 28+",
      tone: "Owner Decides",
      description: "Automated sequence pauses. Owner approves next legal escalation step.",
      messageType: "seller",
      messageText: "🚨 Ramesh has not paid for 28 days. Should we proceed with the official MSME Act legal notice?",
      buttonLabel: "",
      showHumanGateActions: true
    },
    {
      id: 6,
      title: "MSME Samadhaan Filing",
      days: "Day 45+",
      tone: "Government Arbitration",
      description: "Statutory 45 days limit exceeded. Case ready to file on Govt dispute settlement portal.",
      messageType: "seller",
      messageText: "⚖️ MSME Samadhaan Case Ready:\nInvoice #102 exceeds the 45-day statutory limit. File dispute for 3x interest recovery?",
      buttonLabel: "",
      showHumanGateActions: true
    }
  ];

  return (
    <section id="tonal-ladder" className="relative w-full bg-slate-50/20 py-20 md:py-28 lg:py-32 overflow-hidden select-none border-y border-slate-100 scroll-mt-24">
      {/* Background ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#B5F670]/5 blur-[130px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-50/10 blur-[130px]" />
      </div>

      <div className="relative max-w-[1340px] mx-auto px-4 md:px-6 z-10 w-full">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-[#B5F670]/30 bg-[#B5F670]/10 text-black text-sm font-medium tracking-tight font-outfit mb-6 shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            5-Phase Adaptation Engine
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-[3.55rem] font-normal text-gray-950 tracking-tight leading-[1.15] font-outfit">
            The Tonal Ladder: Keep Relations Safe, <br/>
            <span className="bg-gradient-to-r from-gray-950 via-[#82D42D] to-gray-950 bg-clip-text text-transparent font-normal">Collect Without Awkwardness.</span>
          </h2>
          
          <p className="text-gray-500 font-normal text-sm md:text-base mt-4 leading-relaxed max-w-2xl font-sans">
            Every customer is different. UdhaarClear adapts reminders from friendly nudges to formal regulatory warnings based on invoice age. You retain full control at every step.
          </p>
        </div>

        {/* 3x2 Grid Container with Snake Ordering */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-12 items-stretch">
          {phases.map((phase, index) => {
            // Determine the responsive ordering
            let orderClass = "";
            if (phase.id === 1) orderClass = "order-1 md:order-1";
            else if (phase.id === 2) orderClass = "order-2 md:order-2";
            else if (phase.id === 3) orderClass = "order-3 md:order-3";
            else if (phase.id === 4) orderClass = "order-4 md:order-6";
            else if (phase.id === 5) orderClass = "order-5 md:order-5";
            else if (phase.id === 6) orderClass = "order-6 md:order-4";

            return (
              <div key={phase.id} className={`relative flex flex-col items-stretch ${orderClass}`}>
                
                {/* Individual Phase Card (Flat premium design: warm beige bg, clean borders, no hover scale, no shadow) */}
                <div className="flex-1 bg-[#FAF9F6]  rounded-3xl p-5 flex flex-col justify-between min-h-[380px] lg:min-h-[400px] relative z-10">
                  
                  {/* Top Portion: Metadata & Description */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-medium font-serif text-zinc-300">
                        0{phase.id}
                      </span>
                      <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 bg-white text-zinc-500 rounded-full border border-black/[0.04]">
                        {phase.days}
                      </span>
                    </div>

                    <h4 className="text-base font-medium tracking-tight text-gray-950 font-outfit mb-1.5">
                      {phase.title}
                    </h4>
                    
                    <p className="text-[12px] text-zinc-500 leading-relaxed mb-4 font-sans">
                      {phase.description}
                    </p>
                  </div>

                  {/* Bottom Portion: Self-Contained WhatsApp Preview Bubble (Crisp white contrast container) */}
                  <div className="bg-white border border-black/[0.03] rounded-2xl p-3 flex flex-col gap-2 mt-auto">
                    <div className="flex items-center justify-between border-b border-black/[0.04] pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${phase.messageType === 'buyer' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                        <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-wider font-medium">
                          {phase.messageType === 'buyer' ? 'WhatsApp Notification' : 'Failsafe Authorization'}
                        </span>
                      </div>
                      <span className="text-[8px] text-zinc-300 font-mono font-medium">10:42 AM</span>
                    </div>

                    {/* Chat Bubble */}
                    <div className={`rounded-xl p-2.5 text-[10.5px] leading-relaxed relative ${
                      phase.messageType === "buyer"
                        ? "bg-[#DCF8C6] text-zinc-800 rounded-tr-none self-end border-l-2 border-emerald-500/10"
                        : "bg-white text-zinc-800 rounded-tl-none border border-zinc-150"
                    }`}>
                      <p className="font-sans font-medium text-[11px] leading-normal">{phase.messageText}</p>
                      
                      {phase.messageType === "buyer" && (
                        <div className="flex items-center justify-end mt-0.5">
                          <svg className="w-3 h-3 text-sky-500 fill-current" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Pay Button / Human Gate Buttons */}
                    {phase.messageType === "buyer" ? (
                      <div className="bg-white border border-zinc-200/60 rounded-xl p-1.5 text-center flex flex-col mt-0.5">
                        <button className="w-full py-1.5 bg-[#128C7E] hover:bg-[#075E54] text-white text-[10px] font-medium rounded-lg transition-colors cursor-pointer select-none">
                          {phase.buttonLabel}
                        </button>
                      </div>
                    ) : (
                      phase.showHumanGateActions && (
                        <div className="flex flex-col gap-1 w-full mt-0.5">
                          <div className="flex gap-1.5">
                            <button className="flex-1 py-1.5 bg-[#B5F670] hover:bg-[#A3E635] text-zinc-950 text-[9.5px] font-medium rounded-lg border border-[#B5F670]/30 transition-colors cursor-pointer select-none">
                              {phase.id === 6 ? 'File on Samadhaan' : 'Yes, send notice'}
                            </button>
                            <button className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-zinc-600 text-[9.5px] font-medium rounded-lg transition-colors cursor-pointer select-none">
                              {phase.id === 6 ? 'Settle / Skip' : 'Snooze 7d'}
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                </div>

                {/* Hand-drawn Arrow Overlays based on flow index */}
                {/* Card 1 & 2 -> Point rightwards on desktop, downwards on mobile */}
                {(phase.id === 1 || phase.id === 2) && (
                  <>
                    <HorizontalArrow />
                    <DownwardArrow mobileOnly={true} />
                  </>
                )}

                {/* Card 3 -> Points straight down to Card 4 on desktop & mobile */}
                {phase.id === 3 && (
                  <DownwardArrow mobileOnly={false} />
                )}

                {/* Card 4 & 5 -> Point leftwards on desktop, downwards on mobile */}
                {(phase.id === 4 || phase.id === 5) && (
                  <>
                    <LeftArrow />
                    <DownwardArrow mobileOnly={true} />
                  </>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
