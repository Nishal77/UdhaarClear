"use client";

import React, { useState } from "react";

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
    <section id="faq" className="relative w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32 border-b border-gray-100">
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

      <div className="relative max-w-[900px] mx-auto px-6 z-10">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight font-outfit text-gray-900 text-center mb-16">
          Frequently Asked <span className="text-[#0047FF]">Questions</span>
        </h2>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-blue-50/60 bg-white rounded-2xl shadow-sm transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between py-6 px-6 md:px-8 text-left cursor-pointer group"
                >
                  <span className="text-base md:text-lg font-medium text-gray-900 group-hover:text-[#0047FF] transition-colors duration-200 pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`transform transition-transform duration-300 text-gray-400 group-hover:text-gray-600 ${
                      isOpen ? "rotate-180 text-[#0047FF]" : ""
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[500px] opacity-100 border-t border-gray-50 bg-[#F8FAFC]/30" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <p className="py-5 px-6 md:px-8 text-sm md:text-base text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
