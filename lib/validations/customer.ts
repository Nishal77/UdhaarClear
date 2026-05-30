import { z } from 'zod'
import { indianPhoneSchema, gstinSchema, emailSchema } from './common'

export const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  contactName: z.string().max(100).optional(),
  phone: indianPhoneSchema,
  email: emailSchema,
  gstin: gstinSchema.optional().or(z.literal('')),
  address: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  defaultTone: z.enum(['GENTLE', 'FIRM', 'LEGAL']).default('GENTLE'),
  notes: z.string().max(500).optional(),
})

export type CustomerInput = z.infer<typeof customerSchema>
