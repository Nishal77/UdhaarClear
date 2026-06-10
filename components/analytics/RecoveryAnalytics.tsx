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
  const [timeRange, setTimeRange] = React.useState<string>('6_months')
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    let isMounted = true
    setLoading(true)
    fetch(`/api/analytics/recovery?timeRange=${timeRange}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((fetchedData) => {
        if (isMounted) {
          setData(fetchedData)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error(err)
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [timeRange])
  // Value formatting utility for currency (INR)
  const currencyFormatter = (value: number) => {
    return formatINRCompact(value)
  }

  const channelValueFormatter = (value: number) => {
    return formatINRCompact(value)
  }

  const metrics = data?.metrics ?? {
    totalRecovered: 0,
    recoveredDiffPercent: 0,
    recoveredDiffText: '0.0% vs last period',
    rate: 0,
    daysToCollect: 0,
    daysDiff: 0,
    daysDiffText: '0 days change',
    outstanding: 0,
  }

  const totalChannelsValue = (data?.channels ?? []).reduce((sum: number, item: any) => sum + item.value, 0)
  const trendData = data?.trend ?? []
  const channelsData = data?.channels ?? []
  const agingData = data?.aging ?? []

  // Dynamic Y-axis limit scaling
  const yAxisMax = React.useMemo(() => {
    if (!trendData || trendData.length === 0) return 300000 // default 3 Lakh

    // Find the maximum value in both series (desktop and mobile)
    const maxVal = trendData.reduce((accMax: number, point: any) => {
      const desktopVal = Number(point.desktop ?? 0)
      const mobileVal = Number(point.mobile ?? 0)
      return Math.max(accMax, desktopVal, mobileVal)
    }, 0)

    if (maxVal <= 0) return 300000 // default 3 Lakh

    // Add +50% buffer to keep the chart clean and spaced out
    const target = maxVal * 1.5

    // Round up step size to a clean interval to produce exactly 4 clean ticks
    // (step = yAxisMax / 3, since ticks are: 0, step, 2*step, 3*step)
    let step = 0
    if (target >= 10000000) { // Crore range (>= 1 Cr)
      const rawStep = target / 3
      step = Math.ceil(rawStep / 1000000) * 1000000 // round to nearest 10 Lakh (0.1 Cr)
    } else if (target >= 100000) { // Lakh range (>= 1 L)
      const rawStep = target / 3
      if (rawStep > 200000) {
        step = Math.ceil(rawStep / 100000) * 100000 // round to nearest 1L
      } else if (rawStep > 100000) {
        step = Math.ceil(rawStep / 50000) * 50000 // round to nearest 50k
      } else {
        step = Math.ceil(rawStep / 10000) * 10000 // round to nearest 10k
      }
    } else if (target >= 1000) { // Thousand range (>= 1k)
      const rawStep = target / 3
      step = Math.ceil(rawStep / 1000) * 1000 // round to nearest 1k
    } else {
      const rawStep = target / 3
      step = Math.ceil(rawStep / 10) * 10 // round to nearest 10
    }

    return step * 3
  }, [trendData])

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
            onChange={(e) => setTimeRange(e.target.value)}
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
            {loading ? (
              <div className="mt-3.5 space-y-2 animate-pulse">
                <div className="h-7 w-24 bg-gray-200 rounded-lg" />
                <div className="h-4 w-32 bg-gray-100 rounded-md" />
              </div>
            ) : (
              <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[26px] font-bold text-gray-900 leading-none whitespace-nowrap">
                  {currencyFormatter(metrics.totalRecovered)}
                </span>
                <span className={`text-[11.5px] font-semibold whitespace-nowrap ${
                  metrics.recoveredDiffPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {metrics.recoveredDiffPercent >= 0 ? '▲' : '▼'} {metrics.recoveredDiffText}
                </span>
              </div>
            )}
          </div>

          {/* Stat 2: Recovery Success */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Recovery Success</span>
            {loading ? (
              <div className="mt-3.5 space-y-2 animate-pulse">
                <div className="h-7 w-24 bg-gray-200 rounded-lg" />
                <div className="h-4 w-32 bg-gray-100 rounded-md" />
              </div>
            ) : (
              <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[26px] font-bold text-gray-900 leading-none whitespace-nowrap">
                  {metrics.rate}%
                </span>
                <span className="text-[11.5px] text-gray-500 font-medium whitespace-nowrap">
                  Target: 80%
                </span>
              </div>
            )}
          </div>

          {/* Stat 3: Average Days to Collect */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Avg Days to Collect</span>
            {loading ? (
              <div className="mt-3.5 space-y-2 animate-pulse">
                <div className="h-7 w-24 bg-gray-200 rounded-lg" />
                <div className="h-4 w-32 bg-gray-100 rounded-md" />
              </div>
            ) : (
              <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[26px] font-bold text-gray-900 leading-none whitespace-nowrap">
                  {metrics.daysToCollect} Days
                </span>
                <span className={`text-[11.5px] font-semibold whitespace-nowrap ${
                  metrics.daysDiff === 0 ? 'text-gray-500' : metrics.daysDiff < 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {metrics.daysDiff === 0 ? '' : metrics.daysDiff < 0 ? '▼ ' : '▲ '}{metrics.daysDiffText}
                </span>
              </div>
            )}
          </div>

          {/* Stat 4: Outstanding Receivables */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <span className="text-[14px] font-medium text-black tracking-tight">Outstanding Queue</span>
            {loading ? (
              <div className="mt-3.5 space-y-2 animate-pulse">
                <div className="h-7 w-24 bg-gray-200 rounded-lg" />
                <div className="h-4 w-32 bg-gray-100 rounded-md" />
              </div>
            ) : (
              <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[26px] font-bold text-gray-900 leading-none whitespace-nowrap">
                  {currencyFormatter(metrics.outstanding)}
                </span>
                <span className="text-[11.5px] text-gray-500 font-semibold whitespace-nowrap">
                  Awaiting Reminders
                </span>
              </div>
            )}
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
              <RechartsAreaChart data={trendData} margin={{ left: 10, right: 10 }}>
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
                  domain={[0, yAxisMax]}
                  tickCount={4}
                  tickFormatter={formatINRCompact}
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
              {loading ? (
                <div className="h-32 w-32 rounded-full border-8 border-gray-100 border-t-gray-300 animate-spin" />
              ) : (
                <DonutChart
                  data={channelsData}
                  category="name"
                  value="value"
                  colors={['emerald', 'blue', 'orange', 'violet']}
                  valueFormatter={channelValueFormatter}
                  showLabel={true}
                  label="Channels"
                />
              )}
            </div>
            
            <div className="space-y-2 flex-1 w-full max-w-[200px]">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-3.5 w-24 bg-gray-200 rounded" />
                      <div className="h-3.5 w-10 bg-gray-150 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                channelsData.map((chan: any, idx: number) => {
                  const percentage = totalChannelsValue > 0 ? ((chan.value / totalChannelsValue) * 100).toFixed(0) : '0'
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
                          ({channelValueFormatter(chan.value)})
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
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
            {loading ? (
              <div className="space-y-4 w-full animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-3 w-12 bg-gray-150 rounded" />
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <BarList
                data={agingData}
                valueFormatter={currencyFormatter}
              />
            )}
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
