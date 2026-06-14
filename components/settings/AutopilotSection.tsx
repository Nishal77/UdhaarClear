"use client";

import React, { useState } from "react";
import { Sliders } from "lucide-react";
import { toast } from "sonner";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B00]" />
    </label>
  );
}

// 30-min slots 07:00 – 21:00
function buildTimeSlots() {
  const slots: { value: string; label: string }[] = [];
  for (let h = 7; h <= 21; h++) {
    for (const m of [0, 30]) {
      if (h === 21 && m === 30) break;
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const suffix = h < 12 ? "AM" : h === 12 ? "PM" : "PM";
      const displayH = h > 12 ? h - 12 : h;
      slots.push({ value: `${hh}:${mm}`, label: `${displayH}:${mm} ${suffix}` });
    }
  }
  return slots;
}

const TIME_SLOTS = buildTimeSlots();

export default function AutopilotSection() {
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);
  const [windowStart, setWindowStart] = useState("09:30");
  const [windowEnd, setWindowEnd] = useState("17:30");
  const [weekendLock, setWeekendLock] = useState(true);
  const [autoPauseOnReply, setAutoPauseOnReply] = useState(true);
  const [gracePeriod, setGracePeriod] = useState(3);
  const [toneProfile, setToneProfile] = useState<"gentle" | "firm" | "legal">("firm");
  const [msmeRuleTrigger, setMsmeRuleTrigger] = useState(true);
  const [escalationInterval, setEscalationInterval] = useState(7);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO: POST /api/businesses/reminder-settings
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success("Reminder rules saved");
  };

  return (
    <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] w-full max-w-3xl text-left animate-in fade-in duration-200">
      <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-gray-50">
        <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100/20 text-[#FF6B00] flex items-center justify-center shrink-0">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 font-outfit">Reminder Rules</h2>
          <p className="text-xs text-gray-400 font-medium">Control how and when UdhaarClear sends automated payment chasers to your customers.</p>
        </div>
      </div>

      <div className="space-y-0 divide-y divide-gray-50">

        {/* Master switch */}
        <div className="flex items-center justify-between py-3.5">
          <div>
            <span className="text-xs font-bold text-gray-900 font-outfit flex items-center gap-1.5">
              Enable Autopilot
              {autopilotEnabled && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 text-[8.5px] font-bold text-emerald-600 border border-emerald-100/30 uppercase tracking-wider">On</span>
              )}
            </span>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Allow the system to dispatch reminders automatically without manual approval.</p>
          </div>
          <Toggle checked={autopilotEnabled} onChange={setAutopilotEnabled} />
        </div>

        {/* Send window */}
        <div className="flex items-center justify-between py-3.5">
          <div>
            <span className="text-xs font-bold text-gray-900 font-outfit">Send Window</span>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Reminders only go out between these hours on business days.</p>
          </div>
          <div className="flex items-center gap-2 select-none">
            <select
              value={windowStart}
              onChange={(e) => setWindowStart(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 focus:outline-none"
            >
              {TIME_SLOTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <span className="text-gray-400 text-xs">to</span>
            <select
              value={windowEnd}
              onChange={(e) => setWindowEnd(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 focus:outline-none"
            >
              {TIME_SLOTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Weekend lock */}
        <div className="flex items-center justify-between py-3.5">
          <div>
            <span className="text-xs font-bold text-gray-900 font-outfit">Weekend & Holiday Lock</span>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Block reminders on Saturday, Sunday, and national holidays.</p>
          </div>
          <Toggle checked={weekendLock} onChange={setWeekendLock} />
        </div>

        {/* Auto-pause on reply */}
        <div className="flex items-center justify-between py-3.5">
          <div>
            <span className="text-xs font-bold text-gray-900 font-outfit">Auto-pause if Customer Replies</span>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              Stop sending reminders immediately when a customer replies on WhatsApp. Resumes after you close the conversation.
            </p>
          </div>
          <Toggle checked={autoPauseOnReply} onChange={setAutoPauseOnReply} />
        </div>

        {/* Grace period */}
        <div className="flex items-center justify-between py-3.5">
          <div>
            <span className="text-xs font-bold text-gray-900 font-outfit">Grace Period (days)</span>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Buffer days after the due date before the first chaser is sent.</p>
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

        {/* Tone profile */}
        <div className="flex items-center justify-between py-3.5">
          <div>
            <span className="text-xs font-bold text-gray-900 font-outfit">Starting Tone</span>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              Gentle = polite requests · Firm = assertive · Legal = pre-litigation language. Automatically escalates over time.
            </p>
          </div>
          <select
            value={toneProfile}
            onChange={(e) => setToneProfile(e.target.value as any)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 focus:outline-none"
          >
            <option value="gentle">Gentle</option>
            <option value="firm">Firm</option>
            <option value="legal">Legal</option>
          </select>
        </div>

        {/* MSME rule */}
        <div className="flex items-center justify-between py-3.5">
          <div>
            <span className="text-xs font-bold text-gray-900 font-outfit flex items-center gap-1.5">
              45-Day MSME Samadhaan Rule
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-orange-50 text-[8px] font-bold text-orange-600 border border-orange-100/30 uppercase">Escalating</span>
            </span>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              Trigger strict MSME Council legal notice on Day 46 of default (MSMED Act, Section 15).
            </p>
          </div>
          <Toggle checked={msmeRuleTrigger} onChange={setMsmeRuleTrigger} />
        </div>

        {/* Escalation interval */}
        <div className="py-3.5 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-900">
            <span>Escalation Interval</span>
            <span>Every {escalationInterval} days</span>
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
          <p className="text-[9.5px] text-gray-400 font-semibold leading-normal">
            Days between tone escalation steps (gentle → firm → legal).
          </p>
        </div>

      </div>

      {/* Save */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E05B2E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 active:scale-95"
        >
          {saving ? "Saving..." : "Save Rules"}
        </button>
      </div>
    </div>
  );
}
