'use client'

import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { customerSchema, type CustomerInput } from '@/lib/validations/customer'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface CustomerFormProps {
  defaultValues?: Partial<CustomerInput>
  customerId?: string
}

export function CustomerForm({ defaultValues, customerId }: CustomerFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(customerSchema) as any,
    defaultValues: { defaultTone: 'GENTLE', ...defaultValues },
  })

  const onSubmit: SubmitHandler<CustomerInput> = async (data) => {
    const url = customerId ? `/api/customers/${customerId}` : '/api/customers'
    const method = customerId ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = await res.json()
      if (res.status === 402) {
        toast.error('Plan limit reached. Upgrade to add more customers.')
        return
      }
      toast.error(err.message ?? 'Failed to save customer')
      return
    }

    toast.success(customerId ? 'Customer updated' : 'Customer added')
    router.push('/customers')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Name *</label>
          <input
            {...register('name')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Ramesh Traders"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Person</label>
          <input
            {...register('contactName')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            placeholder="Ramesh Gupta"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">WhatsApp Number *</label>
          <input
            {...register('phone')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="+91 98765 43210"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...register('email')}
            type="email"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            placeholder="ramesh@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">GSTIN</label>
          <input
            {...register('gstin')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:border-brand-500 focus:outline-none"
            placeholder="29AABCU9603R1ZX"
          />
          {errors.gstin && <p className="mt-1 text-xs text-red-600">{errors.gstin.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            {...register('city')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            placeholder="Mumbai"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          {...register('address')}
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          placeholder="Shop 12, MG Road..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Default Reminder Tone</label>
        <select
          {...register('defaultTone')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="GENTLE">Gentle — Friendly reminders</option>
          <option value="FIRM">Firm — Direct payment request</option>
          <option value="LEGAL">Legal — Final notice language</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Private Notes</label>
        <textarea
          {...register('notes')}
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          placeholder="Notes about this customer (not shared)"
        />
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
          {isSubmitting ? 'Saving...' : customerId ? 'Save Changes' : 'Add Customer'}
        </button>
      </div>
    </form>
  )
}
