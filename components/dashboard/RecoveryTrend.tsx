"use client"

import React from "react"
import { AreaChart, type TooltipProps as TooltipCallbackProps } from "@/components/ui/chart/AreaChart"

interface DataItem {
  date: string
  revenue: number
}

const data: DataItem[] = [
  //array-start
  {
    date: "Jan 23",
    revenue: 2340,
  },
  {
    date: "Feb 23",
    revenue: 3110,
  },
  {
    date: "Mar 23",
    revenue: 4643,
  },
  {
    date: "Apr 23",
    revenue: 4650,
  },
  {
    date: "May 23",
    revenue: 3980,
  },
  {
    date: "Jun 23",
    revenue: 4702,
  },
  {
    date: "Jul 23",
    revenue: 5990,
  },
  {
    date: "Aug 23",
    revenue: 5700,
  },
  {
    date: "Sep 23",
    revenue: 4250,
  },
  {
    date: "Oct 23",
    revenue: 4182,
  },
  {
    date: "Nov 23",
    revenue: 3812,
  },
  {
    date: "Dec 23",
    revenue: 4900,
  },
  //array-end
]

export function RecoveryTrend() {
  const [datas, setDatas] = React.useState<TooltipCallbackProps | null>(null)
  
  const currencyFormatter = (number: number) =>
    `₹${Intl.NumberFormat("en-IN").format(number)}`

  const payload = datas?.payload?.[0]
  const value = payload?.value

  const displayValue = payload
    ? currencyFormatter(value as number)
    : "₹16,073"

  const dateLabel = payload
    ? `recovered in ${datas?.label}`
    : "recovered last 30 days"

  return (
    <div>
      <p className="text-[15px] font-black text-black">
        Recovery Trend — May 2026
      </p>
      <p className="mt-1 text-sm font-medium text-black flex items-center gap-1.5 flex-wrap">
        <span>{displayValue} {dateLabel}</span>
        <span className="text-emerald-600 font-bold">· ▲ +31%</span>
      </p>

      <div className="mt-8 -mb-2" style={{ height: 192, minHeight: 192, width: '100%' }}>
      <AreaChart
        data={data}
        index="date"
        categories={["revenue"]}
        showLegend={false}
        showYAxis={false}
        startEndOnly={false}
        valueFormatter={currencyFormatter}
        className="h-full w-full"
        tooltipCallback={(props) => {
          if (props.active) {
            setDatas((prev) => {
              if (prev?.label === props.label) return prev
              return props
            })
          } else {
            setDatas(null)
          }
          return null
        }}
      />
      </div>
    </div>
  )
}
