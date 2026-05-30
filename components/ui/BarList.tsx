"use client"

import React from "react"
import { cx } from "@/lib/utils/cn"

export const focusRing = "focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/50 focus:ring-offset-2 transition-all"

export type Bar<T> = T & {
  key?: string
  href?: string
  value: number
  name: string
  colorClass?: string // Allow custom premium colors per row
  formattedValue?: string // Pre-formatted string to avoid serializing functions from Server Components
}

export interface BarListProps<T = unknown>
  extends React.HTMLAttributes<HTMLDivElement> {
  data: Bar<T>[]
  valueFormatter?: (value: number) => string
  showAnimation?: boolean
  onValueChange?: (payload: Bar<T>) => void
  sortOrder?: "ascending" | "descending" | "none"
}

function BarListInner<T>(
  {
    data = [],
    valueFormatter = (value) => value.toLocaleString(),
    showAnimation = true,
    onValueChange,
    sortOrder = "descending",
    className,
    ...props
  }: BarListProps<T>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const Component = onValueChange ? "button" : "div"
  const sortedData = React.useMemo(() => {
    if (sortOrder === "none") {
      return data
    }
    return [...data].sort((a, b) => {
      return sortOrder === "ascending" ? a.value - b.value : b.value - a.value
    })
  }, [data, sortOrder])

  const widths = React.useMemo(() => {
    const maxValue = Math.max(...sortedData.map((item) => item.value), 0)
    return sortedData.map((item) =>
      item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, 2),
    )
  }, [sortedData])

  const rowHeight = "h-9" // Slightly taller for more premium breathing room

  return (
    <div
      ref={forwardedRef}
      className={cx("flex justify-between space-x-6 w-full", className)}
      aria-sort={sortOrder}
      tremor-id="tremor-raw"
      {...props}
    >
      <div className="relative w-full space-y-2">
        {sortedData.map((item, index) => (
          <Component
            key={item.key ?? item.name}
            onClick={() => {
              onValueChange?.(item)
            }}
            className={cx(
              "group w-full rounded-xl transition-all relative block focus:outline-none",
              onValueChange ? "cursor-pointer hover:bg-gray-50/50" : ""
            )}
          >
            {/* Background pill track */}
            <div className="w-full bg-gray-50/50 border border-gray-100/30 rounded-xl overflow-hidden relative">
              <div
                className={cx(
                  "flex items-center rounded-xl transition-all duration-1000 ease-out",
                  rowHeight,
                  // Default elegant gradient color
                  item.colorClass ?? "bg-gradient-to-r from-blue-500/5 to-blue-500/15",
                  onValueChange ? "group-hover:opacity-90" : "",
                  {
                    "mb-0": index === sortedData.length - 1,
                  }
                )}
                style={{ width: `${widths[index]}%` }}
              />

              {/* Text overlays - perfectly absolute so text is never clipped by the bar width! */}
              <div className="absolute inset-0 flex items-center px-3.5 pointer-events-none">
                {item.href ? (
                  <a
                    href={item.href}
                    className={cx(
                      "truncate whitespace-nowrap rounded-sm text-[13px] font-bold text-gray-800 pointer-events-auto hover:underline hover:underline-offset-2",
                      focusRing
                    )}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {item.name}
                  </a>
                ) : (
                  <p className="truncate whitespace-nowrap text-[13px] font-bold text-gray-800">
                    {item.name}
                  </p>
                )}
              </div>
            </div>
          </Component>
        ))}
      </div>
      <div className="space-y-2">
        {sortedData.map((item, index) => (
          <div
            key={item.key ?? item.name}
            className={cx(
              "flex items-center justify-end",
              rowHeight,
              index === sortedData.length - 1 ? "mb-0" : "mb-2"
            )}
          >
            <p className="truncate whitespace-nowrap text-[13px] font-extrabold text-gray-900 tabular-nums">
              {item.formattedValue ?? valueFormatter(item.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

BarListInner.displayName = "BarList"

const BarList = React.forwardRef(BarListInner) as <T>(
  p: BarListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof BarListInner>

export { BarList }
