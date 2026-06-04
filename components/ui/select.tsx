import * as React from "react"
import { cn } from "@/lib/utils/cn"
import { ChevronDown, Check } from "lucide-react"

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  items: Record<string, string>
  registerItem: (value: string, label: string) => void
} | null>(null)

export function Select({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<Record<string, string>>({})
  
  const registerItem = React.useCallback((val: string, label: string) => {
    setItems(prev => {
      if (prev[val] === label) return prev
      return { ...prev, [val]: label }
    })
  }, [])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, items, registerItem }}>
      <div className="relative inline-block text-left w-full sm:w-auto">{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectTrigger must be used within Select")
  
  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-lg border border-[#EBEAE6] bg-white px-3 py-2 text-xs font-bold text-gray-800 shadow-3xs hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#FF6A39] disabled:cursor-not-allowed disabled:opacity-50 gap-2",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-3.5 w-3.5 opacity-50" />
    </button>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectValue must be used within Select")
  
  const selectedLabel = context.value ? context.items[context.value] : undefined
  return <span>{selectedLabel || placeholder}</span>
}

export function SelectContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectContent must be used within Select")
  const { setOpen, open } = context
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const container = ref.current?.parentElement
      if (container && !container.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 mt-1.5 z-50 min-w-[140px] overflow-hidden rounded-xl border border-[#EBEAE6] bg-white p-1 text-gray-950 shadow-md animate-fade-up",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SelectItem({
  className,
  children,
  value,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectItem must be used within Select")
  const { registerItem, value: contextValue, onValueChange, setOpen } = context

  const isSelected = contextValue === value

  const label = typeof children === "string" ? children : value
  React.useEffect(() => {
    registerItem(value, label)
  }, [value, label, registerItem])

  return (
    <div
      onClick={() => {
        onValueChange?.(value)
        setOpen(false)
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-1.5 pl-2 pr-8 text-xs font-semibold text-gray-700 outline-none hover:bg-gray-100 hover:text-gray-900 transition-colors",
        isSelected && "bg-gray-50 text-gray-900 font-bold",
        className
      )}
      {...props}
    >
      {isSelected && (
        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-3 w-3 text-[#FF6A39]" />
        </span>
      )}
      {children}
    </div>
  )
}
