import { z } from 'zod'

export const invoiceSchema = z.object({
  customerId: z.string().min(1, 'Select a customer'),
  invoiceNumber: z.string().max(50).optional(),
  amount: z.number().positive('Amount must be positive').max(99999999, 'Amount too large'),
  description: z.string().max(500).optional(),
  invoiceDate: z.date(),
  dueDate: z.date(),
  creditDays: z.number().int().min(0).max(365).default(30),
  reminderTone: z.enum(['GENTLE', 'FIRM', 'LEGAL']).default('GENTLE'),
  autoReminder: z.boolean().default(true),
})

export type InvoiceInput = z.infer<typeof invoiceSchema>
