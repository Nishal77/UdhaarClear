"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";



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
      name: "Free",
      description: "Micro-merchants and freelancers testing automated khata ledger recovery.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      periodLabel: {
        monthly: "/month",
        yearly: "/mo",
      },
      billingLabel: {
        monthly: "Billed Per Month",
        yearly: "Free Forever",
      },
      badge: null,
      isHighlighted: false,
      bgColor: "bg-[#EDEDED]",
      textColor: "text-gray-900",
      descColor: "text-gray-500",
      priceColor: "text-gray-900",
      features: [
        "3 Active Invoices /month",
        "Manual Ledger Uploads",
        "Standard Email Reminders",
        "Basic MSME Dues Calculator",
        "UPI Payout Checkout",
        "Unlimited View Seats",
      ],
      checkBg: "border-gray-400 text-gray-700",
    },
    {
      name: "Starter",
      description: "Small traders and retail merchants establishing recovery sequences.",
      monthlyPrice: 999,
      yearlyPrice: 799,
      periodLabel: {
        monthly: "/month",
        yearly: "/mo",
      },
      billingLabel: {
        monthly: "Billed Per Month",
        yearly: "billed annually — save ₹2,400",
      },
      badge: null,
      isHighlighted: false,
      bgColor: "bg-[#EDEDED]",
      textColor: "text-gray-900",
      descColor: "text-gray-500",
      priceColor: "text-gray-900",
      features: [
        "25 Active Invoices /month",
        "Automated WhatsApp Alerts",
        "Tally & Zoho Utility Sync",
        "Basic AI Tone Engine (Reminders)",
        "Court-Ready MSME Interest Logs",
        "Standard Chat Support",
      ],
      checkBg: "border-gray-400 text-gray-700",
    },
    {
      name: "Growth",
      description: "Growing wholesalers and distributors with regular late invoices.",
      monthlyPrice: 2499,
      yearlyPrice: 1999,
      periodLabel: {
        monthly: "/month",
        yearly: "/mo",
      },
      billingLabel: {
        monthly: "Billed Per Month",
        yearly: "billed annually — save ₹6,000",
      },
      badge: "POPULAR",
      isHighlighted: true,
      bgColor: "bg-[#4F46E5]",
      textColor: "text-white",
      descColor: "text-indigo-200",
      priceColor: "text-white",
      features: [
        "100 Active Invoices /month",
        "Auto-Draft MSME Legal Notices",
        "1-Click MSME Samadhaan Docs",
        "Full AI Tone Engine (Escalation)",
        "Daily AI Recovery Insights",
        "Priority Support",
      ],
      checkBg: "border-white/40 text-white",
    },
    {
      name: "Professional",
      description: "Large manufacturers and CA Agencies managing multiple ledger networks.",
      monthlyPrice: 6999,
      yearlyPrice: 5599,
      periodLabel: {
        monthly: "/month",
        yearly: "/mo",
      },
      billingLabel: {
        monthly: "Billed Per Month",
        yearly: "billed annually — save ₹16,800",
      },
      badge: null,
      isHighlighted: false,
      bgColor: "bg-[#EDEDED]",
      textColor: "text-gray-900",
      descColor: "text-gray-500",
      priceColor: "text-gray-900",
      features: [
        "500 Active Invoices /month",
        "Dedicated WABA Connection",
        "AI Cash Flow & Forecast Reports",
        "Custom API & ERP Integrations",
        "Multi-tenant CA/Agency Console",
        "Dedicated Account Manager",
      ],
      checkBg: "border-gray-400 text-gray-700",
    },
  ];

  const comparePlans = [
    {
      name: "Free",
      key: "free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      periodLabel: {
        monthly: "/month",
        yearly: "/mo",
      },
      isHighlighted: false,
    },
    {
      name: "Starter",
      key: "starter",
      monthlyPrice: 999,
      yearlyPrice: 799,
      periodLabel: {
        monthly: "/month",
        yearly: "/mo",
      },
      isHighlighted: false,
    },
    {
      name: "Growth",
      key: "growth",
      monthlyPrice: 2499,
      yearlyPrice: 1999,
      periodLabel: {
        monthly: "/month",
        yearly: "/mo",
      },
      isHighlighted: true,
    },
    {
      name: "Professional",
      key: "professional",
      monthlyPrice: 6999,
      yearlyPrice: 5599,
      periodLabel: {
        monthly: "/month",
        yearly: "/mo",
      },
      isHighlighted: false,
    },
    {
      name: "Enterprise",
      key: "enterprise",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      periodLabel: {
        monthly: "",
        yearly: "",
      },
      isHighlighted: false,
    },
  ];

  const categories = [
    {
      name: "Invoices & Customers",
      features: [
        { name: "Active invoices", free: "Up to 3", starter: "Up to 25", growth: "Up to 100", professional: "Up to 500", enterprise: "Unlimited" },
        { name: "Customer profiles", free: "Yes", starter: "Yes", growth: "Yes", professional: "Yes", enterprise: "Yes" },
        { name: "Customer health scores", free: "Basic", starter: "Basic", growth: "Full (AI)", professional: "Full + AI Insights", enterprise: "Custom + Predictive" },
        { name: "Excel / CSV import", free: "Yes", starter: "Yes", growth: "Yes", professional: "Yes", enterprise: "Yes" },
        { name: "Tally & Zoho Sync", free: "No", starter: "Yes", growth: "Yes", professional: "Yes", enterprise: "Yes" },
      ],
    },
    {
      name: "WhatsApp Reminders",
      features: [
        { name: "WhatsApp reminders (Meta API)", free: "No", starter: "1,000/mo", growth: "5,000/mo", professional: "25,000/mo", enterprise: "Unlimited" },
        { name: "Razorpay UPI in every message", free: "Yes", starter: "Yes", growth: "Yes", professional: "Yes", enterprise: "Yes" },
        { name: "AI Tone Engine (3 phases)", free: "No", starter: "Basic AI", growth: "Full AI (Auto)", professional: "Full + Custom Tuning", enterprise: "Fully Customized" },
        { name: "Custom message templates", free: "No", starter: "No", growth: "Yes", professional: "Yes", enterprise: "Yes" },
        { name: "Read receipt tracking", free: "Yes", starter: "Yes", growth: "Yes", professional: "Yes", enterprise: "Yes" },
        { name: "UPI link tap tracking", free: "Yes", starter: "Yes", growth: "Yes", professional: "Yes", enterprise: "Yes" },
        { name: "Scheduled reminder timing", free: "Default only", starter: "Default only", growth: "Custom", professional: "Custom", enterprise: "Advanced Queue" },
      ],
    },
    {
      name: "Legal & MSME (Exclusive)",
      features: [
        { name: "Legal notice (MSME Act 2006)", free: "No", starter: "No", growth: "Yes — Auto Draft", professional: "Yes — Auto Draft", enterprise: "Advocate Drafted & Sent" },
        { name: "MSME Samadhaan filing doc", free: "No", starter: "No", growth: "Yes (1-Click)", professional: "Yes (1-Click)", enterprise: "Full Portal Service" },
        { name: "Compound interest calculation", free: "Yes (Standard)", starter: "Yes (MSME Sec 16)", growth: "Yes (MSME Sec 16)", professional: "Yes (MSME Sec 16)", enterprise: "Yes (Custom Terms)" },
      ],
    },
    {
      name: "Dashboard & Analytics",
      features: [
        { name: "Live recovery dashboard", free: "Yes", starter: "Yes", growth: "Yes", professional: "Yes", enterprise: "Yes" },
        { name: "Recovery analytics & reports", free: "Basic", starter: "Basic", growth: "Full", professional: "Full + Export", enterprise: "Custom Analytics" },
        { name: "AI predictive insights", free: "No", starter: "No", growth: "Daily insights", professional: "Cash flow predictions", enterprise: "Full ML Forecast" },
        { name: "Invoice aging heatmap", free: "Yes", starter: "Yes", growth: "Yes", professional: "Yes", enterprise: "Yes" },
        { name: "Daily email / WhatsApp summary", free: "No", starter: "No", growth: "Yes", professional: "Yes", enterprise: "Yes" },
      ],
    },
    {
      name: "Team & Access",
      features: [
        { name: "Team members / users", free: "1 user", starter: "1 user", growth: "Unlimited", professional: "Unlimited", enterprise: "Unlimited" },
        { name: "Role-based permissions", free: "No", starter: "No", growth: "No", professional: "Yes", enterprise: "Yes" },
        { name: "Multi-business accounts", free: "No", starter: "No", growth: "No", professional: "Up to 5 clients", enterprise: "Unlimited clients" },
        { name: "White-label branding", free: "No", starter: "No", growth: "No", professional: "Yes — Included", enterprise: "Yes — Included" },
      ],
    },
    {
      name: "Support",
      features: [
        { name: "Customer support", free: "Email only", starter: "Chat support", growth: "Priority Support", professional: "Dedicated manager", enterprise: "24/7 Phone + Slack" },
        { name: "Setup assistance", free: "Self-service", starter: "Self-service", growth: "Guided setup call", professional: "Full onboarding", enterprise: "White-glove migration" },
      ],
    },
    {
      name: "API & Reliability",
      features: [
        { name: "API access + webhooks", free: "No", starter: "No", growth: "No", professional: "Yes", enterprise: "Yes" },
        { name: "SLA-backed uptime", free: "No", starter: "No", growth: "No", professional: "99.9% SLA", enterprise: "99.99% SLA" },
        { name: "Free trial", free: "No", starter: "7 days free", growth: "7 days free", professional: "7 days free", enterprise: "Custom PoC" },
      ],
    },
  ];

  const renderValue = (val: string, colKey: string) => {
    if (val === "Yes") {
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

    const isScale = colKey === "growth" && (
      val.includes("100") ||
      val.includes("Full") ||
      val.includes("Auto Draft") ||
      val.includes("1-Click") ||
      val.includes("Priority Support") ||
      val.includes("Daily insights")
    );

    return (
      <span className={`text-xs md:text-sm font-medium ${isScale ? "text-gray-900 font-bold" : "text-gray-600"}`}>
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

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-blue-200/60 bg-blue-50/40 text-[#0047FF] text-sm font-medium tracking-tight font-outfit mb-6">
          <HugeiconsIcon icon={ShoppingCart02Icon} size={14} color="#0047FF" />
          Pricing
        </div>

        <h2 className="text-[2.75rem] md:text-[3.25rem] font-medium text-gray-900 tracking-tight leading-[1.15] font-outfit max-w-5xl mx-auto">
          One Recovered Invoice Can Pay for Your Plan Many Times Over.
        </h2>

        <h3 className="text-[18px] md:text-lg font-medium mt-3 text-gray-600 tracking-tight leading-[1.15] font-outfit max-w-3xl mx-auto">
          Choose the plan that fits your business and let UdhaarClear follow up, collect, and keep your cash flow moving.
        </h3>

        <div className="flex items-center justify-center gap-4 mt-10 mb-8">
          <div className="relative flex bg-gray-100/80 p-1 rounded-full border border-gray-200/50">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`relative px-6 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-300 ${billingPeriod === "monthly"
                ? "bg-white text-gray-900"
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              Pay Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`relative px-6 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-300 ${billingPeriod === "yearly"
                ? "bg-white text-gray-900"
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              Pay Yearly & Save 20%
            </button>
          </div>
        </div>

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

                <div className="relative z-10 flex flex-col justify-end mb-6">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-4xl md:text-5xl font-medium tracking-tight font-outfit">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs md:text-sm font-bold opacity-85">
                      {periodLabel}
                    </span>
                  </div>
                </div>

                <button
                  className="relative z-10 w-full py-3.5 bg-[#000] text-white font-medium rounded-full text-center text-xs md:text-sm transition-all hover:bg-white/95 active:scale-95 duration-200 mb-8"
                >
                  Start 7-Days Free Trial
                </button>

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

        <div className="max-w-[1280px] mx-auto text-left mt-28">
          <div className="w-full overflow-x-auto lg:overflow-visible bg-transparent">
            <div className="border border-gray-200/80 rounded-t-[22px] lg:overflow-visible bg-white shadow-xs min-w-[950px]">
              <table className="w-full border-separate border-spacing-0 text-left">
                <thead>
                  <tr>
                    <th className="bg-[#F9FAFB] border-b border-gray-200 w-[25%] sticky top-[70px] md:top-[96px] z-30 text-left rounded-tl-[22px] p-5 pr-4 align-middle">
                      <div className="flex flex-col gap-1 justify-center h-full">
                        <h4 className="text-xl md:text-2xl font-bold text-gray-900 font-outfit tracking-tight leading-tight">
                          Compare plans
                        </h4>
                        <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed mt-0.5">
                          Compare detailed features across all plans.
                        </p>
                      </div>
                    </th>

                    {comparePlans.map((plan, idx) => {
                      const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
                      const priceDisplay = typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : "ON DEMAND";
                      const isHighlighted = plan.isHighlighted;
                      const buttonText = plan.key === "enterprise" ? "Contact Us" : plan.key === "professional" ? "Get Started" : "Start Trial";
                      const billingSubtext = billingPeriod === "monthly" ? "Billed monthly" : "Billed annually";
                      const annualTotal = typeof plan.yearlyPrice === "number" && plan.yearlyPrice > 0
                        ? `₹${(plan.yearlyPrice * 12).toLocaleString("en-IN")}/yr`
                        : null;

                      return (
                        <th
                          key={idx}
                          className={`py-5 px-4 border-b border-gray-200 w-[15%] align-top text-center sticky top-[70px] md:top-[96px] z-30 border-l border-gray-200/50 ${isHighlighted ? "bg-[#F8FAFC]" : "bg-white"} ${idx === comparePlans.length - 1 ? "rounded-tr-[22px]" : ""}`}
                        >
                          <div className="flex flex-col items-center text-center w-full select-none gap-0.5">
                            {/* "FREE PLAN" label */}
                            <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] font-outfit">
                              {plan.name} PLAN
                            </span>

                            {/* Price */}
                            <div className="flex items-baseline justify-center gap-0.5 mt-1">
                              {typeof price === "number" ? (
                                <>
                                  <span className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight font-outfit">
                                    {priceDisplay}
                                  </span>
                                  {plan.periodLabel[billingPeriod] && (
                                    <span className="text-xs md:text-sm font-semibold text-gray-500 ml-0.5">
                                      {plan.periodLabel[billingPeriod]}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight font-outfit">
                                  Custom
                                </span>
                              )}
                            </div>

                            {/* Billing subtext */}
                            <div className="flex flex-col items-center mb-3">
                              <span className="text-[10px] md:text-xs text-gray-400 font-medium">
                                {plan.key === "enterprise" ? "Custom pricing" : billingSubtext}
                              </span>
                              {billingPeriod === "yearly" && annualTotal && plan.key !== "enterprise" && (
                                <span className="text-[10px] md:text-xs text-emerald-600 font-semibold mt-0.5">
                                  {annualTotal}
                                </span>
                              )}
                            </div>

                            {/* CTA Button */}
                            <button
                              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer w-full max-w-[120px] active:scale-95 border ${
                                isHighlighted
                                  ? "bg-[#4F46E5] hover:bg-[#4338CA] text-white border-[#4F46E5]"
                                  : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                              }`}
                            >
                              {buttonText}
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, catIdx) => (
                    <React.Fragment key={catIdx}>
                      <tr>
                        <td colSpan={6} className="py-3 px-6 bg-gray-50/45 border-b border-gray-200/80 border-t border-gray-100/20 font-bold text-[11px] uppercase tracking-wider text-gray-500 font-outfit select-none">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0047FF]/60" />
                            {category.name}
                          </div>
                        </td>
                      </tr>

                      {category.features.map((feature: any, featIdx) => (
                        <tr
                          key={featIdx}
                          className="hover:bg-gray-50/10 transition-colors duration-150"
                        >
                          <td className="py-3.5 px-6 text-xs md:text-sm font-medium text-gray-700 w-[25%] border-b border-gray-200/40 bg-white">
                            <div className="flex items-center gap-1.5">
                              <span>{feature.name}</span>
                              <span className="text-gray-300 hover:text-gray-500 cursor-pointer transition-colors duration-150">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M12 16v-4" />
                                  <path d="M12 8h.01" />
                                </svg>
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-2 text-center w-[15%] border-b border-gray-200/40 border-l border-gray-200/30 bg-white">
                            {renderValue(feature.free, "free")}
                          </td>
                          <td className="py-3.5 px-2 text-center w-[15%] border-b border-gray-200/40 border-l border-gray-200/30 bg-white">
                            {renderValue(feature.starter, "starter")}
                          </td>
                          <td className="py-3.5 px-2 text-center w-[15%] border-b border-gray-200/40 border-l border-gray-200/30 bg-[#F8FAFC]/50">
                            {renderValue(feature.growth, "growth")}
                          </td>
                          <td className="py-3.5 px-2 text-center w-[15%] border-b border-gray-200/40 border-l border-gray-200/30 bg-white">
                            {renderValue(feature.professional, "professional")}
                          </td>
                          <td className="py-3.5 px-2 text-center w-[15%] border-b border-gray-200/40 border-l border-gray-200/30 bg-white">
                            {renderValue(feature.enterprise, "enterprise")}
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
      </div>
    </section>
  );
}
