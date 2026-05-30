'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  IconLayoutDashboard,
  IconUsers,
  IconFileInvoice,
  IconMessage,
  IconChartBar,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
  { href: '/customers', label: 'Customers', icon: IconUsers },
  { href: '/invoices', label: 'Invoices', icon: IconFileInvoice },
  { href: '/reminders', label: 'Reminders', icon: IconMessage },
  { href: '/reports', label: 'Reports', icon: IconChartBar },
  { href: '/settings', label: 'Settings', icon: IconSettings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white px-4 py-6">
      <div className="mb-8 px-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white font-bold text-sm">
            UC
          </div>
          <span className="text-lg font-bold text-gray-900">UdhaarClear</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 mt-2"
      >
        <IconLogout size={18} />
        Sign Out
      </button>
    </aside>
  )
}
