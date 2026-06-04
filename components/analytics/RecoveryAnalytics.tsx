'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatINRCompact } from '@/lib/utils/currency'
import { AreaChart } from '@/components/ui/chart/AreaChart'
import { DonutChart } from '@/components/ui/DonutChart'
import { BarList } from '@/components/ui/BarList'
import { CategoryBar } from '@/components/ui/CategoryBar'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  AiBrain01Icon,
  Coins01Icon,
  Chart01Icon,
  HourglassIcon,
  InvoiceIcon
} from '@hugeicons/core-free-icons'

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

export function RecoveryAnalytics() {
  const [timeRange, setTimeRange] = useState<keyof typeof TIME_RANGE_DATA>('6_months')
  const currentData = TIME_RANGE_DATA[timeRange]

  // Value formatting utility for currency (INR)
  const currencyFormatter = (value: number) => {
    return `₹${(value / 100000).toFixed(2)} L`
  }

  // Calculate sum for channel percentages display
  const totalChannelsValue = currentData.channels.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">

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
          <span className="text-[12px] font-bold text-gray-500 pl-2">Timeframe:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-gray-50/70 border border-gray-100 hover:bg-gray-100/50 transition-colors rounded-lg px-2.5 py-1 text-[12px] font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/20 cursor-pointer"
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
          <div className="px-6 py-5 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wider">Total Recovered</span>
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                <HugeiconsIcon icon={Coins01Icon} size={15} />
              </span>
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              <span className="text-[26px] font-black text-gray-900 leading-none whitespace-nowrap block">
                {currencyFormatter(currentData.metrics.totalRecovered)}
              </span>
              <div className="pt-0.5">
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold">
                  ▲ {currentData.metrics.recoveredDiff}
                </span>
              </div>
            </div>
          </div>

          {/* Stat 2: Recovery Success */}
          <div className="px-6 py-5 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wider">Recovery Success</span>
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <HugeiconsIcon icon={Chart01Icon} size={15} />
              </span>
            </div>
            <div className="mt-2 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-[26px] font-black text-gray-900 leading-none whitespace-nowrap">
                  {currentData.metrics.rate}%
                </span>
                <span className="text-[10px] text-gray-400 font-bold">
                  Target: 80%
                </span>
              </div>
              <div className="w-full">
                <CategoryBar
                  values={[60, 20, 20]}
                  colors={["red", "amber", "emerald"]}
                  marker={{ value: currentData.metrics.rate }}
                  showLabels={false}
                  className="h-1.5"
                />
              </div>
            </div>
          </div>

          {/* Stat 3: Average Days to Collect */}
          <div className="px-6 py-5 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wider">Avg Days to Collect</span>
              <span className="p-1.5 rounded-lg bg-orange-50 text-[#FF6A39] shrink-0">
                <HugeiconsIcon icon={HourglassIcon} size={15} />
              </span>
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              <span className="text-[26px] font-black text-gray-900 leading-none whitespace-nowrap block">
                {currentData.metrics.daysToCollect} Days
              </span>
              <div className="pt-0.5">
                <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  ▼ {currentData.metrics.daysDiff}
                </span>
              </div>
            </div>
          </div>

          {/* Stat 4: Outstanding Receivables */}
          <div className="px-6 py-5 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wider">Outstanding Queue</span>
              <span className="p-1.5 rounded-lg bg-violet-50 text-violet-600 shrink-0">
                <HugeiconsIcon icon={InvoiceIcon} size={15} />
              </span>
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              <span className="text-[26px] font-black text-gray-900 leading-none whitespace-nowrap block font-mono">
                {currencyFormatter(currentData.metrics.outstanding)}
              </span>
              <div className="pt-0.5">
                <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-750 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  ⏱️ Awaiting Reminders
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Trend Analysis Charts (Double Graph Layout) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Chart 1: Cash Flow Trend (Takes 2 Columns) */}
        <div className="lg:col-span-2 rounded-xl bg-white border border-[#EBEAE6] shadow-xs p-5 select-none text-left space-y-4">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
              Cash Flow Trend
            </span>
            <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight mt-0.5">
              Recovered Cash vs logged invoice Value
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Visual comparison showing new logged credit values vs collections. High intersection represents strong cash flows.
            </p>
          </div>

          <div className="pt-2 h-72">
            <AreaChart
              data={currentData.trend}
              index="date"
              categories={['Recovered Amount', 'New Invoices Logged']}
              colors={['emerald', 'orange']}
              valueFormatter={(val) => `₹${(val / 1000).toFixed(0)}K`}
              yAxisWidth={64} // Expanded width to prevent text clipping
            />
          </div>
        </div>

        {/* Chart 2: Recovery Success Scorecard (Takes 1 Column) */}
        <div className="rounded-xl bg-white border border-[#EBEAE6] shadow-xs p-5 select-none text-left space-y-4 flex flex-col justify-between min-h-[380px]">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
              Efficiency Score
            </span>
            <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight mt-0.5">
              Collection Success Rate
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Real-time recovery success rate performance against target.
            </p>
          </div>

          {/* SVG Progress Ring */}
          <div className="relative flex items-center justify-center flex-1 my-2">
            <svg
              height={160}
              width={160}
              className="transform -rotate-90"
            >
              {/* Background circle */}
              <circle
                stroke="#F1F1F0"
                fill="transparent"
                strokeWidth={14}
                r={62}
                cx={80}
                cy={80}
              />
              {/* Animated foreground circle */}
              <circle
                stroke="url(#progressGradient)"
                fill="transparent"
                strokeWidth={14}
                strokeDasharray={389.56} // 2 * PI * 62 = ~389.56
                strokeDashoffset={389.56 - (currentData.metrics.rate / 100) * 389.56}
                strokeLinecap="round"
                r={62}
                cx={80}
                cy={80}
                className="transition-all duration-500 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[34px] font-black text-gray-900 tracking-tight leading-none">
                {currentData.metrics.rate.toFixed(1)}%
              </span>
              <span className="text-[11.5px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-2 border border-emerald-100/50">
                {Math.round(currentData.metrics.rate)} / 100
              </span>
            </div>
          </div>

          {/* Summary stats row */}
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs font-semibold">
            <div className="text-left">
              <span className="text-gray-400 block font-medium">Efficiency Rating</span>
              <span className="text-gray-900 block font-bold mt-0.5">
                {currentData.metrics.rate >= 85 ? 'Excellent compliance' : 'Standard compliance'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 block font-medium">Target Variance</span>
              <span className="text-emerald-600 block font-bold mt-0.5">
                +{(currentData.metrics.rate - 80).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Double-Column Breakdowns ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Column: Recovery Channels Donut Chart */}
        <div className="rounded-xl bg-white border border-[#EBEAE6] p-5 shadow-xs flex flex-col justify-between text-left select-none space-y-4">
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
        <div className="rounded-xl bg-white border border-[#EBEAE6] p-5 shadow-xs flex flex-col justify-between text-left select-none space-y-4">
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
      <div className="bg-[#FAF9F6] border border-[#EBEAE6] rounded-[22px] p-5 text-left select-none shadow-3xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-orange-100 text-[#FF6A39]">
            <HugeiconsIcon icon={AiBrain01Icon} size={16} />
          </span>
          <h3 className="text-[14.5px] font-extrabold text-gray-900 uppercase tracking-wider">
            AI Collection recommendations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: WhatsApp Efficiency */}
          <div className="bg-white border-l-4 border-emerald-500 border-y border-r border-[#EBEAE6]/65 p-4 rounded-r-xl flex gap-3.5 hover:shadow-xs transition-shadow">
            <div className="h-8.5 w-8.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 text-sm">
              💬
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-900 block leading-tight">
                WhatsApp is yielding 2.2x higher recovery
              </span>
              <p className="text-[11.5px] text-gray-500 font-medium leading-relaxed">
                For invoices aged 15-30 days, WhatsApp automation produces 64% faster payment settlements than Email. Consider upgrading early-stage escalations to Assertive WhatsApp.
              </p>
              <Link 
                href="/tone-engine" 
                className="text-[10px] text-blue-600 font-bold hover:underline inline-block pt-1 font-semibold"
              >
                Configure Tone Escalations →
              </Link>
            </div>
          </div>

          {/* Card 2: MSME Filing Opportunity */}
          <div className="bg-white border-l-4 border-[#FF6A39] border-y border-r border-[#EBEAE6]/65 p-4 rounded-r-xl flex gap-3.5 hover:shadow-xs transition-shadow">
            <div className="h-8.5 w-8.5 rounded-full bg-orange-50 text-[#FF6A39] flex items-center justify-center flex-shrink-0 text-sm">
              ⚖️
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-900 block leading-tight">
                Accrue 3x RBI Interest on 2 Invoices
              </span>
              <p className="text-[11.5px] text-gray-500 font-medium leading-relaxed">
                You have 2 outstanding customer invoices exceeding the 45-day overdue mark. Under MSMED rules, you can file a petition to claim compounding interest at 3x the RBI Repo Rate.
              </p>
              <Link 
                href="/msme-samadhaan" 
                className="text-[10px] text-[#FF6A39] font-bold hover:underline inline-block pt-1 font-semibold"
              >
                Open MSME Samadhaan Drawer →
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
