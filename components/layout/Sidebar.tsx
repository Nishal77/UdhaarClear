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
  AppleReminderIcon,
  CheckListIcon,
  Megaphone02Icon,
  CreditCardIcon,
  NotificationSquareIcon,
  SchoolReportCardIcon,
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
  { href: '/invoices', label: 'Invoices', icon: InvoiceIcon },
  { href: '/customers', label: 'Customers', icon: UserGroupIcon },
  { href: '/reminders', label: 'Reminder', icon: CheckListIcon },
]


const RECOVERY_NAV_ITEMS = [
  { href: '/tone-engine', label: 'Tone Engine', icon: Megaphone02Icon },
  { href: '/payments', label: 'Payments', icon: CreditCardIcon },
  { href: '/legal-notices', label: 'Legal Notices', icon: NotificationSquareIcon },
  { href: '/reminder-customisation', label: 'Customise Reminders', icon: Settings02Icon },
]

const INSIGHTS_NAV_ITEMS = [
  { href: '/insights', label: 'Reports', icon: SchoolReportCardIcon },
  { href: '/settings', label: 'Settings', icon: Settings01Icon },
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
    <aside className="flex h-full w-[260px] flex-col bg-white px-4 pt-[18px] pb-5 justify-between select-none overflow-hidden shrink-0">
      <div className="flex flex-col">
        {/* Logo Section */}
        <div className="mb-6 px-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img
              src="/logo-main.png"
              alt="UdhaarClear Logo"
              className="h-11 w-auto shrink-0 select-none"
            />
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-gray-900 leading-tight">UdhaarClear</span>
              <span className="text-[11px] text-gray-400 font-medium mt-0.5">Dashboard</span>
            </div>
          </Link>
        </div>

        {/* Main Section */}
        <div className="mb-2 px-3.5">
          <p className="text-[15px] font-medium text-gray-600 tracking-tight">Main</p>
        </div>
        <nav className="space-y-1 px-1">
          {MAIN_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200',
                  active
                    ? 'bg-gray-100/70 text-gray-900 font-medium'
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
          <p className="text-[15px] font-medium text-gray-600 tracking-tight">Recovery Channels</p>
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
                  'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200',
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

        {/* insights */}
        <div className="flex items-center justify-between mt-6 mb-2 px-3.5">
          <p className="text-[15px] font-medium text-gray-600 tracking-tight">Insights</p>
          <button className="text-gray-600 text-sm font-medium pr-1">
            +
          </button>
        </div>
        <nav className='px-1'>
          {INSIGHTS_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200',
                  active
                    ? 'bg-gray-100/70 text-gray-900 font-semibold'
                    : 'text-[#5C5C5B] hover:bg-gray-50/80 hover:text-gray-900'
                )}
              >
                <HugeiconsIcon
                  icon={Icon}
                  size={18}
                  className={active ? 'text-gray-400' : 'text-gray-400 group-hover:text-gray-600'}
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
    </aside>
  )
}
