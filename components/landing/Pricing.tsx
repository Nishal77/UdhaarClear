"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";



export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<number, boolean>>({});

  const toggleCategory = (idx: number) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const plans = [
    {
      name: "Starter",
      description: "Small trader or freelancer just starting to organise collections.",
      monthlyPrice: 799,
      yearlyPrice: 666,
      periodLabel: {
        monthly: "/month",
        yearly: "/mo",
      },
      billingLabel: {
        monthly: "Billed Per Month",
        yearly: "billed annually — save ₹1,596",
      },
      badge: null,
      isHighlighted: false,
      bgColor: "bg-[#EDEDED]",
      textColor: "text-gray-900",
      descColor: "text-gray-500",
      priceColor: "text-gray-900",
      features: [
        "15 Active Invoices /month",
        "Automated WhatsApp Reminders",
        "UPI Payment Links",
        "Customer Ledgers (Khata Book)",
        "Basic Reports & Dashboard",
        "Standard Email Support",
      ],
      checkBg: "border-gray-400 text-gray-700",
    },
    {
      name: "Growth",
      description: "Growing business with regular outstanding. ROI is 4.6× in working capital alone.",
      monthlyPrice: 1999,
      yearlyPrice: 1666,
      periodLabel: {
        monthly: "/month",
        yearly: "/mo",
      },
      billingLabel: {
        monthly: "Billed Per Month",
        yearly: "billed annually — save ₹3,996",
      },
      badge: "POPULAR",
      isHighlighted: true,
      bgColor: "bg-[#4F46E5]", // Premium Indigo/Blue as requested
      textColor: "text-white",
      descColor: "text-indigo-200",
      priceColor: "text-white",
      features: [
        "75 Active Invoices /month",
        "Custom WhatsApp Templates",
        "Smart Follow-up Escalation Rules",
        "Automatic Retry Sequences",
        "Advanced Analytics Dashboard",
        "Priority Call & WhatsApp Support",
      ],
      checkBg: "border-white/40 text-white",
    },
    {
      name: "Scale",
      description: "Medium enterprise with large invoice volumes and a team managing collections.",
      monthlyPrice: 4999,
      yearlyPrice: 4166,
      periodLabel: {
        monthly: "/month",
        yearly: "/mo",
      },
      billingLabel: {
        monthly: "Billed Per Month",
        yearly: "billed annually — save ₹9,996",
      },
      badge: null,
      isHighlighted: false,
      bgColor: "bg-[#EDEDED]",
      textColor: "text-gray-900",
      descColor: "text-gray-500",
      priceColor: "text-gray-900",
      features: [
        "300 Active Invoices /month",
        "Dedicated WhatsApp API (WABA)",
        "Custom Branding & Domain Map",
        "Multi-user Access (5 Seats)",
        "Full API & Webhooks Access",
        "Dedicated Integration Manager",
      ],
      checkBg: "border-gray-400 text-gray-700",
    },
    {
      name: "CA / Agency",
      description: "Chartered Accountants and collection agencies managing multiple client businesses.",
      monthlyPrice: 9999,
      yearlyPrice: 9999,
      periodLabel: {
        monthly: "/month",
        yearly: "/month",
      },
      billingLabel: {
        monthly: "Per agency · Up to 25 clients included",
        yearly: "Per agency · Up to 25 clients included",
      },
      badge: null,
      isHighlighted: false,
      bgColor: "bg-[#EDEDED]",
      textColor: "text-gray-900",
      descColor: "text-gray-500",
      priceColor: "text-gray-900",
      features: [
        "Up to 25 Client Accounts Included",
        "Shared Clients Dashboard",
        "Automated Client Due Reminders",
        "White-labeled PDF Ledger Reports",
        "CA/Agency Portal Console",
        "Dedicated Account Manager",
      ],
      checkBg: "border-gray-400 text-gray-700",
    },
  ];

  const categories = [
    {
      name: "Invoices & Customers",
      features: [
        { name: "Active invoices", starter: "Up to 50", growth: "Up to 300", scale: "Unlimited", ca: "Unlimited" },
        { name: "Customer profiles", starter: "Yes", growth: "Yes", scale: "Yes", ca: "Yes" },
        { name: "Customer health scores", starter: "Basic", growth: "Full", scale: "Full + AI", ca: "Full + AI" },
        { name: "Excel / CSV import", starter: "Yes", growth: "Yes", scale: "Yes", ca: "Yes" },
        { name: "Tally ERP sync", starter: "No", growth: "Yes", scale: "Yes", ca: "Yes" },
      ],
    },
    {
      name: "WhatsApp Reminders",
      features: [
        { name: "WhatsApp reminders (Meta API)", starter: "Unlimited", growth: "Unlimited", scale: "Unlimited", ca: "Unlimited" },
        { name: "Razorpay UPI in every message", starter: "Yes", growth: "Yes", scale: "Yes", ca: "Yes" },
        { name: "AI Tone Engine (3 phases)", starter: "Basic", growth: "Full", scale: "Full + Custom", ca: "Full + Custom" },
        { name: "Custom message templates", starter: "No", growth: "Yes", scale: "Yes", ca: "Yes + per-client" },
        { name: "Read receipt tracking", starter: "Yes", growth: "Yes", scale: "Yes", ca: "Yes" },
        { name: "UPI link tap tracking", starter: "Yes", growth: "Yes", scale: "Yes", ca: "Yes" },
        { name: "Scheduled reminder timing", starter: "Default only", growth: "Custom", scale: "Custom", ca: "Custom per client" },
      ],
    },
    {
      name: "Legal & MSME",
      features: [
        { name: "Legal notice (MSME Act 2006)", starter: "No", growth: "Yes — Auto", scale: "Yes — Auto", ca: "Yes — Auto" },
        { name: "MSME Samadhaan filing doc", starter: "No", growth: "Yes", scale: "Yes", ca: "Yes" },
        { name: "Compound interest calculation", starter: "No", growth: "Yes", scale: "Yes", ca: "Yes" },
      ],
    },
    {
      name: "Dashboard & Analytics",
      features: [
        { name: "Live recovery dashboard", starter: "Yes", growth: "Yes", scale: "Yes", ca: "Yes" },
        { name: "Recovery analytics & reports", starter: "Basic", growth: "Full", scale: "Full + Export", ca: "Full + per-client" },
        { name: "AI predictive insights", starter: "No", growth: "No", scale: "Yes", ca: "Yes" },
        { name: "Invoice aging heatmap", starter: "Yes", growth: "Yes", scale: "Yes", ca: "Yes" },
        { name: "Daily email / WhatsApp summary", starter: "No", growth: "Yes", scale: "Yes", ca: "Yes" },
      ],
    },
    {
      name: "Team & Access",
      features: [
        { name: "Team members / users", starter: "1 user", growth: "1 user", scale: "Up to 5", ca: "Unlimited" },
        { name: "Role-based permissions", starter: "No", growth: "No", scale: "Yes", ca: "Yes" },
        { name: "Multi-business accounts", starter: "No", growth: "No", scale: "Yes (2)", ca: "Up to 25 clients" },
        { name: "White-label branding", starter: "No", growth: "No", scale: "Optional add-on", ca: "Yes — Included" },
      ],
    },
    {
      name: "Support",
      features: [
        { name: "Customer support", starter: "Email only", growth: "Priority WhatsApp", scale: "Dedicated account manager", ca: "Dedicated + onboarding" },
        { name: "Setup assistance", starter: "Self-service", growth: "Guided setup call", scale: "Full onboarding", ca: "Full + client onboarding" },
      ],
    },
    {
      name: "API & Reliability",
      features: [
        { name: "API access + webhooks", starter: "No", growth: "No", scale: "Yes", ca: "Yes" },
        { name: "SLA-backed uptime", starter: "No", growth: "No", scale: "99.9% SLA", ca: "99.9% SLA" },
        { name: "Free trial", starter: "14 days free", growth: "14 days free", scale: "14 days free", ca: "30 days free" },
      ],
    },
  ];

  const renderValue = (val: string, colName: string, isHighlighted: boolean) => {
    if (val === "Yes") {
      if (colName === "growth") {
        return (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#4F46E5] text-white shadow-sm">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        );
      }
      if (colName === "ca") {
        return (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#8B5CF6] text-white shadow-sm">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        );
      }
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-800 text-white shadow-sm">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      );
    }
    if (val === "No") {
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-400">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      );
    }

    // Purple highlights for CA Plan
    const isPurpleHighlight = colName === "ca" && (
      val === "Unlimited" || 
      val === "Up to 25 clients" || 
      val === "Yes — Included" || 
      val === "30 days free"
    );

    if (isPurpleHighlight) {
      return <span className="text-[#8B5CF6] font-bold text-sm md:text-base">{val}</span>;
    }

    // Bold highlights for Growth
    const isBoldHighlight = colName === "growth" && (
      val === "Up to 300" || 
      val === "Full" || 
      val === "Yes — Auto" || 
      val === "Priority WhatsApp" ||
      val === "Custom"
    );

    if (isBoldHighlight) {
      return <span className="text-gray-900 font-bold text-sm md:text-base">{val}</span>;
    }

    return (
      <span className={`text-sm md:text-base font-medium ${
        isHighlighted ? "text-gray-900" : "text-gray-600"
      }`}>
        {val}
      </span>
    );
  };

  return (
    <section id="pricing" className="relative w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32 border-b border-gray-100">
      {/* Decorative background grid and lights */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at top left, rgba(0, 73, 255, 0.04), transparent 600px),
            radial-gradient(circle at bottom right, rgba(99, 102, 241, 0.03), transparent 600px)
          `
        }}
      />

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 text-center">
        
        {/* Pricing tag badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200/60 bg-blue-50/40 text-[#0047FF] text-xs font-semibold tracking-wide font-outfit uppercase mb-6 shadow-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Pricing
        </div>

        {/* Heading */}
        <h2 className="text-[2.75rem] md:text-[3.25rem] font-medium text-gray-900 tracking-tight leading-[1.15] font-outfit max-w-5xl mx-auto">
          Try For Free And Start Controlling Your Finances
        </h2>

        {/* Pricing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-10 mb-16">
          <div className="relative flex bg-gray-100/80 p-1 rounded-full border border-gray-200/50 shadow-inner">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`relative px-6 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-300 ${billingPeriod === "monthly"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`relative px-6 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-300 ${billingPeriod === "yearly"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              Yearly
            </button>
          </div>
          <span className="flex items-center gap-1 bg-rose-50 text-rose-500 border border-rose-100 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            -20% Save
          </span>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1280px] mx-auto text-left items-stretch">
          {plans.map((plan, index) => {
            const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const periodLabel = plan.periodLabel[billingPeriod];
            const billingLabel = plan.billingLabel[billingPeriod];
            
            return (
              <div
                key={index}
                className={`relative flex flex-col rounded-[2.2rem] overflow-hidden p-7 md:p-8 ${plan.bgColor} ${plan.textColor} shadow-sm`}
              >
                {/* Header: Title + Badge & Description */}
                <div className="relative z-10 flex flex-col mb-4 md:min-h-[110px]">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="text-xl md:text-2xl font-medium font-outfit tracking-tight">
                      {plan.name}
                    </h3>
                    {plan.badge && (
                      <span className="bg-[#FF6B00] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full tracking-wider">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs md:text-sm font-medium ${plan.descColor} leading-relaxed`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price block & Billing subtext */}
                <div className="relative z-10 flex flex-col justify-end mb-6 md:min-h-[90px]">
                  <div className="flex items-baseline gap-0.5 mb-1">
                    <span className="text-4xl md:text-5xl font-medium tracking-tight font-outfit">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs md:text-sm font-bold opacity-85">
                      {periodLabel}
                    </span>
                  </div>
                  <p className={`text-[10px] md:text-xs font-semibold ${plan.descColor} opacity-75`}>
                    {billingLabel}
                  </p>
                </div>

                {/* Pill CTA button placed right under price */}
                <button
                  className="relative z-10 w-full py-3.5 bg-[#000] text-white font-medium rounded-full text-center text-xs md:text-sm transition-all hover:bg-white/95 active:scale-95 duration-200 mb-8"
                >
                  Start 7-Days Free Trial
                </button>

                {/* Feature List below the button */}
                <ul className="relative z-10 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs md:text-sm font-medium opacity-90 leading-tight">
                      <span className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${plan.checkBg}`}>
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Sync Integrations Banner */}
        <div className="mt-20 max-w-[1280px] mx-auto bg-[#EDEDED] border border-gray-200/40 rounded-[2.2rem] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 text-left">
          <div className="flex flex-col max-w-xl">
            <h3 className="text-2xl md:text-3xl font-medium text-gray-900 font-outfit tracking-tight">
              Sync Tally, Zoho, or Excel in 1-Click
            </h3>
            <p className="mt-2 text-sm md:text-base text-gray-500 font-medium leading-relaxed">
              Automate payment recovery for your outstanding bills without changing your existing accounting software.
            </p>
            <a 
              href="#explore"
              className="mt-6 text-[#4F46E5] hover:text-[#4338CA] font-semibold flex items-center gap-1 text-sm group"
            >
              Explore integrations 
              <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
          </div>

          <div className="flex gap-4 md:gap-5 items-center">
            {/* Logo 1: Tally */}
            <div className="relative flex flex-col items-center py-10">
              <svg className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 h-full z-0 text-gray-200/70" viewBox="0 0 32 140" fill="none">
                <path d="M16 0 C8 35, 24 70, 16 105 C8 120, 24 130, 16 140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
              <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#0B4C28] flex items-center justify-center shadow-md border border-[#093d20] hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold font-outfit text-xl tracking-tight">T</span>
              </div>
            </div>

            {/* Logo 2: Zoho */}
            <div className="relative flex flex-col items-center py-10">
              <svg className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 h-full z-0 text-gray-200/70" viewBox="0 0 32 140" fill="none">
                <path d="M16 0 C24 35, 8 70, 16 105 C24 120, 8 130, 16 140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
              <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#FFFFFF] flex items-center justify-center shadow-md border border-gray-200/60 hover:scale-105 transition-transform duration-200">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="8" height="8" rx="1.5" fill="#EA4335" />
                  <rect x="14" y="2" width="8" height="8" rx="1.5" fill="#4285F4" />
                  <rect x="2" y="14" width="8" height="8" rx="1.5" fill="#FBBC05" />
                  <rect x="14" y="14" width="8" height="8" rx="1.5" fill="#34A853" />
                </svg>
              </div>
            </div>

            {/* Logo 3: Excel */}
            <div className="relative flex flex-col items-center py-10">
              <svg className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 h-full z-0 text-gray-200/70" viewBox="0 0 32 140" fill="none">
                <path d="M16 0 C8 35, 24 70, 16 105 C8 120, 24 130, 16 140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
              <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#107C41] flex items-center justify-center shadow-md border border-[#0d6233] hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold font-outfit text-xl tracking-tight">X</span>
              </div>
            </div>

            {/* Logo 4: Busy */}
            <div className="relative flex flex-col items-center py-10">
              <svg className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 h-full z-0 text-gray-200/70" viewBox="0 0 32 140" fill="none">
                <path d="M16 0 C24 35, 8 70, 16 105 C24 120, 8 130, 16 140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
              <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#FF6B00] flex items-center justify-center shadow-md border border-[#e05e00] hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold font-outfit text-xl tracking-tight">B</span>
              </div>
            </div>

            {/* Logo 5: Vyapaar */}
            <div className="relative flex flex-col items-center py-10">
              <svg className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 h-full z-0 text-gray-200/70" viewBox="0 0 32 140" fill="none">
                <path d="M16 0 C8 35, 24 70, 16 105 C8 120, 24 130, 16 140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
              <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#EA4335] flex items-center justify-center shadow-md border border-[#d63224] hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold font-outfit text-xl tracking-tight">V</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 md:mt-32 max-w-[1280px] mx-auto text-left">
          <div className="w-full overflow-x-auto lg:overflow-visible bg-transparent">
            <table className="w-full border-separate border-spacing-0 text-left min-w-[900px]">
              <thead>
                <tr>
                  {/* Left-hand column header showing table title/description */}
                  <th className="py-8 pr-6 bg-white border-b border-gray-200 w-[30%] sticky top-[70px] md:top-[96px] z-30 text-left">
                    <div className="flex flex-col gap-2 h-full justify-end pb-3">
                      <h4 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 font-outfit tracking-tight leading-tight">
                        Compare plans
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed">
                        Compare detailed features across all plans.
                      </p>
                    </div>
                  </th>
                  {/* Cards for each plan */}
                  {plans.map((plan, idx) => {
                    const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
                    const isGrowth = plan.name === "Growth";
                    return (
                      <th
                        key={idx}
                        className="py-8 px-4 bg-white border-b border-gray-200 w-[17.5%] align-top text-center sticky top-[70px] md:top-[96px] z-30 border-l border-gray-200/50"
                      >
                        <div className="flex flex-col items-center w-full">
                          <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest font-outfit">
                            {plan.name === "CA / Agency" ? "CA & AGENCY PLAN" : `${plan.name.toUpperCase()} PLAN`}
                          </span>
                          
                          <div className="mt-2 flex items-baseline justify-center gap-0.5">
                            <span className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight font-outfit">
                              ₹{price.toLocaleString("en-IN")}
                            </span>
                            <span className="text-xs md:text-sm font-semibold text-gray-500">
                              {plan.periodLabel[billingPeriod]}
                            </span>
                          </div>

                          <span className="mt-1 text-[10px] md:text-xs text-gray-500 font-medium">
                            {billingPeriod === "monthly" 
                              ? "Billed monthly" 
                              : `₹${(price * 12).toLocaleString("en-IN")} billed annually`
                            }
                          </span>

                          <button
                            className={`mt-4 px-6 py-2 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                              isGrowth
                                ? "bg-[#4F46E5] text-white hover:bg-[#4338CA] active:scale-95 shadow-sm"
                                : "bg-gray-100 text-gray-750 hover:bg-gray-200 active:scale-95"
                            }`}
                          >
                            {plan.name === "CA / Agency" ? "Get Started" : "Start Trial"}
                          </button>

                          <p className="mt-3 text-[10px] md:text-xs text-gray-500 font-medium max-w-[150px] leading-normal">
                            {plan.description}
                          </p>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {categories.map((category, catIdx) => {
                  const isCollapsed = !!collapsedCategories[catIdx];
                  return (
                    <React.Fragment key={catIdx}>
                      {/* Category Header Row (Collapsible) */}
                      <tr
                        className="cursor-pointer select-none"
                        onClick={() => toggleCategory(catIdx)}
                      >
                        <td colSpan={5} className="pt-8 pb-3 bg-white border-b border-gray-100">
                          <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-gray-50 text-gray-800 hover:bg-gray-100/70 transition-all duration-200 font-bold text-xs md:text-sm font-outfit uppercase tracking-wider">
                            <span>{category.name}</span>
                            <span className={`transform transition-transform duration-200 ${isCollapsed ? "" : "rotate-180"}`}>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Feature Rows (Rendered only if not collapsed) */}
                      {!isCollapsed &&
                        category.features.map((feature, featIdx) => (
                          <tr
                            key={featIdx}
                            className="hover:bg-gray-50/40 transition-colors duration-150"
                          >
                            <td className="py-4 pl-6 pr-6 text-xs md:text-sm font-medium text-gray-700 w-[30%] border-b border-gray-100 bg-white">
                              <div className="flex items-center gap-1.5">
                                <span>{feature.name}</span>
                                <span className="text-gray-300 hover:text-gray-500 cursor-pointer transition-colors duration-150">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4" />
                                    <path d="M12 8h.01" />
                                  </svg>
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-2 text-center w-[17.5%] border-b border-gray-100 border-l border-gray-200/30 bg-white">
                              {renderValue(feature.starter, "starter", false)}
                            </td>
                            <td className="py-4 px-2 text-center w-[17.5%] bg-[#4F46E5]/[0.015] border-b border-gray-100 border-l border-gray-200/30">
                              {renderValue(feature.growth, "growth", true)}
                            </td>
                            <td className="py-4 px-2 text-center w-[17.5%] border-b border-gray-100 border-l border-gray-200/30 bg-white">
                              {renderValue(feature.scale, "scale", false)}
                            </td>
                            <td className="py-4 pl-2 pr-6 text-center w-[17.5%] border-b border-gray-100 border-l border-gray-200/30 bg-white">
                              {renderValue(feature.ca, "ca", false)}
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
