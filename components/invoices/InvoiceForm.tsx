'use client'

import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { invoiceSchema, type InvoiceInput } from '@/lib/validations/invoice'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Customer } from '@prisma/client'
import { useEffect } from 'react'
import { triggerActivityToast } from '@/components/shared/ActivityToast'
import { formatINRCompact } from '@/lib/utils/currency'

interface InvoiceFormProps {
  customers: Customer[]
  defaultValues?: Partial<Omit<InvoiceInput, 'invoiceDate' | 'dueDate'> & {
    invoiceDate?: string
    dueDate?: string
  }>
  invoiceId?: string
}

export function InvoiceForm({ customers, defaultValues, invoiceId }: InvoiceFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(invoiceSchema) as any,
    defaultValues: {
      amount: 0,
      creditDays: 30,
      reminderTone: 'GENTLE',
      autoReminder: true,
      ...defaultValues,
      invoiceDate: defaultValues?.invoiceDate ? new Date(defaultValues.invoiceDate) : new Date(),
      dueDate: defaultValues?.dueDate ? new Date(defaultValues.dueDate) : undefined,
    },
  })

  const invoiceDate = watch('invoiceDate')
  const creditDays = watch('creditDays')

  useEffect(() => {
    if (invoiceDate && creditDays && !invoiceId) {
      const due = new Date(invoiceDate)
      due.setDate(due.getDate() + creditDays)
      setValue('dueDate', due)
    }
  }, [invoiceDate, creditDays, setValue, invoiceId])

  const onSubmit: SubmitHandler<InvoiceInput> = async (data) => {
    const url = invoiceId ? `/api/invoices/${invoiceId}` : '/api/invoices'
    const method = invoiceId ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = await res.json()
      if (res.status === 402) {
        toast.error('Plan limit reached. Upgrade to add more invoices.')
        return
      }
      toast.error(err.message ?? 'Failed to save invoice')
      return
    }

    const result = await res.json()
    toast.success(invoiceId ? 'Invoice updated' : 'Invoice created')
    
    const selectedCustomer = customers.find(c => c.id === data.customerId)?.name || 'Customer'
    triggerActivityToast({
      type: 'payment',
      customerName: selectedCustomer,
      amount: formatINRCompact(Number(data.amount)),
      detail: invoiceId 
        ? `Invoice #${result.invoice.invoiceNumber || data.invoiceNumber || ''} updated` 
        : `Invoice #${result.invoice.invoiceNumber || data.invoiceNumber || ''} created`
    })

    router.push(`/invoices/${result.invoice.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-[14px] font-semibold text-gray-800 mb-1.5">Customer <span className="text-red-500 ml-0.5">*</span></label>
          <select
            {...register('customerId')}
            className="h-11 block w-full rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all cursor-pointer"
          >
            <option value="">Select customer...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.phone}
              </option>
            ))}
          </select>
          {errors.customerId && <p className="mt-1.5 text-xs text-red-650 font-medium">{errors.customerId.message}</p>}
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-gray-800 mb-1.5">Invoice Number</label>
          <input
            {...register('invoiceNumber')}
            className="h-11 block w-full rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all"
            placeholder="INV-2024-001 (auto if blank)"
          />
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-gray-800 mb-1.5">Amount (₹) <span className="text-red-500 ml-0.5">*</span></label>
          <Controller
            control={control}
            name="amount"
            render={({ field: { value, onChange, ...rest } }) => {
              const displayValue = value !== undefined && value !== null && !isNaN(Number(value))
                ? new Intl.NumberFormat('en-IN').format(Number(value))
                : ''

              return (
                <div className="relative flex rounded-xl w-full">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 font-medium text-[14px]">
                    ₹
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={displayValue}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '')
                      onChange(clean ? parseInt(clean, 10) : 0)
                    }}
                    className="h-11 block w-full rounded-xl border border-gray-200 bg-white pl-8 pr-4 text-[14px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all font-semibold"
                    placeholder="50,000"
                    {...rest}
                  />
                </div>
              )
            }}
          />
          {errors.amount && <p className="mt-1.5 text-xs text-red-655 font-medium">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-gray-800 mb-1.5">Credit Days</label>
          <input
            {...register('creditDays', { valueAsNumber: true })}
            type="number"
            min="0"
            max="365"
            className="h-11 block w-full rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-gray-800 mb-1.5">Invoice Date <span className="text-red-500 ml-0.5">*</span></label>
          <Controller
            control={control}
            name="invoiceDate"
            render={({ field }) => (
              <input
                type="date"
                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                className="h-11 block w-full rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all cursor-pointer"
              />
            )}
          />
          {errors.invoiceDate && <p className="mt-1.5 text-xs text-red-655 font-medium">{errors.invoiceDate.message}</p>}
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-gray-800 mb-1.5">Due Date <span className="text-red-500 ml-0.5">*</span></label>
          <Controller
            control={control}
            name="dueDate"
            render={({ field }) => (
              <input
                type="date"
                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                className="h-11 block w-full rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all cursor-pointer"
              />
            )}
          />
          {errors.dueDate && <p className="mt-1.5 text-xs text-red-655 font-medium">{errors.dueDate.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-[14px] font-semibold text-gray-800 mb-1.5">Description (Optional)</label>
        <textarea
          {...register('description')}
          rows={3}
          className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 placeholder-gray-400 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all resize-none"
          placeholder="Supply of goods / services description..."
        />
      </div>

      <div>
        <label className="block text-[14px] font-semibold text-gray-800 mb-1.5">Reminder Tone</label>
        <select
          {...register('reminderTone')}
          className="h-11 block w-full rounded-xl border border-gray-200 bg-white px-4 text-[14px] text-gray-900 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all cursor-pointer"
        >
          <option value="GENTLE">Gentle — Friendly reminders (recommended)</option>
          <option value="FIRM">Firm — Direct payment request</option>
          <option value="LEGAL">Legal — Final notice language</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input
          {...register('autoReminder')}
          id="autoReminder"
          type="checkbox"
          className="h-5 w-5 rounded-lg border-gray-200 text-[#FF6A39] focus:ring-[#FF6A39] focus:ring-offset-0 transition-all cursor-pointer accent-[#FF6A39]"
        />
        <label htmlFor="autoReminder" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
          Send automated WhatsApp reminders
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-11 px-6 rounded-xl border border-gray-200 text-[13.5px] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 px-6 rounded-xl bg-[#FF6A39] hover:bg-[#E05B2E] text-white text-[13.5px] font-semibold transition-all disabled:opacity-40 cursor-pointer shadow-sm border-0"
        >
          {isSubmitting ? 'Saving...' : invoiceId ? 'Save Changes' : 'Create Invoice'}
        </button>
      </div>
    </form>
  )
}
