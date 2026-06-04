'use client'

import * as React from 'react'
import Link from 'next/link'
import { formatINRCompact } from '@/lib/utils/currency'
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { DonutChart } from '@/components/ui/DonutChart'
import { BarList } from '@/components/ui/BarList'
import { CategoryBar } from '@/components/ui/CategoryBar'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  AiBrain01Icon
} from '@hugeicons/core-free-icons'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data structures for the different Time Ranges
const TIME_RANGE_DATA = {
  '30_days': {
    metrics: {
      totalRecovered: 240000,
      recoveredDiff: '+14.2% vs last 30d',
      rate: 88.5,
      daysToCollect: 24,
      daysDiff: '-3 days improvement',
      outstanding: 58000,
    },
    trend: [
      { date: 'Week 1', 'Recovered Amount': 45000, 'New Invoices Logged': 52000 },
      { date: 'Week 2', 'Recovered Amount': 68000, 'New Invoices Logged': 70000 },
      { date: 'Week 3', 'Recovered Amount': 55000, 'New Invoices Logged': 48000 },
      { date: 'Week 4', 'Recovered Amount': 72000, 'New Invoices Logged': 60000 },
    ],
    rateTrend: [
      { date: 'Week 1', 'Recovery Rate': 80 },
      { date: 'Week 2', 'Recovery Rate': 84 },
      { date: 'Week 3', 'Recovery Rate': 85 },
      { date: 'Week 4', 'Recovery Rate': 88.5 },
    ],
    channels: [
      { name: 'WhatsApp', value: 118000 },
      { name: 'Email', value: 42000 },
      { name: 'Legal Notices', value: 30000 },
      { name: 'MSME Samadhaan', value: 50000 },
    ],
    aging: [
      { name: '0-30 Days DPD', value: 132000, colorClass: 'bg-gradient-to-r from-emerald-500/5 to-emerald-500/15' },
      { name: '31-45 Days DPD', value: 58000, colorClass: 'bg-gradient-to-r from-blue-500/5 to-blue-500/15' },
      { name: '46-60 Days DPD', value: 32000, colorClass: 'bg-gradient-to-r from-amber-500/5 to-amber-500/15' },
      { name: '>60 Days DPD', value: 18000, colorClass: 'bg-gradient-to-r from-rose-500/5 to-rose-500/15' },
    ],
  },
  '90_days': {
    metrics: {
      totalRecovered: 840000,
      recoveredDiff: '+10.8% vs last 90d',
      rate: 85.2,
      daysToCollect: 26,
      daysDiff: '-4 days improvement',
      outstanding: 145000,
    },
    trend: [
      { date: 'March', 'Recovered Amount': 240000, 'New Invoices Logged': 260000 },
      { date: 'April', 'Recovered Amount': 280000, 'New Invoices Logged': 295000 },
      { date: 'May', 'Recovered Amount': 320000, 'New Invoices Logged': 285000 },
    ],
    rateTrend: [
      { date: 'March', 'Recovery Rate': 82 },
      { date: 'April', 'Recovery Rate': 84 },
      { date: 'May', 'Recovery Rate': 85.2 },
    ],
    channels: [
      { name: 'WhatsApp', value: 395000 },
      { name: 'Email', value: 160000 },
      { name: 'Legal Notices', value: 125000 },
      { name: 'MSME Samadhaan', value: 160000 },
    ],
    aging: [
      { name: '0-30 Days DPD', value: 480000, colorClass: 'bg-gradient-to-r from-emerald-500/5 to-emerald-500/15' },
      { name: '31-45 Days DPD', value: 195000, colorClass: 'bg-gradient-to-r from-blue-500/5 to-blue-500/15' },
      { name: '46-60 Days DPD', value: 110000, colorClass: 'bg-gradient-to-r from-amber-500/5 to-amber-500/15' },
      { name: '>60 Days DPD', value: 55000, colorClass: 'bg-gradient-to-r from-rose-500/5 to-rose-500/15' },
    ],
  },
  '6_months': {
    metrics: {
      totalRecovered: 1842000,
      recoveredDiff: '+12.3% MoM',
      rate: 86.4,
      daysToCollect: 28,
      daysDiff: '-7 days improvement',
      outstanding: 458000,
    },
    trend: [
      { date: 'Dec 25', 'Recovered Amount': 220000, 'New Invoices Logged': 250000 },
      { date: 'Jan 26', 'Recovered Amount': 260000, 'New Invoices Logged': 310000 },
      { date: 'Feb 26', 'Recovered Amount': 340000, 'New Invoices Logged': 320000 },
      { date: 'Mar 26', 'Recovered Amount': 310000, 'New Invoices Logged': 290000 },
      { date: 'Apr 26', 'Recovered Amount': 342000, 'New Invoices Logged': 360000 },
      { date: 'May 26', 'Recovered Amount': 370000, 'New Invoices Logged': 340000 },
    ],
    rateTrend: [
      { date: 'Dec 25', 'Recovery Rate': 78 },
      { date: 'Jan 26', 'Recovery Rate': 80 },
      { date: 'Feb 26', 'Recovery Rate': 82 },
      { date: 'Mar 26', 'Recovery Rate': 81 },
      { date: 'Apr 26', 'Recovery Rate': 85 },
      { date: 'May 26', 'Recovery Rate': 86.4 },
    ],
    channels: [
      { name: 'WhatsApp', value: 828900 },
      { name: 'Email', value: 368400 },
      { name: 'Legal Notices', value: 276300 },
      { name: 'MSME Samadhaan', value: 368400 },
    ],
    aging: [
      { name: '0-30 Days DPD', value: 1120000, colorClass: 'bg-gradient-to-r from-emerald-500/5 to-emerald-500/15' },
      { name: '31-45 Days DPD', value: 412000, colorClass: 'bg-gradient-to-r from-blue-500/5 to-blue-500/15' },
      { name: '46-60 Days DPD', value: 210000, colorClass: 'bg-gradient-to-r from-amber-500/5 to-amber-500/15' },
      { name: '>60 Days DPD', value: 100000, colorClass: 'bg-gradient-to-r from-rose-500/5 to-rose-500/15' },
    ],
  },
  'ytd': {
    metrics: {
      totalRecovered: 3820000,
      recoveredDiff: '+15.5% vs YTD Target',
      rate: 87.1,
      daysToCollect: 27,
      daysDiff: '-8 days improvement',
      outstanding: 890000,
    },
    trend: [
      { date: 'Jan', 'Recovered Amount': 540000, 'New Invoices Logged': 590000 },
      { date: 'Feb', 'Recovered Amount': 610000, 'New Invoices Logged': 630000 },
      { date: 'Mar', 'Recovered Amount': 740000, 'New Invoices Logged': 710000 },
      { date: 'Apr', 'Recovered Amount': 920000, 'New Invoices Logged': 890000 },
      { date: 'May', 'Recovered Amount': 1010000, 'New Invoices Logged': 980000 },
    ],
    rateTrend: [
      { date: 'Jan', 'Recovery Rate': 75 },
      { date: 'Feb', 'Recovery Rate': 79 },
      { date: 'Mar', 'Recovery Rate': 82 },
      { date: 'Apr', 'Recovery Rate': 85 },
      { date: 'May', 'Recovery Rate': 87.1 },
    ],
    channels: [
      { name: 'WhatsApp', value: 1719000 },
      { name: 'Email', value: 764000 },
      { name: 'Legal Notices', value: 573000 },
      { name: 'MSME Samadhaan', value: 764000 },
    ],
    aging: [
      { name: '0-30 Days DPD', value: 2310000, colorClass: 'bg-gradient-to-r from-emerald-500/5 to-emerald-500/15' },
      { name: '31-45 Days DPD', value: 890000, colorClass: 'bg-gradient-to-r from-blue-500/5 to-blue-500/15' },
      { name: '46-60 Days DPD', value: 420000, colorClass: 'bg-gradient-to-r from-amber-500/5 to-amber-500/15' },
      { name: '>60 Days DPD', value: 200000, colorClass: 'bg-gradient-to-r from-rose-500/5 to-rose-500/15' },
    ],
  }
}

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]

const chartConfig = {
  desktop: {
    label: "Invoices Sent",
    color: "#FF6A39",
  },
  mobile: {
    label: "Payments Received",
    color: "#10B981",
  },
} satisfies ChartConfig

export function RecoveryAnalytics() {
  const [timeRange, setTimeRange] = React.useState<keyof typeof TIME_RANGE_DATA>('6_months')
  const currentData = TIME_RANGE_DATA[timeRange]

  const filteredData = React.useMemo(() => {
    let daysToSubtract = 90
    if (timeRange === "30_days") {
      daysToSubtract = 30
    } else if (timeRange === "90_days") {
      daysToSubtract = 90
    } else if (timeRange === "6_months") {
      daysToSubtract = 90
    } else if (timeRange === "ytd") {
      daysToSubtract = 90
    }

    const referenceDate = new Date("2024-06-30")
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return chartData.filter((item) => {
      const date = new Date(item.date)
      return date >= startDate
    })
  }, [timeRange])

  // Value formatting utility for currency (INR)
  const currencyFormatter = (value: number) => {
    return `₹${(value / 100000).toFixed(2)} L`
  }

  // Calculate sum for channel percentages display
  const totalChannelsValue = currentData.channels.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-4">

      {/* ── Page Header & Controls ── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 select-none pb-2">
        <div className="text-left flex-1">
          <nav className="flex items-center gap-1.5 text-[12px] text-gray-400">
            <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gray-400">Analytics</span>
            <span>›</span>
            <span className="text-gray-600 font-medium">Recovery Analytics</span>
          </nav>
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight mt-1">
            Recovery Analytics
          </h1>
          <p className="mt-1 text-[13px] text-gray-400 font-medium">
            Monitor collections speed, recovery success rates, DPD performance, and channels efficiency in real time.
          </p>
        </div>

        {/* Dropdown controls */}
        <div className="flex items-center gap-2 bg-white border border-[#EBEAE6] p-1.5 rounded-xl shadow-3xs shrink-0 self-start md:self-end">
          <span className="text-[12px] font-semibold text-gray-600 pl-2">Timeframe:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-gray-50/70 border border-gray-100 hover:bg-gray-100/50 transition-colors rounded-lg px-2.5 py-1 text-[12px] font-bold text-gray-800 focus:outline-none cursor-pointer"
          >
            <option value="30_days">Last 30 Days</option>
            <option value="90_days">Last 90 Days</option>
            <option value="6_months">Last 6 Months</option>
            <option value="ytd">Year to Date (YTD)</option>
          </select>
        </div>
      </div>

      {/* ── Key Metrics Grid (Unified Premium Panel) ── */}
      <div className="bg-white border border-[#EBEAE6] rounded-[22px] overflow-hidden select-none">
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x text-left">
          
          {/* Stat 1: Total Debt Recovered */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Total Recovered</span>
            <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[26px] font-bold text-gray-900 leading-none whitespace-nowrap">
                {currencyFormatter(currentData.metrics.totalRecovered)}
              </span>
              <span className="text-[11.5px] text-emerald-600 font-semibold whitespace-nowrap">
                ▲ {currentData.metrics.recoveredDiff}
              </span>
            </div>
          </div>

          {/* Stat 2: Recovery Success */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Recovery Success</span>
            <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[26px] font-bold text-gray-900 leading-none whitespace-nowrap">
                {currentData.metrics.rate}%
              </span>
              <span className="text-[11.5px] text-gray-500 font-medium whitespace-nowrap">
                Target: 80%
              </span>
            </div>
          </div>

          {/* Stat 3: Average Days to Collect */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Avg Days to Collect</span>
            <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[26px] font-bold text-gray-900 leading-none whitespace-nowrap">
                {currentData.metrics.daysToCollect} Days
              </span>
              <span className="text-[11.5px] text-orange-600 font-semibold whitespace-nowrap">
                ▼ {currentData.metrics.daysDiff}
              </span>
            </div>
          </div>

          {/* Stat 4: Outstanding Receivables */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Outstanding Queue</span>
            <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[26px] font-bold text-gray-900 leading-none whitespace-nowrap">
                {currencyFormatter(currentData.metrics.outstanding)}
              </span>
              <span className="text-[11.5px] text-gray-500 font-semibold whitespace-nowrap">
                Awaiting Reminders
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Trend Analysis Chart (Full-Width Premium White Card) ── */}
      <div className="w-full">
        <div className="w-full rounded-[22px] bg-white border border-[#EBEAE6] p-6 shadow-3xs text-left select-none space-y-4">
          <div className="border-b border-[#EBEAE6]/60 pb-4">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
              Invoices & Payments
            </span>
            <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight mt-0.5">
              Payments Received vs Invoices Sent
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Compare the total money billed to customers with the cash you actually collected. The closer they are, the faster you get paid.
            </p>
          </div>
          <div className="pt-2">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[320px] w-full"
            >
              <RechartsAreaChart data={filteredData} margin={{ left: 10, right: 10 }}>
                <defs>
                  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-gray-200/50" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  className="text-xs font-semibold fill-gray-400"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  width={60}
                  tickFormatter={(value) => `₹${value}K`}
                  className="text-xs font-semibold fill-gray-400"
                />
                <ChartTooltip
                  cursor={{ stroke: '#EBEAE6', strokeWidth: 1 }}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value: any) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="mobile"
                  type="monotone"
                  fill="url(#fillMobile)"
                  stroke="var(--color-mobile)"
                  strokeWidth={2}
                  stackId="a"
                />
                <Area
                  dataKey="desktop"
                  type="monotone"
                  fill="url(#fillDesktop)"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent className="pt-4" />} />
              </RechartsAreaChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* ── Double-Column Breakdowns ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Column: Recovery Channels Donut Chart */}
        <div className="rounded-[22px] bg-white border border-[#EBEAE6] p-5 flex flex-col justify-between text-left select-none space-y-4">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
              Channel Efficiency
            </span>
            <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight mt-0.5">
              Recovery by Channels
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Percentage of cash recovered from each communication & legal channel.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4 flex-1">
            <div className="h-40 w-40 flex-shrink-0 flex items-center justify-center relative">
              <DonutChart
                data={currentData.channels}
                category="name"
                value="value"
                colors={['emerald', 'blue', 'orange', 'violet']}
                valueFormatter={currencyFormatter}
                showLabel={true}
                label="Channels"
              />
            </div>
            
            <div className="space-y-2 flex-1 w-full max-w-[200px]">
              {currentData.channels.map((chan, idx) => {
                const percentage = ((chan.value / totalChannelsValue) * 100).toFixed(0)
                const colorsArr = ['bg-emerald-500', 'bg-blue-500', 'bg-orange-500', 'bg-violet-500']
                
                return (
                  <div key={chan.name} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${colorsArr[idx % colorsArr.length]}`} />
                      <span className="text-gray-600">{chan.name}</span>
                    </div>
                    <div className="text-gray-900 flex items-center gap-1.5">
                      <span>{percentage}%</span>
                      <span className="text-[10px] text-gray-400 font-normal font-mono">
                        ({(chan.value / 1000).toFixed(0)}K)
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Aging Profile Recovery BarList */}
        <div className="rounded-[22px] bg-white border border-[#EBEAE6] p-5 flex flex-col justify-between text-left select-none space-y-4">
          <div>
            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest block">
              aging Performance
            </span>
            <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight mt-0.5">
              Recovery by Invoice Aging
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Distribution of recovered outstanding debts classified under DPD (Days Past Due).
            </p>
          </div>

          <div className="py-2 flex-1 flex items-center">
            <BarList
              data={currentData.aging}
              valueFormatter={currencyFormatter}
            />
          </div>
        </div>

      </div>

      {/* ── Actionable Recovery Insights (Wow & Premium) ── */}
      <div className="bg-white border border-[#EBEAE6] rounded-[22px] p-6 text-left select-none shadow-3xs space-y-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight">
            AI Smart Suggestions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Card 1: WhatsApp Efficiency */}
          <div className="bg-gradient-to-br from-emerald-500/[0.03] to-emerald-500/[0.08] hover:from-emerald-500/[0.06] hover:to-emerald-500/[0.12] border border-emerald-500/20 p-5 rounded-2xl flex gap-4 transition-all duration-300 hover:shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm text-lg font-bold">
              💬
            </div>
            <div className="space-y-2 flex-1">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest block">
                Recovery Speed Boost
              </span>
              <h4 className="text-sm font-extrabold text-gray-900 leading-tight">
                Send WhatsApp reminders to get paid 64% faster
              </h4>
              <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                Invoices overdue by 15-30 days get paid 2.2x quicker when reminded on WhatsApp instead of Email. Set up your reminder tone below.
              </p>
              <div className="pt-1">
                <Link 
                  href="/tone-engine" 
                  className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                >
                  Configure Tone Escalations →
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: MSME Filing Opportunity */}
          <div className="bg-gradient-to-br from-[#FF6A39]/[0.03] to-[#FF6A39]/[0.08] hover:from-[#FF6A39]/[0.06] hover:to-[#FF6A39]/[0.12] border border-[#FF6A39]/20 p-5 rounded-2xl flex gap-4 transition-all duration-300 hover:shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-[#FF6A39] text-white flex items-center justify-center flex-shrink-0 shadow-sm text-lg font-bold">
              ⚖️
            </div>
            <div className="space-y-2 flex-1">
              <span className="text-[10px] font-extrabold text-[#FF6A39] uppercase tracking-widest block">
                Legal Interest Claim
              </span>
              <h4 className="text-sm font-extrabold text-gray-900 leading-tight">
                Claim 3x interest on 2 long-overdue invoices
              </h4>
              <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                You have 2 invoices overdue by more than 45 days. Under MSME rules, you can claim 3x the RBI interest rate from these customers.
              </p>
              <div className="pt-1">
                <Link 
                  href="/msme-samadhaan" 
                  className="text-xs text-[#FF6A39] font-bold hover:underline inline-flex items-center gap-1"
                >
                  Claim RBI Interest / MSME Samadhaan →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
