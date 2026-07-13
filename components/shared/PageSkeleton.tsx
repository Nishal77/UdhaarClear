export function PageSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-xl bg-gray-200" />
          <div className="h-4 w-72 rounded-lg bg-gray-100" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-gray-200" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="h-4 w-20 rounded bg-gray-100 mb-3" />
            <div className="h-7 w-28 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Table rows */}
      <div className="rounded-[24px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-gray-200" />
              <div className="h-3 w-1/4 rounded bg-gray-100" />
            </div>
            <div className="h-6 w-20 rounded-full bg-gray-100" />
            <div className="h-8 w-24 rounded-xl bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  )
}
