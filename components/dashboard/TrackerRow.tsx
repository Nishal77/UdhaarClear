"use client"

import React, { useState } from "react"
import { Tracker } from "@/components/Tracker"
import type { TrackerBlockProps } from "@/components/Tracker"
import { HugeiconsIcon } from "@hugeicons/react"
import { ChartAnalysisIcon } from "@hugeicons/core-free-icons"

type Period = "weekly" | "monthly"

interface TrackerRowProps {
  outstandingWeekly: TrackerBlockProps[]
  collectedWeekly: TrackerBlockProps[]
  outstandingMonthly: TrackerBlockProps[]
  collectedMonthly: TrackerBlockProps[]
  outstandingCount: number
  totalOutstanding: string
  collectedThisMonth: string
}

function PeriodToggle({
  value,
  onChange,
}: {
  value: Period
  onChange: (v: Period) => void
}) {
  return (
    <div className="flex items-center rounded-full bg-gray-100/80 p-0.5 gap-0.5">
      {(["weekly", "monthly"] as Period[]).map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={[
              "relative px-3 py-1 text-[11px] font-medium rounded-full transition-all duration-200 capitalize select-none",
              active
                ? "bg-white text-gray-900"
                : "text-gray-400 hover:text-gray-600",
            ].join(" ")}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export function TrackerRow({
  outstandingWeekly,
  collectedWeekly,
  outstandingMonthly,
  collectedMonthly,
  outstandingCount,
  totalOutstanding,
  collectedThisMonth,
}: TrackerRowProps) {
  const [period, setPeriod] = useState<Period>("weekly")

  const outstanding = period === "weekly" ? outstandingWeekly : outstandingMonthly
  const collected = period === "weekly" ? collectedWeekly : collectedMonthly
  const periodLabel = period === "weekly" ? "Weekly" : "Monthly"


  return (
    <div className="border-t border-gray-200/85 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200/85">

      {/* CARD 1: Outstanding */}
      <div className="lg:col-span-5 p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Clock icon */}
            <span className="text-[14px] font-medium text-black tracking-tight">
              Outstanding &mdash; {periodLabel}
            </span>
          </div>
          <PeriodToggle value={period} onChange={setPeriod} />
        </div>

        <div className="my-5">
          <div className="mb-4">
            <Tracker className="hidden w-full lg:flex" data={outstanding} hoverEffect />
            <Tracker className="hidden w-full sm:flex lg:hidden" data={outstanding.slice(0, 60)} hoverEffect />
            <Tracker className="flex w-full sm:hidden" data={outstanding.slice(0, 30)} hoverEffect />
          </div>
          <span className="text-[14px] font-medium text-black tracking-tight block">
            Total outstanding ({outstandingCount} invoices)
          </span>
          <span className="text-[28px] font-semibold text-[#000] leading-none tracking-tight block mt-1.5">
            {totalOutstanding}
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200 text-[11px] text-gray-600 font-medium mt-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
            <span>Overdue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-300" />
            <span>Future</span>
          </div>
        </div>
      </div>

      {/* CARD 2: Collected */}
      <div className="lg:col-span-5 p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Checkbox icon */}
            <div className="flex h-4.5 w-4.5 items-center justify-center rounded bg-emerald-600 text-white shrink-0">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[14px] font-medium text-black tracking-tight">
              Collected &mdash; {periodLabel}
            </span>
          </div>
          <PeriodToggle value={period} onChange={setPeriod} />
        </div>

        <div className="my-5">
          <div className="mb-4">
            <Tracker className="hidden w-full lg:flex" data={collected} hoverEffect />
            <Tracker className="hidden w-full sm:flex lg:hidden" data={collected.slice(0, 60)} hoverEffect />
            <Tracker className="flex w-full sm:hidden" data={collected.slice(0, 30)} hoverEffect />
          </div>
          <span className="text-[14px] font-medium text-black tracking-tight block">
            Total paid this month
          </span>
          <span className="text-[28px] font-semibold text-emerald-600 leading-none tracking-tight block mt-1.5">
            {collectedThisMonth}
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200 text-[11px] text-gray-600 font-medium mt-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
            <span>Recovered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-gray-300" />
            <span>Pending</span>
          </div>
        </div>
      </div>

      {/* CARD 3: Growth Rate (unchanged) */}
      <div className="lg:col-span-2 p-6 flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={ChartAnalysisIcon} className="size-4 text-black-400" />
          <span className="text-[14px] font-medium text-black tracking-tight">Growth Rate</span>
        </div>

        <div className="my-3">
          <span className="text-[32px] font-black text-[#E15A42] leading-none tracking-tight block">31%</span>
          <span className="text-[14px] font-medium text-black tracking-tight block mt-2">
            Recovery MoM growth
          </span>
          <span className="text-[11px] font-medium text-gray-600 tracking-tight block mt-0.5">Last 7 months</span>
        </div>

        {/* Bar Chart Graphic */}
        <div className="flex items-end justify-between gap-1 h-14 mt-auto w-full">
          <div className="w-[12%] h-[20%] bg-[#FF6A39]/20 rounded-t" />
          <div className="w-[12%] h-[35%] bg-[#FF6A39]/30 rounded-t" />
          <div className="w-[12%] h-[45%] bg-[#FF6A39]/50 rounded-t" />
          <div className="w-[12%] h-[60%] bg-[#FF6A39]/70 rounded-t" />
          <div className="w-[12%] h-[72%] bg-[#FF6A39]/85 rounded-t" />
          <div className="w-[12%] h-[85%] bg-[#FF6A39]/95 rounded-t" />
          <div className="w-[12%] h-[100%] bg-[#FF6A39] rounded-t" />
        </div>
      </div>
    </div>
  )
}
