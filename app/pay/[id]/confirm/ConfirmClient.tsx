'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { 
  ArrowLeft, 
  UploadCloud, 
  CheckCircle, 
  FileText, 
  X, 
  Loader2, 
  Lock, 
  ShieldCheck 
} from 'lucide-react'

interface Props {
  invoiceId: string
  invoiceNumber: string
  amount: number
  formattedAmount: string
  customerName: string
  businessName: string
  businessPhone: string
  isPaid: boolean
  status: string
}

export default function ConfirmClient({
  invoiceId,
  invoiceNumber,
  amount,
  formattedAmount,
  customerName,
  businessName,
  businessPhone,
  isPaid,
  status,
}: Props) {
  const router = useRouter()
  
  const [utr, setUtr] = useState('')
  const [payerName, setPayerName] = useState(customerName)
  const [payerBank, setPayerBank] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(status === 'PENDING_CONFIRMATION')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        setScreenshot(file)
      }
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        setScreenshot(file)
      }
    }
  }

  const validateFile = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid JPEG, PNG image or PDF proof.')
      return false
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB.')
      return false
    }
    return true
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const removeFile = () => {
    setScreenshot(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!utr.trim()) {
      toast.error('Please enter the UTR / Transaction reference number.')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('transferRef', utr.trim())
      formData.append('payerName', payerName.trim())
      formData.append('payerBank', payerBank.trim())
      formData.append('transferredAmount', amount.toString())
      if (screenshot) {
        formData.append('screenshot', screenshot)
      }

      const res = await fetch(`/api/pay/${invoiceId}/confirm`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Submission failed')

      toast.success('Payment proof submitted successfully!')
      setDone(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F4EE] flex flex-col items-center py-10 px-4 font-sans text-gray-800">
      
      {/* Header */}
      <div className="w-full max-w-[480px] mb-6 flex items-center justify-between">
        <Link 
          href={`/pay/${invoiceId}`} 
          className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to payment</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#376E55] animate-pulse" />
          <span className="text-[11px] font-bold text-[#376E55] uppercase tracking-wide">Direct Verification</span>
        </div>
      </div>

      {/* Main card */}
      <div className="w-full max-w-[480px] rounded-[24px] bg-white border border-[#EBEAE6]/80 shadow-[0_6px_30px_rgba(0,0,0,0.03)] overflow-hidden">
        
        {/* Banner */}
        <div className="bg-[#376E55] px-6 py-6 text-white text-center">
          <p className="text-[12.5px] font-medium text-white/80 uppercase tracking-wider">Confirming Payment</p>
          <p className="text-[32px] font-bold mt-1 tracking-tight">{formattedAmount}</p>
          <p className="text-[13px] text-white/70 mt-1">Invoice #{invoiceNumber} · {businessName}</p>
        </div>

        {done ? (
          <div className="p-8 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2.5">Verification Pending</h2>
            <p className="text-[13.5px] text-gray-500 leading-relaxed max-w-[340px] mx-auto">
              We have received your UTR details and payment proof. The merchant <strong className="text-gray-700">{businessName}</strong> has been notified and will verify the transfer against their bank statement.
            </p>
            <div className="my-6 p-4 rounded-2xl bg-[#F5F4EE]/60 border border-[#EBEAE6]/60 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">UTR / Reference:</span>
                <span className="font-semibold font-mono text-gray-800">{utr || 'Awaiting verify'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Status:</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5 select-none">Awaiting confirmation</span>
              </div>
            </div>
            <p className="text-[12px] text-gray-400">
              You will receive an update once the merchant settles this invoice. Paused automated reminders.
            </p>
            <Link 
              href={`/pay/${invoiceId}`}
              className="mt-6 block w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-[13.5px] font-semibold transition-all"
            >
              Back to invoice summary
            </Link>
          </div>
        ) : isPaid ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Invoice Fully Paid!</h2>
            <p className="text-[13.5px] text-gray-500 mb-6">This invoice has already been fully settled. Thank you!</p>
            <Link 
              href={`/pay/${invoiceId}`}
              className="block w-full py-3 bg-[#376E55] text-white rounded-xl text-[13.5px] font-semibold transition-all"
            >
              Close Page
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-5">
            <div>
              <p className="text-[13.5px] text-gray-500 leading-relaxed mb-4">
                Thank you for your payment. Please fill in the details below to submit your payment receipt for matching.
              </p>
            </div>

            {/* UTR Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-bold text-gray-700 flex items-center justify-between">
                <span>UTR / Transaction Reference Number <span className="text-red-500">*</span></span>
                <span className="text-[10px] font-medium text-gray-400 uppercase">12 or 22 characters</span>
              </label>
              <input
                type="text"
                required
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. HDFC4823910293847"
                className="h-11 rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 text-[13.5px] font-mono text-gray-900 placeholder-gray-400 focus:border-[#376E55] focus:outline-none focus:ring-2 focus:ring-[#376E55]/10 transition-all uppercase"
              />
            </div>

            {/* Payer Name & Bank */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-gray-700">Payer Name / Business</label>
                <input
                  type="text"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="e.g. Vivek Kumar"
                  className="h-11 rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 text-[13.5px] text-gray-900 placeholder-gray-400 focus:border-[#376E55] focus:outline-none focus:ring-2 focus:ring-[#376E55]/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-gray-700">Payer Bank Name</label>
                <input
                  type="text"
                  value={payerBank}
                  onChange={(e) => setPayerBank(e.target.value)}
                  placeholder="e.g. HDFC Bank"
                  className="h-11 rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 text-[13.5px] text-gray-900 placeholder-gray-400 focus:border-[#376E55] focus:outline-none focus:ring-2 focus:ring-[#376E55]/10 transition-all"
                />
              </div>
            </div>

            {/* Drag & Drop File Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-bold text-gray-700">Upload Receipt / Screenshot</label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  dragActive 
                    ? 'border-[#376E55] bg-[#376E55]/5' 
                    : screenshot 
                      ? 'border-[#376E55]/60 bg-emerald-50/10' 
                      : 'border-gray-200 bg-[#FAFAF8] hover:border-gray-300 hover:bg-[#FAFAF8]/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="hidden"
                />

                {screenshot ? (
                  <div className="space-y-3 w-full" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 max-w-[360px] mx-auto">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText size={20} className="text-[#376E55] shrink-0" />
                        <span className="text-xs font-semibold text-gray-700 truncate max-w-[200px]" title={screenshot.name}>
                          {screenshot.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                          ({(screenshot.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                      <button 
                        type="button" 
                        onClick={removeFile}
                        className="p-1 rounded-full hover:bg-gray-200/60 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400">Click the X to remove file or upload a different one</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={28} className="text-gray-400 mb-2.5 animate-pulse-soft" />
                    <p className="text-xs font-bold text-gray-700">Drag & drop your screenshot receipt here</p>
                    <p className="text-[11px] text-gray-400 mt-1">or <span className="text-[#376E55] font-semibold underline">browse files</span> (PNG, JPG, PDF up to 10MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* CTA Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#376E55] hover:bg-[#2c5844] active:scale-[0.99] text-white text-[14px] font-semibold tracking-wide transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-4"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting Details...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Submit Payment Confirmation</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-center gap-4 text-[11px] text-gray-400 font-medium">
          <div className="flex items-center gap-1">
            <Lock size={12} className="text-gray-400" />
            <span>256-bit Encrypted</span>
          </div>
          <span>·</span>
          <span>Support: {businessPhone}</span>
        </div>
      </div>
    </div>
  )
}
