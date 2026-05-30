import { describe, it, expect } from 'vitest'
import { customerSchema } from '@/lib/validations/customer'
import { invoiceSchema } from '@/lib/validations/invoice'

describe('customerSchema', () => {
  it('accepts valid customer', () => {
    const result = customerSchema.safeParse({
      name: 'Ramesh Traders',
      phone: '+919876543210',
      defaultTone: 'GENTLE',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid phone', () => {
    const result = customerSchema.safeParse({
      name: 'Ramesh Traders',
      phone: '1234567890',
    })
    expect(result.success).toBe(false)
  })

  it('accepts phone without country code', () => {
    const result = customerSchema.safeParse({
      name: 'Ramesh Traders',
      phone: '9876543210',
    })
    expect(result.success).toBe(true)
  })

  it('rejects name too short', () => {
    const result = customerSchema.safeParse({
      name: 'R',
      phone: '9876543210',
    })
    expect(result.success).toBe(false)
  })
})

describe('invoiceSchema', () => {
  it('accepts valid invoice', () => {
    const result = invoiceSchema.safeParse({
      customerId: 'clxxxxxxxx',
      amount: 50000,
      invoiceDate: new Date('2024-01-01'),
      dueDate: new Date('2024-01-31'),
      creditDays: 30,
    })
    expect(result.success).toBe(true)
  })

  it('rejects negative amount', () => {
    const result = invoiceSchema.safeParse({
      customerId: 'clxxxxxxxx',
      amount: -1000,
      invoiceDate: new Date(),
      dueDate: new Date(),
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing customerId', () => {
    const result = invoiceSchema.safeParse({
      amount: 5000,
      invoiceDate: new Date(),
      dueDate: new Date(),
    })
    expect(result.success).toBe(false)
  })
})
