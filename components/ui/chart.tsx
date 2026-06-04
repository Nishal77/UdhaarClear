import * as React from "react"
import { ResponsiveContainer, Tooltip, Legend } from "recharts"
import { cn } from "@/lib/utils/cn"

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
    theme?: Record<string, string>
  }
}

const ChartContext = React.createContext<{
  config: ChartConfig
} | null>(null)

export function ChartContainer({
  id,
  config,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig
  children: React.ReactNode
}) {
  const chartId = React.useId()
  const idToUse = id || `chart-${chartId}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        id={idToUse}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-grid-horizontal_line]:stroke-gray-200/50 [&_.recharts-cartesian-grid-vertical_line]:stroke-gray-200/50 [&_.recharts-dot]:stroke-background [&_.recharts-active-dot]:stroke-background [&_.recharts-label]:fill-foreground [&_.recharts-reference-line-line]:stroke-border [&_.recharts-sector]:stroke-background [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #${idToUse} {
                ${Object.entries(config)
                  .map(([key, value]) => {
                    if (!value.color) return ""
                    return `--color-${key}: ${value.color};`
                  })
                  .join("\n")}
              }
            `,
          }}
        />
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

export const ChartTooltip = Tooltip

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  any
>(
  (
    {
      active,
      payload,
      label,
      labelFormatter,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const context = React.useContext(ChartContext)
    if (!context) return null

    if (!active || !payload?.length) {
      return null
    }

    const config = context.config

    return (
      <div
        ref={ref}
        className="grid min-w-[8rem] items-start gap-1.5 rounded-xl border border-[#EBEAE6] bg-white px-2.5 py-1.5 text-xs shadow-md"
      >
        {!hideLabel && (
          <div className="font-bold text-gray-900">
            {labelFormatter ? labelFormatter(label) : label}
          </div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item: any) => {
            const key = item.name || item.dataKey || ""
            const itemConfig = config[key]
            const name = itemConfig?.label || key
            const color = itemConfig?.color || item.color || item.payload.color

            return (
              <div key={String(key)} className="flex items-center gap-2">
                {!hideIndicator && (
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      indicator === "dot" && "rounded-full",
                      indicator === "line" && "w-1 h-3 rounded-sm"
                    )}
                    style={{ backgroundColor: color }}
                  />
                )}
                <span className="text-gray-500 font-semibold">{name}:</span>
                <span className="ml-auto font-bold text-gray-900 font-mono">
                  {typeof item.value === "number"
                    ? `₹${(item.value).toLocaleString("en-IN")}`
                    : item.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export const ChartLegend = Legend

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload?: any[]
    verticalAlign?: "top" | "bottom"
  }
>(({ className, payload, verticalAlign = "bottom", ...props }, ref) => {
  const context = React.useContext(ChartContext)
  if (!context) return null

  const config = context.config

  if (!payload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap items-center justify-center gap-4 pt-2 text-xs",
        className
      )}
      {...props}
    >
      {payload.map((item: any) => {
        const key = item.value
        const itemConfig = config[key]
        const name = itemConfig?.label || key
        const color = itemConfig?.color || item.color

        return (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-gray-600 font-bold">{name}</span>
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegendContent"
