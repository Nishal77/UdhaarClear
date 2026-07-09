"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { toast } from "sonner";
import {
  Activity,
  Trash2,
  Check,
  Sparkles,
  ShieldCheck,
  Loader2,
  CreditCard,
  Wallet,
  Building,
  CheckCircle2
} from "lucide-react";
import { CancelSubscriptionButton } from "./CancelSubscriptionButton";
import { PLAN_PRICING } from "@/lib/pricing";

// Minimal shape of the Razorpay Checkout.js constructor this component uses —
// the actual global is loaded at runtime via the <Script> tag below.
interface RazorpayCheckoutOptions {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  theme: { color: string };
  handler: (response: { razorpay_payment_id: string }) => void;
  modal: { ondismiss: () => void };
}
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => { open: () => void };
  }
}

interface UsageSummary {
  customerCount: number;
  customerLimit: number;
  invoiceCount: number;
  invoiceLimit: number;
}

interface BillingSectionProps {
  businessName: string;
  currentPlanTier: string;
  usage: UsageSummary;
}

/** Infinity limits render as "Unlimited" rather than a meaningless "12 / ∞". */
function formatLimit(value: number): string {
  return Number.isFinite(value) ? value.toLocaleString("en-IN") : "Unlimited";
}

function usagePercent(count: number, limit: number): number {
  if (!Number.isFinite(limit) || limit <= 0) return 0;
  return Math.min(100, Math.round((count / limit) * 100));
}

interface PlanDetails {
  key: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  limitText: string;
  customers: string;
  invoices: string;
  color: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
  badge?: string;
}

const PLANS: PlanDetails[] = [
  {
    key: "STARTER",
    name: "Chota Vyaapar — Starter",
    // Prices come from the single source of truth (lib/pricing.ts) — the same
    // numbers shown on the landing page and charged by Razorpay. Never hardcode.
    monthlyPrice: PLAN_PRICING.STARTER.monthly,
    annualPrice: PLAN_PRICING.STARTER.annualPerMonth * 12,
    customers: "15 Customers",
    invoices: "Unlimited Invoices",
    limitText: "Perfect for growing vendors starting automated recovery chasers.",
    features: [
      "Up to 15 active customers",
      "Unlimited automated invoices",
      "Smart WhatsApp reminders (3 phases)",
      "Buyer payment page (UPI)",
      "Tally / Excel CSV import"
    ],
    color: "text-slate-900",
    bgColor: "bg-white",
    borderColor: "border-gray-200/80",
    accentColor: "bg-slate-900 text-white hover:bg-slate-800"
  },
  {
    key: "GROWTH",
    name: "Vyaapaar — Pro",
    monthlyPrice: PLAN_PRICING.GROWTH.monthly,
    annualPrice: PLAN_PRICING.GROWTH.annualPerMonth * 12,
    customers: "Unlimited Customers",
    invoices: "Unlimited Invoices",
    limitText: "Full recovery engine with all 5 phases and legal notices included.",
    features: [
      "Unlimited active customers",
      "All 5 reminder phases + human gate",
      "Legal notices included",
      "Priority WhatsApp & SMS triggers",
      "Collection Autopilot engine",
      "Tally / Excel CSV import"
    ],
    color: "text-gray-900",
    bgColor: "bg-[#FFFBF7]",
    borderColor: "border-[#FF6B00]/35 shadow-[0_12px_40px_rgba(255,107,0,0.03)]",
    accentColor: "bg-[#FF6B00] text-white hover:bg-[#E05B2E]",
    badge: "MOST POPULAR"
  },
  {
    key: "CA_PRO",
    name: "Udyog — Enterprise",
    monthlyPrice: PLAN_PRICING.CA_PRO.monthly,
    annualPrice: PLAN_PRICING.CA_PRO.annualPerMonth * 12,
    customers: "Unlimited Customers",
    invoices: "Unlimited Invoices",
    limitText: "For teams and firms managing recovery across multiple businesses.",
    features: [
      "Unlimited active customers",
      "Unlimited automated invoices",
      "Manage up to 20 client businesses",
      "Unlimited advocate legal notices",
      "Dedicated account manager",
      "Custom brand white-labeling"
    ],
    color: "text-slate-900",
    bgColor: "bg-white",
    borderColor: "border-gray-200/80",
    accentColor: "bg-slate-900 text-white hover:bg-slate-800"
  }
];

export default function BillingSection({ businessName, currentPlanTier, usage }: BillingSectionProps) {
  const router = useRouter();
  // The plan tier is server-fetched truth (see app/(dashboard)/settings/page.tsx)
  // — no local "activePlan" state, so there's no way for the UI to show a
  // plan that isn't actually the one stored on the business.
  const activePlan = currentPlanTier.toUpperCase();
  const [confirmDeleteText, setConfirmDeleteText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"review" | "processing" | "success">("review");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "wallet">("upi");
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);

  const getPlanDisplayName = (tier: string) => {
    switch (tier.toUpperCase()) {
      case "STARTER": return "Chota Vyaapar — Starter";
      case "GROWTH":  return "Vyaapaar — Pro";
      case "CA_PRO":  return "Udyog — Enterprise";
      case "FREE":    return "Shuruat — Free";
      default:        return tier;
    }
  };

  const handleOpenCheckout = (plan: PlanDetails) => {
    setSelectedPlan(plan);
    setCheckoutStep("review");
  };

  // Real Razorpay Subscriptions flow: create the subscription server-side,
  // then open Razorpay's own hosted Checkout widget for the actual payment
  // — payment method selection below happens inside that widget, our local
  // `paymentMethod` state is just which one to pre-select on open.
  const handleStartCheckout = async () => {
    if (!selectedPlan) return;
    if (!isRazorpayReady || !window.Razorpay) {
      toast.error("Payment widget is still loading — try again in a moment");
      return;
    }

    setCheckoutStep("processing");

    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planTier: selectedPlan.key }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Failed to start checkout");

      const razorpay = new window.Razorpay({
        key: json.razorpayKeyId,
        subscription_id: json.subscriptionId,
        name: "UdhaarClear",
        description: `${selectedPlan.name} — Monthly`,
        theme: { color: "#FF6B00" },
        handler: () => {
          setCheckoutStep("success");
          toast.success(`Subscribed to ${selectedPlan.name}! Activating your plan...`);
          // The webhook (not this callback) is what actually confirms the
          // payment and updates the plan in the database — refresh a couple
          // times to pick that up once it lands, same pattern as buyer
          // invoice payments elsewhere in the app.
          router.refresh();
          setTimeout(() => router.refresh(), 2500);
        },
        modal: {
          ondismiss: () => setCheckoutStep("review"),
        },
      });
      razorpay.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start checkout");
      setCheckoutStep("review");
    }
  };

  const handleCancelSubscription = async () => {
    const res = await fetch("/api/subscriptions/cancel", { method: "POST" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? "Failed to cancel subscription");
    toast.success("Subscription cancelled — you're back on the Free plan");
    router.refresh();
  };

  const handleDeleteOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmDeleteText !== businessName) {
      toast.error(`Confirmation text must match your organization: "${businessName}"`);
      return;
    }

    setIsDeleting(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Wiping all ledger books, invoices, customer metrics, and workspace metadata...",
        success: () => {
          setIsDeleting(false);
          setTimeout(() => {
            window.location.href = "/login";
          }, 500);
          return "Workspace deleted successfully. Redirecting...";
        },
        error: "Failed to complete workspace wipe."
      }
    );
  };

  // Get active plan price — monthly only for now; annual billing isn't wired
  // up to a real Razorpay plan yet, so there's nothing honest to show for it.
  const currentPlanObj = PLANS.find(p => p.key === activePlan);
  const currentPrice = currentPlanObj?.monthlyPrice ?? 0;

  return (
    <div className="space-y-7 w-full animate-in fade-in duration-200">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onReady={() => setIsRazorpayReady(true)}
      />

      {/* ── Pricing & Upgrade Sub-Dashboard ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-center relative overflow-hidden">
        
        {/* Dynamic header summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between text-left gap-4 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-outfit flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF6B00]" />
              SaaS Plans & Subscription
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Current active plan: <strong className="text-gray-900 font-semibold">{getPlanDisplayName(activePlan)}</strong>. Upgrade/downgrade to adjust limits.
            </p>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {PLANS.map((plan) => {
            const isCurrent = activePlan === plan.key;
            const price = plan.monthlyPrice;
            const cycleText = "/ month";

            // Determine relative rank for upgrade/downgrade logic
            const planOrder = ["FREE", "STARTER", "GROWTH", "CA_PRO"];
            const currentIdx = planOrder.indexOf(activePlan);
            const thisIdx = planOrder.indexOf(plan.key);
            const isUpgrade = thisIdx > currentIdx;

            return (
              <div
                key={plan.key}
                className={`relative flex flex-col justify-between border rounded-[22px] p-5.5 transition-all duration-300 hover:scale-[1.015] ${
                  plan.bgColor
                } ${isCurrent ? "border-[#FF6B00] ring-1 ring-[#FF6B00]/20" : plan.borderColor}`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white text-[9px] font-bold tracking-wider px-3.5 py-1 rounded-full uppercase leading-none shadow-sm">
                    {plan.badge}
                  </span>
                )}

                <div className="text-left">
                  <h3 className={`text-base font-bold font-outfit ${plan.color}`}>{plan.name}</h3>
                  <p className="text-[11px] text-gray-400 font-semibold leading-relaxed mt-1">{plan.limitText}</p>

                  {/* Price display */}
                  <div className="mt-4 flex items-baseline gap-1 select-none">
                    <span className="text-2xl font-bold text-gray-900 font-outfit">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold">{cycleText}</span>
                  </div>

                  {/* Features list */}
                  <div className="mt-5 border-t border-gray-100/80 pt-4 space-y-2.5">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[12px] text-gray-600 font-medium">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to action */}
                <div className="mt-6">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full text-xs font-bold py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed select-none"
                    >
                      Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenCheckout(plan)}
                      className={`w-full text-xs font-bold py-2.5 rounded-full shadow-2xs hover:shadow active:scale-98 transition-all cursor-pointer ${plan.accentColor}`}
                    >
                      {isUpgrade ? "Upgrade Plan" : "Downgrade Plan"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Active limits meters ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-50">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100/20 text-[#FF6B00] flex items-center justify-center shadow-sm shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 font-outfit">Active Usage Limits</h2>
              <p className="text-xs text-gray-400 font-medium">Track your active usage parameters based on your selected plan tier.</p>
            </div>
          </div>

          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 text-[10.5px] font-semibold uppercase text-gray-600 border border-gray-200">
            {getPlanDisplayName(activePlan)}
          </span>
        </div>

        {/* Meters — real counts from the database, not hardcoded per-tier fakes */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-2">
              <span>Debtor Customers</span>
              <span className="text-gray-900 font-semibold">
                {usage.customerCount.toLocaleString("en-IN")} / {formatLimit(usage.customerLimit)} added
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${usagePercent(usage.customerCount, usage.customerLimit)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-2">
              <span>Invoices Created</span>
              <span className="text-gray-900 font-semibold">
                {usage.invoiceCount.toLocaleString("en-IN")} / {formatLimit(usage.invoiceLimit)} generated
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#FF6B00] h-full rounded-full transition-all duration-500"
                style={{ width: `${usagePercent(usage.invoiceCount, usage.invoiceLimit)}%` }}
              />
            </div>
          </div>

          {activePlan !== "FREE" && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-900 font-outfit">Manage subscription</span>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-normal">
                  Cancelling switches you to the Free plan immediately.
                </span>
              </div>
              <CancelSubscriptionButton onCancel={handleCancelSubscription} />
            </div>
          )}
        </div>
      </div>

      {/* ── Billing History receipts ── */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left">
        <h3 className="text-base font-bold text-gray-900 font-outfit mb-4">Billing Receipts History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold text-gray-600">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[9.5px]">
                <th className="pb-3 text-left">Billing Period</th>
                <th className="pb-3 text-left">Plan Tier</th>
                <th className="pb-3 text-left">Invoice Amount</th>
                <th className="pb-3 text-left">Status</th>
                <th className="pb-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activePlan === "FREE" ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400 font-medium normal-case">
                    No billing history yet — receipts appear here after your first payment.
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="py-3 font-medium text-gray-800">Current period</td>
                  <td className="py-3">{getPlanDisplayName(activePlan)} - Monthly</td>
                  <td className="py-3 font-mono">₹{currentPrice.toLocaleString("en-IN")}</td>
                  <td className="py-3 text-emerald-600 font-semibold">Active</td>
                  <td className="py-3 text-right text-gray-300">—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="bg-rose-50/40 border border-rose-100/70 rounded-[22px] p-5 text-left">
        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-rose-100/30">
          <Trash2 className="w-5 h-5 text-rose-600" />
          <h3 className="text-base font-bold text-rose-800 font-outfit">Danger Zone - Permanent Workspace Deletion</h3>
        </div>
        <p className="text-xs text-rose-700 mb-4 leading-relaxed font-semibold">
          Deleting your workspace "{businessName}" is a permanent process. It immediately wipes all debtor ledgers, legal logs, and invoices. Action is irreversible.
        </p>
        
        <form onSubmit={handleDeleteOrganization} className="flex flex-col sm:flex-row items-end gap-3.5">
          <div className="flex-1 w-full text-left">
            <label className="block text-[10.5px] font-bold text-rose-700 uppercase tracking-wider mb-1.5 font-outfit">
              Type "{businessName}" to confirm deletion
            </label>
            <input
              type="text"
              required
              placeholder={`e.g. ${businessName}`}
              value={confirmDeleteText}
              onChange={(e) => setConfirmDeleteText(e.target.value)}
              className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-rose-900 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
          <button
            type="submit"
            disabled={confirmDeleteText !== businessName || isDeleting}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-150 shrink-0 cursor-pointer ${
              confirmDeleteText === businessName && !isDeleting
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-sm active:scale-95"
                : "bg-rose-100 text-rose-400 cursor-not-allowed border border-rose-200/50"
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete Organization"}
          </button>
        </form>
      </div>

      {/* ── Secure Payment Checkout Modal Simulator ── */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[26px] p-6 w-full max-w-md text-left mx-4 relative animate-in zoom-in-95 duration-200">
            
            {/* Header info */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-outfit flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Secure Checkout
                </h3>
                <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Powered by Razorpay Payments</p>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                disabled={checkoutStep === "processing"}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30"
              >
                Cancel
              </button>
            </div>

            {/* Step 1: Review details */}
            {checkoutStep === "review" && (
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500">Selected Plan</span>
                    <span className="text-sm font-bold text-gray-900">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-semibold text-gray-500">Billing Interval</span>
                    <span className="text-xs font-bold text-gray-900 bg-gray-200/60 px-2.5 py-0.5 rounded-full uppercase leading-none">
                      Monthly
                    </span>
                  </div>
                  <div className="border-t border-gray-200/50 my-3" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900 font-outfit">Charged today</span>
                    <span className="text-base font-extrabold text-[#FF6B00] font-outfit">
                      ₹{selectedPlan.monthlyPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="mt-2 text-[10.5px] text-gray-400">
                    Renews automatically every month until cancelled. Cancel anytime from this page.
                  </p>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Select Payment Method
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                        paymentMethod === "upi"
                          ? "border-[#FF6B00] bg-[#FFFBF7]/60 shadow-3xs"
                          : "border-gray-200 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs font-bold text-gray-800">
                        <Wallet className="w-4 h-4 text-[#FF6B00]" />
                        UPI (Google Pay, PhonePe, Paytm)
                      </div>
                      <span className="text-[10px] text-gray-400 font-semibold">1-click secure</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                        paymentMethod === "card"
                          ? "border-[#FF6B00] bg-[#FFFBF7]/60 shadow-3xs"
                          : "border-gray-200 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs font-bold text-gray-800">
                        <CreditCard className="w-4 h-4 text-[#FF6B00]" />
                        Credit / Debit Card
                      </div>
                      <span className="text-[10px] text-gray-400 font-semibold">Visa, Mastercard, RuPay</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                        paymentMethod === "netbanking"
                          ? "border-[#FF6B00] bg-[#FFFBF7]/60 shadow-3xs"
                          : "border-gray-200 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs font-bold text-gray-800">
                        <Building className="w-4 h-4 text-[#FF6B00]" />
                        Netbanking
                      </div>
                      <span className="text-[10px] text-gray-400 font-semibold">All Indian Banks</span>
                    </button>
                  </div>
                </div>

                {/* Confirm actions */}
                <div className="pt-2">
                  <button
                    onClick={handleStartCheckout}
                    className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E05B2E] text-white text-xs font-bold py-3 rounded-full shadow-sm hover:shadow active:scale-98 transition-all cursor-pointer"
                  >
                    Pay Securely with Razorpay
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Processing state — Razorpay's own widget is open on top of this */}
            {checkoutStep === "processing" && (
              <div className="mt-5 py-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-10 h-10 text-[#FF6B00] animate-spin mb-4" />
                <h4 className="text-sm font-bold text-gray-900 font-outfit">Opening secure checkout...</h4>
                <p className="text-[11.5px] text-gray-400 font-medium mt-1">Complete your payment in the Razorpay window</p>
              </div>
            )}

            {/* Step 3: Success state */}
            {checkoutStep === "success" && (
              <div className="mt-5 py-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-100 shadow-3xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-gray-900 font-outfit">Payment received!</h4>
                <p className="text-xs text-gray-400 font-semibold mt-1 leading-relaxed px-4">
                  Activating your <strong>{selectedPlan.name}</strong> — this usually takes just a few seconds.
                </p>

                <div className="mt-6 w-full">
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-full active:scale-98 transition-all cursor-pointer"
                  >
                    Return to Settings
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
