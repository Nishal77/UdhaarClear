'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { HugeiconsIcon } from '@hugeicons/react'
import { Notification01Icon } from '@hugeicons/core-free-icons'

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  type: 'payment' | 'warning' | 'whatsapp' | 'legal'
  isUnread: boolean
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Sample highly realistic notifications for UdhaarClear dashboard
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Payment Credited',
      description: '₹1,85,000 received from Ramesh Traders via auto-UPI deposit for #INV-2026-001.',
      time: 'Just now',
      type: 'payment',
      isUnread: true
    },
    {
      id: 'notif-2',
      title: 'WhatsApp Alert Read',
      description: 'Sunita Fabrics opened late fee reminder warning. Promise to pay recorded: 6th June.',
      time: '14 mins ago',
      type: 'whatsapp',
      isUnread: true
    },
    {
      id: 'notif-3',
      title: 'Litigation Draft Ready',
      description: 'AI Tone Engine auto-generated formal MSME Samadhaan pre-notice warning for Kaveri Auto Parts.',
      time: '2 hours ago',
      type: 'legal',
      isUnread: true
    },
    {
      id: 'notif-4',
      title: 'Auto-Settlement Failed',
      description: 'UPI mandate bounce recorded for Sunita Fabrics scheduled auto-pay of ₹18,200.',
      time: 'Yesterday',
      type: 'warning',
      isUnread: false
    }
  ])

  // Count unread notifications
  const unreadCount = notifications.filter(n => n.isUnread).length

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

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })))
  }

  // Helper to render type-specific background/icon values
  const getTypeStyles = (type: NotificationItem['type']) => {
    switch (type) {
      case 'payment':
        return {
          bg: 'bg-[#E5F7ED]',
          text: 'text-emerald-600',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      case 'whatsapp':
        return {
          bg: 'bg-[#E6F8F1]',
          text: 'text-emerald-500',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )
        }
      case 'legal':
        return {
          bg: 'bg-violet-50',
          text: 'text-violet-600',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        }
      case 'warning':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-600',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        }
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button matching screenshot exactly */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-full bg-[#F1F1F1] cursor-pointer select-none transition-all duration-200 focus:outline-none border-0",
          isOpen ? "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-gray-200/80" : "hover:bg-[#EBEBEB]"
        )}
      >
        <HugeiconsIcon icon={Notification01Icon} size={18} className="text-gray-800" />
        {unreadCount > 0 && (
          <span className="absolute top-[10px] right-[10px] flex h-2.5 w-2.5 rounded-full bg-[#FF4D4D] border-2 border-white ring-1 ring-[#FF4D4D]/10" />
        )}
      </button>

      {/* Floating Notification Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-[380px] bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-2.5 z-50 transform origin-top-right transition-all duration-200 select-none animate-in fade-in slide-in-from-top-3 duration-250">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-100/80 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="shrink-0 rounded-full bg-[#FFF0EB] px-2 py-0.5 text-[10px] font-bold text-[#FF6A39] border border-[#FF6A39]/10">
                  {unreadCount} New
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-gray-400 hover:text-[#FF6A39] transition-colors border-0 bg-transparent cursor-pointer p-0"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications Scrollable List */}
          <div className="max-h-[350px] overflow-y-auto min-h-0 space-y-1 py-1 pr-0.5 scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-transparent">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="text-2xl mb-1.5">🔔</span>
                <p className="text-[12.5px] font-bold text-gray-800">You are all caught up!</p>
                <p className="text-[11px] font-medium text-gray-400 mt-0.5">No new notifications at this time.</p>
              </div>
            ) : (
              notifications.map((item) => {
                const styles = getTypeStyles(item.type)
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      // Mark item as read on click
                      setNotifications(prev =>
                        prev.map(n => (n.id === item.id ? { ...n, isUnread: false } : n))
                      )
                    }}
                    className={cn(
                      "group flex items-start gap-3.5 rounded-2xl p-2.5 cursor-pointer hover:bg-gray-50/70 transition-all duration-200",
                      item.isUnread ? "bg-white" : "opacity-75"
                    )}
                  >
                    {/* Circle icon */}
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl shrink-0 transition-colors duration-200", styles.bg, styles.text)}>
                      {styles.icon}
                    </div>

                    {/* Notification content */}
                    <div className="flex flex-col text-left leading-[1.25] flex-1 min-w-0">
                      <span className={cn("text-[12.5px] text-gray-800 group-hover:text-gray-950 transition-colors", item.isUnread ? "font-bold" : "font-semibold")}>
                        {item.title}
                      </span>
                      <span className="text-[11.5px] font-medium text-gray-400 group-hover:text-gray-500 transition-colors leading-relaxed mt-0.5 break-words">
                        {item.description}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400 mt-1">
                        {item.time}
                      </span>
                    </div>

                    {/* Unread circle dot */}
                    {item.isUnread && (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0 ml-1.5 mt-2 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Separator Line */}
          <div className="border-t border-gray-100/85 my-2 mx-2" />

          {/* Footer View Logs Button */}
          <Link
            href="/analytics/recovery"
            onClick={() => setIsOpen(false)}
            className="group flex w-[95%] mx-auto items-center gap-3 rounded-2xl p-2 hover:bg-gray-50/70 transition-all duration-200"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-[#FFF0EB] group-hover:text-[#FF6A39] transition-all duration-200 shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="flex flex-col text-left leading-[1.2] min-w-0 flex-1">
              <span className="text-[13px] font-bold text-[#FF6A39] transition-colors">
                View Activity Logs
              </span>
              <span className="text-[10.5px] font-medium text-gray-400 group-hover:text-gray-500 transition-colors truncate">
                Access audit records & history trails
              </span>
            </div>
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
        </div>
      )}
    </div>
  )
}
