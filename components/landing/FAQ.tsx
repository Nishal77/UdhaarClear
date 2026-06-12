"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How does UdhaarClear collect payments automatically?",
      answer: "UdhaarClear connects with your existing invoicing systems (Excel, CSV, Tally, or direct API). It monitors payment due dates and schedules a sequence of personalized WhatsApp reminders with embedded UPI and gateway payment links, prompting customers to pay on time without manual chasing.",
    },
    {
      question: "Is it safe to send reminders via WhatsApp? Can we get banned?",
      answer: "Yes, it is 100% safe. We route all reminders through the official Meta WhatsApp Business API (WABA). All message templates are pre-approved by Meta to verify compliance with business guidelines, ensuring high deliverability rates and keeping your brand number fully protected from banning.",
    },
    {
      question: "What payment gateways does UdhaarClear support?",
      answer: "We support direct payment integrations with leading Indian gateways including Razorpay, Cashfree, and Paytm. This allows your clients to settle invoices instantly using standard payment methods (UPI, cards, or Net Banking), with the funds going directly to your merchant account.",
    },
    {
      question: "How does the automated MSME legal notice sequence work?",
      answer: "For invoices delayed beyond the MSME-mandated 45 days, UdhaarClear can auto-generate a pre-drafted legal notice that reference-cites the MSME Development Act 2006 (specifying the 3x interest rate penalty). You can review, approve, and send this warning sequence via official channels with a single tap.",
    },
    {
      question: "Can my accounts team or CA access the dashboard?",
      answer: "Absolutely. Our Scale and CA/Agency plans include multi-user access with role-based permissions. You can invite your accounting staff, collection agents, or external Chartered Accountants to manage invoices, configure templates, and audit ledger reconciliation directly.",
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes. You can test UdhaarClear with a 14-day free trial on our Starter, Growth, and Scale plans, or a 30-day trial if you are setting up a client console on our CA Plan. No credit card is required to start your trial.",
    },
  ];

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

            {/* "Still have questions?" Card */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-3 md:py-8 md:px-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 font-outfit max-w-sm">
                <h3 className="text-xl md:text-2xl font-medium tracking-tight text-slate-900">Still have questions?</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Can't find what you're looking for? Chat with our team - we're here to help.
                </p>
              </div>
              
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl py-2 pl-4 pr-2.5 shadow-sm hover:shadow-md transition-all duration-200 group shrink-0"
              >
                <span className="text-sm font-semibold text-slate-800 font-outfit">Talk to Us</span>
                <div className="w-8 h-8 rounded-xl bg-[#FF5722] flex items-center justify-center text-white transition-colors duration-200 group-hover:bg-[#E64A19]">
                  <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </Link>
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
                      <span className="text-base md:text-lg font-semibold text-slate-900 group-hover:text-[#4F46E5] transition-colors duration-200 pr-6 font-outfit">
                        <span className="text-slate-400 mr-2.5 font-medium">{idx + 1}.</span>
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
                      <p className="text-sm md:text-base text-slate-500 leading-relaxed font-outfit pl-7">
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
