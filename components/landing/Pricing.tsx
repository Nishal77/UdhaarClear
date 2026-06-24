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
      name: "Free",
      description: "Micro-merchants and freelancers testing automated khata ledger recovery.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      periodLabel: {
        monthly: "/month",
        yearly: "/month",
      },
      badge: null,
      isHighlighted: false,
      features: [
        "Up to 15 active customers",
        "30 automated PDF invoices/mo",
        "Smart WhatsApp alerts (standard)",
        "UPI & bank payment collection",
      ],
    },
    {
      name: "Starter",
      description: "Small traders and retail merchants establishing automated recovery sequences.",
      monthlyPrice: 799,
      yearlyPrice: 599,
      periodLabel: {
        monthly: "/month",
        yearly: "/month",
      },
      badge: null,
      isHighlighted: false,
      features: [
        "Up to 50 active customers",
        "150 automated PDF invoices/mo",
        "Tone-escalation reminder engine",
        "Custom reminder schedules",
        "Daily morning email digest",
      ],
    },
    {
      name: "Growth",
      description: "Growing wholesalers and distributors with regular late invoices.",
      monthlyPrice: 2499,
      yearlyPrice: 1999,
      periodLabel: {
        monthly: "/month",
        yearly: "/month",
      },
      badge: "Most popular",
      isHighlighted: true,
      features: [
        "Up to 250 active customers",
        "Unlimited invoices & templates",
        "15 advocate legal notices/mo",
        "Tally Prime & Zoho Books sync",
        "Aging heatmap & AI projections",
      ],
    },
    {
      name: "CA Pro",
      description: "Large manufacturers and CA Agencies managing multiple ledger networks.",
      monthlyPrice: 4999,
      yearlyPrice: 3999,
      periodLabel: {
        monthly: "/month",
        yearly: "/month",
      },
      badge: null,
      isHighlighted: false,
      features: [
        "Unlimited active customers",
        "Manage up to 20 client consoles",
        "Unlimited advocate legal notices",
        "MSME Samadhaan filing helper",
        "White-label client audit reports",
      ],
    },
  ];

  const comparisonCategories = [
    {
      name: "Summary Overview",
      features: [
        { name: "Active Customers Limit", free: "15", starter: "50", growth: "250", capro: "Unlimited", enterprise: "Unlimited" },
        { name: "Monthly Invoices", free: "30", starter: "150", growth: "Unlimited", capro: "Unlimited", enterprise: "Unlimited" },
        { name: "Client Consoles (Entities)", free: "1", starter: "1", growth: "1", capro: "Up to 20", enterprise: "Custom / Unlimited" },
        { name: "Staff User Seats", free: "1 (Owner)", starter: "2", growth: "5 (Role-based)", capro: "Unlimited", enterprise: "Unlimited" },
        { name: "Standard Support", free: "Yes", starter: "Yes", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "24/7 Priority Support & SLA", free: "No", starter: "No", growth: "No", capro: "No", enterprise: "Yes" },
      ]
    },
    {
      name: "Feature Availability Comparison",
      features: [
        { name: "Manual Ledger / Bookkeeping", free: "Yes", starter: "Yes", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Manual PDF Invoice Generation", free: "Yes", starter: "Yes", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Manual Payment Collection Links", free: "Yes", starter: "Yes", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Email Overdue Reminders", free: "Yes", starter: "Yes", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Shared System WhatsApp Channel", free: "Yes", starter: "Yes", growth: "Yes", capro: "Yes", enterprise: "No" },
        { name: "Daily Morning Email Digest", free: "No", starter: "Yes", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Automatic Tone Escalation Engine", free: "No", starter: "Standard", growth: "Advanced", capro: "Advanced", enterprise: "Advanced" },
        { name: "Custom Reminder Schedules", free: "No", starter: "Yes", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Custom Invoice & Portal Branding", free: "No", starter: "Yes", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Partial Payments Collection", free: "No", starter: "No", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Aging Heatmap Analytics", free: "No", starter: "No", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "ML Cashflow Collection Forecast", free: "No", starter: "No", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Pre-Litigation Advocate Notices", free: "No", starter: "No", growth: "Limit: 15/mo", capro: "Unlimited", enterprise: "Custom" },
        { name: "Multi-Tenant CA Admin Dashboard", free: "No", starter: "No", growth: "No", capro: "Yes", enterprise: "Yes" },
        { name: "MSME Samadhaan Filing Helper", free: "No", starter: "No", growth: "No", capro: "Yes", enterprise: "Yes" },
        { name: "White-Label Client Audits/Reports", free: "No", starter: "No", growth: "No", capro: "Yes", enterprise: "Yes" },
        { name: "Dedicated Account Success Manager", free: "No", starter: "No", growth: "No", capro: "No", enterprise: "Yes" },
        { name: "Custom Corporate Legal Workflows", free: "No", starter: "No", growth: "No", capro: "No", enterprise: "Yes" },
      ]
    },
    {
      name: "Integrations & Deliverability Matrix",
      features: [
        { name: "Excel / CSV Data Import", free: "Yes", starter: "Yes", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Direct UPI / Bank Transfer Page", free: "Yes", starter: "Yes", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Cloud Storage Fetch (G-Drive/Box)", free: "No", starter: "Yes", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Payment Gateway Links (Razorpay)", free: "No", starter: "No", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Zoho Books Native Integration", free: "No", starter: "No", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Tally Prime Local Sync Agent", free: "No", starter: "No", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Vyapar & Khatabook Exports", free: "No", starter: "No", growth: "Yes", capro: "Yes", enterprise: "Yes" },
        { name: "Custom REST API Access", free: "No", starter: "No", growth: "No", capro: "No", enterprise: "Yes" },
        { name: "Custom Webhooks for Events", free: "No", starter: "No", growth: "No", capro: "No", enterprise: "Yes" },
        { name: "Client Verified WhatsApp API (WABA)", free: "No", starter: "No", growth: "No", capro: "No", enterprise: "Yes" },
        { name: "Custom Subdomains / Domains", free: "No", starter: "No", growth: "No", capro: "No", enterprise: "Yes" },
        { name: "Enterprise ERP Sync (SAP, Oracle)", free: "No", starter: "No", growth: "No", capro: "No", enterprise: "Yes" },
      ]
    }
  ];

  const renderTableValue = (val: string) => {
    if (val === "Yes") {
      return (
        <span className="text-[#0D8A4F] text-[15px] font-bold select-none">✓</span>
      );
    }
    if (val === "No") {
      return (
        <span className="text-gray-300 text-[15px] font-semibold select-none">✕</span>
      );
    }
    return (
      <span className="text-gray-600 font-medium text-[13px] md:text-sm">
        {val}
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
            let buttonText = "Start 7-day free trial";
            let targetUrl = `/signup?plan=${plan.name.toLowerCase().replace(" ", "_")}`;

            if (plan.name === "Free") {
              buttonBg = "bg-white text-gray-900 border border-gray-200 shadow-2xs hover:bg-gray-50";
              buttonText = "Get started";
              targetUrl = "/signup";
            } else if (isGrowth) {
              buttonBg = "btn-premium-green text-white shadow-md hover:shadow-lg hover:brightness-110";
            }

            return (
              <div
                key={index}
                className={`flex flex-col rounded-[2rem] overflow-hidden transition-all duration-300 ${
                  isGrowth 
                    ? "bg-white border-2 border-[#0D8A4F]/80 lg:-mt-[37px] lg:z-10 shadow-[0_16px_48px_-4px_rgba(13,138,79,0.12)]" 
                    : plan.name === "Free"
                      ? "bg-[#EAE9E5] border border-transparent"
                      : "bg-white border border-gray-200"
                }`}
              >
                {/* Most Popular Header Bar */}
                {isGrowth && (
                  <div className="w-full btn-premium-green text-white text-center py-3 text-xs font-bold uppercase tracking-[0.15em] select-none border-b border-[#0D8A4F]/20 shadow-xs relative z-10">
                    Most popular
                  </div>
                )}

                <div className="p-7 flex flex-col justify-between flex-1">
                  <div className="flex flex-col">
                    {/* Top Badge */}
                    <span className="px-3 py-1 rounded-full border border-gray-200/60 text-[11px] font-bold text-gray-500 bg-white w-fit mb-5  select-none">
                      {plan.name}
                    </span>

                    {/* Description */}
                    <p className="text-[14px] text-gray-800 font-normal leading-relaxed mb-6 h-[48px] overflow-hidden">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-6 flex flex-col">
                      <div className="flex items-baseline gap-1 select-none font-outfit">
                        <span className="text-4xl md:text-[2.75rem] font-medium tracking-tight text-gray-950">
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                          INR
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-semibold mt-2 block">
                        {plan.name === "Free" ? "/forever" : "/month"}
                      </span>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={targetUrl}
                      className={`w-full py-3.5 ${buttonBg} font-semibold rounded-xl text-center text-xs md:text-sm transition-all duration-250 active:scale-97 mb-8 block`}
                    >
                      {buttonText}
                    </Link>

                    {/* Features Checklist */}
                    <ul className="space-y-3.5 pt-6 border-t border-gray-200/40">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm font-medium text-gray-700 leading-normal">
                          <svg className={`w-4 h-4 shrink-0 mt-0.5 ${isGrowth ? "text-[#0D8A4F]" : "text-gray-900"}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 max-w-[1280px] mx-auto bg-[#EDEDED] border border-gray-200/40 rounded-[2.2rem] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 text-left">
          <div className="flex flex-col max-w-2xl">
            <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest font-outfit mb-2 block">
              ENTERPRISE & HIGH VOLUME
            </span>
            <h3 className="text-2xl md:text-3xl font-medium text-gray-900 font-outfit tracking-tight leading-tight">
              Need custom volume, custom integrations, or dedicated enterprise support?
            </h3>
            <p className="mt-2 text-sm md:text-base text-gray-500 font-medium leading-relaxed">
              We offer custom ERP connectivity (SAP, Oracle, Microsoft Dynamics), enterprise SLAs, and custom volume pricing.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
            <a
              href="mailto:sales@udhaarclear.com?subject=UdhaarClear%20Enterprise%20Inquiry"
              className="px-8 py-4 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-full text-center text-sm transition-all duration-200 active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
            >
              Contact Enterprise Sales
            </a>
            <span className="text-center text-[10px] md:text-xs text-gray-500 font-semibold uppercase tracking-wider block mt-1">
              Response within 2 hours
            </span>
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
                  <th className="py-6 px-4 bg-white align-middle w-[25%] shadow-[0_1px_0_0_#E2E8F0]">
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

                  {/* Free Plan Card */}
                  <th className="py-4 px-2 bg-white shadow-[0_1px_0_0_#E2E8F0] align-top w-[15%]">
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 text-left flex flex-col justify-between h-[155px] font-normal">
                      <div>
                        <span className="text-lg font-medium text-black block font-outfit">Free</span>
                        <span className="text-[11px] text-gray-500 font-medium mt-1.5 block tracking-tight leading-tight">
                          {billingPeriod === "yearly" ? "₹0 user/mo billed annually" : "₹0 user/mo billed monthly"}
                        </span>
                      </div>
                      <Link
                        href="/signup"
                        className="mt-4 w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-all duration-150 active:scale-97 block text-center"
                      >
                        Get started
                      </Link>
                    </div>
                  </th>

                  {/* Starter Plan Card */}
                  <th className="py-4 px-2 bg-white shadow-[0_1px_0_0_#E2E8F0] align-top w-[15%]">
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 text-left flex flex-col justify-between h-[155px] font-normal">
                      <div>
                        <span className="text-lg font-medium text-black block font-outfit">Starter</span>
                        <span className="text-[11px] text-gray-500 font-medium mt-1.5 block tracking-tight leading-tight">
                          {billingPeriod === "yearly" ? "₹599 user/mo billed annually" : "₹799 user/mo billed monthly"}
                        </span>
                      </div>
                      <Link
                        href="/signup?plan=starter"
                        className="mt-4 w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium transition-all duration-150 active:scale-97 block text-center"
                      >
                        Get started
                      </Link>
                    </div>
                  </th>

                  {/* Growth Plan Card (Highlighted) */}
                  <th className="py-4 px-2 bg-white shadow-[0_1px_0_0_#E2E8F0] align-top w-[15%]">
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 text-left flex flex-col justify-between h-[155px] font-normal">
                      <div>
                        <span className="text-lg font-medium text-black block font-outfit">Growth</span>
                        <span className="text-[11px] text-gray-500 font-medium mt-1.5 block tracking-tight leading-tight">
                          {billingPeriod === "yearly" ? "₹1,999 user/mo billed annually" : "₹2,499 user/mo billed monthly"}
                        </span>
                      </div>
                      <Link
                        href="/signup?plan=growth"
                        className="mt-4 w-full py-2.5 rounded-xl btn-premium-green text-white text-xs font-medium transition-all duration-150 active:scale-97 block text-center "
                      >
                        Get started
                      </Link>
                    </div>
                  </th>

                  {/* CA Pro Plan Card */}
                  <th className="py-4 px-2 bg-white shadow-[0_1px_0_0_#E2E8F0] align-top w-[15%]">
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 text-left flex flex-col justify-between h-[155px] font-normal">
                      <div>
                        <span className="text-lg font-medium text-black block font-outfit">CA Pro</span>
                        <span className="text-[11px] text-gray-500 font-medium mt-1.5 block tracking-tight leading-tight">
                          {billingPeriod === "yearly" ? "₹3,999 user/mo billed annually" : "₹4,999 user/mo billed monthly"}
                        </span>
                      </div>
                      <Link
                        href="/signup?plan=ca_pro"
                        className="mt-4 w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-all duration-150 active:scale-97 block text-center"
                      >
                        Get started
                      </Link>
                    </div>
                  </th>

                  {/* Enterprise Plan Card */}
                  <th className="py-4 px-2 bg-white shadow-[0_1px_0_0_#E2E8F0] align-top w-[15%]">
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 text-left flex flex-col justify-between h-[155px] font-normal">
                      <div>
                        <span className="text-lg font-medium text-black block font-outfit">Enterprise</span>
                        <span className="text-[11px] text-gray-500 font-medium mt-1.5 block tracking-tight leading-tight">
                          Custom volume pricing
                        </span>
                      </div>
                      <a
                        href="mailto:sales@udhaarclear.com?subject=UdhaarClear%20Enterprise%20Inquiry"
                        className="mt-4 w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-all duration-150 active:scale-97 block text-center"
                      >
                        Talk to sales
                      </a>
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
                    <tr className="border-t border-b border-gray-200 bg-gray-50/50">
                      <td colSpan={6} className="py-4 px-4 text-sm md:text-base font-medium tracking-tight text-black font-outfit">
                        {category.name}
                      </td>
                    </tr>

                    {/* Feature Rows */}
                    {category.features.map((feature, featIdx) => (
                      <tr
                        key={featIdx}
                        className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors duration-150"
                      >
                        <td className="py-4 px-4 text-xs md:text-[14px] font-medium text-gray-700 w-[25%]">
                          {feature.name}
                        </td>
                        <td className="py-4 px-2 text-center w-[15%]">
                          {renderTableValue(feature.free)}
                        </td>
                        <td className="py-4 px-2 text-center w-[15%]">
                          {renderTableValue(feature.starter)}
                        </td>
                        <td className="py-4 px-2 text-center w-[15%]">
                          {renderTableValue(feature.growth)}
                        </td>
                        <td className="py-4 px-2 text-center w-[15%]">
                          {renderTableValue(feature.capro)}
                        </td>
                        <td className="py-4 px-2 text-center w-[15%]">
                          {renderTableValue(feature.enterprise)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
