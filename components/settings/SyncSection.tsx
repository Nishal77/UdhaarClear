"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Webhook, Loader2 } from "lucide-react";

export default function SyncSection() {
  const [zohoConnected, setZohoConnected] = useState(false);
  const [tallyConnected, setTallyConnected] = useState(false);
  const [connectingZoho, setConnectingZoho] = useState(false);
  const [connectingTally, setConnectingTally] = useState(false);
  const [syncFrequency, setSyncFrequency] = useState<"realtime" | "daily" | "manual">("daily");
  const [autoLedger, setAutoLedger] = useState(true);
  const [caAuditEmail, setCaAuditEmail] = useState("ca.audit@udhaarclear.com");

  const handleConnectZoho = () => {
    setConnectingZoho(true);
    setTimeout(() => {
      setConnectingZoho(false);
      setZohoConnected(!zohoConnected);
      toast.success(zohoConnected ? "Zoho Books connection revoked" : "Zoho Books synced successfully!");
    }, 1200);
  };

  const handleConnectTally = () => {
    setConnectingTally(true);
    setTimeout(() => {
      setConnectingTally(false);
      setTallyConnected(!tallyConnected);
      toast.success(tallyConnected ? "Tally Prime connection revoked" : "Tally Prime client synced successfully via dynamic agent!");
    }, 1200);
  };

  return (
    <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] w-full max-w-3xl text-left animate-in fade-in duration-200">
      <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-gray-50">
        <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100/20 text-[#FF6B00] flex items-center justify-center shadow-sm shrink-0">
          <Webhook className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 font-outfit">Accounting Software & ERP Sync</h2>
          <p className="text-xs text-gray-400 font-medium">Integrate reconciliations with Zoho Books, Tally Prime, and local ledger exports.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Connectors Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {/* Zoho Connect */}
          <div className="p-4 border border-gray-200/60 rounded-2xl relative bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-800 font-outfit">Zoho Books</span>
              <span className={`w-2 h-2 rounded-full ${zohoConnected ? "bg-emerald-500" : "bg-gray-300"}`} />
            </div>
            <p className="text-[10.5px] text-gray-400 mb-4 leading-relaxed font-semibold">Instantly pulls outstanding invoices and pushes collected payment statuses into Zoho Books.</p>
            
            <button
              type="button"
              onClick={handleConnectZoho}
              disabled={connectingZoho}
              className={`text-xs font-bold px-4 py-2 rounded-full border transition-all cursor-pointer ${
                zohoConnected
                  ? "border-gray-200 bg-white text-gray-500 hover:text-rose-600 hover:bg-rose-50"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {connectingZoho ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : zohoConnected ? (
                "Disconnect Zoho"
              ) : (
                "Connect Zoho Books"
              )}
            </button>
          </div>

          {/* Tally Connector */}
          <div className="p-4 border border-gray-200/60 rounded-2xl relative bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-800 font-outfit">Tally Prime Sync</span>
              <span className={`w-2 h-2 rounded-full ${tallyConnected ? "bg-emerald-500" : "bg-gray-300"}`} />
            </div>
            <p className="text-[10.5px] text-gray-400 mb-4 leading-relaxed font-semibold">Integrates direct collection reconciliation logs with Tally Prime databases via sync agents.</p>
            
            <button
              type="button"
              onClick={handleConnectTally}
              disabled={connectingTally}
              className={`text-xs font-bold px-4 py-2 rounded-full border transition-all cursor-pointer ${
                tallyConnected
                  ? "border-gray-200 bg-white text-gray-500 hover:text-rose-600 hover:bg-rose-50"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {connectingTally ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : tallyConnected ? (
                "Disconnect Tally"
              ) : (
                "Connect Tally Prime"
              )}
            </button>
          </div>
        </div>

        {/* Frequency Configs */}
        <div className="space-y-4 font-semibold text-slate-700">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 font-outfit">Auto-Sync Frequency</span>
              <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-normal">Determines how frequently the ERP pulls files and updates logs.</span>
            </div>
            <select 
              value={syncFrequency} 
              onChange={(e) => setSyncFrequency(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 focus:outline-none"
            >
              <option value="realtime">Real-time webhooks</option>
              <option value="daily">Daily at 8:00 AM</option>
              <option value="manual">Manual trigger only</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 font-outfit">Auto-Ledger matching checks</span>
              <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-normal">Automatically tag matching invoices as PAID in ERP when settlements clear.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" checked={autoLedger} onChange={(e) => setAutoLedger(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B00]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex flex-col text-left w-full mr-4">
              <span className="text-xs font-bold text-gray-900 font-outfit">CA Auditor Notification Dispatch</span>
              <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-normal">Designate CA's contact email to receive automatic monthly reconciliation reports.</span>
            </div>
            <input
              type="email"
              value={caAuditEmail}
              onChange={(e) => setCaAuditEmail(e.target.value)}
              className="w-64 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-right font-semibold text-gray-700 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
