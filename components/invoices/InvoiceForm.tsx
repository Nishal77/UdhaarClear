'use client'

import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { invoiceSchema, type InvoiceInput } from '@/lib/validations/invoice'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Customer } from '@prisma/client'
import { useEffect } from 'react'

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
    router.push(`/invoices/${result.invoice.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer *</label>
          <select
            {...register('customerId')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">Select customer...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.phone}
              </option>
            ))}
          </select>
          {errors.customerId && <p className="mt-1 text-xs text-red-600">{errors.customerId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
          <input
            {...register('invoiceNumber')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            placeholder="INV-2024-001 (auto if blank)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (₹) *</label>
          <input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            min="1"
            step="0.01"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="50000"
          />
          {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Credit Days</label>
          <input
            {...register('creditDays', { valueAsNumber: true })}
            type="number"
            min="0"
            max="365"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Invoice Date *</label>
          <Controller
            control={control}
            name="invoiceDate"
            render={({ field }) => (
              <input
                type="date"
                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            )}
          />
          {errors.invoiceDate && <p className="mt-1 text-xs text-red-600">{errors.invoiceDate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Due Date *</label>
          <Controller
            control={control}
            name="dueDate"
            render={({ field }) => (
              <input
                type="date"
                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            )}
          />
          {errors.dueDate && <p className="mt-1 text-xs text-red-600">{errors.dueDate.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          placeholder="Supply of goods / services description..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Reminder Tone</label>
        <select
          {...register('reminderTone')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
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
          className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
        />
        <label htmlFor="autoReminder" className="text-sm text-gray-700">
          Send automated WhatsApp reminders
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : invoiceId ? 'Save Changes' : 'Create Invoice'}
        </button>
      </div>
    </form>
  )
}
