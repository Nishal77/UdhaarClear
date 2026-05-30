'use client'

import { format } from 'date-fns'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon, Calendar01Icon, Notification01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons'

interface TopBarProps {
  userName: string
  businessName: string
  userEmail: string
}

export function TopBar({ userName, businessName }: TopBarProps) {
  const dayOfMonth = format(new Date(), 'd')
  const dayOfWeek = format(new Date(), 'EEE')
  const monthName = format(new Date(), 'MMMM')

  return (
    <div className="flex h-20 items-center justify-end px-8 py-4 bg-white select-none shrink-0 z-20 gap-4.5">
      {/* Search Input Bar (mockup size) */}
      <div className="relative w-[300px] hidden lg:block">
        <span className="absolute inset-y-0 left-4.5 flex items-center pointer-events-none">
          <HugeiconsIcon icon={Search01Icon} size={18} className="text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Start searching here ..."
          className="w-full h-11 bg-[#F1F1F1] rounded-full pl-12 pr-5 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-[#EBEBEB] transition-all duration-200 border-0"
        />
      </div>

      {/* Calendar Date Widget Capsule */}
      <div className="flex items-center h-11 bg-[#F1F1F1] rounded-full p-1 pl-1 pr-1 gap-3 select-none" suppressHydrationWarning>
        {/* Circle for Day Number */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-[14px] font-bold text-gray-900 shrink-0">
          {dayOfMonth}
        </div>
        {/* Day of Week & Month Stacked */}
        <div className="flex flex-col text-left justify-center leading-[1.15] pr-0.5 shrink-0">
          <span className="text-[12.5px] font-bold text-gray-900">{dayOfWeek},</span>
          <span className="text-[12px] font-medium text-gray-800">{monthName}</span>
        </div>
        {/* Circle for Calendar Icon */}
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 shrink-0 cursor-pointer hover:bg-gray-200/50 transition-colors">
          <HugeiconsIcon icon={Calendar01Icon} size={15} className="text-gray-800" />
          <span className="absolute top-[1.5px] right-[1.5px] flex h-2 w-2 rounded-full bg-[#FF4D4D] border border-white" />
        </div>
      </div>

      {/* Notification Button */}
      <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#F1F1F1] cursor-pointer hover:bg-[#EBEBEB] transition-colors shrink-0">
        <HugeiconsIcon icon={Notification01Icon} size={18} className="text-gray-800" />
        <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-[#FF4D4D] border border-white" />
      </div>

      {/* User Profile Widget (Capsule matching image 1) */}
      <div className="flex items-center h-11 bg-[#F1F1F1] rounded-full p-1 pl-1 pr-3 gap-3 cursor-pointer hover:bg-[#EBEBEB] transition-colors select-none shrink-0">
        {/* Circle for Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5F7ED] border border-[#E4E4E7] overflow-hidden shrink-0">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Profile Name & Subtext */}
        <div className="flex flex-col text-left justify-center leading-[1.1] shrink-0">
          <span className="text-[13px] font-bold text-gray-900">{userName}</span>
          <span className="text-[11px] font-medium text-gray-400 mt-0.5">Manage Account</span>
        </div>
        {/* Chevron Down */}
       <HugeiconsIcon icon={ArrowDown01Icon} className='size-3.5' />
      </div>
    </div>
  )
}
