"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Activity, 
  FileDown, 
  Trash2, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Loader2, 
  HelpCircle, 
  CreditCard, 
  Wallet, 
  Building, 
  ArrowLeft, 
  CheckCircle2 
} from "lucide-react";

interface BillingSectionProps {
  businessName: string;
  currentPlanTier: string;
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
    name: "Starter Plan",
    monthlyPrice: 799,
    annualPrice: 7990,
    customers: "25 Customers",
    invoices: "100 Invoices/mo",
    limitText: "Perfect for growing vendors starting automated recovery chasers.",
    features: [
      "Up to 25 active customers",
      "100 automated PDF invoices/mo",
      "Smart WhatsApp reminders",
      "UPI & bank payment collection",
      "Standard daily email digest"
    ],
    color: "text-slate-900",
    bgColor: "bg-white",
    borderColor: "border-gray-200/80",
    accentColor: "bg-slate-900 text-white hover:bg-slate-800"
  },
  {
    key: "GROWTH",
    name: "Growth Plan",
    monthlyPrice: 1999,
    annualPrice: 19990,
    customers: "100 Customers",
    invoices: "Unlimited Invoices",
    limitText: "Designed for mid-market businesses requiring full autopilot recovery.",
    features: [
      "Up to 100 active customers",
      "Unlimited invoices & templates",
      "Advocate legal notices (50/mo)",
      "Priority WhatsApp & SMS triggers",
      "Collection Autopilot engine",
      "Zoho Books & Tally Prime sync"
    ],
    color: "text-gray-900",
    bgColor: "bg-[#FFFBF7]",
    borderColor: "border-[#FF6B00]/35 shadow-[0_12px_40px_rgba(255,107,0,0.03)]",
    accentColor: "bg-[#FF6B00] text-white hover:bg-[#E05B2E]",
    badge: "MOST POPULAR"
  },
  {
    key: "CA_PRO",
    name: "CA Pro Plan",
    monthlyPrice: 4999,
    annualPrice: 49990,
    customers: "Unlimited Customers",
    invoices: "Unlimited Invoices",
    limitText: "For professional accounting firms managing recovery for multiple clients.",
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

export default function BillingSection({ businessName, currentPlanTier }: BillingSectionProps) {
  const [activePlan, setActivePlan] = useState(currentPlanTier.toUpperCase());
  const [isAnnual, setIsAnnual] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const [confirmDeleteText, setConfirmDeleteText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Simulated Checkout Modal states
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"review" | "processing" | "success">("review");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "wallet">("upi");
  const [processingMsg, setProcessingMsg] = useState("Establishing secure session with Razorpay...");

  const getPlanDisplayName = (tier: string) => {
    switch (tier.toUpperCase()) {
      case "STARTER": return "Starter Plan";
      case "GROWTH":  return "Growth Plan";
      case "CA_PRO":  return "CA Pro Plan";
      case "FREE":    return "Free Plan";
      default:        return tier;
    }
  };

  const handleOpenCheckout = (plan: PlanDetails) => {
    setSelectedPlan(plan);
    setCheckoutStep("review");
  };

  const handleStartCheckout = () => {
    if (!selectedPlan) return;
    setCheckoutStep("processing");

    // Cycle through messaging simulation
    const msgs = [
      "Establishing secure session with Razorpay...",
      "Authorizing subscription token validation...",
      "Registering workspace update protocols...",
      "Verifying payment confirmation status..."
    ];

    let currentMsgIdx = 0;
    const interval = setInterval(() => {
      currentMsgIdx++;
      if (currentMsgIdx < msgs.length) {
        setProcessingMsg(msgs[currentMsgIdx]);
      } else {
        clearInterval(interval);
        setCheckoutStep("success");
        setActivePlan(selectedPlan.key);
        toast.success(`Subscribed to ${selectedPlan.name} successfully!`);
      }
    }, 1200);
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

  // Get active plan prices
  const currentPlanObj = PLANS.find(p => p.key === activePlan);
  const currentPrice = currentPlanObj 
    ? (isAnnual ? currentPlanObj.annualPrice : currentPlanObj.monthlyPrice)
    : 0;

  return (
    <div className="space-y-7 w-full animate-in fade-in duration-200">
      
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

          {/* Pricing cycle selector */}
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setIsAnnual(false)}
              className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                !isAnnual 
                  ? "bg-white text-gray-900 shadow-3xs" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                isAnnual 
                  ? "bg-white text-gray-900 shadow-3xs" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Annual
              <span className="text-[9px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded-full uppercase leading-none">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {PLANS.map((plan) => {
            const isCurrent = activePlan === plan.key;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const cycleText = isAnnual ? "/ year" : "/ month";

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

        {/* Meters dependent on plan */}
        <div className="space-y-5">
          {activePlan === "FREE" && (
            <>
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-2">
                  <span>Debtor Customers</span>
                  <span className="text-gray-900 font-semibold">9 / 10 added</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: "90%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-2">
                  <span>PDF Invoices</span>
                  <span className="text-gray-900 font-semibold">28 / 30 generated</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#FF6B00] h-full rounded-full transition-all duration-500" style={{ width: "93%" }} />
                </div>
              </div>
            </>
          )}

          {activePlan === "STARTER" && (
            <>
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-2">
                  <span>Debtor Customers</span>
                  <span className="text-gray-900 font-semibold">18 / 25 added</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: "72%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-2">
                  <span>PDF Invoices</span>
                  <span className="text-gray-900 font-semibold">76 / 100 generated</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#FF6B00] h-full rounded-full transition-all duration-500" style={{ width: "76%" }} />
                </div>
              </div>
            </>
          )}

          {activePlan === "GROWTH" && (
            <>
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-2">
                  <span>Debtor Customers</span>
                  <span className="text-gray-900 font-semibold">74 / 100 added</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: "74%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-2">
                  <span>Advocate Legal Notices</span>
                  <span className="text-gray-900 font-semibold">18 / 50 generated</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#FF6B00] h-full rounded-full transition-all duration-500" style={{ width: "36%" }} />
                </div>
              </div>
            </>
          )}

          {activePlan === "CA_PRO" && (
            <>
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-2">
                  <span>Client Businesses</span>
                  <span className="text-gray-900 font-semibold">12 / 20 registered</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: "60%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-2">
                  <span>Debtor Customers</span>
                  <span className="text-gray-900 font-semibold">Unlimited (Active)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#FF6B00] h-full rounded-full transition-all duration-500" style={{ width: "15%" }} />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 font-outfit">Auto-Renew Subscriptions (Razorpay)</span>
              <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-normal">
                Automatically renew limits and renew cycle subscription at the end of billing period.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" checked={autoRenew} onChange={(e) => setAutoRenew(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B00]"></div>
            </label>
          </div>
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
              <tr>
                <td className="py-3 font-medium text-gray-800">June 1, 2026</td>
                <td className="py-3">{getPlanDisplayName(activePlan)} - Monthly</td>
                <td className="py-3 font-mono">₹{currentPrice.toLocaleString("en-IN")}.00</td>
                <td className="py-3 text-emerald-600 font-semibold">Paid</td>
                <td className="py-3 text-right">
                  <button type="button" className="text-[#FF6B00] hover:text-[#E05B2E] font-bold inline-flex items-center gap-1 cursor-pointer">
                    <FileDown className="w-3.5 h-3.5" /> PDF
                  </button>
                </td>
              </tr>
              {activePlan !== "FREE" && (
                <tr>
                  <td className="py-3 font-medium text-gray-800">May 1, 2026</td>
                  <td className="py-3">Starter Plan - Monthly</td>
                  <td className="py-3 font-mono">₹799.00</td>
                  <td className="py-3 text-emerald-600 font-semibold">Paid</td>
                  <td className="py-3 text-right">
                    <button type="button" className="text-[#FF6B00] hover:text-[#E05B2E] font-bold inline-flex items-center gap-1 cursor-pointer">
                      <FileDown className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
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
                      {isAnnual ? "Annual" : "Monthly"}
                    </span>
                  </div>
                  <div className="border-t border-gray-200/50 my-3" />
                  
                  {/* Calculations */}
                  <div className="flex justify-between items-center text-xs font-medium text-gray-600">
                    <span>Base Amount</span>
                    <span>₹{(isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice).toLocaleString("en-IN")}.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium text-gray-600 mt-2">
                    <span>Estimated GST (18%)</span>
                    <span>₹{((isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice) * 0.18).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-gray-200/50 my-3" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900 font-outfit">Total Payment</span>
                    <span className="text-base font-extrabold text-[#FF6B00] font-outfit">
                      ₹{((isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice) * 1.18).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
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

            {/* Step 2: Processing state */}
            {checkoutStep === "processing" && (
              <div className="mt-5 py-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-10 h-10 text-[#FF6B00] animate-spin mb-4" />
                <h4 className="text-sm font-bold text-gray-900 font-outfit">Processing transaction...</h4>
                <p className="text-[11.5px] text-gray-400 font-medium mt-1 animate-pulse">{processingMsg}</p>
              </div>
            )}

            {/* Step 3: Success state */}
            {checkoutStep === "success" && (
              <div className="mt-5 py-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-100 shadow-3xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-gray-900 font-outfit">Payment Completed!</h4>
                <p className="text-xs text-gray-400 font-semibold mt-1 leading-relaxed px-4">
                  Your workspace has been successfully upgraded to the **{selectedPlan.name}**. Enjoy your expanded usage limits.
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
