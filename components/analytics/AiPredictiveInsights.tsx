'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatINRCompact } from '@/lib/utils/currency'
import { AreaChart } from '@/components/ui/chart/AreaChart'
import { CategoryBar } from '@/components/ui/CategoryBar'
import { BarList } from '@/components/ui/BarList'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  AiBrain01Icon,
  Coins01Icon,
  HourglassIcon,
  InvoiceIcon,
  Chart01Icon
} from '@hugeicons/core-free-icons'

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

// Projected collections runway data (Week 1 to Week 4)
const PROJECTED_RUNWAY = [
  { date: 'Week 1', 'AI Baseline Expected': 420000, 'Worst Case Recovery': 280000, 'Total Outstanding AR': 640000 },
  { date: 'Week 2', 'AI Baseline Expected': 780000, 'Worst Case Recovery': 450000, 'Total Outstanding AR': 1200000 },
  { date: 'Week 3', 'AI Baseline Expected': 1150000, 'Worst Case Recovery': 680000, 'Total Outstanding AR': 1850000 },
  { date: 'Week 4', 'AI Baseline Expected': 1450000, 'Worst Case Recovery': 890000, 'Total Outstanding AR': 2300000 }
]

export function AiPredictiveInsights() {
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL')
  
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

  const handleApplyOptimization = (cName: string, actionName: string) => {
    toast.success(`Applied AI recommendation: "${actionName}" for ${cName}`)
  }

  return (
    <div className="space-y-4">

      {/* ── ML Metrics Panel ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        
        {/* Metric 1: Expected Collections */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Projected 30d Recoveries</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <HugeiconsIcon icon={Coins01Icon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block">
              {formatINRCompact(1450000)}
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ● AI Projected Baseline
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Average Payment Probability */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Average Probability</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <HugeiconsIcon icon={Chart01Icon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[25px] font-black text-gray-900 leading-none">
                68.4%
              </span>
              <span className="text-[10px] text-gray-400 font-bold">
                Confidence: High
              </span>
            </div>
            <div className="w-full">
              <CategoryBar
                values={[30, 40, 30]}
                colors={["red", "amber", "emerald"]}
                marker={{ value: 68.4 }}
                showLabels={false}
                className="h-1.5"
              />
            </div>
          </div>
        </div>

        {/* Metric 3: Default Risk */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Projected Bad Debt</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-650">
              <HugeiconsIcon icon={HourglassIcon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-red-600 leading-none block">
              3.8%
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                Target limit: &lt;5.0%
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: suggested actions */}
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between min-h-[140px] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">ML Optimizations</span>
            <span className="p-1.5 rounded-lg bg-violet-50 text-violet-600">
              <HugeiconsIcon icon={InvoiceIcon} size={15} />
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-[25px] font-black text-gray-900 leading-none block font-mono">
              5 Actions
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                Estimated impact: +₹1.80 L
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Cash Projections Runway Area Chart ── */}
      <div className="rounded-xl bg-white border border-[#EBEAE6] shadow-xs p-5 select-none text-left space-y-4">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
            Runway Cash Forecast
          </span>
          <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight mt-0.5">
            Expected 30-Day Collections Runway
          </h3>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Machine learning projection comparing expected recoveries (Baseline) against absolute worst-case default rates and total outstanding accounts receivable.
          </p>
        </div>

        <div className="pt-2 h-72">
          <AreaChart
            data={PROJECTED_RUNWAY}
            index="date"
            categories={['AI Baseline Expected', 'Worst Case Recovery', 'Total Outstanding AR']}
            colors={['emerald', 'orange', 'violet']}
            valueFormatter={(val) => `₹${(val / 1000).toFixed(0)}K`}
            yAxisWidth={64}
          />
        </div>
      </div>

      {/* ── Debtor Probability Ledger Table ── */}
      <div className="rounded-xl bg-white border border-[#EBEAE6] shadow-xs overflow-hidden select-none">
        
        {/* Table Header Toolbar */}
        <div className="border-b border-[#EBEAE6] px-5 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 select-none bg-white text-left">
          <div className="relative flex-1 max-w-[300px] w-full">
            <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search debtors..."
              className="w-full h-9 bg-gray-50 rounded-lg pl-9 pr-8 text-[12px] text-gray-800 border border-[#EBEAE6] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FF6A39]/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-gray-100/70 p-1 rounded-lg">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
              <button
                key={risk}
                onClick={() => setRiskFilter(risk as any)}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all ${
                  riskFilter === risk
                    ? 'bg-white text-gray-900 shadow-3xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#EBEAE6] select-none bg-gray-50/50 text-left">
                <th className="px-5 py-3.5 text-[12px] font-bold text-gray-500">Debtor Account</th>
                <th className="px-4 py-3.5 text-[12px] font-bold text-gray-500">outstanding Balance</th>
                <th className="px-4 py-3.5 text-[12px] font-bold text-gray-500 w-[200px]">AI Payment Probability</th>
                <th className="px-4 py-3.5 text-[12px] font-bold text-gray-500">predicted pay date</th>
                <th className="px-4 py-3.5 text-[12px] font-bold text-gray-500">AI Suggested Action</th>
                <th className="px-5 py-3.5 text-right text-[12px] font-bold text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEAE6]/60 text-left">
              {filteredDebtors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[13px] text-gray-400 font-medium select-none">
                    No debtors match the filters.
                  </td>
                </tr>
              ) : (
                filteredDebtors.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/40 transition-colors">
                    
                    {/* Customer Info */}
                    <td className="px-5 py-4">
                      <div>
                        <span className="text-[13px] font-bold text-gray-900 block leading-tight">
                          {row.customerName}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.2 mt-1 text-[8.5px] font-bold ${
                          row.riskLevel === 'CRITICAL'
                            ? 'bg-red-50 text-red-700'
                            : row.riskLevel === 'HIGH'
                              ? 'bg-orange-50 text-orange-700'
                              : row.riskLevel === 'MEDIUM'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          ● {row.riskLevel} RISK
                        </span>
                      </div>
                    </td>

                    {/* Balance */}
                    <td className="px-4 py-4 whitespace-nowrap font-bold text-gray-900 text-[13px]">
                      {formatINRCompact(row.balance)}
                    </td>

                    {/* Probability indicator */}
                    <td className="px-4 py-4 w-[200px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className={
                            row.probability > 80
                              ? 'text-emerald-600'
                              : row.probability > 50
                                ? 'text-amber-600'
                                : 'text-red-650'
                          }>
                            {row.probability}% Probability
                          </span>
                        </div>
                        <CategoryBar
                          values={[35, 35, 30]}
                          colors={["red", "amber", "emerald"]}
                          marker={{ value: row.probability }}
                          showLabels={false}
                          className="h-1"
                        />
                      </div>
                    </td>

                    {/* Predicted pay date */}
                    <td className="px-4 py-4 text-[12.5px] font-bold text-gray-700">
                      {row.predictedDate}
                    </td>

                    {/* Recommended action info */}
                    <td className="px-4 py-4 text-[12px] font-semibold text-gray-500 max-w-[200px]">
                      {row.recommendedAction}
                    </td>

                    {/* Click buttons */}
                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProfile(row)
                          setDrawerOpen(true)
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                      >
                        Inspect behavior
                      </button>
                      <button
                        onClick={() => handleApplyOptimization(row.customerName, row.recommendedAction)}
                        className="bg-gray-950 hover:bg-gray-850 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
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
          
          {/* Card 1: Shift to Friday */}
          <div className="bg-white border-l-4 border-emerald-500 border-y border-r border-[#EBEAE6]/65 p-4 rounded-r-xl flex gap-3.5 hover:shadow-xs transition-shadow">
            <div className="h-8.5 w-8.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 text-sm">
              🤖
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-900 block leading-tight">
                Collection Optimization Available
              </span>
              <p className="text-[11.5px] text-gray-500 font-medium leading-relaxed">
                Applying Friday afternoon scheduling on **Reddy Enterprises** is projected to recover ₹2,00,000 approximately 8 days earlier. Click the "Optimize" button to apply this scheduling rule.
              </p>
            </div>
          </div>

          {/* Card 2: Legal escalations */}
          <div className="bg-white border-l-4 border-[#FF6A39] border-y border-r border-[#EBEAE6]/65 p-4 rounded-r-xl flex gap-3.5 hover:shadow-xs transition-shadow">
            <div className="h-8.5 w-8.5 rounded-full bg-orange-50 text-[#FF6A39] flex items-center justify-center flex-shrink-0 text-sm">
              ⚖️
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-900 block leading-tight">
                MSME Filing Escalation recommended
              </span>
              <p className="text-[11.5px] text-gray-500 font-medium leading-relaxed">
                **MegaVision Electronics** payment probability has dropped below 42%. ML models indicate electronic reminders have hit a ceiling. Proceeding to MSME Samadhaan will trigger recovery proceedings.
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

      {/* ── CUSTOMER BEHAVIORAL DETAILS DRAWER ── */}
      {drawerOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setDrawerOpen(false)} />

          <div className="relative z-10 w-full max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col h-full border-l border-[#EBEAE6]">
            
            {/* Header */}
            <div className="p-5 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold text-[#FF6A39] uppercase tracking-widest">
                  AI Behavioral Audit
                </span>
                <h3 className="text-[16px] font-bold text-gray-900 mt-0.5 leading-tight">
                  {selectedProfile.customerName}
                </h3>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5 text-left">
              
              {/* Box 1: Core behavioral metrics */}
              <div className="bg-white border border-[#EBEAE6] p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Average Overdue Delay:</span>
                  <span className="font-extrabold text-gray-900">{selectedProfile.behavior.avgDelayDays} Days Past Due</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Payment Probability:</span>
                  <span className={`font-bold ${
                    selectedProfile.probability > 80
                      ? 'text-emerald-600'
                      : selectedProfile.probability > 50
                        ? 'text-amber-600'
                        : 'text-red-650'
                  }`}>{selectedProfile.probability}%</span>
                </div>
              </div>

              {/* Box 2: Channel conversion rates (BarList) */}
              <div className="space-y-2.5">
                <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wider block">
                  Channel Response Rates
                </span>
                <div className="bg-white border border-[#EBEAE6] p-4 rounded-xl">
                  <BarList
                    data={selectedProfile.behavior.responseRates}
                    valueFormatter={(val) => `${val}% conversion`}
                  />
                </div>
              </div>

              {/* Box 3: ML Summary explanation */}
              <div className="space-y-2.5">
                <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wider block">
                  ML Behavioral Summary
                </span>
                <div className="bg-white border border-[#EBEAE6] p-4 rounded-xl text-xs text-gray-600 leading-relaxed font-semibold">
                  📖 {selectedProfile.behavior.mlSummary}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 bg-white border-t border-gray-100 flex gap-2.5">
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
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
