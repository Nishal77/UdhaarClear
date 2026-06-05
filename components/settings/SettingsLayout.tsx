'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Settings, CreditCard, Users, Webhook, Puzzle } from 'lucide-react'

const SETTINGS_TABS = [
  { label: 'My Settings', href: '/settings', icon: Settings },
  { label: 'Business Profile', href: '/settings/profile', icon: User },
  { label: 'Billing & Plans', href: '/settings/billing', icon: CreditCard },
  { label: 'Team Members', href: '/settings/team', icon: Users },
  { label: 'API & Webhooks', href: '/settings/webhooks', icon: Webhook },
  { label: 'Connected Apps', href: '/settings/integrations', icon: Puzzle },
]

interface SettingsLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export function SettingsLayout({ children, title, description }: SettingsLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="space-y-4 w-full select-none">
      {/* Page Header */}
      <div className="flex flex-col">
        <h1 className="text-[24px] font-bold text-gray-900 leading-tight font-outfit">{title}</h1>
        <p className="mt-1 text-[13px] text-gray-400 font-medium">
          {description}
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-row items-center overflow-x-auto bg-[#EDEDED] border border-gray-200/50 rounded-full p-1.5 w-fit max-w-full  gap-0.5">
        {SETTINGS_TABS.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 px-4 md:px-5 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-200 shrink-0 ${
                isActive
                  ? "bg-white text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Main Settings Page content */}
      <div className="animate-in fade-in duration-300">
        {children}
      </div>
    </div>
  )
}
