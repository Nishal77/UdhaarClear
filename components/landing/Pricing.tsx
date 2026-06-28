"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";



export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<number, boolean>>({});


  const plans = [
    {
      name: "Shuruat - Free",
      description: "Try it free. 3 customers. No card ever.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      priceSubtext: "Free forever · 3 customers",
      badge: null,
      isHighlighted: false,
      buttonText: "Get started",
      features: [
        { text: "3 customers", included: true },
        { text: "10 invoices/month", included: true },
        { text: "Day 1 + Day 7 reminders", included: true },
        { text: "Basic dashboard", included: true },
        { text: "Buyer payment page", included: false },
        { text: "Legal notices", included: false },
        { text: "Hindi templates", included: false },
      ],
    },
    {
      name: "Chota Vyaapar - Starter",
      description: "For small shops. Up to 15 customers. Affordable first step.",
      monthlyPrice: 399,
      yearlyPrice: 319,
      priceSubtext: "/month · 15 customers",
      badge: null,
      isHighlighted: false,
      buttonText: "Try 14 days free",
      features: [
        { text: "15 customers", included: true },
        { text: "Unlimited invoices", included: true },
        { text: "3-phase reminders", included: true },
        { text: "Hindi templates", included: true },
        { text: "Buyer payment page (UPI)", included: true },
        { text: "Legal notices", included: false },
        { text: "SMS fallback", included: false },
      ],
    },
    {
      name: "Vyaapaar - Pro",
      description: "Full recovery engine. Unlimited customers. Legal notices included.",
      monthlyPrice: 999,
      yearlyPrice: 799,
      priceSubtext: "/month · Unlimited",
      badge: "★ Most popular",
      isHighlighted: true,
      buttonText: "Try 14 days free",
      features: [
        { text: "Unlimited customers", included: true },
        { text: "All 5 reminder phases", included: true },
        { text: "SMS fallback", included: true },
        { text: "Buyer page + partial pay", included: true },
        { text: "Legal notice + human gate", included: true },
        { text: "Hindi + 1 regional language", included: true },
        { text: "WhatsApp bot", included: true },
      ],
    },
    {
      name: "Udyog - Enterprise",
      description: "Teams. API. UdhaarClear Score. For distributors handling crores.",
      monthlyPrice: 9999,
      yearlyPrice: 7999,
      priceSubtext: "/month · Teams + API",
      badge: null,
      isHighlighted: false,
      buttonText: "Talk to us",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Unlimited team members", included: true },
        { text: "All 6 regional languages", included: true },
        { text: "UdhaarClear Score", included: true },
        { text: "REST API + white-label", included: true },
        { text: "NBFC BNPL for buyers", included: true },
        { text: "Dedicated account manager", included: true },
      ],
    },
  ];

  const comparisonCategories = [
    {
      name: "Invoices & Customers",
      features: [
        { name: "Active customers", free: "3", starter: "15", growth: "✓ Unlimited", capro: "✓ Unlimited", enterprise: "Per client" },
        { name: "Invoices per month", free: "10", starter: "✓ Unlimited", growth: "✓ Unlimited", capro: "✓ Unlimited", enterprise: "Per client" },
        { name: "Tally / Zoho CSV import", free: "✕", starter: "✓", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Bulk Excel upload", free: "✕", starter: "✕", growth: "✕", capro: "✓", enterprise: "✓" },
        { name: "GST number auto-verify", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Invoice QR code (scan to pay)", free: "✕", starter: "✓", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Audit trail (all messages)", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
      ]
    },
    {
      name: "Reminders",
      features: [
        { name: "Reminder phases", free: "2 phases", starter: "3 phases", growth: "✓ All 5", capro: "✓ All 5", enterprise: "✓ All 5" },
        { name: "WhatsApp reminders", free: "✓", starter: "✓", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "SMS fallback", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Email reminders", free: "✕", starter: "✓", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Hindi templates", free: "✕", starter: "✓", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Regional languages (6 total)", free: "✕", starter: "✕", growth: "1 extra", capro: "✓ All 6", enterprise: "✓ All 6" },
        { name: "Send from own WABA number", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Pause / snooze per customer", free: "✕", starter: "✓", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Custom reminder schedule", free: "✕", starter: "✕", growth: "✕", capro: "✓", enterprise: "✓" },
      ]
    },
    {
      name: "Buyer Experience",
      features: [
        { name: "Buyer payment page (UPI/NEFT)", free: "✕", starter: "✓", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Pay partial amount", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Request extension with reason", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Dispute invoice (with evidence)", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "EMI / BNPL via NBFC", free: "✕", starter: "✕", growth: "✕", capro: "✓", enterprise: "✕" },
        { name: "Viral \"collect from your customers\" prompt", free: "✕", starter: "✓", growth: "✓", capro: "✓", enterprise: "✓" },
      ]
    },
    {
      name: "Legal & Safety",
      features: [
        { name: "Human gate at Day 28", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Legal notice PDF (lawyer-reviewed)", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "MSME Samadhaan guidance", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Fraud signal alerts", free: "✕", starter: "✕", growth: "✕", capro: "✓", enterprise: "✓" },
      ]
    },
    {
      name: "WhatsApp Bot",
      features: [
        { name: "Create invoice via WhatsApp", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Mark paid / pause via WhatsApp", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Voice note input (Hindi)", free: "✕", starter: "✕", growth: "✕", capro: "✓", enterprise: "✕" },
      ]
    },
    {
      name: "Analytics",
      features: [
        { name: "Basic collection dashboard", free: "✓", starter: "✓", growth: "✓", capro: "✓", enterprise: "✓ All clients" },
        { name: "Recovery rate + best/worst payers", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Shareable recovery stat card", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Cash flow forecast (30/60 days)", free: "✕", starter: "✕", growth: "✕", capro: "✓", enterprise: "✕" },
        { name: "UdhaarClear Score (check any buyer)", free: "✕", starter: "✕", growth: "✕", capro: "✓", enterprise: "✓" },
      ]
    },
    {
      name: "CA Partner Only",
      features: [
        { name: "Manage all clients in one dashboard", free: "✕", starter: "✕", growth: "✕", capro: "✕", enterprise: "✓" },
        { name: "Earn ₹300/client/month", free: "✕", starter: "✕", growth: "✕", capro: "✕", enterprise: "✓" },
        { name: "White-label with CA firm name", free: "✕", starter: "✕", growth: "✕", capro: "✓ own brand", enterprise: "✓ firm name" },
        { name: "Monthly payout to bank account", free: "✕", starter: "✕", growth: "✕", capro: "✕", enterprise: "✓" },
        { name: "Client recovery report (for CA records)", free: "✕", starter: "✕", growth: "✕", capro: "✕", enterprise: "✓" },
      ]
    },
    {
      name: "Team & API",
      features: [
        { name: "Team members", free: "1", starter: "1", growth: "1", capro: "✓ Unlimited", enterprise: "Per client" },
        { name: "REST API access", free: "✕", starter: "✕", growth: "✕", capro: "✓", enterprise: "✕" },
        { name: "Field agent mode (cash tracking)", free: "✕", starter: "✕", growth: "✕", capro: "✓", enterprise: "✕" },
      ]
    },
    {
      name: "Support",
      features: [
        { name: "Email support", free: "✓", starter: "✓", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "WhatsApp support", free: "✕", starter: "✕", growth: "✓", capro: "✓", enterprise: "✓" },
        { name: "Priority support", free: "✕", starter: "✕", growth: "✕", capro: "✓", enterprise: "✓" },
        { name: "Dedicated account manager", free: "✕", starter: "✕", growth: "✕", capro: "✓", enterprise: "✕" },
      ]
    }
  ];

  const renderTableValue = (val: string) => {
    const cleanVal = val.trim();
    
    if (cleanVal === "Yes" || cleanVal === "✓") {
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-50 text-emerald-600 select-none">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </span>
      );
    }
    
    if (cleanVal === "No" || cleanVal === "✕") {
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 text-zinc-300 select-none font-semibold text-[13px]">
          ✕
        </span>
      );
    }

    if (cleanVal.startsWith("✓")) {
      const text = cleanVal.replace("✓", "").trim();
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#0D8A4F] text-[11.5px] font-bold tracking-tight select-none">
          <svg className="w-3.5 h-3.5 text-[#0D8A4F] shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {text}
        </span>
      );
    }

    // Numbers or blue phrases
    if (/^\d+/.test(cleanVal) || cleanVal === "1" || cleanVal.includes("phases") || cleanVal.includes("extra")) {
      return (
        <span className="text-[#0047FF] text-[13px] md:text-sm font-semibold">
          {cleanVal}
        </span>
      );
    }

    if (cleanVal.toLowerCase().includes("client")) {
      return (
        <span className="text-[#D97706] text-[13px] md:text-sm font-semibold">
          {cleanVal}
        </span>
      );
    }

    return (
      <span className="text-gray-600 font-medium text-[13px] md:text-sm">
        {cleanVal}
      </span>
    );
  };

  return (
    <section id="pricing" className="relative w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at top left, rgba(0, 73, 255, 0.04), transparent 600px),
            radial-gradient(circle at bottom right, rgba(99, 102, 241, 0.03), transparent 600px)
          `
        }}
      />

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 text-left">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-[3.5rem] font-normal text-gray-900 tracking-tight leading-[1.1] font-outfit">
               One Recovered Invoice Can Pay for Your Plan Many Times Over.
           
            </h1>
            <p className="text-base md:text-lg text-gray-500 font-normal mt-4">
             Choose the plan that fits your business and let UdhaarClear follow up, collect, and keep your cash flow moving.
            </p>
          </div>

          <div className="flex flex-row items-center gap-3.5 shrink-0">
            <Link
              href="/signup"
              className="px-6 py-3 bg-gray-950 hover:bg-zinc-900 text-white font-medium rounded-xl text-sm transition-all duration-200 active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
            >
              Start for free
            </Link>
            <button
              onClick={() => {
                document.getElementById('compare-table')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200/80 text-gray-800 font-medium rounded-xl text-sm transition-all duration-200 active:scale-95 shadow-2xs flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
              Compare plans
            </button>
          </div>
        </div>

        {/* Social Proof Bar */}
        <div className="mb-20 w-full select-none border-t border-b border-gray-200/40 py-5">
          <p className="text-sm md:text-base font-semibold text-gray-500 tracking-tight flex items-center justify-center gap-2">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            1,200+ Indian wholesalers and CAs trust UdhaarClear to protect their cash flow
          </p>
        </div>

        {/* Centered Billing Selector */}
        <div className="flex items-center justify-center gap-4 mt-10 mb-8">
          <div className="relative flex bg-gray-100/80 p-1 rounded-2xl border border-gray-200/50">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`relative px-6 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 ${billingPeriod === "monthly"
                ? "bg-white text-gray-900 shadow-3xs"
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`relative px-6 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${billingPeriod === "yearly"
                ? "bg-white text-gray-900 shadow-3xs"
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              <span>Yearly</span>
              <span className="bg-[#DFF7C7] text-gray-950 font-semibold px-2.5 py-0.5 rounded-full text-[10px] md:text-xs tracking-tight">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1280px] mx-auto text-left items-stretch mt-10 lg:pt-[50px] lg:pb-6">
          {plans.map((plan, index) => {
            const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const isGrowth = plan.isHighlighted;

            // Resolve dynamic buttons
            let buttonBg = "bg-gray-950 text-white hover:bg-zinc-900";
            let buttonText = plan.buttonText || "Start 7-day free trial";
            let targetUrl = `/signup?plan=${plan.name.toLowerCase().replace(" ", "_")}`;

            if (plan.name === "SHURUAT") {
              buttonBg = "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50";
              targetUrl = "/signup";
            } else if (isGrowth) {
              buttonBg = "bg-[#B5F670] hover:bg-[#A3E635] text-black font-semibold";
            }

            return (
              <div
                key={index}
                className={`flex flex-col rounded-3xl overflow-hidden ${
                  isGrowth 
                    ? "bg-gray-100/80 border border-[#B5F670] lg:-mt-[37px] lg:z-10 shadow-none" 
                    : plan.name === "SHURUAT"
                      ? "bg-gray-100/80 border border-transparent"
                      : "bg-gray-100/80 border border-gray-200"
                }`}
              >
                {/* Most Popular Header Bar */}
                {isGrowth && (
                  <div className="w-full bg-[#B5F670] text-black text-center py-2.5 text-sm font-semibold tracking-tight select-none relative z-10">
                    Most popular
                  </div>
                )}

                <div className="p-7 flex flex-col justify-between flex-1">
                  <div className="flex flex-col flex-1">
                    {/* Top Badge */}
                    <span className="px-3 py-1 rounded-xl border border-gray-200/60 bg-gray-200 text-gray-600 text-[13px] font-medium tracking-tight w-fit mb-5 select-none animate-none">
                      {plan.name}
                    </span>

                    {/* Price */}
                    <div className="mb-4 flex flex-col">
                      <div className="flex items-baseline gap-1 select-none font-outfit">
                        <span className="text-4xl md:text-[2.75rem] font-medium tracking-tight text-gray-950">
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-sm font-semibold text-gray-400 ml-1">
                          {billingPeriod === "monthly" ? "/mo" : "/yr"}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed h-[72px] overflow-hidden">
                      {plan.description}
                    </p>

                    {/* Features Checklist */}
                    <ul className="space-y-3.5 pt-6 border-t border-gray-100 mb-8 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className={`flex items-start gap-2.5 text-xs md:text-sm font-medium leading-normal ${feature.included ? "text-gray-700" : "text-gray-400/80"}`}>
                          {feature.included ? (
                            <svg className={`w-4 h-4 shrink-0 mt-0.5 ${isGrowth ? "text-[#0D8A4F]" : "text-gray-950"}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 shrink-0 mt-0.5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    <Link
                      href={targetUrl}
                      className={`w-full py-3.5 ${buttonBg} font-medium rounded-xl text-center text-xs md:text-sm flex items-center justify-center gap-1.5 group `}
                    >
                      <span>{buttonText}</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-1 flex items-center">
                        <HugeiconsIcon icon={ArrowRight02Icon} size={15} />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-1 max-w-[1280px] mx-auto bg-gray-100/80 border border-gray-100 rounded-3xl p-8 md:p-10 flex flex-col lg:flex-row justify-between items-center gap-8 text-left">
          <div className="flex flex-col max-w-xl">
            <span className="text-[13.5px] bg-gray-200 px-2 rounded-xl border border-gray-200 py-1 font-medium text-black font-outfit mb-2 flex items-center gap-1.5 select-none w-fit">
              For CAs & Accountants
            </span>
            <h3 className="text-2xl md:text-3xl font-semibold text-black font-outfit tracking-tight leading-tight">
              Refer clients. Earn every month.
            </h3>
            <p className="mt-2 text-sm text-gray-600 font-normal leading-relaxed">
              Join free. Each client you bring earns you ₹300/month — forever.
            </p>
          </div>

          <div className="flex flex-col items-center lg:items-start text-center lg:text-left select-none md:mx-6">
            <span className="text-3xl md:text-4xl font-extrabold text-[#FFC700] font-outfit tracking-tight">
              ₹6,000
            </span>
            <span className="text-xs text-zinc-500 font-medium mt-1">
              per month · just 20 clients
            </span>
          </div>

          <div className="shrink-0 w-full lg:w-auto flex justify-center lg:justify-start">
            <Link
              href="/signup?ref=ca_partner"
              className="pl-2 pr-6 py-2 bg-[#FFC700] hover:bg-[#E6B200] text-black font-medium rounded-full text-center text-sm whitespace-nowrap cursor-pointer flex items-center gap-3"
            >
              <div className="flex-shrink-0 w-9 h-9 bg-black rounded-full flex items-center justify-center">
                <div className="grid grid-cols-5 gap-[2px]">
                  {/* Row 0 */}
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />

                  {/* Row 1 */}
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />

                  {/* Row 2 */}
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />

                  {/* Row 3 */}
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />

                  {/* Row 4 */}
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
                </div>
              </div>
              Join as CA Partner
            </Link>
          </div>
        </div>

        <div id="compare-table" className="max-w-[1280px] mx-auto text-left mt-28">
          <div className="flex flex-col mb-10 select-none">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 font-outfit tracking-tight">
              Full Comparison
            </h3>
            <p className="text-sm text-gray-500 font-normal mt-1">
              Deep dive into limits, automation modules, legal frameworks, and ERP sync support.
            </p>
          </div>
          <div className="w-full overflow-x-auto lg:overflow-visible bg-transparent">
            <table className="w-full text-left border-separate border-spacing-0 min-w-[1000px] mb-12">
              <thead className="sticky top-16 z-30 bg-white">
                <tr className="bg-white">
                  {/* Left Column: Billing Toggle */}
                  <th className="py-6 px-4 bg-white align-middle w-[25%] shadow-[0_1px_0_0_#E2E8F0] border-r border-gray-100">
                    <div className="flex flex-col gap-2 select-none text-left">
                      <span className="text-base font-medium text-gray-900 tracking-tight block font-outfit">
                        Billing frequency
                      </span>
                      <div className="relative inline-flex bg-gray-100 p-1 rounded-xl border border-gray-200/50 w-fit">
                        <button
                          onClick={() => setBillingPeriod("yearly")}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                            billingPeriod === "yearly"
                              ? "bg-[#0D8A4F] text-white shadow-xs"
                              : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          Bill annually
                        </button>
                        <button
                          onClick={() => setBillingPeriod("monthly")}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                            billingPeriod === "monthly"
                              ? "bg-[#0D8A4F] text-white shadow-xs"
                              : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          Bill monthly
                        </button>
                      </div>
                    </div>
                  </th>

                  {/* Free Column */}
                  <th className="py-6 px-4 bg-white shadow-[0_1px_0_0_#E2E8F0] align-middle w-[15%] text-center border-r border-gray-100">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm md:text-base font-bold text-black block font-outfit leading-tight select-none">
                        Free
                      </span>
                      <span className="text-[11px] md:text-[12px] text-zinc-400 font-medium mt-1 block leading-tight select-none">
                        Free forever
                      </span>
                    </div>
                  </th>

                  {/* Starter Column */}
                  <th className="py-6 px-4 bg-white shadow-[0_1px_0_0_#E2E8F0] align-middle w-[15%] text-center border-r border-gray-100">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm md:text-base font-bold text-black block font-outfit leading-tight select-none">
                        Starter
                      </span>
                      <span className="text-[11px] md:text-[12px] text-zinc-400 font-medium mt-1 block leading-tight select-none whitespace-nowrap">
                        {billingPeriod === "yearly" ? "₹319/mo" : "₹399/mo"}
                      </span>
                    </div>
                  </th>

                  {/* Pro Column */}
                  <th className="py-6 px-4 bg-white shadow-[0_1px_0_0_#E2E8F0] align-middle w-[15%] text-center border-r border-gray-100">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm md:text-base font-bold text-black block font-outfit leading-tight select-none">
                        Pro
                      </span>
                      <span className="text-[11px] md:text-[12px] text-zinc-400 font-medium mt-1 block leading-tight select-none whitespace-nowrap">
                        {billingPeriod === "yearly" ? "₹799/mo" : "₹999/mo"}
                      </span>
                    </div>
                  </th>

                  {/* Enterprise Column */}
                  <th className="py-6 px-4 bg-white shadow-[0_1px_0_0_#E2E8F0] align-middle w-[15%] text-center border-r border-gray-100">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm md:text-base font-bold text-black block font-outfit leading-tight select-none">
                        Enterprise
                      </span>
                      <span className="text-[11px] md:text-[12px] text-zinc-400 font-medium mt-1 block leading-tight select-none whitespace-nowrap">
                        {billingPeriod === "yearly" ? "₹7,999/mo" : "₹9,999/mo"}
                      </span>
                    </div>
                  </th>

                  {/* CA Partner Column */}
                  <th className="py-6 px-4 bg-white shadow-[0_1px_0_0_#E2E8F0] align-middle w-[15%] text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm md:text-base font-bold text-black block font-outfit leading-tight select-none">
                        CA Partner
                      </span>
                      <span className="text-[11px] md:text-[12px] text-zinc-400 font-medium mt-1 block leading-tight select-none whitespace-nowrap">
                        Free · earn ₹300/client
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonCategories.map((category, catIdx) => (
                  <React.Fragment key={catIdx}>
                    {/* Spacer Row between categories (not first) */}
                    {catIdx > 0 && (
                      <tr>
                        <td colSpan={6} className="h-14 bg-transparent border-none"></td>
                      </tr>
                    )}

                    {/* Category Header Row */}
                    <tr className="bg-gray-50/50">
                      <td colSpan={6} className="py-4 px-4 text-sm md:text-base font-semibold tracking-tight text-black font-outfit border-t border-b border-gray-200">
                        {category.name}
                      </td>
                    </tr>

                    {/* Feature Rows */}
                    {category.features.map((feature, featIdx) => (
                      <tr
                        key={featIdx}
                        className="hover:bg-gray-50/30 transition-colors duration-150"
                      >
                        <td className="py-4 px-4 text-xs md:text-[14px] font-medium text-gray-700 w-[25%] border-r border-b border-gray-200">
                          {feature.name}
                        </td>
                        <td className="py-4 px-2 text-center w-[15%] border-r border-b border-gray-200">
                          {renderTableValue(feature.free)}
                        </td>
                        <td className="py-4 px-2 text-center w-[15%] border-r border-b border-gray-200">
                          {renderTableValue(feature.starter)}
                        </td>
                        <td className="py-4 px-2 text-center w-[15%] border-r border-b border-gray-200">
                          {renderTableValue(feature.growth)}
                        </td>
                        <td className="py-4 px-2 text-center w-[15%] border-r border-b border-gray-200">
                          {renderTableValue(feature.capro)}
                        </td>
                        <td className="py-4 px-2 text-center w-[15%] border-b border-gray-200">
                          {renderTableValue(feature.enterprise)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}

                {/* Bottom Spacer before actions */}
                <tr>
                  <td colSpan={6} className="h-14 bg-transparent border-none"></td>
                </tr>

                {/* Bottom Action Row (Visual CTA Buttons) */}
                <tr className="bg-gray-50/20">
                  <td className="py-6 px-4 text-xs md:text-[14px] font-bold text-gray-900 w-[25%] border-r border-t border-b border-gray-200">
                    Get started
                  </td>
                  <td className="py-4 px-2 text-center w-[15%] border-r border-t border-b border-gray-200">
                    <Link
                      href="/signup"
                      className="px-5 py-2.5 bg-black hover:bg-zinc-900 text-white rounded-full text-xs font-semibold block w-fit mx-auto transition-all active:scale-95 whitespace-nowrap font-sans"
                    >
                      Free
                    </Link>
                  </td>
                  <td className="py-4 px-2 text-center w-[15%] border-r border-t border-b border-gray-200">
                    <Link
                      href="/signup?plan=chota_vyaapar"
                      className="px-5 py-2.5 bg-black hover:bg-zinc-900 text-white rounded-full text-xs font-semibold block w-fit mx-auto transition-all active:scale-95 whitespace-nowrap font-sans"
                    >
                      ₹399/mo
                    </Link>
                  </td>
                  <td className="py-4 px-2 text-center w-[15%] border-r border-t border-b border-gray-200">
                    <Link
                      href="/signup?plan=vyaapar_pro"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold block w-fit mx-auto transition-all active:scale-95 whitespace-nowrap font-sans"
                    >
                      14-day trial
                    </Link>
                  </td>
                  <td className="py-4 px-2 text-center w-[15%] border-r border-t border-b border-gray-200">
                    <Link
                      href="/signup?plan=udyog"
                      className="px-5 py-2.5 bg-black hover:bg-zinc-900 text-white rounded-full text-xs font-semibold block w-fit mx-auto transition-all active:scale-95 whitespace-nowrap font-sans"
                    >
                      Talk to us
                    </Link>
                  </td>
                  <td className="py-4 px-2 text-center w-[15%] border-t border-b border-gray-200">
                    <Link
                      href="/signup?ref=ca_partner"
                      className="px-5 py-2.5 bg-[#FFC700] hover:bg-[#E6B200] text-black rounded-full text-xs font-semibold block w-fit mx-auto transition-all active:scale-95 whitespace-nowrap flex items-center gap-1 font-sans justify-center"
                    >
                      Join free →
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
