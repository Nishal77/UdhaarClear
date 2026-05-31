'use client'

/**
 * DashboardClientShell
 * ---------------------
 * A lightweight client-side wrapper that lives inside the server
 * DashboardLayout. It mounts any global client-only providers
 * (toasts, modals, etc.) without forcing the whole layout into
 * "use client" territory.
 */

import { ActivityToast } from '@/components/shared/ActivityToast'

interface DashboardClientShellProps {
  children: React.ReactNode
}

export function DashboardClientShell({ children }: DashboardClientShellProps) {
  return (
    <>
      {children}
      <ActivityToast />
    </>
  )
}
