import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'UdhaarClear — Automated Payment Recovery for Indian Businesses',
  description:
    'Stop chasing customers for payments. UdhaarClear automates WhatsApp reminders with UPI payment links for Indian MSMEs.',
  keywords: 'payment recovery, invoice reminders, WhatsApp, UPI, MSME, India',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full antialiased" suppressHydrationWarning>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
