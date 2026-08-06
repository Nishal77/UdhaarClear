"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { PLAN_PRICING } from "@/lib/pricing";



export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<number, boolean>>({});


  const plans = [
    {
      name: "Free",
      description: "Free until first ₹1 lakh recovered",
      monthlyPrice: 0,
      yearlyPrice: 0,
      priceSubtext: "Free forever · 3 customers",
      badge: null,
      isHighlighted: false,
      buttonText: "Get started",
      features: [
        { text: "200 debtors, 2 users", included: true },
        { text: "Full escalation ladder", included: true },
        { text: "WhatsApp · SMS · email", included: true },
        { text: "UPI payment links", included: true },
        { text: "Promise-to-pay tracking", included: true },
        { text: "Contact-window compliance", included: true },
        { text: "Hindi templates", included: false },
      ],
    },
    {
      name: "Starter",
      description: "+ 3% of what we recover",
      monthlyPrice: PLAN_PRICING.STARTER.monthly,
      yearlyPrice: PLAN_PRICING.STARTER.annualPerMonth,
      priceSubtext: "/month · 15 customers",
      badge: null,
      isHighlighted: false,
      buttonText: "Choose Starter",
      features: [
        { text: "200 debtors, 2 users", included: true },
        { text: "Full escalation ladder", included: true },
        { text: "WhatsApp · SMS · email", included: true },
        { text: "UPI payment links", included: true },
        { text: "Promise-to-pay tracking", included: true },
        { text: "Contact-window compliance", included: true },
        { text: "Hindi templates", included: false },
      ],
    },
    {
      name: "Growth",
      description: "+ 2% of what we recover",
      monthlyPrice: PLAN_PRICING.GROWTH.monthly,
      yearlyPrice: PLAN_PRICING.GROWTH.annualPerMonth,
      priceSubtext: "/month · Unlimited",
      badge: "★ Most popular",
      isHighlighted: true,
      buttonText: "Choose Growth",
      features: [
        { text: "1,000 debtors, 10 users", included: true },
        { text: "Everything in Starter, plus", included: true },
        { text: "Tally two-way sync", included: true },
        { text: "MSMED interest notices", included: true },
        { text: "Legal notice + human gate", included: true },
        { text: "All 8 languages Support", included: true },
        { text: "CA-ready reports", included: true },
      ],
    },
    {
      name: "Scale",
      description: "+ 1% of what we recover",
      monthlyPrice: PLAN_PRICING.CA_PRO.monthly,
      yearlyPrice: PLAN_PRICING.CA_PRO.annualPerMonth,
      priceSubtext: "/month · Teams + API",
      badge: null,
      isHighlighted: false,
      buttonText: "Choose Scale",
      features: [
        { text: "Unlimited debtors + users", included: true },
        { text: "Everything in Growth, plus", included: true },
        { text: "Recovery scoring", included: true },
        { text: "Cash-flow forecasting", included: true },
        { text: "Credit limits + alerts", included: true },
        { text: "Debtor + CA portals", included: true },
        { text: "API and approvals", included: true },
      ],
    },
  ];

  const comparisonCategories = [
    {
      name: "Know what you're owed",
      features: [
        { name: "CSV and Excel import", free: "✓", starter: "✓", growth: "✓", scale: "✓" },
        { name: "Ageing dashboard and DSO", free: "✓", starter: "✓", growth: "✓", scale: "✓" },
        { name: "Debtor timeline", free: "—", starter: "✓", growth: "✓", scale: "✓" },
      ]
    },
    {
      name: "Collect it",
      features: [
        { name: "Escalation ladder", free: "—", starter: "✓", growth: "✓", scale: "✓" },
        { name: "WhatsApp, SMS, email", free: "—", starter: "✓", growth: "✓", scale: "✓" },
        { name: "UPI and payment links", free: "—", starter: "✓", growth: "✓", scale: "✓" },
        { name: "Promise-to-pay tracking", free: "—", starter: "✓", growth: "✓", scale: "✓" },
        { name: "Strategic-account gate", free: "—", starter: "✓", growth: "✓", scale: "✓" },
        { name: "Contact window and festival rules", free: "—", starter: "✓", growth: "✓", scale: "✓" },
        { name: "AI reply classification", free: "—", starter: "✓", growth: "✓", scale: "✓" },
      ]
    },
    {
      name: "Escalate properly",
      features: [
        { name: "Tally two-way sync", free: "—", starter: "—", growth: "✓", scale: "✓" },
        { name: "MSMED interest notices", free: "—", starter: "—", growth: "✓", scale: "✓" },
        { name: "Legal notice templates", free: "—", starter: "—", growth: "✓", scale: "✓" },
        { name: "Section 43B(h) exposure report", free: "—", starter: "—", growth: "✓", scale: "✓" },
        { name: "Disputes module", free: "—", starter: "—", growth: "✓", scale: "✓" },
        { name: "Eight Indian languages", free: "—", starter: "—", growth: "✓", scale: "✓" },
        { name: "CA-ready client reports", free: "—", starter: "—", growth: "✓", scale: "✓" },
      ]
    },
    {
      name: "See it coming",
      features: [
        { name: "Recovery likelihood scoring", free: "—", starter: "—", growth: "—", scale: "✓" },
        { name: "Cash-flow forecasting", free: "—", starter: "—", growth: "—", scale: "✓" },
        { name: "Credit limits and breach alerts", free: "—", starter: "—", growth: "—", scale: "✓" },
        { name: "Anomaly detection", free: "—", starter: "—", growth: "—", scale: "✓" },
        { name: "Debtor and CA portals", free: "—", starter: "—", growth: "—", scale: "✓" },
        { name: "Samadhaan filing pack", free: "—", starter: "—", growth: "—", scale: "✓" },
        { name: "API, approvals, audit log", free: "—", starter: "—", growth: "—", scale: "✓" },
      ]
    },
    {
      name: "Limits",
      features: [
        { name: "Users", free: "1", starter: "2", growth: "10", scale: "Unlimited" },
        { name: "Debtors", free: "25", starter: "200", growth: "1,000", scale: "Unlimited" },
      ]
    }
  ];

  const renderTableValue = (val: string) => {
    const cleanVal = val.trim();
    
    if (cleanVal === "Yes" || cleanVal === "✓") {
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 text-emerald-600 select-none">
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
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[#0D8A4F] text-[12.5px] font-semibold tracking-tight select-none">
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
        <span className="text-[#000] text-[13px] md:text-sm font-semibold">
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
                2 months free
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
                    <p className="text-[13.5px] bg-blue-200 rounded-md text-gray-600 font-normal leading-relaxed h-[72px] overflow-hidden">
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
<div className="mt-1 max-w-[1280px] mx-auto bg-gray-100/80 border border-gray-100 rounded-3xl p-8 md:p-10">
  <div className="max-w-4xl">
    <h3 className="text-2xl md:text-3xl font-semibold text-black tracking-tight leading-tight">
      If we don't recover ₹1 lakh in your first 60 days, you don't pay.
    </h3>

    <p className="mt-4 text-base text-gray-600 leading-relaxed">
      No contracts. Cancel in one click. Export everything on the way out.
      We automatically move you to the cheaper plan when your outstanding
      drops.
    </p>

    <p className="mt-6 text-base font-medium text-black">
      Over ₹10 crore outstanding, or prefer to pay only on what we recover?
      <span className="underline underline-offset-4 cursor-pointer ml-1">
        Talk to us.
      </span>
    </p>
  </div>
</div>

        <div id="compare-table" className="max-w-[1280px] mx-auto text-left mt-28">
          <div className="flex flex-col mb-10 select-none">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 font-outfit tracking-tight">
              What's in each plan
            </h3>
            <p className="text-sm text-gray-500 font-normal mt-1">
             Plans are sized by your total outstanding receivables, not by how many people log in.
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
                        {billingPeriod === "yearly" ? `₹${PLAN_PRICING.STARTER.annualPerMonth}/mo` : `₹${PLAN_PRICING.STARTER.monthly}/mo`}
                      </span>
                    </div>
                  </th>

                  {/* Growth Column */}
                  <th className="py-6 px-4 bg-white shadow-[0_1px_0_0_#E2E8F0] align-middle w-[15%] text-center border-r border-gray-100">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm md:text-base font-bold text-black block font-outfit leading-tight select-none">
                        Growth
                      </span>
                      <span className="text-[11px] md:text-[12px] text-zinc-400 font-medium mt-1 block leading-tight select-none whitespace-nowrap">
                        {billingPeriod === "yearly" ? `₹${PLAN_PRICING.GROWTH.annualPerMonth}/mo` : `₹${PLAN_PRICING.GROWTH.monthly}/mo`}
                      </span>
                    </div>
                  </th>

                  {/* Scale Column */}
                  <th className="py-6 px-4 bg-white shadow-[0_1px_0_0_#E2E8F0] align-middle w-[15%] text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm md:text-base font-bold text-black block font-outfit leading-tight select-none">
                        Scale
                      </span>
                      <span className="text-[11px] md:text-[12px] text-zinc-400 font-medium mt-1 block leading-tight select-none whitespace-nowrap">
                        {billingPeriod === "yearly" ? `₹${PLAN_PRICING.CA_PRO.annualPerMonth.toLocaleString("en-IN")}/mo` : `₹${PLAN_PRICING.CA_PRO.monthly.toLocaleString("en-IN")}/mo`}
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
                        <td colSpan={5} className="h-14 bg-transparent border-none"></td>
                      </tr>
                    )}

                    {/* Category Header Row */}
                    <tr className="bg-gray-50/50">
                      <td colSpan={5} className="py-4 px-4 text-sm md:text-base font-semibold tracking-tight text-black font-outfit border-t border-b border-gray-200">
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
                        <td className="py-4 px-2 text-center w-[15%] border-b border-gray-200">
                          {renderTableValue(feature.scale)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}

                {/* Bottom Spacer before actions */}
                <tr>
                  <td colSpan={5} className="h-14 bg-transparent border-none"></td>
                </tr>

                {/* Bottom Action Row (Visual CTA Buttons) */}
                <tr className="bg-gray-50/20">
                  <td className="py-6 px-4 text-xs md:text-[14px] font-semibold text-gray-900 w-[25%] border-r border-t border-b border-gray-200 tracking-tight">
                    Get started
                  </td>
                  <td className="py-4 px-2 text-center w-[15%] border-r border-t border-b border-gray-200">
                    <Link
                      href="/signup"
                      className="w-full max-w-[140px] py-2.5 bg-black hover:bg-zinc-900 text-white rounded-xl text-xs font-semibold block mx-auto transition-all active:scale-95 whitespace-nowrap font-sans"
                    >
                      Free
                    </Link>
                  </td>
                  <td className="py-4 px-2 text-center w-[15%] border-r border-t border-b border-gray-200">
                    <Link
                      href="/signup?plan=chota_vyaapar"
                      className="w-full max-w-[140px] py-2.5 bg-black hover:bg-zinc-900 text-white rounded-xl text-xs font-semibold block mx-auto transition-all active:scale-95 whitespace-nowrap font-sans"
                    >
                      7-day trial
                    </Link>
                  </td>
                  <td className="py-4 px-2 text-center w-[15%] border-r border-t border-b border-gray-200">
                    <Link
                      href="/signup?plan=vyaapar_pro"
                      className="w-full max-w-[140px] py-2.5 bg-[#B5F670] hover:bg-[#B5F670]/90 text-black rounded-xl text-xs font-semibold block mx-auto transition-all active:scale-95 whitespace-nowrap font-sans"
                    >
                      14-day trial
                    </Link>
                  </td>
                  <td className="py-4 px-2 text-center w-[15%] border-t border-b border-gray-200">
                    <Link
                      href="/signup?plan=udyog"
                      className="w-full max-w-[140px] py-2.5 bg-black hover:bg-zinc-900 text-white rounded-xl text-xs font-semibold block mx-auto transition-all active:scale-95 whitespace-nowrap font-sans"
                    >
                      Talk to us
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
