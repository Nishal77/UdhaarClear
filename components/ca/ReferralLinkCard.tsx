'use client'

import { useState } from 'react'

export function ReferralLinkCard({ referralLink }: { referralLink: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="rounded-2xl border border-[#EBEAE6] bg-[#FAFAF8] p-5">
      <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Your referral link</p>
      <div className="flex items-center gap-3">
        <code className="flex-1 truncate rounded-xl bg-white border border-[#EBEAE6] px-4 py-3 text-[13px] font-mono text-gray-800">
          {referralLink}
        </code>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 rounded-xl bg-[#FF6A39] hover:bg-[#E05B2E] px-4 py-3 text-[13px] font-semibold text-white transition-all"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="mt-2 text-[12px] text-gray-400">
        Every business that signs up through this link is permanently attributed to you — even if they click a different link later.
      </p>
    </div>
  )
}
