"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Activity, FileDown, Trash2 } from "lucide-react";

interface BillingSectionProps {
  businessName: string;
}

export default function BillingSection({ businessName }: BillingSectionProps) {
  const [autoRenew, setAutoRenew] = useState(true);
  const [confirmDeleteText, setConfirmDeleteText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      
      {/* Card 1: Limits usage progress bars */}
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-50">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100/20 text-[#FF6B00] flex items-center justify-center shadow-sm shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 font-outfit">Limits & Subscription Progress</h2>
              <p className="text-xs text-gray-400 font-medium">Track WhatsApp messages sent and legal notifications dispatched.</p>
            </div>
          </div>

          <span className="inline-flex items-center px-3 py-1 rounded bg-[#FFF0EB] text-xs font-bold uppercase text-[#FF6A39] border border-[#FF6A39]/15">
            Growth Plan
          </span>
        </div>

        {/* Progress meters */}
        <div className="space-y-5 font-semibold text-slate-700">
          <div>
            <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
              <span>WhatsApp Chaser Reminders</span>
              <span className="text-gray-900 font-bold">2,450 / 5,000 sent</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "49%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
              <span>Advocate Legal Notices Drafted</span>
              <span className="text-gray-900 font-bold">18 / 50 generated</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#FF6B00] h-full rounded-full" style={{ width: "36%" }} />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 font-outfit">Auto-Renew Subscription via Razorpay</span>
              <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-normal">Allows the system to automatically renew limits when limits are reached.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" checked={autoRenew} onChange={(e) => setAutoRenew(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B00]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Card 2: Billing Payment History Table */}
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
                <td className="py-3">Growth Plan - Monthly</td>
                <td className="py-3 font-mono">₹4,999.00</td>
                <td className="py-3 text-emerald-600">Paid</td>
                <td className="py-3 text-right">
                  <button type="button" className="text-[#FF6B00] hover:text-[#E05B2E] font-bold inline-flex items-center gap-1 cursor-pointer">
                    <FileDown className="w-3.5 h-3.5" /> PDF
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-800">May 1, 2026</td>
                <td className="py-3">Growth Plan - Monthly</td>
                <td className="py-3 font-mono">₹4,999.00</td>
                <td className="py-3 text-emerald-600">Paid</td>
                <td className="py-3 text-right">
                  <button type="button" className="text-[#FF6B00] hover:text-[#E05B2E] font-bold inline-flex items-center gap-1 cursor-pointer">
                    <FileDown className="w-3.5 h-3.5" /> PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 3: Danger Zone */}
      <div className="bg-rose-50/40 border border-rose-100 rounded-[22px] p-5 text-left">
        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-rose-100/30">
          <Trash2 className="w-5 h-5 text-rose-600" />
          <h3 className="text-base font-bold text-rose-800 font-outfit">Danger Zone - Permanent Workspace Deletion</h3>
        </div>
        <p className="text-xs text-rose-700 mb-4 leading-relaxed font-semibold">Deleting your workspace "{businessName}" is a permanent process. It immediately wipes all debtor ledgers, legal logs, and invoices. Action is irreversible.</p>
        
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

    </div>
  );
}
