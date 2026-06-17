"use client";

import React from "react";
import { UploadCloud, Mail, MessageSquare, Link2, FileText, UserCheck, Banknote, ArrowDown } from "lucide-react";

export default function Workflow() {
  const udhaarclearSubsteps = [
    { icon: Mail, label: "Email Reminder", desc: "Official request with Section 16 compound interest calculation." },
    { icon: MessageSquare, label: "WhatsApp Reminder", desc: "Polite, persistent alerts delivered directly to their phone." },
    { icon: Link2, label: "Payment Link", desc: "Secure, integrated UPI & Netbanking checkout." },
    { icon: FileText, label: "MSME Notice", desc: "Automated delayed payment notice drafted by the system." }
  ];

  return (
    <section id="workflow" className="relative w-full bg-[#030303] py-20 md:py-28 lg:py-32 overflow-hidden border-t border-white/5">
      {/* Decorative ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] rounded-full bg-blue-500/5 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-[450px] h-[450px] rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none" />
      </div>

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-white/10 bg-white/5 text-gray-400 text-sm font-medium tracking-tight font-outfit mb-6 select-none shadow-sm">
          Signature Workflow
        </div>

        {/* Heading */}
        <h2 className="text-[2.75rem] md:text-[3.25rem] font-medium text-white tracking-tight leading-[1.15] font-outfit max-w-4xl mx-auto mb-6">
          The Automated Recovery Pipeline
        </h2>
        <p className="text-gray-400 font-medium text-sm md:text-base mb-20 max-w-2xl mx-auto">
          See exactly how UdhaarClear handles your overdue invoices, from initial sync to final bank settlement.
        </p>

        {/* Timeline Layout */}
        <div className="max-w-[800px] mx-auto relative flex flex-col items-center">
          
          {/* Vertical Connecting Line */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-emerald-500 opacity-20 z-0" />

          {/* STEP 1: YOU */}
          <div className="w-full relative flex flex-col items-center z-10 mb-12">
            <div className="w-12 h-12 rounded-full border border-blue-500/35 bg-blue-950 flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <UploadCloud className="w-5 h-5" />
            </div>
            
            <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6 w-[90%] max-w-[460px] text-center hover:border-blue-500/30 transition-all duration-300">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block mb-1">Step 1: YOU</span>
              <h3 className="text-lg font-bold text-white font-outfit mb-2">Upload Invoice</h3>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                Add invoice amount and customer contact. Syncs in 8 seconds with absolute security.
              </p>
            </div>
          </div>

          {/* ARROW DOWN */}
          <div className="text-gray-600 mb-8 z-10">
            <ArrowDown className="w-5 h-5" />
          </div>

          {/* STEP 2: UDHAARCLEAR */}
          <div className="w-full relative flex flex-col items-center z-10 mb-12">
            <div className="w-12 h-12 rounded-full border border-indigo-500/35 bg-indigo-950 flex items-center justify-center text-indigo-400 mb-6 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <span className="text-[#FFC72C] font-black text-[18px] tracking-tight">U</span>
            </div>
            
            <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6 md:p-8 w-[95%] max-w-[680px] text-center hover:border-indigo-500/30 transition-all duration-300">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2">Step 2: UDHAARCLEAR</span>
              <h3 className="text-xl font-bold text-white font-outfit mb-4">Automated Sequences Active</h3>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6">
                Our automated recovery engine goes to work immediately using multiple communication layers.
              </p>

              {/* Substeps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {udhaarclearSubsteps.map((sub, index) => {
                  const Icon = sub.icon;
                  return (
                    <div key={index} className="bg-black/40 border border-white/5 rounded-xl p-4 text-left hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3.5 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-indigo-400 shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-white text-sm font-semibold leading-tight">{sub.label}</span>
                      </div>
                      <p className="text-gray-400 text-xs leading-normal font-normal">{sub.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ARROW DOWN */}
          <div className="text-gray-600 mb-8 z-10">
            <ArrowDown className="w-5 h-5" />
          </div>

          {/* STEP 3: CUSTOMER PAYS */}
          <div className="w-full relative flex flex-col items-center z-10 mb-12">
            <div className="w-12 h-12 rounded-full border border-emerald-500/35 bg-emerald-950 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <UserCheck className="w-5 h-5" />
            </div>
            
            <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6 w-[90%] max-w-[460px] text-center hover:border-emerald-500/30 transition-all duration-300">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Step 3: CUSTOMER</span>
              <h3 className="text-lg font-bold text-white font-outfit mb-2">Customer Pays</h3>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                The buyer clicks the link inside WhatsApp or SMS, and settles the balance via secure one-click checkout.
              </p>
            </div>
          </div>

          {/* ARROW DOWN */}
          <div className="text-gray-600 mb-8 z-10">
            <ArrowDown className="w-5 h-5" />
          </div>

          {/* STEP 4: MONEY IN BANK */}
          <div className="w-full relative flex flex-col items-center z-10">
            <div className="w-12 h-12 rounded-full border border-emerald-400 bg-emerald-500 flex items-center justify-center text-black mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <Banknote className="w-5 h-5" />
            </div>
            
            <div className="bg-gradient-to-br from-zinc-950 to-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 w-[90%] max-w-[460px] text-center shadow-[0_4px_30px_rgba(16,185,129,0.05)] hover:border-emerald-500/50 transition-all duration-300">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Final Outcome</span>
              <h3 className="text-lg font-bold text-white font-outfit mb-2">Money in Bank</h3>
              <p className="text-gray-355 text-xs md:text-sm leading-relaxed">
                Recovered funds are routed instantly to your bank account, auto-reconciling your ledger.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
