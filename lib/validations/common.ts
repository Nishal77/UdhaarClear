import { z } from 'zod'

export const indianPhoneSchema = z
  .string()
  .regex(/^(\+91)?[6-9]\d{9}$/, 'Enter a valid Indian mobile number')

export const gstinSchema = z
  .string()
  .regex(
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    'Enter a valid GSTIN'
  )

export const emailSchema = z
  .string()
  .email('Enter a valid email')
  .optional()
  .or(z.literal(''))
