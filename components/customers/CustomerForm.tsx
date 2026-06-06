'use client'

import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { customerSchema, type CustomerInput } from '@/lib/validations/customer'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { triggerActivityToast } from '@/components/shared/ActivityToast'

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
    defaultValues: {
      defaultTone: 'GENTLE',
      ...defaultValues,
      phone: defaultValues?.phone
        ? defaultValues.phone.replace(/^\+91/, '').replace(/^91(?=\d{10})/, '')
        : '',
    },
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
    triggerActivityToast({
      type: 'opened',
      customerName: data.name,
      detail: customerId ? 'Customer details updated' : 'New customer added'
    })
    router.push('/customers')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-[14px] font-semibold text-gray-800 tracking-tight">Business Name <span className="text-red-500 ml-0.5">*</span></label>
          <input
            {...register('name')}
            className="mt-1.5 block w-full bg-[#F8F8F7] hover:bg-[#F3F3F2] border border-[#EBEAE6] focus:border-[#FF6A39] rounded-xl px-4 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-all duration-200"
            placeholder="e.g., Acme Corporation"
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-gray-800 tracking-tight">Contact Person <span className="text-red-500 ml-0.5">*</span></label>
          <input
            {...register('contactName')}
            className="mt-1.5 block w-full bg-[#F8F8F7] hover:bg-[#F3F3F2] border border-[#EBEAE6] focus:border-[#FF6A39] rounded-xl px-4 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-all duration-200"
            placeholder="e.g., John Doe"
          />
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-gray-800 tracking-tight">WhatsApp Number <span className="text-red-500 ml-0.5">*</span></label>
          <div className="relative mt-1.5 flex rounded-xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <span className="text-[13px] flex items-center gap-1.5 text-gray-500 font-semibold select-none">
                <span className="text-[16px]">🇮🇳</span>
                <span>+91</span>
              </span>
              <div className="h-4 w-px bg-gray-300 ml-2.5" />
            </div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              {...register('phone', {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10)
                }
              })}
              className="block w-full bg-[#F8F8F7] hover:bg-[#F3F3F2] border border-[#EBEAE6] focus:border-[#FF6A39] rounded-xl pl-[76px] pr-4 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-all duration-200"
              placeholder="98765 43210"
            />
          </div>
          {errors.phone && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-gray-800 tracking-tight">Email</label>
          <input
            {...register('email')}
            type="email"
            className="mt-1.5 block w-full bg-[#F8F8F7] hover:bg-[#F3F3F2] border border-[#EBEAE6] focus:border-[#FF6A39] rounded-xl px-4 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-all duration-200"
            placeholder="ramesh@example.com"
          />
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-gray-800 tracking-tight">GSTIN (optional)</label>
          <input
            {...register('gstin')}
            className="mt-1.5 block w-full bg-[#F8F8F7] hover:bg-[#F3F3F2] border border-[#EBEAE6] focus:border-[#FF6A39] rounded-xl px-4 py-2.5 text-[13px] text-gray-800 font-mono placeholder-gray-400 focus:outline-none focus:bg-white transition-all duration-200"
            placeholder="29AABCU9603R1ZX"
          />
          {errors.gstin && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.gstin.message}</p>}
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-gray-800 tracking-tight">City</label>
          <input
            {...register('city')}
            className="mt-1.5 block w-full bg-[#F8F8F7] hover:bg-[#F3F3F2] border border-[#EBEAE6] focus:border-[#FF6A39] rounded-xl px-4 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-all duration-200"
            placeholder="e.g., Mangalore"
          />
        </div>
      </div>

      <div>
        <label className="block text-[14px] font-semibold text-gray-800 tracking-tight">Address</label>
        <textarea
          {...register('address')}
          rows={2}
          className="mt-1.5 block w-full bg-[#F8F8F7] hover:bg-[#F3F3F2] border border-[#EBEAE6] focus:border-[#FF6A39] rounded-xl px-4 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-all duration-200 resize-none"
          placeholder="e.g., Shop No. 14, MG Road, 3rd Phase..."
        />
      </div>

      <div>
        <label className="block text-[14px] font-semibold text-gray-800 tracking-tight">Default Reminder Tone</label>
        <select
          {...register('defaultTone')}
          className="mt-1.5 block w-full bg-[#F8F8F7] hover:bg-[#F3F3F2] border border-[#EBEAE6] focus:border-[#FF6A39] rounded-xl px-4 py-2.5 text-[13px] text-gray-800 focus:outline-none focus:bg-white transition-all duration-200"
        >
          <option value="GENTLE">Gentle — Friendly reminders</option>
          <option value="FIRM">Firm — Direct payment request</option>
          <option value="LEGAL">Legal — Final notice language</option>
        </select>
      </div>

      <div>
        <label className="block text-[14px] font-semibold text-gray-800 tracking-tight">Notes</label>
        <textarea
          {...register('notes')}
          rows={2}
          className="mt-1.5 block w-full bg-[#F8F8F7] hover:bg-[#F3F3F2] border border-[#EBEAE6] focus:border-[#FF6A39] rounded-xl px-4 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-all duration-200 resize-none"
          placeholder="e.g., Prefers payment via UPI."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-6 py-2.5 text-[13px] font-semibold text-gray-700 transition-all duration-200 select-none cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#FF6A39] hover:bg-[#E05B2E] disabled:opacity-50 px-6 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 select-none  cursor-pointer"
        >
          {isSubmitting ? 'Saving...' : customerId ? 'Save Changes' : 'Add Customer'}
        </button>
      </div>
    </form>
  )
}
