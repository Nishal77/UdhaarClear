'use client'

import React from 'react'

interface SettingsLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export function SettingsLayout({ children, title, description }: SettingsLayoutProps) {
  return (
    <div className="space-y-4 w-full select-none">
      {/* Page Header */}
      <div className="flex flex-col">
        <h1 className="text-[24px] font-bold text-gray-900 leading-tight font-outfit">{title}</h1>
        <p className="mt-1 text-[13px] text-gray-400 font-medium">
          {description}
        </p>
      </div>

      {/* Main Settings Page content */}
      <div className="animate-in fade-in duration-300">
        {children}
      </div>
    </div>
  )
}
