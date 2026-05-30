'use client'

import { IconBell, IconPlus } from '@tabler/icons-react'
import Link from 'next/link'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <Link
          href="/invoices/new"
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          <IconPlus size={16} />
          Add Invoice
        </Link>
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <IconBell size={20} />
        </button>
      </div>
    </header>
  )
}
