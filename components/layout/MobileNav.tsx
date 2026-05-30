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
  Settings01Icon,
} from '@hugeicons/core-free-icons'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: DashboardSquare01Icon },
  { href: '/customers', label: 'Customers', icon: UserGroupIcon },
  { href: '/invoices', label: 'Invoices', icon: InvoiceIcon },
  { href: '/reminders', label: 'Reminders', icon: WhatsappIcon },
  { href: '/settings', label: 'Settings', icon: Settings01Icon },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-gray-200 bg-white md:hidden select-none pb-safe">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors duration-150',
              active ? 'text-black font-semibold' : 'text-gray-500 hover:text-gray-800'
            )}
          >
            <HugeiconsIcon icon={Icon} size={20} className={active ? 'text-black' : 'text-gray-400'} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
