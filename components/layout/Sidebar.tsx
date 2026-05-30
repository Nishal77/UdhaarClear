'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DashboardSquare01Icon,
  UserGroupIcon,
  InvoiceIcon,
  WhatsappIcon,
  Settings02Icon,
  Settings01Icon,
  Logout01Icon,
  Chart01Icon,
} from '@hugeicons/core-free-icons'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  userName?: string
  userEmail?: string
  businessName?: string
}

const MAIN_NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: DashboardSquare01Icon },
  { href: '/reports', label: 'Analytics', icon: Chart01Icon },
  { href: '/invoices', label: 'Invoices', icon: InvoiceIcon },
  { href: '/customers', label: 'Customers', icon: UserGroupIcon },
]

const RECOVERY_NAV_ITEMS = [
  { href: '/reminders', label: 'WhatsApp Reminders', icon: WhatsappIcon },
  { href: '/settings/whatsapp', label: 'WhatsApp Settings', icon: Settings02Icon },
]

export function Sidebar({ userName = 'User', userEmail = 'user@example.com', businessName = 'UdhaarClear' }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="flex h-full w-[260px] flex-col bg-white px-4 pt-[18px] pb-5 justify-between select-none overflow-hidden border-r border-gray-100 shrink-0">
      <div className="flex flex-col">
        {/* Logo Section */}
        <div className="mb-6 px-3">
          <Link href="/dashboard" className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#033E35] shadow-sm shrink-0">
              <svg className="w-5.5 h-5.5 text-[#C2F970]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="12" cy="12" r="5" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-gray-900 leading-tight">UdhaarClear</span>
              <span className="text-[11px] text-gray-400 font-medium mt-0.5">Dashboard</span>
            </div>
          </Link>
        </div>

        {/* Main Section */}
        <div className="mb-2 px-3.5">
          <p className="text-[11px] font-bold text-gray-400 tracking-[0.08em] uppercase">Main</p>
        </div>
        <nav className="space-y-1 px-1">
          {MAIN_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-200',
                  active
                    ? 'bg-gray-100/70 text-gray-900 font-semibold'
                    : 'text-[#5C5C5B] hover:bg-gray-50/80 hover:text-gray-900'
                )}
              >
                <HugeiconsIcon
                  icon={Icon}
                  size={18}
                  className={active ? 'text-[#FF6A39]' : 'text-gray-400 group-hover:text-gray-600'}
                />
                <span className="flex-1">{label}</span>
                {active && (
                  <svg className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Recovery Channels Section */}
        <div className="flex items-center justify-between mt-6 mb-2 px-3.5">
          <p className="text-[11px] font-bold text-gray-400 tracking-[0.08em] uppercase">Recovery Channels</p>
          <button className="text-gray-400 hover:text-gray-600 text-sm font-medium pr-1 hover:scale-105 transition-transform">
            +
          </button>
        </div>
        <nav className="space-y-1 px-1">
          {RECOVERY_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-200',
                  active
                    ? 'bg-gray-100/70 text-gray-900 font-semibold'
                    : 'text-[#5C5C5B] hover:bg-gray-50/80 hover:text-gray-900'
                )}
              >
                <HugeiconsIcon
                  icon={Icon}
                  size={18}
                  className={active ? 'text-[#FF6A39]' : 'text-gray-400 group-hover:text-gray-600'}
                />
                <span className="flex-1">{label}</span>
                {active && (
                  <svg className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom section (Settings, Sign Out) */}
      <div className="mt-auto flex flex-col w-full">
        {/* Settings link */}
        <Link
          href="/settings"
          className={cn(
            'group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-200',
            pathname === '/settings'
              ? 'bg-gray-100/70 text-gray-900 font-semibold'
              : 'text-[#5C5C5B] hover:bg-gray-50/80 hover:text-gray-900'
          )}
        >
          <HugeiconsIcon
            icon={Settings01Icon}
            size={18}
            className={pathname === '/settings' ? 'text-[#FF6A39]' : 'text-gray-400 group-hover:text-gray-600'}
          />
          <span className="flex-1">Settings</span>
          {pathname === '/settings' && (
            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          )}
        </Link>

        {/* Sign Out button in Red */}
        <button
          onClick={handleSignOut}
          className="group flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium text-red-600 hover:bg-red-50/40 hover:text-red-700 transition-all duration-200 cursor-pointer"
        >
          <HugeiconsIcon icon={Logout01Icon} size={18} className="text-red-500 group-hover:text-red-600" />
          <span className="text-left flex-1">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
