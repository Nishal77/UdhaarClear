'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  IconLayoutDashboard,
  IconUsers,
  IconFileInvoice,
  IconMessage,
  IconSettings,
} from '@tabler/icons-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: IconLayoutDashboard },
  { href: '/customers', label: 'Customers', icon: IconUsers },
  { href: '/invoices', label: 'Invoices', icon: IconFileInvoice },
  { href: '/reminders', label: 'Reminders', icon: IconMessage },
  { href: '/settings', label: 'Settings', icon: IconSettings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-gray-200 bg-white md:hidden">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium',
              active ? 'text-brand-500' : 'text-gray-500'
            )}
          >
            <Icon size={20} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
