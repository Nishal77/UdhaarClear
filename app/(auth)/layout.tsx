import { LeftPanel } from '@/components/auth/LeftPanel'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <LeftPanel />
      {/* Right panel takes remaining width, each page fills it fully */}
      <div className="flex flex-1 flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}
