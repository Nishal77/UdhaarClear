export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 selection:bg-[#FF6A39]/30 selection:text-gray-900 antialiased">
      {children}
    </div>
  )
}
