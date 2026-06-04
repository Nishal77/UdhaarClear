'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatINRCompact } from '@/lib/utils/currency'
import { toast } from 'sonner'

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
            <div className="px-5 py-3 flex flex-col justify-center">
              <span className="text-[14px] font-medium text-black tracking-tight">Active Samadhaan Cases</span>
              <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[22px] font-semibold text-gray-900 leading-none whitespace-nowrap">
                  {filedCases.length} Claims
                </span>
                <span className="text-[11.5px] text-orange-600 font-semibold whitespace-nowrap">Under council review</span>
              </div>
            </div>

            {/* Stat 2: Active Claims Amount */}
            <div className="px-5 py-3 flex flex-col justify-center">
              <span className="text-[14px] font-medium text-black tracking-tight">Total Claims Value</span>
              <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[22px] font-semibold text-gray-900 leading-none whitespace-nowrap">
                  {formatINRCompact(totalActiveClaimsAmount)}
                </span>
                <span className="text-[11.5px] text-gray-400 font-medium whitespace-nowrap">
                  (Interest: {formatINRCompact(totalInterestClaimed)})
                </span>
              </div>
            </div>

            {/* Stat 3: RBI Compound Interest Rate */}
            <div className="px-5 py-3 flex flex-col justify-center">
              <span className="text-[14px] font-medium text-black tracking-tight">Legal Interest Rate</span>
              <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[22px] font-semibold text-emerald-600 leading-none whitespace-nowrap">3x RBI Rate</span>
                <span className="text-[11.5px] text-emerald-600 font-semibold whitespace-nowrap">20.25% Comp. Monthly</span>
              </div>
            </div>

            {/* Stat 4: Eligible for Filing */}
            <div className="px-5 py-3 flex flex-col justify-center">
              <span className="text-[14px] font-medium text-black tracking-tight">Filing Eligibility</span>
              <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[22px] font-semibold text-[#FF6A39] leading-none whitespace-nowrap">
                  {totalEligibleCount} Invoices
                </span>
                <span className="text-[11.5px] text-[#FF6A39] font-semibold whitespace-nowrap">Unpaid &gt;45 days</span>
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
                🔍
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => { if (!isFiling) setSelectedEligible(null) }} />

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
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500 disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* Steps Progress Indicator */}
            <div className="bg-white border-b border-gray-100 px-6 py-2.5 flex items-center justify-between text-xs select-none">
              {[
                { s: 1, label: 'Interest Audit' },
                { s: 2, label: 'Documents' },
                { s: 3, label: 'Petition Pack' },
                { s: 4, label: 'Submit File' },
              ].map(st => (
                <div key={st.s} className="flex items-center gap-1">
                  <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center font-bold text-[9px] ${
                    wizardStep === st.s
                      ? 'bg-[#FF6A39] text-white'
                      : wizardStep > st.s
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {wizardStep > st.s ? '✓' : st.s}
                  </span>
                  <span className={`font-bold ${
                    wizardStep === st.s ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {st.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Step Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-left">
              
              {/* STEP 1: INTEREST AUDIT */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-[13.5px] font-extrabold text-gray-900">compounded monthly Interest Audit</h4>
                    <p className="text-[11.5px] text-gray-500 leading-relaxed font-medium">
                      Under MSMED Act Section 16, interest is computed at **3x RBI Repo Rate (compounded monthly)** starting from 45 days after the invoice delivery date.
                    </p>
                  </div>

                  {/* Calculations Sheet */}
                  <div className="bg-white border border-[#EBEAE6] rounded-xl overflow-hidden shadow-3xs">
                    <div className="bg-gray-50/70 p-3 border-b border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400">
                      <span>AUDIT SPREADSHEET</span>
                      <span>MONTHLY COMPOUNDING</span>
                    </div>

                    <div className="p-4 space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Buyer Defendant:</span>
                        <span className="font-bold text-gray-800">{selectedEligible.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Principal Due:</span>
                        <span className="font-bold text-gray-800">{formatINRCompact(selectedEligible.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Days Late (overdue):</span>
                        <span className="font-bold text-red-600">{selectedEligible.daysOverdue} Days</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2.5">
                        <span className="text-gray-400">3x Compounding Rate:</span>
                        <span className="font-bold text-emerald-600">20.25% (6.75% × 3)</span>
                      </div>
                      
                      <div className="flex justify-between pt-1">
                        <span className="text-gray-400">Principal Amount:</span>
                        <span className="font-bold text-gray-900">{formatINRCompact(selectedEligible.amount)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Compounded Interest:</span>
                        <span>+{formatINRCompact(calculateInterest(selectedEligible.amount, selectedEligible.daysOverdue))}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-150 pt-2.5 text-sm font-extrabold text-[#FF6A39]">
                        <span>Total Claimable Dues:</span>
                        <span>{formatINRCompact(selectedEligible.amount + calculateInterest(selectedEligible.amount, selectedEligible.daysOverdue))}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-[11px] text-emerald-700 leading-relaxed font-semibold">
                    💡 <strong>Interest Recovery Tip:</strong> Compound interest continues accruing monthly during the Council dispute resolution proceedings. The defendant buyer is legally bound to clear it.
                  </div>
                </div>
              )}

              {/* STEP 2: DOCUMENTS CHECKLIST */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-[13.5px] font-extrabold text-gray-900">Required court Attachments</h4>
                    <p className="text-[11.5px] text-gray-500 leading-relaxed font-medium">
                      The Facilitation Council requires evidence of both your MSME registration status and proof of the buyer transaction.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    
                    {/* Doc 1: Udyam Certificate */}
                    <div className="bg-white border border-[#EBEAE6] p-3.5 rounded-xl flex items-center justify-between shadow-3xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">🛡️</span>
                        <div className="text-left">
                          <span className="text-xs font-bold text-gray-800 block leading-none">Udyam MSME Registration</span>
                          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Verified: UDYAM-MH-12-0089452</span>
                        </div>
                      </div>
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Attached</span>
                    </div>

                    {/* Doc 2: Signed Invoice */}
                    <div className="bg-white border border-[#EBEAE6] p-3.5 rounded-xl flex items-center justify-between shadow-3xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">📄</span>
                        <div className="text-left">
                          <span className="text-xs font-bold text-gray-800 block leading-none">Signed Invoice Copy</span>
                          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Uploaded: {selectedEligible.invoiceNumber}.pdf</span>
                        </div>
                      </div>
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Attached</span>
                    </div>

                    {/* Doc 3: PO challan */}
                    <div className="bg-white border border-[#EBEAE6] p-3.5 rounded-xl flex items-center justify-between shadow-3xs">
                      <div className="flex items-center gap-2.5 font-semibold">
                        <span className="text-lg">📁</span>
                        <div className="text-left">
                          <span className="text-xs font-bold text-gray-800 block leading-none">Purchase Order / Delivery Receipt</span>
                          <span className={selectedEligible.hasPO ? "text-[10px] text-emerald-600 block mt-1" : "text-[10px] text-gray-400 block mt-1 font-medium"}>
                            {selectedEligible.hasPO ? "Attached: PO-2026-904.pdf" : "Optional but recommended"}
                          </span>
                        </div>
                      </div>
                      {selectedEligible.hasPO ? (
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Attached</span>
                      ) : (
                        <button
                          onClick={() => {
                            toast.success('Simulated PO upload successful')
                          }}
                          className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
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
                    <h4 className="text-[13.5px] font-extrabold text-gray-900">Download compiled Case Files</h4>
                    <p className="text-[11.5px] text-gray-500 leading-relaxed font-medium">
                      Download the complete pre-filled legal petition drafted by UdhaarClear. The PDF structure matches the formatting rules of the council portal.
                    </p>
                  </div>

                  {/* PDF Download Visual Card */}
                  <div className="bg-white border border-[#EBEAE6] rounded-xl p-5 shadow-3xs flex flex-col items-center justify-center text-center space-y-3.5">
                    <div className="h-12 w-12 rounded-full bg-[#FF6A39]/10 flex items-center justify-center text-xl">
                      📥
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-gray-800 block leading-tight">
                        petition_draft_{selectedEligible.invoiceNumber}.zip
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold block">
                        Size: 1.4 MB · Compiled including signed proofs & interest sheets
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        toast.success('Case petition pack downloaded successfully')
                      }}
                      className="bg-[#FF6A39] hover:bg-[#E05B2E] text-white text-xs font-bold py-2 px-5 rounded-xl transition-colors cursor-pointer shadow-3xs flex items-center gap-1.5"
                    >
                      <span>Download Zip Pack</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-lg font-medium border border-gray-100">
                    📜 <strong>Included documents:</strong>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5">
                      <li>Compounding Interest Computation Statement</li>
                      <li>Official Petition Draft Form 1</li>
                      <li>Defendant Buyer Legal Notice Notice Letter Copy</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* STEP 4: SUBMIT CASE */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-[13.5px] font-extrabold text-gray-900">File Dispute on Samadhaan Portal</h4>
                    <p className="text-[11.5px] text-gray-500 leading-relaxed font-medium">
                      Submit the completed legal petition directly to the MSME Facilitation Council portal via UdhaarClear API handshake.
                    </p>
                  </div>

                  {/* Submission loader state */}
                  {isFiling ? (
                    <div className="bg-white border border-[#EBEAE6] rounded-xl p-8 shadow-3xs flex flex-col items-center justify-center text-center space-y-4">
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
                    <div className="bg-white border border-emerald-100 rounded-xl p-6 shadow-3xs flex flex-col items-center justify-center text-center space-y-3.5">
                      <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-lg">
                        ✓
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-gray-900 block">Filing Confirmed!</span>
                        <span className="text-[10px] text-gray-400 block font-semibold font-mono">
                          Case reference: MSME/MUM/2026/0948
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg leading-relaxed font-semibold">
                        A notice has been issued to the buyer. Conciliation proceedings will begin within 15 days.
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-[#EBEAE6] rounded-xl p-6 shadow-3xs flex flex-col items-center justify-center text-center space-y-4">
                      <div className="h-12 w-12 rounded-full bg-[#FF6A39]/10 flex items-center justify-center text-xl">
                        ⚖️
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-gray-800 block leading-tight">
                          Ready to transmit to Samadhaan Portal
                        </span>
                        <p className="text-[10.5px] text-gray-400 leading-relaxed font-medium">
                          Clicking submit will file this dispute officially on behalf of your MSME firm.
                        </p>
                      </div>
                      <button
                        onClick={handleFileCaseSubmit}
                        className="bg-[#FF6A39] hover:bg-[#E05B2E] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-colors cursor-pointer shadow-3xs active:scale-95 w-full max-w-[200px]"
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
                  className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
                >
                  Back
                </button>
              )}
              {wizardStep < 4 && (
                <button
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-3xs"
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
                  className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors disabled:opacity-50"
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
