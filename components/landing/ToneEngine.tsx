"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BatteryFullIcon, Wifi01Icon, ChartNoAxesColumnIncreasingIcon } from "@hugeicons/core-free-icons";

const phases = [
  {
    id: "friendly",
    step: "01",
    label: "Friendly",
    tag: "Day 1–3",
    tagColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    dotColor: "bg-emerald-400",
    activeBorder: "border-emerald-200",
    activeBg: "bg-emerald-50/40",
    stepColor: "text-emerald-500",
    body: "A polite, automated WhatsApp nudge sent with a one-tap UPI link to secure quick payments while maintaining great customer relationships.",
    whatsapp: {
      sender: "UdhaarClear",
      time: "10:14 AM",
      message: [
        "Hi Ramesh,",
        "",
        "Hope you're doing well! 🙏 Just a gentle reminder that invoice *#INV-2026-042* of *₹1,85,000* is due.",
        "",
        "You can pay in one tap here:",
        "*→ pay.udhaarclear.in/ramesh*",
        "",
        "Thank you for your continued trust!",
        "– UdhaarClear (on behalf of Sharma Exports)",
      ],
    },
  },
  {
    id: "serious",
    step: "02",
    label: "Serious",
    tag: "Day 7–14",
    tagColor: "bg-amber-50 text-amber-600 border-amber-100 ",
    dotColor: "bg-amber-400",
    activeBorder: "border-amber-200",
    activeBg: "bg-amber-50/40",
    stepColor: "text-amber-500",
    body: "A firm, professional follow-up highlighting the overdue timeline to create immediate financial urgency without damaging business trust.",
    whatsapp: {
      sender: "UdhaarClear",
      time: "11:32 AM",
      message: [
        "Hi Ramesh,",
        "",
        "This is a follow-up regarding *₹1,85,000* on invoice *#INV-2026-042*, now *9 days overdue*.",
        "",
        "We request you to clear this at the earliest to avoid any disruption to your account.",
        "",
        "*Pay now:* pay.udhaarclear.in/ramesh",
        "",
        "Please confirm once done.",
        "– Sharma Exports",
      ],
    },
  },
  {
    id: "legal",
    step: "03",
    label: "Legal",
    tag: "Day 21+",
    tagColor: "bg-rose-50 text-rose-600 border-rose-100",
    dotColor: "bg-rose-400",
    activeBorder: "border-rose-200",
    activeBg: "bg-rose-50/40",
    stepColor: "text-rose-500",
    body: "A formal statutory notice issued under the MSME Act, 2006, automatically calculating accrued compound interest to legally enforce recovery.",
    whatsapp: {
      sender: "UdhaarClear Legal",
      time: "9:00 AM",
      message: [
        "⚠️ *LEGAL NOTICE — MSME ACT 2006*",
        "",
        "Dear Ramesh Traders Pvt. Ltd.,",
        "",
        "Invoice *#INV-2026-042* of *₹1,85,000* remains unpaid for *24 days*. As per Section 16 of the MSME Act, 2006, compound interest of *18% p.a.* has accrued.",
        "",
        "Total outstanding: *₹1,87,400*",
        "",
        "Settle immediately to avoid formal MSME Samadhaan proceedings.",
        "",
        "— Legal Cell, Sharma Exports",
      ],
    },
  },
];

interface PhoneMockupProps {
  phaseId: "friendly" | "serious" | "legal";
}

function PhoneMockup({ phaseId }: PhoneMockupProps) {
  const isFriendly = phaseId === "friendly";
  const isSerious = phaseId === "serious";

  return (
    <div 
      className="relative w-full h-[430px] sm:h-[460px] rounded-t-[3.25rem] rounded-b-none bg-zinc-900 border-x border-t border-zinc-800/80 border-b-0 p-1 flex flex-col overflow-hidden"
    >
      <div className="relative w-full h-full rounded-t-[3rem] rounded-b-none border-x border-t border-zinc-800 border-b-0 bg-zinc-950 p-4 pt-4 flex flex-col flex-1 select-none">
        
        {/* Status Bar */}
        <div className="h-6 flex items-center justify-between text-zinc-100 text-[11px] font-semibold tracking-tight">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={ChartNoAxesColumnIncreasingIcon} size={11} className="text-zinc-100" />
            <HugeiconsIcon icon={Wifi01Icon} size={11} className="text-zinc-100" />
            <HugeiconsIcon icon={BatteryFullIcon} size={12} className="text-zinc-100" />
          </div>
        </div>

        {/* WhatsApp Chat Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mt-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#00a884]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center relative shrink-0">
              <svg className="w-5 h-5 text-[#00c285] fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-950" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-bold text-zinc-100 tracking-tight leading-tight">UdhaarClear Alerts</span>
                <svg className="w-3.5 h-3.5 text-[#00c285] fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="text-[10px] text-zinc-500 leading-tight">Official Business Account</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.47-5.112-3.758-6.58-6.58l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </div>
        </div>

        {/* Chat Stream View */}
        <div className="flex-1 flex flex-col pt-4 overflow-hidden relative">
          <div className="mx-auto bg-zinc-900/60 border border-zinc-800 text-[10.5px] text-zinc-500 font-bold uppercase px-3 py-1 rounded-lg tracking-wider mb-4">
            Today
          </div>
          
          <div className="flex flex-col items-start w-full max-w-[285px]">
            {/* Premium WhatsApp Message Bubble matching the requested interactive UI layout */}
            <div className="bg-[#202C33] border border-zinc-800/40 rounded-2xl rounded-tl-none text-[13px] leading-relaxed text-zinc-100 font-sans relative shadow-md text-left w-full overflow-hidden">
              
              {/* Content text section */}
              <div className="p-3.5 pb-1">
                {isFriendly ? (
                  <>
                    <p className="text-zinc-200">
                      Busy/Not available when your Amazon COD order(Tracking ID: 165613219239) arrives? <span className="font-bold text-white">Pay now</span> to avoid missing your delivery.
                    </p>
                    <p className="mt-3 font-bold text-white text-[13.5px]">
                      Amount due: ₹4,80,000
                    </p>
                    <p className="mt-3 text-zinc-300 text-[12.5px]">
                      You can ask the delivery associate to leave the package at your doorstep/ with a family member or neighbour.
                    </p>
                  </>
                ) : isSerious ? (
                  <>
                    <p className="text-zinc-200">
                      Urgent follow-up regarding your pending invoice <span className="font-bold text-white">#INV-2198</span>. Your account status is now <span className="font-bold text-amber-400">9 days overdue</span>.
                    </p>
                    <p className="mt-3 font-bold text-white text-[13.5px]">
                      Amount due: ₹4,80,000
                    </p>
                    <p className="mt-3 text-zinc-300 text-[12.5px]">
                      Please clear this dynamic amount immediately via the premium settlement gateway below to prevent automated credit bureau escalations.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-zinc-200">
                      ⚠️ <span className="font-bold text-rose-400">LEGAL NOTICE — MSME ACT, 2006</span>. Settle outstanding metrics immediately to avoid impending MSME Samadhaan arbitration proceedings.
                    </p>
                    <p className="mt-3 font-bold text-white text-[13.5px]">
                      Amount due: ₹4,86,240
                    </p>
                    <p className="mt-3 text-zinc-300 text-[12.5px]">
                      Official warning notice has accrued mandatory compound interest variables at a statutory standard rate of 18% p.a.
                    </p>
                  </>
                )}

                {/* Micro Meta Timestamp */}
                <div className="flex items-center justify-end gap-1 mt-2 text-[9px] text-zinc-400 font-medium">
                  <span>{isFriendly ? "12:31 PM" : isSerious ? "11:32 AM" : "2:15 PM"}</span>
                  <div className="flex text-[#53BDEB]">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Native WhatsApp Template Interactive Action Row (Premium UI Upgrade) */}
              <div className="border-t border-zinc-700/50 bg-black/10 transition-colors hover:bg-white/[0.03]">
                <button className="w-full py-3 px-4 flex items-center justify-center gap-2 text-[13px] font-bold tracking-wide transition-all cursor-pointer">
                  {/* Share/Export/Pay-Now Arrow Indicator matching reference */}
                  <svg className={`w-4 h-4 shrink-0 stroke-current ${isFriendly ? 'text-[#00c285]' : isSerious ? 'text-amber-400' : 'text-rose-400'}`} fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                  <span className={isFriendly ? 'text-[#00c285]' : isSerious ? 'text-amber-400' : 'text-rose-400'}>
                    Pay Now
                  </span>
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ToneEngine() {
  return (
    <section className="relative w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32 overflow-hidden rounded-t-[3rem] md:rounded-t-4xl -mt-10 z-20">

      {/* FULL WIDTH BACKGROUND GRID EFFECT (Masked to hide under heading and fade in near the cards) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.70]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E5E7EB 1px, transparent 1px),
            linear-gradient(to bottom, #E5E7EB 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 28%, black 48%, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 28%, black 48%, black 85%, transparent 100%)'
        }}
      />
      {/* Optional fade out for the grid edges to make it softer */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white pointer-events-none z-0 opacity-60" />

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10">

        {/* ── Header ── */}
        <div className="max-w-3xl mb-16 md:mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-gray-200 text-black text-sm font-medium tracking-tight font-outfit mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shrink-0">
              <span className="animate-ping inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            </span>
            Tone Engine
          </div>

          <h2 className="text-[2.75rem] md:text-[3.25rem] font-medium text-black tracking-tight leading-[1.15] font-outfit">
            Friendly When It’s Early. Serious When They Delay. Legal When They Ignore.
          </h2>

          <p className="mt-5 text-gray-600 text-lg md:text-xl leading-relaxed font-normal max-w-3xl">
            UdhaarClear sends the right reminder at the right time, polite when the invoice is fresh, firmer when payment is delayed, and formal when customers keep ignoring it.
          </p>
        </div>

        {/* ── Box Wrapper (bg-white added back to hide grid behind the cards) ── */}
        <div className="w-full relative z-10">
          <div className="bg-white border border-gray-100 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {phases.map((p, idx) => {
              const isFriendly = idx === 0;
              const isSerious = idx === 1;
              
              const dotColorClass = isFriendly
                ? "bg-[#00c285]"
                : isSerious
                ? "bg-amber-500"
                : "bg-rose-500";

              return (
                <div key={p.id} className="flex flex-col w-full flex-1 p-6 lg:p-8 group">
                  
                  {/* Inner Box containing Mockup Image */}
                  <div 
                    className="w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#EBF2FF] to-[#F5F8FF] border border-[#E2EAFD] rounded-4xl pt-6 px-4"
                    style={{
                      WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 65%, rgba(0,0,0,0.85) 76%, rgba(0,0,0,0.45) 86%, rgba(0,0,0,0.12) 94%, rgba(0,0,0,0) 100%)",
                      maskImage: "linear-gradient(to bottom, #000 0%, #000 65%, rgba(0,0,0,0.85) 76%, rgba(0,0,0,0.45) 86%, rgba(0,0,0,0.12) 94%, rgba(0,0,0,0) 100%)"
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] via-transparent to-white/[0.01] pointer-events-none" />
                    <PhoneMockup phaseId={p.id as "friendly" | "serious" | "legal"} />
                  </div>

                  {/* Clean Text and Labels integrated directly into Box Column */}
                  <div className="mt-8 px-1 flex flex-col text-left z-10 flex-1">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${dotColorClass} shrink-0`} />
                        <h3 className="text-lg font-medium tracking-tight text-zinc-900 font-outfit">
                          {idx === 0 ? "Friendly Reminder" : idx === 1 ? "Urgent Escalation" : "Formal Legal Notice"}
                        </h3>
                      </div>
                      <span className="text-[12px] font-semibold tracking-tight text-gray-900 font-sans">
                        {p.tag}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-600 font-medium font-sans">
                      {p.body}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}