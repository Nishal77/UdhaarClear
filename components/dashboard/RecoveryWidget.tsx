"use client"

import React, { useState } from "react"
import { DonutChart } from "@/components/ui/DonutChart"
import { BarList } from "@/components/ui/BarList"
import { cx } from "@/lib/utils/cn"

const initialBarData = [
  {
    name: "UPI Auto Nudge",
    value: 234000,
    colorClass: "bg-gradient-to-r from-emerald-500/5 to-emerald-500/15 border-emerald-500/30 text-emerald-600",
  },
  {
    name: "WhatsApp Reminders",
    value: 148500,
    colorClass: "bg-gradient-to-r from-cyan-500/5 to-cyan-500/15 border-cyan-500/30 text-cyan-600",
  },
  {
    name: "Virtual Accounts",
    value: 92000,
    colorClass: "bg-gradient-to-r from-blue-500/5 to-blue-500/15 border-blue-500/30 text-blue-600",
  },
  {
    name: "Manual Settle",
    value: 43000,
    colorClass: "bg-gradient-to-r from-amber-500/5 to-amber-500/15 border-amber-500/30 text-amber-600",
  },
]

const toneData = [
  { name: "Courteous", value: 78, color: "emerald" as const },
  { name: "Assertive", value: 14, color: "orange" as const },
  { name: "Legal", value: 2, color: "red" as const },
  { name: "Unpaid", value: 6, color: "gray" as const },
]

export function RecoveryWidget() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const valueFormatter = (value: number) =>
    `₹${Intl.NumberFormat("en-IN").format(value)}`

  // Highlight corresponding row if hovered/selected
  const formattedBarData = initialBarData.map((item) => {
    const isHighlighted = activeCategory === item.name
    const isAnyActive = activeCategory !== null

    return {
      name: item.name,
      value: item.value,
      formattedValue: valueFormatter(item.value),
      colorClass: cx(
        item.colorClass,
        isHighlighted && "opacity-100 ring-1 ring-offset-1 ring-gray-200/50 scale-[1.01]",
        isAnyActive && !isHighlighted && "opacity-40 transition-all duration-300"
      )
    }
  })

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-between gap-10 md:gap-12 w-full relative z-10">

      {/* ── Left Column: By Tone Phase (Replicating Image 2) ── */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-5">
            <h3 className="text-[16px] font-extrabold text-gray-950 tracking-tight">By Tone Phase</h3>
            <span className="text-[14px] text-gray-600 font-medium tracking-tight">Where your money is</span>
          </div>

          {/* Donut Chart and Legend Row */}
          <div className="flex items-center gap-6 select-none my-2">
            {/* Hollow Donut Chart with center label */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <DonutChart
                data={toneData}
                category="name"
                value="value"
                variant="donut"
                colors={["emerald", "orange", "red", "gray"]}
                showTooltip={true}
                className="h-32 w-32"
              />
              {/* Center percentage label exactly as requested */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-[-2px]">
                <span className="text-[17px] font-black text-gray-950 tracking-tight">94%</span>
              </div>
            </div>

            {/* Custom Premium Colored Legend */}
            <div className="flex-1 space-y-2">
              {[
                { name: "Courteous", value: "78%", dotColor: "bg-emerald-500", textColor: "text-emerald-500" },
                { name: "Assertive", value: "14%", dotColor: "bg-orange-500", textColor: "text-orange-500" },
                { name: "Legal", value: "2%", dotColor: "bg-red-500", textColor: "text-red-500" },
                { name: "Unpaid", value: "6%", dotColor: "bg-gray-200", textColor: "text-gray-400" },
              ].map((legend) => (
                <div key={legend.name} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className={cx("w-2 h-2 rounded-full", legend.dotColor)} />
                    <span className="text-gray-700 font-medium">{legend.name}</span>
                  </div>
                  <span className={cx("font-bold tabular-nums", legend.textColor)}>{legend.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info: Collection cycle improved */}
        <div className="border-t border-gray-100 pt-4 mt-6 text-left">
          <p className="text-[14px] text-gray-700 font-medium">Collection cycle improved</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[#D946EF] md:text-red-500 text-[14.5px] font-semibold tracking-tight">47 days</span>
            <span className="text-gray-600 text-sm font-semibold">→</span>
            <span className="text-emerald-500 text-[14.5px] font-semibold tracking-tight">12 days</span>
          </div>
        </div>
      </div>

      {/* ── Middle: Crisp Straight Vertical Divider touching top and bottom ── */}
      <div className="hidden md:block w-[1px] bg-gray-200 self-stretch shrink-0 mx-2 -my-8" />

      {/* ── Right Column: Active Recovery Channels ── */}
      <div className="flex-[1.2] flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100/60 pb-3.5 mb-5">
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-extrabold text-gray-950 tracking-tight">Active Recovery Channels</h3>
              <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/10 shrink-0">
                AI Optimized
              </span>
            </div>
            <div className="text-[11.5px] font-medium text-green-600 flex items-center gap-1.5 shrink-0">
              <span>Live Telemetry</span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-600"></span>
              </span>
            </div>
          </div>

          {/* Content: BarList */}
          <div className="my-2 py-0.5">
            <BarList
              data={formattedBarData}
              onValueChange={(item) => {
                if (activeCategory === item.name) {
                  setActiveCategory(null)
                } else {
                  setActiveCategory(item.name)
                }
              }}
            />
          </div>
        </div>

        {/* Footer info: calibrated description */}
        <div className="border-t border-gray-100 pt-4 mt-6 flex items-center gap-2.5 text-left">
          {/* Dot Container (shrink-0 prevents it from squishing) */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>

          {/* Text */}
          <p className="text-[14px] text-gray-700 font-medium">
            All System Calibrated with <span className="text-[#FF6A39]">Deep Learning</span> Technology
          </p>
        </div>
      </div>

    </div>
  )
}
