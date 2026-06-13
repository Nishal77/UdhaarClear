"use client";

import React, { useState } from "react";
import { Sliders } from "lucide-react";

export default function AutopilotSection() {
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);
  const [businessHoursStart, setBusinessHoursStart] = useState("09:30");
  const [businessHoursEnd, setBusinessHoursEnd] = useState("17:30");
  const [weekendLock, setWeekendLock] = useState(true);
  const [gracePeriod, setGracePeriod] = useState(3);
  const [toneProfile, setToneProfile] = useState<"gentle" | "firm" | "legal">("firm");
  const [msmeRuleTrigger, setMsmeRuleTrigger] = useState(true);
  const [escalationInterval, setEscalationInterval] = useState(7);

  return (
    <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] w-full max-w-3xl text-left animate-in fade-in duration-200">
      <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-gray-50">
        <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100/20 text-[#FF6B00] flex items-center justify-center shadow-sm shrink-0">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 font-outfit">Collection Autopilot Settings</h2>
          <p className="text-xs text-gray-400 font-medium">Fine-tune automated messaging rules, grace periods, and escalating triggers.</p>
        </div>
      </div>

      <div className="space-y-4 font-semibold text-slate-700">
        {/* Master Autopilot Switch */}
        <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900 font-outfit flex items-center gap-1">
              Autopilot Master Switch
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 text-[8.5px] font-bold text-emerald-600 border border-emerald-100/30 uppercase tracking-wider">Active</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-normal">Allows the system to dispatch payment links and chasers automatically without manual approvals.</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input type="checkbox" checked={autopilotEnabled} onChange={(e) => setAutopilotEnabled(e.target.checked)} className="sr-only peer" />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B00]"></div>
          </label>
        </div>

        {/* Active Business Hours */}
        <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-gray-900 font-outfit">Active Reminders Window</span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-normal">Restrict automated collections window to respect business courtesy times.</span>
          </div>
          <div className="flex items-center gap-2 select-none">
            <select 
              value={businessHoursStart} 
              onChange={(e) => setBusinessHoursStart(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 focus:outline-none"
            >
              <option value="09:00">09:00 AM</option>
              <option value="09:30">09:30 AM</option>
              <option value="10:00">10:00 AM</option>
            </select>
            <span className="text-gray-400 text-xs">to</span>
            <select 
              value={businessHoursEnd} 
              onChange={(e) => setBusinessHoursEnd(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 focus:outline-none"
            >
              <option value="17:00">05:00 PM</option>
              <option value="17:30">05:30 PM</option>
              <option value="18:00">06:00 PM</option>
            </select>
          </div>
        </div>

        {/* Weekend Lock */}
        <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900 font-outfit">Weekend & Public Holiday Lock</span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-normal">Blocks reminders from dispatching on Saturday, Sunday, or official holidays.</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input type="checkbox" checked={weekendLock} onChange={(e) => setWeekendLock(e.target.checked)} className="sr-only peer" />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B00]"></div>
          </label>
        </div>

        {/* Dues Grace Period */}
        <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900 font-outfit">Dues Grace Period Allowance</span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-normal">Number of buffer days to wait after the due date before sending the first chaser.</span>
          </div>
          <input 
            type="number" 
            min="0"
            max="15"
            value={gracePeriod} 
            onChange={(e) => setGracePeriod(parseInt(e.target.value) || 0)}
            className="w-16 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-center font-bold text-gray-700 focus:outline-none"
          />
        </div>

        {/* Tone Profile */}
        <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900 font-outfit">WhatsApp Messaging Tone Profiles</span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-normal">Tone styling: Gentle (Polite requests) / Firm (Strict) / Legal (Pre-litigation tone).</span>
          </div>
          <select 
            value={toneProfile} 
            onChange={(e) => setToneProfile(e.target.value as any)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 focus:outline-none"
          >
            <option value="gentle">Gentle</option>
            <option value="firm">Firm</option>
            <option value="legal">Legal Pre-Warning</option>
          </select>
        </div>

        {/* 45-Day MSME Rule Trigger */}
        <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900 font-outfit flex items-center gap-1">
              45-Day MSME samadhaan Rule
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-orange-50 text-[8px] font-bold text-orange-600 border border-orange-100/30 uppercase tracking-wider">Escalating</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-normal">Automatically triggers strict MSME Council Legal notices on Day 46 of default (as allowed by the MSMED Act).</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input type="checkbox" checked={msmeRuleTrigger} onChange={(e) => setMsmeRuleTrigger(e.target.checked)} className="sr-only peer" />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B00]"></div>
          </label>
        </div>

        {/* Auto-Escalation Interval */}
        <div className="space-y-2 py-2.5">
          <div className="flex justify-between items-center text-xs font-bold text-gray-900 font-outfit">
            <span>Auto-Escalation Warning Interval</span>
            <span>Every {escalationInterval} Days</span>
          </div>
          <input 
            type="range"
            min="3"
            max="14"
            step="1"
            value={escalationInterval}
            onChange={(e) => setEscalationInterval(parseInt(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B00] outline-none"
          />
          <span className="block text-[9.5px] text-gray-400 font-semibold leading-normal font-sans">Controls how many days the system waits before escalating notice levels (gentle to firm to lawyer dispatch).</span>
        </div>
      </div>
    </div>
  );
}
