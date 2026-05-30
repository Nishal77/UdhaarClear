export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white font-bold">
          UC
        </div>
        <span className="text-2xl font-bold text-gray-900">UdhaarClear</span>
      </div>
      {children}
    </div>
  )
}
