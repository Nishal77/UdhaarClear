"use client";

import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function PricingFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Can I upgrade, downgrade, or cancel my plan at any time?",
      answer: "Yes. UdhaarClear is a flexible pay-as-you-go service. You can upgrade, downgrade, or cancel your subscription at any time from your billing settings. If you upgrade, the price will be prorated. If you cancel, your plan remains active until the end of the current billing cycle.",
    },
    {
      question: "What happens if I exceed my active customer limit?",
      answer: "We won't block your recovery process immediately. If you exceed your plan's active customer limit, we will notify you to upgrade to the next tier. Reminders for existing customers will continue to be sent, but you won't be able to add new customers until your plan is updated.",
    },
    {
      question: "Are there any extra charges for sending WhatsApp or SMS reminders?",
      answer: "Standard automated WhatsApp reminders sent via our shared sender channel are included in your subscription. If you choose to send messages from your own brand's verified WhatsApp Business API (WABA) number (available on Pro/Enterprise), you will be billed directly for Meta's standard conversation rates.",
    },
    {
      question: "Is the 14-day free trial really free? Do I need a credit card?",
      answer: "Yes, the 14-day free trial is completely free. You get access to all features of the selected plan to test the platform. No credit card or payment information is required to start your trial.",
    },
    {
      question: "How do payouts work for CA Partners?",
      answer: "As a CA Partner, you earn ₹300 per month for every active paying client you refer or manage. Commissions are accumulated throughout the month and paid directly to your registered bank account on the 10th of every month.",
    },
    {
      question: "Are MSME pre-litigation advocate notices legally binding? Are there extra fees?",
      answer: "The pre-litigation warning templates are designed in consultation with senior legal experts and follow MSME Samadhaan formats. Generating these PDFs and sending digital warnings is fully included in the Pro and Enterprise plans. If you opt for physical dispatch of registered legal notices with advocate signatures, those are fulfilled on-demand by partner legal firms at a flat rate of ₹299 per notice.",
    },
    {
      question: "Is there any contract or setup fee?",
      answer: "No. There are absolutely no setup fees, hidden charges, or long-term contracts. You only pay the flat subscription rate billed either monthly or annually.",
    },
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="pricing-faq" className="relative w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32">
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
                Pricing & Billing <br className="hidden md:inline" /> Questions!
              </h2>
              <p className="text-sm text-gray-500 font-normal leading-relaxed max-w-sm">
                Have details you want to clarify about subscription tiers, usage bounds, integrations, or partner margins? We have you covered.
              </p>
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
