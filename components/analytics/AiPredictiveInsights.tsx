'use client'

import { useState } from 'react'
import { formatINRCompact } from '@/lib/utils/currency'
import { CategoryBar } from '@/components/ui/CategoryBar'
import { BarList } from '@/components/ui/BarList'
import { toast } from 'sonner'
import { Tracker } from '@/components/ui/Tracker'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  AiBrain01Icon,
  Search01Icon
} from '@hugeicons/core-free-icons'
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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

interface DebtorMlProfile {
  id: string
  customerName: string
  balance: number
  probability: number
  predictedDate: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  recommendedAction: string
  recommendedRoute: string
  behavior: {
    avgDelayDays: number
    responseRates: { name: string; value: number }[]
    mlSummary: string
  }
}

const DEBTOR_ML_PROFILES: DebtorMlProfile[] = [
  {
    id: 'db-1',
    customerName: 'Reddy Enterprises',
    balance: 200000,
    probability: 74,
    predictedDate: '12 Jun 2026 (±2d)',
    riskLevel: 'MEDIUM',
    recommendedAction: 'Shift to WhatsApp Friday Reminders',
    recommendedRoute: '/tone-engine',
    behavior: {
      avgDelayDays: 18,
      responseRates: [
        { name: 'WhatsApp', value: 85 },
        { name: 'Email', value: 20 },
        { name: 'Calls', value: 45 }
      ],
      mlSummary: 'Customer typically pays on Friday afternoons. Reminders dispatched on Thursdays or Fridays receive 4x quicker responses than early-week notices.'
    }
  },
  {
    id: 'db-2',
    customerName: 'Bharat Steel Works',
    balance: 640000,
    probability: 88,
    predictedDate: '18 Jun 2026 (±3d)',
    riskLevel: 'LOW',
    recommendedAction: 'Trigger Friendly WhatsApp Notice',
    recommendedRoute: '/tone-engine',
    behavior: {
      avgDelayDays: 8,
      responseRates: [
        { name: 'WhatsApp', value: 92 },
        { name: 'Email', value: 40 },
        { name: 'Calls', value: 60 }
      ],
      mlSummary: 'Highly responsive client. Tends to clear balances immediately after a friendly WhatsApp follow-up. Email remains unread.'
    }
  },
  {
    id: 'db-3',
    customerName: 'MegaVision Electronics',
    balance: 2200000,
    probability: 41,
    predictedDate: 'High Default Risk (>60d late)',
    riskLevel: 'CRITICAL',
    recommendedAction: 'File MSME Samadhaan pre-notice',
    recommendedRoute: '/msme-samadhaan',
    behavior: {
      avgDelayDays: 52,
      responseRates: [
        { name: 'WhatsApp', value: 15 },
        { name: 'Email', value: 5 },
        { name: 'Calls', value: 10 }
      ],
      mlSummary: 'Zero response across electronic channels. Historical trends suggest legal escalation triggers immediate conciliation. Recommend filing MSME Samadhaan dispute immediately.'
    }
  },
  {
    id: 'db-4',
    customerName: 'Tara Decoratives',
    balance: 170000,
    probability: 48,
    predictedDate: 'Default threat (>95d late)',
    riskLevel: 'CRITICAL',
    recommendedAction: 'Claim 3x RBI compound interest',
    recommendedRoute: '/msme-samadhaan',
    behavior: {
      avgDelayDays: 65,
      responseRates: [
        { name: 'WhatsApp', value: 30 },
        { name: 'Email', value: 10 },
        { name: 'Calls', value: 20 }
      ],
      mlSummary: 'Severe payment delays. Escalating reminders have exhausted efficiency. Claim compounding interest via Facilitation Council to force recovery.'
    }
  },
  {
    id: 'db-5',
    customerName: 'Vertex Solutions Co.',
    balance: 89000,
    probability: 91,
    predictedDate: '08 Jun 2026 (±1d)',
    riskLevel: 'LOW',
    recommendedAction: 'Trigger auto-billing sync',
    recommendedRoute: '/settings',
    behavior: {
      avgDelayDays: 4,
      responseRates: [
        { name: 'WhatsApp', value: 95 },
        { name: 'Email', value: 80 },
        { name: 'Calls', value: 70 }
      ],
      mlSummary: 'Consistent payor. Delays are usually administrative. Triggering automated accounting ledger matching will speed up clearance.'
    }
  }
]

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
  baseline: {
    label: "AI Baseline Expected",
    color: "#10b981", // Emerald
  },
  worstCase: {
    label: "Worst Case Recovery",
    color: "#f97316", // Orange
  },
  outstanding: {
    label: "Total Outstanding AR",
    color: "#8b5cf6", // Violet
  },
} satisfies ChartConfig

const getTrackerData = (probability: number) => {
  const totalBlocks = 30
  return Array.from({ length: totalBlocks }).map((_, index) => {
    const threshold = ((index + 1) / totalBlocks) * 100
    const isActive = probability >= threshold

    let color = "bg-gray-100"
    if (isActive) {
      if (index < 10) {
        color = "bg-[#E14F4B]" // Red
      } else if (index < 20) {
        color = "bg-[#D9791D]" // Orange
      } else {
        color = "bg-[#52BA84]" // Green
      }
    }

    return {
      color,
      tooltip: `${probability}% Probability`
    }
  })
}

export function AiPredictiveInsights() {
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL')
  const [timeRange, setTimeRange] = useState('90d')

  // Drawer states
  const [selectedProfile, setSelectedProfile] = useState<DebtorMlProfile | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const getFilteredDebtors = () => {
    return DEBTOR_ML_PROFILES.filter((db) => {
      const matchesSearch = db.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRisk = riskFilter === 'ALL' || db.riskLevel === riskFilter
      return matchesSearch && matchesRisk
    })
  }

  const filteredDebtors = getFilteredDebtors()

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  const runwayDailyData = filteredData.map((item) => ({
    date: item.date,
    baseline: item.desktop * 3000,
    worstCase: item.mobile * 1800,
    outstanding: (item.desktop + item.mobile) * 4500,
  }))

  const handleApplyOptimization = (cName: string, actionName: string) => {
    toast.success(`Applied AI recommendation: "${actionName}" for ${cName}`)
  }

  return (
    <div className="space-y-4">

      {/* ── ML Metrics Panel ── */}
      <div className="bg-white border border-[#EBEAE6] rounded-[22px] overflow-hidden select-none">
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x text-left">

          {/* Metric 1: Expected Collections */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Projected 30d Recoveries</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                {formatINRCompact(1450000)}
              </span>
              <span className="inline-flex items-center text-emerald-700 text-[11.5px] font-medium whitespace-nowrap">
                AI Projected Baseline
              </span>
            </div>
          </div>

          {/* Metric 2: Average Payment Probability */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Average Probability</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                68.4%
              </span>
              <span className="inline-flex items-center text-blue-700 text-[11.5px] font-medium whitespace-nowrap">
                Confidence: High
              </span>
            </div>
          </div>

          {/* Metric 3: Default Risk */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">Projected Bad Debt</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                3.8%
              </span>
              <span className="inline-flex items-center text-red-700 text-[11.5px] font-medium whitespace-nowrap">
                Target limit: &lt;5.0%
              </span>
            </div>
          </div>

          {/* Metric 4: suggested actions */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight block">ML Optimizations</span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[25px] font-semibold text-gray-900 leading-none whitespace-nowrap block">
                5 Actions
              </span>
              <span className="inline-flex items-center text-violet-700 text-[11.5px] font-medium whitespace-nowrap">
                Est. impact: +₹1.80 L
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Cash Projections Runway Area Chart ── */}
      <Card className="bg-white border border-[#EBEAE6] rounded-[22px] overflow-hidden select-none text-left p-0 shadow-none">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 space-y-0 border-b border-[#EBEAE6]/60 p-6">
          <div className="grid flex-1 gap-1">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
              Runway Cash Forecast
            </span>
            <CardTitle className="text-[16px] font-extrabold text-gray-900 leading-tight">
              Expected 30-Day Collections Runway
            </CardTitle>
            <CardDescription className="text-xs text-gray-400 font-semibold leading-relaxed mt-0.5">
              Machine learning projection comparing expected recoveries (Baseline) against absolute worst-case default rates and total outstanding accounts receivable.
            </CardDescription>
          </div>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[180px] rounded-xl font-semibold text-xs border-[#EBEAE6] cursor-pointer"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white border border-[#EBEAE6] shadow-md z-50">
              <SelectItem value="90d" className="rounded-lg cursor-pointer">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg cursor-pointer">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg cursor-pointer">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[320px] w-full"
          >
            <RechartsAreaChart data={runwayDailyData} margin={{ left: 12, right: 12 }}>
              <defs>
                <linearGradient id="fillBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-baseline)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-baseline)"
                    stopOpacity={0.01}
                  />
                </linearGradient>
                <linearGradient id="fillWorstCase" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-worstCase)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-worstCase)"
                    stopOpacity={0.01}
                  />
                </linearGradient>
                <linearGradient id="fillOutstanding" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-outstanding)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-outstanding)"
                    stopOpacity={0.01}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-gray-200/50" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: any) => {
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
                tickMargin={8}
                width={64}
                tickFormatter={(value: any) => `₹${(value / 1000).toFixed(0)}K`}
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
                dataKey="outstanding"
                type="natural"
                fill="url(#fillOutstanding)"
                stroke="var(--color-outstanding)"
                strokeWidth={2}
              />
              <Area
                dataKey="baseline"
                type="natural"
                fill="url(#fillBaseline)"
                stroke="var(--color-baseline)"
                strokeWidth={2}
              />
              <Area
                dataKey="worstCase"
                type="natural"
                fill="url(#fillWorstCase)"
                stroke="var(--color-worstCase)"
                strokeWidth={2}
              />
              <ChartLegend content={<ChartLegendContent className="pt-4" />} />
            </RechartsAreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* ── Debtor Toolbar Controls ── */}
      <div className="bg-white border border-[#EBEAE6] rounded-xl p-4 select-none text-left">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

          {/* Left Block: Search */}
          <div className="relative flex-1 min-w-[240px] max-w-[340px] w-full">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <HugeiconsIcon icon={Search01Icon} size={16} className="text-gray-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search debtors..."
              className="w-full h-10 bg-[#F1F1F1] rounded-full pl-11 pr-10 text-[13px] text-gray-800 focus:outline-none focus:bg-[#EBEBEB] focus:ring-2 focus:ring-[#FF6A39]/20 transition-all duration-200 border-0"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 text-xs font-semibold transition-colors z-10"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right Block: Risk Filter Group */}
          <div className="flex items-center gap-1 bg-gray-100/70 p-1 rounded-lg">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
              <button
                key={risk}
                onClick={() => setRiskFilter(risk as any)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${riskFilter === risk
                  ? 'bg-white text-gray-900 shadow-3xs'
                  : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Debtor Probability Ledger Table ── */}
      <div className="bg-white border border-[#EBEAE6] rounded-[22px] overflow-hidden select-none">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#EBEAE6] select-none bg-gray-50/50 text-left">
                <th className="px-5 py-3.5 text-[13.5px] font-bold text-gray-600">Debtor Account</th>
                <th className="px-4 py-3.5 text-[13.5px] font-bold text-gray-600">Balance</th>
                <th className="px-4 py-3.5 text-[13.5px] font-bold text-gray-600 w-[200px]">AI Payment Probability</th>
                <th className="px-4 py-3.5 text-[13.5px] font-bold text-gray-600">Predicted Pay Date</th>
                <th className="px-4 py-3.5 text-[13.5px] font-bold text-gray-600">AI Suggested Action</th>
                <th className="px-5 py-3.5 text-right text-[13.5px] font-bold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEAE6]/60 text-left">
              {filteredDebtors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[13.5px] text-gray-400 font-medium select-none">
                    No debtors match the filters.
                  </td>
                </tr>
              ) : (
                filteredDebtors.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/40 transition-colors">

                    {/* Customer Info */}
                    <td className="px-5 py-4.5">
                      <div>
                        <span className="text-[14.5px] font-semibold text-gray-900 block leading-tight">
                          {row.customerName}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 mt-1.5 text-[10.5px] font-extrabold tracking-wide border whitespace-nowrap ${row.riskLevel === 'CRITICAL'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : row.riskLevel === 'HIGH'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : row.riskLevel === 'MEDIUM'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                          {row.riskLevel} RISK
                        </span>
                      </div>
                    </td>

                    {/* Balance */}
                    <td className="px-4 py-4 whitespace-nowrap font-extrabold text-gray-900 text-[14.5px]">
                      {formatINRCompact(row.balance)}
                    </td>

                    {/* Probability indicator */}
                    <td className="px-4 py-4 w-[200px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[12px] font-semibold">
                          <span className={
                            row.probability > 80
                              ? 'text-emerald-600'
                              : row.probability > 50
                                ? 'text-amber-600'
                                : 'text-gray-900'
                          }>
                            {row.probability}% Probability
                          </span>
                        </div>
                        <Tracker
                          data={getTrackerData(row.probability)}
                          className="h-2 w-full mt-1.5"
                        />
                      </div>
                    </td>

                    {/* Predicted pay date */}
                    <td className="px-4 py-4 text-[13.5px] font-semibold text-gray-800">
                      {row.predictedDate}
                    </td>

                    {/* Recommended action info */}
                    <td className="px-4 py-4 text-[13px] font-semibold text-gray-550 max-w-[200px]">
                      {row.recommendedAction}
                    </td>

                    {/* Click buttons */}
                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProfile(row)
                          setDrawerOpen(true)
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[12px] font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                      >
                        Inspect behavior
                      </button>
                      <button
                        onClick={() => handleApplyOptimization(row.customerName, row.recommendedAction)}
                        className="bg-gray-950 hover:bg-gray-850 text-white text-[12px] font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                      >
                        Optimize
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── AI Recommendation Insight Cards ── */}
      {/* ── AI Collection Insights (Premium & Wow UI) ── */}
      <div className="bg-[#FFFFFF] border border-[#EBEAE6] rounded-[22px] p-5 text-left select-none shadow-3xs flex items-start gap-4">
        <div className="space-y-1.5 flex-1">
          <span className="flex items-center gap-2 text-[14.5px] font-extrabold text-[#FF6A39] leading-tight">
            {/* Layered Ping Dot */}
            <div className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A39] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A39]"></span>
            </div>

            {/* Heading Text */}
            <span>
              Revenue Protection Insights{" "}
              <span className="text-gray-900 font-semibold">
                (&nbsp;AI Powered&nbsp;)
              </span>
            </span>
          </span>
          {/* <h4 className="text-[14.5px] font-extrabold text-gray-900 leading-tight">
            Collection Optimization Available
          </h4> */}
          <p className="text-[13.5px] text-gray-600 font-medium leading-relaxed">
            Applying Friday afternoon scheduling on **Reddy Enterprises** is projected to recover ₹2,00,000 approximately 8 days earlier. Click the "Optimize" button in the table to apply this scheduling rule.
          </p>
        </div>
      </div>

      {/* ── CUSTOMER BEHAVIORAL DETAILS DRAWER ── */}
      {drawerOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={() => setDrawerOpen(false)} />

          <div className="relative z-10 w-full max-w-md bg-[#FFFFFF] shadow-2xl flex flex-col h-full border-l border-[#EBEAE6] rounded-l-[28px] overflow-hidden">

            {/* Header */}
            <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="text-left space-y-1">
                <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-[11.5px] font-semibold text-[#FF6A39] border border-orange-100/50">
                  AI Behavioral Audit
                </span>
                <h3 className="text-[18px] font-semibold text-gray-900 leading-tight">
                  {selectedProfile.customerName}
                </h3>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="h-8 w-8 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200/50 flex items-center justify-center transition-all text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-left">

              {/* Box 1: Core behavioral metrics */}
              <div className="bg-white border border-gray-100 p-4.5 rounded-xl space-y-3 shadow-2xs">
                <div className="flex justify-between text-[12.5px] font-semibold">
                  <span className="text-gray-500">Average Overdue Delay:</span>
                  <span className="font-extrabold text-gray-950">{selectedProfile.behavior.avgDelayDays} Days Past Due</span>
                </div>
                <div className="flex justify-between text-[12.5px] font-semibold">
                  <span className="text-gray-500">Payment Probability:</span>
                  <span className={`font-extrabold ${selectedProfile.probability > 80
                    ? 'text-emerald-600'
                    : selectedProfile.probability > 50
                      ? 'text-amber-600'
                      : 'text-red-650'
                    }`}>{selectedProfile.probability}%</span>
                </div>
              </div>

              {/* Box 2: Channel conversion rates (BarList) */}
              <div className="space-y-2.5">
                <span className="text-[12.5px] font-bold text-gray-400 uppercase tracking-wider block">
                  Channel Response Rates
                </span>
                <div className="bg-white border border-[#EBEAE6] p-4.5 rounded-xl">
                  <BarList
                    data={selectedProfile.behavior.responseRates}
                    valueFormatter={(val) => `${val}% conversion`}
                  />
                </div>
              </div>

              {/* Box 3: ML Summary explanation */}
              <div className="space-y-2.5">
                <span className="text-[12.5px] font-bold text-gray-400 uppercase tracking-wider block">
                  ML Behavioral Summary
                </span>
                <div className="bg-white border border-[#EBEAE6] p-4.5 rounded-xl text-[12px] text-gray-600 leading-relaxed font-semibold">
                  📖 {selectedProfile.behavior.mlSummary}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 bg-white border-t border-gray-100 flex gap-2.5">
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-extrabold py-3 px-4 rounded-xl text-[12.5px] transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
