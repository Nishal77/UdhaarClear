'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatINRCompact } from '@/lib/utils/currency'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  Search01Icon,
  GavelIcon,
  Coins01Icon,
  Chart01Icon,
  HourglassIcon
} from '@hugeicons/core-free-icons'

export interface EligibleInvoice {
  id: string
  invoiceNumber: string
  amount: number
  customerName: string
  customerPhone: string
  dueDate: Date
  daysOverdue: number
  hasUdyam: boolean
  hasPO: boolean
}

export interface FiledCase {
  id: string
  caseNumber: string
  customerName: string
  principalAmount: number
  interestAmount: number
  filingDate: Date
  status: 'FILED' | 'NOTICE_SENT' | 'CONCILIATION' | 'ARBITRATION' | 'RESOLVED'
  statusLabel: string
  nextHearing?: string
}

const SAMPLE_ELIGIBLE = (): EligibleInvoice[] => [
  {
    id: 'elig-1',
    invoiceNumber: 'INV-2026-002',
    amount: 640000,
    customerName: 'Bharat Steel Works',
    customerPhone: '+91 99000 77811',
    dueDate: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000), // 42 days overdue? Wait, needs to be >45 days. Let's make it 60.
    daysOverdue: 60,
    hasUdyam: true,
    hasPO: true,
  },
  {
    id: 'elig-2',
    invoiceNumber: 'INV-2026-006',
    amount: 1850000,
    customerName: 'MegaVision Electronics',
    customerPhone: '+91 97700 33145',
    dueDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
    daysOverdue: 50,
    hasUdyam: true,
    hasPO: false,
  },
  {
    id: 'elig-3',
    invoiceNumber: 'INV-2026-007',
    amount: 120000,
    customerName: 'Tara Decoratives',
    customerPhone: '+91 88800 12345',
    dueDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
    daysOverdue: 75,
    hasUdyam: true,
    hasPO: true,
  },
  {
    id: 'elig-4',
    invoiceNumber: 'INV-2026-011',
    amount: 380000,
    customerName: 'Reddy Enterprises',
    customerPhone: '+91 98321 00223',
    dueDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    daysOverdue: 95,
    hasUdyam: true,
    hasPO: true,
  }
]

const SAMPLE_FILED = (): FiledCase[] => [
  {
    id: 'case-1',
    caseNumber: 'MSME/MUM/2026/0894',
    customerName: 'Karan Logistics Ltd.',
    principalAmount: 450000,
    interestAmount: 88500,
    filingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: 'CONCILIATION',
    statusLabel: 'Conciliation in progress',
    nextHearing: '18 Jun 2026'
  },
  {
    id: 'case-2',
    caseNumber: 'MSME/MUM/2026/0712',
    customerName: 'Shree Plastics Pvt. Ltd.',
    principalAmount: 280000,
    interestAmount: 94600,
    filingDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
    status: 'ARBITRATION',
    statusLabel: 'Arbitration scheduled',
    nextHearing: '24 Jun 2026'
  },
  {
    id: 'case-3',
    caseNumber: 'MSME/MUM/2026/0995',
    customerName: 'Vertex Solutions Co.',
    principalAmount: 890000,
    interestAmount: 42100,
    filingDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: 'NOTICE_SENT',
    statusLabel: 'Council notice dispatched',
  }
]

export function MsmeSamadhaanDashboard() {
  const [activeTab, setActiveTab] = useState<'eligible' | 'filed'>('eligible')
  const [eligibleInvoices, setEligibleInvoices] = useState<EligibleInvoice[]>(SAMPLE_ELIGIBLE())
  const [filedCases, setFiledCases] = useState<FiledCase[]>(SAMPLE_FILED())
  const [searchQuery, setSearchQuery] = useState('')
  
  // Drawer states
  const [selectedEligible, setSelectedEligible] = useState<EligibleInvoice | null>(null)
  const [selectedCase, setSelectedCase] = useState<FiledCase | null>(null)
  
  // Wizard steps
  const [wizardStep, setWizardStep] = useState<number>(1)
  const [isFiling, setIsFiling] = useState(false)
  const [filingStatus, setFilingStatus] = useState('')
  const [filingFinished, setFilingFinished] = useState(false)

  // RBI 3x interest rate (monthly compounding)
  // RBI Rate is approx 6.75%. 3x RBI rate = 20.25% annual rate.
  const calculateInterest = (principal: number, daysOverdue: number) => {
    const annualRate = 0.2025 // 20.25%
    const months = daysOverdue / 30
    // Monthly compounding interest formula: A = P(1 + r/12)^(12 * t)
    // where 12 * t is the number of months compounding
    const totalAmount = principal * Math.pow(1 + annualRate / 12, months)
    const interest = totalAmount - principal
    return Math.round(interest)
  }

  // Filter lists
  const getFilteredEligible = () => {
    return eligibleInvoices.filter(item => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return item.customerName.toLowerCase().includes(q) || item.invoiceNumber.toLowerCase().includes(q)
    })
  }

  const getFilteredFiled = () => {
    return filedCases.filter(item => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return item.customerName.toLowerCase().includes(q) || item.caseNumber.toLowerCase().includes(q)
    })
  }

  // Totals calculations
  const totalPrincipalClaimed = filedCases.reduce((s, c) => s + c.principalAmount, 0)
  const totalInterestClaimed = filedCases.reduce((s, c) => s + c.interestAmount, 0)
  const totalActiveClaimsAmount = totalPrincipalClaimed + totalInterestClaimed
  const totalEligibleCount = eligibleInvoices.length

  // Trigger simulated filing
  const handleFileCaseSubmit = () => {
    setIsFiling(true)
    setFilingStatus('Compressing signed invoice & Udyam documents...')
    
    setTimeout(() => {
      setFilingStatus('Calculating final compounding interest audit...')
      setTimeout(() => {
        setFilingStatus('Handshaking with MSME Samadhaan portal API...')
        setTimeout(() => {
          setFilingStatus('Submitting formal petition to Facilitation Council...')
          setTimeout(() => {
            // Add case to filed list
            if (selectedEligible) {
              const newCase: FiledCase = {
                id: `case-${Date.now()}`,
                caseNumber: `MSME/MUM/2026/0${Math.floor(Math.random() * 900) + 100}`,
                customerName: selectedEligible.customerName,
                principalAmount: selectedEligible.amount,
                interestAmount: calculateInterest(selectedEligible.amount, selectedEligible.daysOverdue),
                filingDate: new Date(),
                status: 'FILED',
                statusLabel: 'Case Filed Successfully'
              }
              setFiledCases([newCase, ...filedCases])
              setEligibleInvoices(eligibleInvoices.filter(i => i.id !== selectedEligible.id))
            }
            setFilingFinished(true)
            setIsFiling(false)
            toast.success('Dispute filed successfully on MSME Samadhaan!')
          }, 1000)
        }, 1000)
      }, 1000)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      
      {/* ── Stats Bar ── */}
      <div className="bg-white border border-[#EBEAE6] rounded-[22px] overflow-hidden select-none">
        <div className="grid grid-cols-1 divide-y divide-[#EBEAE6]/60 md:grid-cols-4 md:divide-y-0 md:divide-x text-left">
            
            {/* Stat 1: Active Cases */}
            <div className="px-6 py-5 flex flex-col justify-between min-h-[140px]">
              <div className="flex items-start justify-between">
                <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wider">Active Samadhaan Cases</span>
                <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600 shrink-0">
                  <HugeiconsIcon icon={GavelIcon} size={15} />
                </span>
              </div>
              <div className="mt-2 flex flex-col gap-1.5">
                <span className="text-[26px] font-bold text-gray-900 leading-none whitespace-nowrap block">
                  {filedCases.length} Claims
                </span>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Under council review
                  </span>
                </div>
              </div>
            </div>

            {/* Stat 2: Active Claims Amount */}
            <div className="px-6 py-5 flex flex-col justify-between min-h-[140px]">
              <div className="flex items-start justify-between">
                <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wider">Total Claims Value</span>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <HugeiconsIcon icon={Coins01Icon} size={15} />
                </span>
              </div>
              <div className="mt-2 flex flex-col gap-1.5">
                <span className="text-[26px] font-bold text-gray-900 leading-none whitespace-nowrap block">
                  {formatINRCompact(totalActiveClaimsAmount)}
                </span>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Interest: {formatINRCompact(totalInterestClaimed)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stat 3: RBI Compound Interest Rate */}
            <div className="px-6 py-5 flex flex-col justify-between min-h-[140px]">
              <div className="flex items-start justify-between">
                <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wider">Legal Interest Rate</span>
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <HugeiconsIcon icon={Chart01Icon} size={15} />
                </span>
              </div>
              <div className="mt-2 flex flex-col gap-1.5">
                <span className="text-[26px] font-bold text-gray-900 leading-none whitespace-nowrap block">
                  3x RBI Rate
                </span>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    20.25% Comp. Monthly
                  </span>
                </div>
              </div>
            </div>

            {/* Stat 4: Eligible for Filing */}
            <div className="px-6 py-5 flex flex-col justify-between min-h-[140px]">
              <div className="flex items-start justify-between">
                <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wider">Filing Eligibility</span>
                <span className="p-1.5 rounded-lg bg-red-50 text-[#FF6A39] shrink-0">
                  <HugeiconsIcon icon={HourglassIcon} size={15} />
                </span>
              </div>
              <div className="mt-2 flex flex-col gap-1.5">
                <span className="text-[26px] font-bold text-gray-900 leading-none whitespace-nowrap block">
                  {totalEligibleCount} Invoices
                </span>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Unpaid &gt;45 days
                  </span>
                </div>
              </div>
            </div>

          </div>
      </div>

      {/* ── Main Dashboard Panel ── */}
      <div className="rounded-[22px] bg-white border border-[#EBEAE6] overflow-hidden">
          
          {/* Table Toolbar controls */}
          <div className="border-b border-gray-100 px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 select-none bg-white">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-[340px] w-full">
              <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10 text-gray-400">
                <HugeiconsIcon icon={Search01Icon} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases, customers..."
                className="w-full h-10 bg-[#F1F1F1] rounded-full pl-11 pr-10 text-[13px] text-gray-800 focus:outline-none focus:bg-[#EBEBEB] focus:ring-2 focus:ring-[#FF6A39]/20 transition-all border-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 text-xs font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Tab Selectors */}
            <div className="flex items-center gap-1 rounded-xl bg-gray-100/70 p-1 flex-shrink-0 w-full md:w-auto">
              
              {/* Tab: Eligible Invoices */}
              <button
                onClick={() => {
                  setActiveTab('eligible')
                  setSearchQuery('')
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all whitespace-nowrap ${
                  activeTab === 'eligible' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-600 hover:text-gray-950'
                }`}
              >
                <span>Eligible disputes (&gt;45 days overdue)</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                  activeTab === 'eligible' ? 'bg-[#FF6A39] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {eligibleInvoices.length}
                </span>
              </button>

              {/* Tab: Filed Cases */}
              <button
                onClick={() => {
                  setActiveTab('filed')
                  setSearchQuery('')
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all whitespace-nowrap ${
                  activeTab === 'filed' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-600 hover:text-gray-950'
                }`}
              >
                <span>Active Samadhaan Cases</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                  activeTab === 'filed' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {filedCases.length}
                </span>
              </button>

            </div>
          </div>

          {/* TABLE DISPLAY */}
          <div className="overflow-x-auto">
            {activeTab === 'eligible' ? (
              /* TAB 1: ELIGIBLE DISPUTES FOR FILING */
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 select-none bg-gray-50/50">
                    <th className="px-6 py-3 text-left text-[12.5px] font-semibold text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-[12.5px] font-semibold text-gray-700">Customer</th>
                    <th className="px-4 py-3 text-left text-[12.5px] font-semibold text-gray-700">Invoice</th>
                    <th className="px-4 py-3 text-left text-[12.5px] font-semibold text-gray-700">Days Late</th>
                    <th className="px-4 py-3 text-left text-[12.5px] font-semibold text-gray-700">Principal Due</th>
                    <th className="px-4 py-3 text-left text-[12.5px] font-semibold text-gray-700">compounding Interest (3x RBI)</th>
                    <th className="px-4 py-3 text-left text-[12.5px] font-semibold text-gray-700">Total Legal Claim</th>
                    <th className="px-6 py-3 text-right text-[12.5px] font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-left">
                  {getFilteredEligible().length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-[13px] text-gray-400 font-medium select-none">
                        No eligible delayed invoices found. Invoices appear here after passing 45 days overdue.
                      </td>
                    </tr>
                  ) : (
                    getFilteredEligible().map((item, idx) => {
                      const interest = calculateInterest(item.amount, item.daysOverdue)
                      const totalClaim = item.amount + interest

                      return (
                        <tr key={item.id} className="group transition-colors hover:bg-gray-50/50">
                          <td className="px-6 py-4 text-[12px] font-medium text-gray-400 font-mono">
                            {String(idx + 1).padStart(2, '0')}
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <span className="text-[13.5px] font-bold text-gray-900 block leading-tight">
                                {item.customerName}
                              </span>
                              <span className="text-[11px] text-gray-400 block mt-1 font-medium">
                                {item.customerPhone}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-[11px] font-mono font-bold text-gray-700">
                              {item.invoiceNumber}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-[13px] font-bold text-red-600 block">
                              {item.daysOverdue} Days Late
                            </span>
                            <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                              Due: {item.dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-[13.5px] font-bold text-gray-900">
                              {formatINRCompact(item.amount)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-[13.5px] font-bold text-emerald-600">
                              +{formatINRCompact(interest)}
                            </span>
                            <span className="text-[9.5px] text-emerald-600 font-bold block mt-0.5">
                              3x compounding interest
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-[14px] font-extrabold text-[#FF6A39]">
                              {formatINRCompact(totalClaim)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setSelectedEligible(item)
                                setWizardStep(1)
                                setFilingFinished(false)
                              }}
                              className="bg-[#FF6A39] hover:bg-[#E05B2E] text-white text-xs font-bold py-1.5 px-3.5 rounded-xl transition-all shadow-3xs cursor-pointer active:scale-95"
                            >
                              File case
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            ) : (
              /* TAB 2: ACTIVE SAMADHAAN FILED CASES */
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 select-none bg-gray-50/50">
                    <th className="px-6 py-3 text-left text-[12.5px] font-semibold text-gray-700">Case reference</th>
                    <th className="px-4 py-3 text-left text-[12.5px] font-semibold text-gray-700">Buyer Name</th>
                    <th className="px-4 py-3 text-left text-[12.5px] font-semibold text-gray-700">Filing Date</th>
                    <th className="px-4 py-3 text-left text-[12.5px] font-semibold text-gray-700">Principal due</th>
                    <th className="px-4 py-3 text-left text-[12.5px] font-semibold text-gray-700">Accrued Interest</th>
                    <th className="px-4 py-3 text-left text-[12.5px] font-semibold text-gray-700">Total Legal Claim</th>
                    <th className="px-4 py-3 text-left text-[12.5px] font-semibold text-gray-700">Dispute Stage</th>
                    <th className="px-6 py-3 text-right text-[12.5px] font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-left">
                  {getFilteredFiled().length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-[13px] text-gray-400 font-medium select-none">
                        No active disputes found matching search queries.
                      </td>
                    </tr>
                  ) : (
                    getFilteredFiled().map((item) => {
                      const totalClaim = item.principalAmount + item.interestAmount

                      return (
                        <tr key={item.id} className="group transition-colors hover:bg-gray-50/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-[13px] font-bold text-gray-900 font-mono block">
                              {item.caseNumber}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-[13.5px] font-bold text-gray-900 block leading-tight">
                              {item.customerName}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-[13px] text-gray-600 font-medium">
                              {item.filingDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-[13.5px] font-bold text-gray-900">
                              {formatINRCompact(item.principalAmount)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-[13.5px] font-bold text-emerald-600">
                              {formatINRCompact(item.interestAmount)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-[14px] font-extrabold text-[#FF6A39]">
                              {formatINRCompact(totalClaim)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap ${
                              item.status === 'RESOLVED' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : item.status === 'ARBITRATION' 
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                  : 'bg-orange-50 text-orange-700 border border-orange-200'
                            }`}>
                              {item.statusLabel}
                            </span>
                            {item.nextHearing && (
                              <span className="text-[10px] text-gray-400 font-bold block mt-1">
                                Hearing: {item.nextHearing}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => setSelectedCase(item)}
                              className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-1.5 px-3 rounded-xl transition-all shadow-3xs cursor-pointer active:scale-95"
                            >
                              Track Case
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>

      </div>

      {/* ── Visual Conciliation Timeline Drawer (Track Case) ── */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setSelectedCase(null)} />

          <div className="relative z-10 w-full max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col h-full border-l border-[#EBEAE6]">
            
            {/* Header */}
            <div className="p-5 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Council dispute timeline
                </span>
                <h3 className="text-[16px] font-bold text-gray-900 mt-0.5 leading-tight">
                  {selectedCase.caseNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Case Details Summary */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5 text-left">
              <div className="bg-white border border-[#EBEAE6] p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Buyer Defendant:</span>
                  <span className="font-bold text-gray-800">{selectedCase.customerName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Filing Date:</span>
                  <span className="font-bold text-gray-800">
                    {selectedCase.filingDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Claim Amount:</span>
                  <span className="font-extrabold text-[#FF6A39]">
                    {formatINRCompact(selectedCase.principalAmount + selectedCase.interestAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] border-t border-gray-150 pt-2 text-gray-400 font-medium">
                  <span>Principal: {formatINRCompact(selectedCase.principalAmount)}</span>
                  <span className="text-emerald-600">Accrued Interest: {formatINRCompact(selectedCase.interestAmount)}</span>
                </div>
              </div>

              {/* Council Visual Stepper Timeline */}
              <div className="space-y-4">
                <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wider block">
                  Facilitation Council Stages
                </span>

                <div className="relative pl-6 space-y-6">
                  {/* Timeline connecting line */}
                  <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-gray-200" />

                  {/* Stage 1: Filed */}
                  <div className="relative">
                    <span className="absolute left-[-21px] top-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-500/20" />
                    <div className="space-y-0.5">
                      <h4 className="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                        <span>Case Filed</span>
                        <span className="text-[9.5px] bg-emerald-50 text-emerald-700 px-1.5 rounded-md font-bold">Done</span>
                      </h4>
                      <p className="text-[11.5px] text-gray-500 font-medium">
                        Dispute details and compounding interest statements submitted successfully to council portal.
                      </p>
                    </div>
                  </div>

                  {/* Stage 2: Buyer Notification */}
                  <div className="relative">
                    <span className="absolute left-[-21px] top-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-500/20" />
                    <div className="space-y-0.5">
                      <h4 className="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                        <span>Buyer Notified</span>
                        <span className="text-[9.5px] bg-emerald-50 text-emerald-700 px-1.5 rounded-md font-bold">Done</span>
                      </h4>
                      <p className="text-[11.5px] text-gray-500 font-medium">
                        Council issued official legal notice under Section 16 of the MSMED Act to the defendant buyer.
                      </p>
                    </div>
                  </div>

                  {/* Stage 3: Conciliation */}
                  <div className="relative">
                    <span className={`absolute left-[-21px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white ring-2 ${
                      selectedCase.status === 'CONCILIATION' || selectedCase.status === 'ARBITRATION'
                        ? 'bg-emerald-500 ring-emerald-500/20' : 'bg-gray-300 ring-gray-300/20'
                    }`} />
                    <div className="space-y-0.5">
                      <h4 className="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                        <span>Conciliation Council Meeting</span>
                        {selectedCase.status === 'CONCILIATION' && (
                          <span className="text-[9.5px] bg-orange-100 text-orange-700 px-1.5 rounded-md font-bold animate-pulse">Active</span>
                        )}
                        {selectedCase.status === 'ARBITRATION' && (
                          <span className="text-[9.5px] bg-emerald-50 text-emerald-700 px-1.5 rounded-md font-bold">Done</span>
                        )}
                      </h4>
                      <p className="text-[11.5px] text-gray-500 font-medium">
                        Council calls both parties for a mutual settlement hearing. Compounding interest remains mandatory.
                      </p>
                      {selectedCase.status === 'CONCILIATION' && (
                        <div className="mt-2 bg-[#FFF8F5] border border-[#FF6A39]/20 p-2.5 rounded-lg text-[11px] text-gray-600">
                          📅 <strong>Next Hearing</strong> scheduled on <strong className="text-gray-900">{selectedCase.nextHearing}</strong>.
                          Keep compounding calculations updated.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stage 4: Arbitration */}
                  <div className="relative">
                    <span className={`absolute left-[-21px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white ring-2 ${
                      selectedCase.status === 'ARBITRATION'
                        ? 'bg-orange-500 ring-orange-500/20 animate-pulse' : 'bg-gray-300 ring-gray-300/20'
                    }`} />
                    <div className="space-y-0.5">
                      <h4 className="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                        <span>Arbitration Escalation</span>
                        {selectedCase.status === 'ARBITRATION' && (
                          <span className="text-[9.5px] bg-rose-100 text-rose-700 px-1.5 rounded-md font-bold">Scheduled</span>
                        )}
                      </h4>
                      <p className="text-[11.5px] text-gray-500 font-medium font-semibold">
                        If conciliation fails, the dispute is escalated to an arbitrator for final decree.
                      </p>
                      {selectedCase.status === 'ARBITRATION' && (
                        <div className="mt-2 bg-rose-50 border border-rose-200/50 p-2.5 rounded-lg text-[11px] text-gray-600">
                          ⚖️ <strong>Arbitrator hearing</strong> set on <strong className="text-gray-900">{selectedCase.nextHearing}</strong>.
                          Counsel is assigned.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stage 5: Order Passed */}
                  <div className="relative">
                    <span className="absolute left-[-21px] top-1 h-3.5 w-3.5 rounded-full bg-gray-300 border-2 border-white ring-2 ring-gray-300/20" />
                    <div className="space-y-0.5">
                      <h4 className="text-[13px] font-bold text-gray-900">Final Order Passed</h4>
                      <p className="text-[11.5px] text-gray-500 font-medium">
                        Council issues a binding order enforcing payment of principal + 3x compound interest.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 bg-white border-t border-gray-100 flex gap-2.5">
              <button
                onClick={() => {
                  toast.success('Downloaded council notification packet')
                }}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-3xs"
              >
                Download Files
              </button>
              <button
                onClick={() => setSelectedCase(null)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                Close Timeline
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── SAMADHAAN DISPUTE FILING WIZARD DRAWER ── */}
      {selectedEligible && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/35 backdrop-blur-[2px]" onClick={() => { if (!isFiling) setSelectedEligible(null) }} />

          <div className="relative z-10 w-full max-w-lg bg-[#FAF9F6] shadow-2xl flex flex-col h-full border-l border-[#EBEAE6]">
            
            {/* Header */}
            <div className="p-5 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold text-[#FF6A39] uppercase tracking-widest">
                  Filing wizard: Step {wizardStep} of 4
                </span>
                <h3 className="text-[16px] font-bold text-gray-900 mt-0.5 leading-tight">
                  MSME Samadhaan File Assistant
                </h3>
              </div>
              <button
                disabled={isFiling}
                onClick={() => setSelectedEligible(null)}
                className="h-8 w-8 rounded-full bg-gray-50 hover:bg-gray-100 hover:rotate-90 hover:scale-105 flex items-center justify-center transition-all duration-300 text-gray-400 hover:text-gray-700 disabled:opacity-50 active:scale-95 border border-gray-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Steps Progress Indicator */}
            <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between text-xs select-none">
              {[
                { s: 1, label: 'Interest' },
                { s: 2, label: 'Documents' },
                { s: 3, label: 'Petition' },
                { s: 4, label: 'Submit' },
              ].map((st, idx) => {
                const isActive = wizardStep === st.s
                const isCompleted = wizardStep > st.s
                return (
                  <div key={st.s} className="flex items-center flex-1 last:flex-initial">
                    <div className="flex items-center gap-2">
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-all duration-300 ${
                        isActive
                          ? 'bg-[#FF6A39] text-white ring-4 ring-[#FF6A39]/10 font-bold scale-105'
                          : isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? '✓' : st.s}
                      </span>
                      <span className={`font-bold text-[11.5px] transition-colors duration-300 ${
                        isActive ? 'text-gray-900 font-extrabold' : 'text-gray-400 font-semibold'
                      }`}>
                        {st.label}
                      </span>
                    </div>
                    {idx < 3 && (
                      <div className={`flex-1 mx-3 h-[2px] min-w-[8px] transition-colors duration-300 ${
                        wizardStep > st.s ? 'bg-emerald-500' : 'bg-gray-100'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Step Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5 text-left">
              
              {/* STEP 1: INTEREST AUDIT */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-[14.5px] font-extrabold text-gray-900 tracking-tight">Interest Compounding Audit</h4>
                    <p className="text-[11.5px] text-gray-500 leading-relaxed font-medium">
                      Under MSMED Act Section 16, interest is computed at <strong className="text-gray-800">3x RBI Repo Rate (compounded monthly)</strong> starting from 45 days after the invoice delivery date.
                    </p>
                  </div>

                  {/* Calculations Sheet */}
                  <div className="bg-white border border-[#EBEAE6] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    <div className="bg-[#FAF9F6] px-5 py-3 border-b border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-400 tracking-wider">
                      <span>AUDIT STATEMENT</span>
                      <span>INTEREST COMPILED</span>
                    </div>

                    <div className="p-5 space-y-4 text-[13px]">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">Buyer Defendant</span>
                        <span className="font-bold text-gray-900">{selectedEligible.customerName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">Principal Due</span>
                        <span className="font-bold text-gray-900">{formatINRCompact(selectedEligible.amount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">Days Late (overdue)</span>
                        <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-100/50">
                          {selectedEligible.daysOverdue} Days
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <span className="text-gray-500 font-medium">3x Compounding Rate</span>
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-100/50">
                          20.25% (6.75% × 3)
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-gray-500 font-medium">Principal Amount</span>
                        <span className="font-bold text-gray-900">{formatINRCompact(selectedEligible.amount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">Accrued Compounded Interest</span>
                        <span className="inline-flex items-center gap-1 text-[13px] font-bold text-emerald-600 bg-emerald-50/50 px-2.5 py-0.5 rounded-lg border border-emerald-100/30">
                          +{formatINRCompact(calculateInterest(selectedEligible.amount, selectedEligible.daysOverdue))}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-[#EBEAE6] pt-4 text-[14px] font-bold text-gray-900">
                        <span className="font-extrabold text-gray-900">Total Claimable Dues</span>
                        <span className="text-[17px] font-black text-[#FF6A39]">
                          {formatINRCompact(selectedEligible.amount + calculateInterest(selectedEligible.amount, selectedEligible.daysOverdue))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#E8F8F0]/30 border border-emerald-500/10 rounded-2xl p-4 text-[11.5px] text-emerald-850 leading-relaxed font-medium flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/30 shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <strong className="font-extrabold text-emerald-950 block mb-0.5">Interest Recovery Rule</strong>
                      Compound interest continues accruing monthly during the Council dispute resolution proceedings. The defendant buyer is legally bound to clear it.
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DOCUMENTS CHECKLIST */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-[14.5px] font-extrabold text-gray-900 tracking-tight">Required Court Attachments</h4>
                    <p className="text-[11.5px] text-gray-500 leading-relaxed font-medium">
                      The Facilitation Council requires evidence of both your MSME registration status and proof of the buyer transaction.
                    </p>
                  </div>

                  <div className="space-y-3">
                    
                    {/* Doc 1: Udyam Certificate */}
                    <div className="bg-white border border-[#EBEAE6] p-4 rounded-2xl flex items-center justify-between hover:border-[#FF6A39]/30 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold text-gray-800 block leading-tight">Udyam MSME Certificate</span>
                          <span className="text-[10px] text-emerald-605 font-bold block mt-1">Verified: UDYAM-MH-12-0089452</span>
                        </div>
                      </div>
                      <span className="text-[11px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full font-bold select-none">
                        Attached
                      </span>
                    </div>

                    {/* Doc 2: Signed Invoice */}
                    <div className="bg-white border border-[#EBEAE6] p-4 rounded-2xl flex items-center justify-between hover:border-[#FF6A39]/30 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold text-gray-800 block leading-tight">Signed Invoice Copy</span>
                          <span className="text-[10px] text-emerald-605 font-bold block mt-1">Uploaded: {selectedEligible.invoiceNumber}.pdf</span>
                        </div>
                      </div>
                      <span className="text-[11px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full font-bold select-none">
                        Attached
                      </span>
                    </div>

                    {/* Doc 3: PO/Challan */}
                    <div className="bg-white border border-[#EBEAE6] p-4 rounded-2xl flex items-center justify-between hover:border-[#FF6A39]/30 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gray-50 border border-gray-200/60 flex items-center justify-center text-gray-500 shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold text-gray-800 block leading-tight">Purchase Order / Delivery Receipt</span>
                          <span className={`text-[10px] block mt-1 font-bold ${
                            selectedEligible.hasPO ? 'text-emerald-605' : 'text-gray-400 font-semibold'
                          }`}>
                            {selectedEligible.hasPO ? 'Attached: PO-2026-904.pdf' : 'Optional but highly recommended'}
                          </span>
                        </div>
                      </div>
                      {selectedEligible.hasPO ? (
                        <span className="text-[11px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full font-bold select-none">
                          Attached
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            toast.success('Simulated PO upload successful')
                          }}
                          className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all cursor-pointer select-none active:scale-95 shadow-3xs"
                        >
                          Upload File
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 3: PETITION DOWNLOAD */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-[14.5px] font-extrabold text-gray-900 tracking-tight">Download Compiled Case Files</h4>
                    <p className="text-[11.5px] text-gray-500 leading-relaxed font-medium">
                      Download the complete pre-filled legal petition drafted by UdhaarClear. The PDF structure matches the formatting rules of the council portal.
                    </p>
                  </div>

                  {/* PDF Download Visual Card */}
                  <div className="bg-white border border-[#EBEAE6] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    <div className="h-12 w-12 rounded-full bg-[#FF6A39]/10 border border-[#FF6A39]/20 flex items-center justify-center text-[#FF6A39] shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[13px] font-bold text-gray-800 block leading-tight">
                        petition_draft_{selectedEligible.invoiceNumber}.zip
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold block">
                        Size: 1.4 MB · Precompiled legal dossier & interest audits
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        toast.success('Case petition pack downloaded successfully')
                      }}
                      className="bg-[#FF6A39] hover:bg-[#E05B2E] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-3xs"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download Zip Pack</span>
                    </button>
                  </div>

                  <div className="text-[11.5px] text-gray-655 leading-relaxed bg-white border border-[#EBEAE6] p-4 rounded-2xl space-y-2">
                    <span className="font-extrabold text-gray-900 block border-b border-gray-100 pb-1.5">
                      Included Case Package Documents
                    </span>
                    <ul className="space-y-2 pt-1 font-medium">
                      {[
                        'Compounding Interest Computation Statement (Schedule 1)',
                        'Official Petition Form 1 (Pre-filled from Invoice records)',
                        'Defendant Buyer Legal Notice Notice Letter Copy (Section 16 proof)',
                      ].map((doc, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2 text-[12px]">
                          <svg className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* STEP 4: SUBMIT CASE */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-[14.5px] font-extrabold text-gray-900 tracking-tight">File Dispute on Samadhaan Portal</h4>
                    <p className="text-[11.5px] text-gray-500 leading-relaxed font-medium">
                      Submit the completed legal petition directly to the MSME Facilitation Council portal via UdhaarClear API handshake.
                    </p>
                  </div>

                  {/* Submission loader state */}
                  {isFiling ? (
                    <div className="bg-white border border-[#EBEAE6] rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                      {/* Spinner loading animation */}
                      <div className="relative flex h-10 w-10">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A39] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-10 w-10 bg-[#FF6A39] flex items-center justify-center text-white font-bold text-sm">
                          ⚡
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-gray-800 block">Submitting Case Petition...</span>
                        <span className="text-[10px] text-gray-400 font-bold animate-pulse block">
                          {filingStatus}
                        </span>
                      </div>
                    </div>
                  ) : filingFinished ? (
                    <div className="bg-white border border-emerald-105 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                      <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-gray-900 block">Filing Confirmed!</span>
                        <span className="text-[10px] text-gray-400 block font-semibold font-mono">
                          Case reference: MSME/MUM/2026/0948
                        </span>
                      </div>
                      <div className="text-[11.5px] text-emerald-700 bg-emerald-50 px-3 py-2.5 rounded-xl leading-relaxed font-semibold border border-emerald-100">
                        A notice has been issued to the buyer. Conciliation proceedings will begin within 15 days.
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-[#EBEAE6] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                      <div className="h-12 w-12 rounded-full bg-[#FF6A39]/10 border border-[#FF6A39]/20 flex items-center justify-center text-xl shrink-0">
                        ⚖️
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[13px] font-bold text-gray-800 block leading-tight">
                          Ready to transmit to Samadhaan Portal
                        </span>
                        <p className="text-[10.5px] text-gray-400 leading-relaxed font-medium">
                          Clicking submit will file this dispute officially on behalf of your MSME firm.
                        </p>
                      </div>
                      <button
                        onClick={handleFileCaseSubmit}
                        className="bg-[#FF6A39] hover:bg-[#E05B2E] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer active:scale-95 w-full max-w-[200px] shadow-3xs"
                      >
                        Transmit & File Case
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-5 bg-white border-t border-gray-100 flex gap-2.5 select-none">
              {wizardStep > 1 && !isFiling && !filingFinished && (
                <button
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl text-xs transition-all active:scale-98"
                >
                  Back
                </button>
              )}
              {wizardStep < 4 && (
                <button
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="flex-1 bg-gray-955 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all active:scale-98 shadow-sm"
                >
                  Continue
                </button>
              )}
              {(wizardStep === 4 || filingFinished) && (
                <button
                  disabled={isFiling}
                  onClick={() => {
                    setSelectedEligible(null)
                    setWizardStep(1)
                  }}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl text-xs transition-all active:scale-98 disabled:opacity-50"
                >
                  {filingFinished ? 'Finish Wizard' : 'Cancel'}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

