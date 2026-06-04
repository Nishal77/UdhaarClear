'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import type { IconSvgElement } from '@hugeicons/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  // Main
  DashboardSquare01Icon,
  UserGroupIcon,
  InvoiceIcon,
  CheckListIcon,
  // Recovery Channels
  Megaphone02Icon,
  NotificationSquareIcon,
  Chart01Icon,
  CreditCardIcon,
  Settings02Icon,
  // Analytics
  Analytics01Icon,
  AnalyticsUpIcon,
  AiBrain01Icon,
  Calendar01Icon,
  // Team & Access
  UserMultipleIcon,
  Building02Icon,
  GlobeIcon,
  // Settings
  Plug01Icon,
  WebhookIcon,
  Settings01Icon,
  SchoolReportCardIcon,
} from '@hugeicons/core-free-icons'


// ─── Nav Sections ─────────────────────────────────────────────────────────────

interface NavItem {
  href: string
  label: string
  icon: IconSvgElement
  badge?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const MAIN_NAV: NavItem[] = [
  { href: '/dashboard',  label: 'Overview',         icon: DashboardSquare01Icon },
  { href: '/invoices',   label: 'Invoices',          icon: InvoiceIcon },
  { href: '/customers',  label: 'Customers',         icon: UserGroupIcon },
  { href: '/whatsapp-email-log',  label: 'Whatsapp & Email Logs',  icon: CheckListIcon },
]

const EXTRA_SECTIONS: NavSection[] = [
  {
    title: 'Recovery Channels',
    items: [
      { href: '/tone-engine',            label: 'AI Tone Engine',       icon: Megaphone02Icon },
      { href: '/legal-notices',          label: 'Legal Notices',        icon: NotificationSquareIcon },
      { href: '/autopilots',             label: 'MSME Samadhaan',       icon: Chart01Icon },
      { href: '/payments',               label: 'Payments',             icon: CreditCardIcon },
      { href: '/reminder-customisation', label: 'Customise Reminders',  icon: Settings02Icon },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { href: '/analytics/recovery',   label: 'Recovery Analytics',    icon: Analytics01Icon },
      { href: '/analytics/heatmap',    label: 'Aging Heatmap',         icon: AnalyticsUpIcon },
      { href: '/analytics/predictive', label: 'AI Predictive Insights', icon: AiBrain01Icon, badge: 'AI' },
      { href: '/analytics/digest',     label: 'Daily Digest',          icon: Calendar01Icon },
    ],
  },
  {
    title: 'Team & Access',
    items: [
      { href: '/team/members',  label: 'Team Members',  icon: UserMultipleIcon },
      { href: '/team/business', label: 'Multi Business', icon: Building02Icon },
      { href: '/team/whitelabel', label: 'White Label', icon: GlobeIcon },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/settings/integrations', label: 'Integrations',    icon: Plug01Icon },
      { href: '/settings/webhooks',     label: 'API & Webhooks',  icon: WebhookIcon },
      { href: '/settings',              label: 'Settings',        icon: Settings01Icon },
      { href: '/settings/profile',      label: 'Business Profile', icon: SchoolReportCardIcon },
    ],
  },
]

// ─── Shared nav link ──────────────────────────────────────────────────────────

interface SidebarProps {
  userName?: string
  userEmail?: string
  businessName?: string
}

function NavLink({ href, label, icon, badge, active }: NavItem & { active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-150',
        active
          ? 'bg-gray-100/70 text-gray-900'
          : 'text-[#5C5C5B] hover:bg-gray-50/80 hover:text-gray-900'
      )}
    >
      <HugeiconsIcon
        icon={icon}
        size={17}
        className={active ? 'text-[#FF6A39]' : 'text-gray-400 group-hover:text-gray-600'}
      />
      <span className="flex-1 truncate">{label}</span>

      {badge && (
        <span className="ml-auto shrink-0 rounded-md bg-violet-50 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-violet-600 ring-1 ring-inset ring-violet-200/60">
          {badge}
        </span>
      )}

      {active && !badge && (
        <svg
          className="ml-auto w-3 h-3 text-gray-400 shrink-0"
          fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  )
}

// Sidebar 

export function Sidebar({
  userName = 'User',
  userEmail = 'user@example.com',
  businessName = 'UdhaarClear',
}: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="relative flex h-full w-[260px] flex-col bg-white px-4 pt-[18px] pb-5 select-none shrink-0 overflow-hidden">

      {/* ── Logo (fixed, never scrolls) ── */}
      <div className="mb-5 px-3 shrink-0">
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

      {/* ── Scrollable nav body ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-0.5">

        {/* Main section */}
        <div className="mb-1 px-3.5">
          <p className="text-[14px] font-medium text-gray-900 tracking-tight">Main</p>
        </div>
        <nav className="space-y-0.5 px-1 mb-4">
          {MAIN_NAV.map(item => (
            <NavLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </nav>

        {/* Extra sections */}
        {EXTRA_SECTIONS.map(section => (
          <div key={section.title}>
            <div className="px-3.5 mb-1 mt-5">
              <p className="text-[14px] font-medium text-gray-900 tracking-tight">
                {section.title}
              </p>
            </div>
            <nav className="space-y-0.5 px-1 mb-1">
              {section.items.map(item => (
                <NavLink key={item.href} {...item} active={isActive(item.href)} />
              ))}
            </nav>
          </div>
        ))}

        {/* Bottom padding so last item isn't flush against the fade */}
        <div className="h-4" />
      </div>

      {/* ── Fade mask (scoped inside aside via relative parent) ── */}
      {/* <div
        className="pointer-events-none absolute bottom-[36px] left-0 right-0 h-8"
        style={{ background: 'linear-gradient(to top, white 60%, transparent)' }}
      /> */}
    </aside>
  )
}
