'use client'

import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  Calendar01Icon, 
  ArrowDown01Icon,
  UserIcon,
  CreditCardIcon,
  SchoolReportCardIcon,
  UserMultipleIcon,
  WebhookIcon,
  Plug01Icon,
  Logout01Icon
} from '@hugeicons/core-free-icons'
import { NotificationDropdown } from './NotificationDropdown'
import { createClient } from '@/lib/supabase/client'

interface TopBarProps {
  userName: string
  businessName: string
  userEmail: string
}

export function TopBar({ userName = 'User', businessName = 'UdhaarClear', userEmail = 'user@example.com' }: TopBarProps) {
  const dayOfMonth = format(new Date(), 'd')
  const dayOfWeek = format(new Date(), 'EEE')
  const monthName = format(new Date(), 'MMMM')

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Options for the dropdown divided into visually structured groups with native Hugeicons
  const menuGroups = [
    {
      label: 'Personal Space',
      items: [
        {
          label: 'My Settings',
          sub: 'Profile details & preferences',
          href: '/settings',
          icon: UserIcon
        },
        {
          label: 'Billing & Plans',
          sub: 'Manage invoices & subscription',
          href: '/settings/billing',
          icon: CreditCardIcon
        }
      ]
    },
    {
      label: 'Business Settings',
      items: [
        {
          label: 'Business Profile',
          sub: 'Tax profile, GSTIN & defaults',
          href: '/settings/profile',
          icon: SchoolReportCardIcon
        },
        {
          label: 'Team Members',
          sub: 'Collaborators & permission roles',
          href: '/settings/team',
          icon: UserMultipleIcon
        }
      ]
    },
    {
      label: 'Developer Settings',
      items: [
        {
          label: 'API & Webhooks',
          sub: 'Create API keys & register hooks',
          href: '/settings/webhooks',
          icon: WebhookIcon
        },
        {
          label: 'Connected Apps',
          sub: 'Connect Stripe, WhatsApp & custom gateways',
          href: '/settings/integrations',
          icon: Plug01Icon
        }
      ]
    }
  ]

  return (
    <div className="flex h-20 items-center justify-end px-8 py-4 bg-white select-none shrink-0 z-20 gap-4.5">
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

      {/* Notification Dropdown Component */}
      <NotificationDropdown />

      {/* User Profile Widget Container */}
      <div className="relative" ref={dropdownRef}>
        {/* Capsule matching user's image exactly */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center h-11 rounded-full p-1 pl-1 pr-3 gap-3 cursor-pointer select-none shrink-0 transition-all duration-200 focus:outline-none border-0",
            isOpen 
              ? "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-gray-200/80" 
              : "bg-[#F1F1F1] hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:ring-1 hover:ring-gray-200/60"
          )}
        >
          {/* Circle for Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5F7ED] border border-[#E4E4E7] overflow-hidden shrink-0">
            <img
              src="https://i.pinimg.com/1200x/1a/da/b7/1adab786560aea0af24b97e07ef04e31.jpg"
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Profile Name & Subtext */}
          <div className="flex flex-col text-left justify-center leading-[1.1] shrink-0">
            <span className="text-[13px] font-bold text-gray-900">{userName}</span>
            <span className="text-[11px] font-medium text-gray-400 mt-0.5">Settings & Profile</span>
          </div>
          {/* Chevron Down */}
          <HugeiconsIcon 
            icon={ArrowDown01Icon} 
            className={cn(
              "size-3.5 text-gray-500 transition-transform duration-300 ease-out",
              isOpen ? "rotate-180 text-gray-900" : "text-gray-400"
            )}
          />
        </button>

        {/* Premium Dropdown floating menu */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-2.5 z-50 transform origin-top-right transition-all duration-200 select-none animate-in fade-in slide-in-from-top-3 duration-250">
            {/* Header / User Info */}
            <div className="flex items-center gap-3 p-3 border-b border-gray-100/80 mb-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E5F7ED] border border-[#EBEAE6] overflow-hidden shrink-0 shadow-sm">
                <img
                  src="https://i.pinimg.com/1200x/6b/85/7e/6b857e52008fdb57dcbc0b42d5ad5211.jpg"
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left justify-center min-w-0 leading-tight">
                <span className="text-[14px] font-bold text-gray-900 truncate">{userName}</span>
                <span className="text-[11px] font-medium text-gray-400 mt-0.5 truncate">{userEmail}</span>
              </div>
              <span className="ml-auto shrink-0 rounded-full bg-[#FFF0EB] px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#FF6A39] border border-[#FF6A39]/10">
                Pro
              </span>
            </div>

            {/* Menu groups list */}
            <div className="space-y-3.5 py-1">
              {menuGroups.map((group) => (
                <div key={group.label} className="space-y-1">
                  <div className="px-3">
                    <p className="text-[13px] font-semibold text-gray-500 tracking-tight leading-none mb-1">
                      {group.label}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-3 rounded-2xl p-2 hover:bg-gray-50/70 transition-all duration-200"
                      >
                        {/* Icon Container */}
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 text-gray-500 group-hover:bg-[#FFF0EB] group-hover:text-[#FF6A39] transition-all duration-200 shrink-0">
                          <HugeiconsIcon icon={item.icon} size={15} />
                        </div>
                        {/* Label detail stacks */}
                        <div className="flex flex-col text-left leading-[1.2] min-w-0 flex-1">
                          <span className="text-[13px] font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                            {item.label}
                          </span>
                          <span className="text-[10.5px] font-medium text-gray-400 group-hover:text-gray-500 transition-colors truncate">
                            {item.sub}
                          </span>
                        </div>
                        {/* Premium micro-sliding chevron */}
                        <svg 
                          className="w-3.5 h-3.5 text-[#FF6A39] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Separator Line */}
            <div className="border-t border-gray-100/85 my-2 mx-2" />

            {/* Premium Logout Button */}
            <button
              onClick={async () => {
                try {
                  const supabase = createClient()
                  await supabase.auth.signOut()
                } catch (err) {
                  console.error('Error during sign out:', err)
                } finally {
                  window.location.href = '/login'
                }
              }}
              className="group flex w-[95%] mx-auto items-center gap-3 rounded-2xl p-2 hover:bg-rose-50/50 transition-all duration-200 border-0 cursor-pointer"
            >
              {/* Icon Container */}
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-rose-100/50 group-hover:text-rose-500 transition-all duration-200 shrink-0">
                <HugeiconsIcon icon={Logout01Icon} size={15} />
              </div>
              {/* Label details */}
              <div className="flex flex-col text-left leading-[1.2] min-w-0 flex-1">
                <span className="text-[13px] font-bold text-gray-700 group-hover:text-rose-600 transition-colors">
                  Log Out
                </span>
                <span className="text-[10.5px] font-medium text-gray-400 group-hover:text-rose-400/80 transition-colors truncate">
                  Sign out of your account securely
                </span>
              </div>
              {/* Micro-sliding Arrow */}
              <svg 
                className="w-3.5 h-3.5 text-rose-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}



