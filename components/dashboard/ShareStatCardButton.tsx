'use client'

import { useState, useRef } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Share03Icon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import { formatINR } from '@/lib/utils/currency'

interface ShareStatCardButtonProps {
  businessName: string
  collectedThisMonth: number
  outstandingCount: number
  totalOutstanding: number
}

export function ShareStatCardButton({
  businessName,
  collectedThisMonth,
  outstandingCount,
  totalOutstanding,
}: ShareStatCardButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Current month string
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })

  // Trigger high-res canvas drawing and file download
  const handleDownload = () => {
    try {
      const canvas = document.createElement('canvas')
      // High-res WABA optimized size (1200 x 630 pixels)
      canvas.width = 1200
      canvas.height = 630
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Could not get canvas context')

      // 1. Draw Clean White Background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 2. Draw Sleek Slate Border
      ctx.strokeStyle = '#F1F1EF'
      ctx.lineWidth = 24
      ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24)

      // 3. Draw Branding Logo (UdhaarClear)
      ctx.font = 'bold 32px sans-serif'
      ctx.fillStyle = '#111827' // Slate 900
      ctx.fillText('Udhaar', 80, 100)
      
      const udhaarWidth = ctx.measureText('Udhaar').width
      ctx.fillStyle = '#FF6A39' // Brand Orange
      ctx.fillText('Clear', 80 + udhaarWidth, 100)

      ctx.fillStyle = '#10B981' // Accent Green dot
      ctx.beginPath()
      ctx.arc(80 + udhaarWidth + ctx.measureText('Clear').width + 8, 90, 6, 0, 2 * Math.PI)
      ctx.fill()

      // Subtitle
      ctx.font = '500 16px sans-serif'
      ctx.fillStyle = '#9CA3AF'
      ctx.fillText('India\'s MSME Cashflow & Recovery Platform', 80, 130)

      // 4. Draw Collection Card Box (Subtle Card Outline)
      ctx.fillStyle = '#FAFAF9'
      ctx.beginPath()
      ctx.roundRect(80, 175, 1040, 280, 24)
      ctx.fill()
      ctx.strokeStyle = '#EBEAE6'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Metric Header
      ctx.font = 'extrabold 18px sans-serif'
      ctx.fillStyle = '#FF6A39'
      ctx.fillText('COLLECTIONS MILESTONE', 120, 225)

      // Amount (Huge & Bold)
      ctx.font = 'bold 72px sans-serif'
      ctx.fillStyle = '#111827'
      const formattedAmt = formatINR(collectedThisMonth)
      ctx.fillText(formattedAmt, 120, 310)

      // Sub-label
      ctx.font = '500 20px sans-serif'
      ctx.fillStyle = '#4B5563'
      ctx.fillText(`Successfully recovered in ${currentMonth}`, 120, 355)

      // Draw horizontal divider inside the box
      ctx.strokeStyle = '#EBEAE6'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(120, 385)
      ctx.lineTo(1080, 385)
      ctx.stroke()

      // 5. Draw Business Stats Footer Columns
      ctx.font = 'bold 15px sans-serif'
      ctx.fillStyle = '#9CA3AF'
      ctx.fillText('BUSINESS', 120, 415)
      ctx.font = 'bold 17px sans-serif'
      ctx.fillStyle = '#1F2937'
      ctx.fillText(businessName, 120, 437)

      ctx.font = 'bold 15px sans-serif'
      ctx.fillStyle = '#9CA3AF'
      ctx.fillText('ACTIVE DEBTORS RESOLVED', 540, 415)
      ctx.font = 'bold 17px sans-serif'
      ctx.fillStyle = '#1F2937'
      ctx.fillText(`${outstandingCount} Accounts Active`, 540, 437)

      ctx.font = 'bold 15px sans-serif'
      ctx.fillStyle = '#9CA3AF'
      ctx.fillText('OUTSTANDING SECURED', 860, 415)
      ctx.font = 'bold 17px sans-serif'
      ctx.fillStyle = '#10B981'
      ctx.fillText(formatINR(totalOutstanding), 860, 437)

      // 6. Draw Platform CTA Footer
      ctx.font = '600 16px sans-serif'
      ctx.fillStyle = '#6B7280'
      ctx.fillText('Stop chasing late payments. Automate recovery at', 80, 550)
      ctx.font = 'bold 16px sans-serif'
      ctx.fillStyle = '#FF6A39'
      ctx.fillText('udhaarclear.in', 475, 550)

      // Trigger actual download link
      const dataUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `udhaarclear_recovery_${businessName.toLowerCase().replace(/\s+/g, '_')}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      toast.success('Stat card downloaded successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate stat card image')
    }
  }

  // Pre-filled WABA text sharing
  const handleWhatsAppShare = () => {
    const text = `I've successfully collected ${formatINR(collectedThisMonth)} this month using UdhaarClear! 🚀 It automates collections & claims 3x interest on late payments. Get started for free at https://udhaarclear.in`
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#EBEAE6]/60 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shadow-3xs"
        title="Share Milestone"
      >
        <HugeiconsIcon icon={Share03Icon} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-[#EBEAE6] w-full max-w-xl rounded-[28px] p-6 shadow-2xl space-y-6 text-left">
            
            {/* Header */}
            <div>
              <h3 className="text-[17px] font-extrabold text-gray-900 leading-tight">
                Share Collections Milestone
              </h3>
              <p className="text-[12.5px] text-gray-400 font-semibold mt-1">
                Promote cash flow recovery progress or share milestone achievements on social channels.
              </p>
            </div>

            {/* Premium Flat Card Preview */}
            <div className="relative border border-[#EBEAE6] bg-white rounded-2xl p-5 shadow-3xs select-none space-y-5 overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 font-bold text-gray-900 text-sm">
                  <span>Udhaar</span>
                  <span className="text-[#FF6A39]">Clear</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block self-center ml-0.5" />
                </div>
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">
                  Recovery Badge
                </span>
              </div>

              <div className="bg-[#FAFAF9] border border-gray-100 rounded-xl p-4.5 space-y-3">
                <span className="text-[10px] font-extrabold text-[#FF6A39] tracking-wider block uppercase">
                  Collections Milestone
                </span>
                <span className="text-[34px] font-semibold text-gray-900 leading-none block">
                  {formatINR(collectedThisMonth)}
                </span>
                <span className="text-[12px] text-gray-500 font-semibold block leading-relaxed">
                  Successfully recovered in {currentMonth}
                </span>

                <div className="border-t border-gray-200/80 pt-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide block">Business</span>
                    <span className="text-[11.5px] font-bold text-gray-800 mt-0.5 block">{businessName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide block">Outstanding</span>
                    <span className="text-[11.5px] font-bold text-emerald-600 mt-0.5 block">{formatINR(totalOutstanding)}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-gray-400 font-semibold leading-relaxed flex items-center justify-between">
                <span>Stop chasing. Automate recovery.</span>
                <span className="text-[#FF6A39] font-bold">udhaarclear.in</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleDownload}
                className="flex-1 bg-gray-950 hover:bg-gray-850 text-white font-extrabold py-3 px-4 rounded-xl text-[13.5px] transition-all cursor-pointer shadow-3xs text-center"
              >
                📥 Download Card (PNG)
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold py-3 px-4 rounded-xl text-[13.5px] transition-all cursor-pointer shadow-3xs text-center"
              >
                💬 Share to WhatsApp
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl text-[13.5px] transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
