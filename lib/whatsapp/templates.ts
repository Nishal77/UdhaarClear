export const TEMPLATE_NAMES = {
  GENTLE: 'payment_reminder_gentle',
  FIRM: 'payment_reminder_firm',
  LEGAL: 'payment_reminder_legal',
  PAYMENT_CONFIRMED: 'payment_confirmed',
} as const

export type TemplateName = (typeof TEMPLATE_NAMES)[keyof typeof TEMPLATE_NAMES]

export interface TemplateComponent {
  type: 'body'
  parameters: Array<{ type: 'text'; text: string }>
}

export function buildGentleComponents(params: {
  customerName: string
  businessName: string
  invoiceNumber: string
  invoiceDate: string
  amount: string
  dueDate: string
  paymentLink: string
}): TemplateComponent[] {
  return [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.customerName },
        { type: 'text', text: params.businessName },
        { type: 'text', text: params.invoiceNumber },
        { type: 'text', text: params.invoiceDate },
        { type: 'text', text: params.amount },
        { type: 'text', text: params.dueDate },
        { type: 'text', text: params.paymentLink },
        { type: 'text', text: params.businessName },
      ],
    },
  ]
}

export function buildFirmComponents(params: {
  customerName: string
  invoiceNumber: string
  amount: string
  daysOverdue: string
  paymentLink: string
  businessPhone: string
  businessName: string
}): TemplateComponent[] {
  return [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.customerName },
        { type: 'text', text: params.invoiceNumber },
        { type: 'text', text: params.amount },
        { type: 'text', text: params.daysOverdue },
        { type: 'text', text: params.paymentLink },
        { type: 'text', text: params.businessPhone },
        { type: 'text', text: params.businessName },
      ],
    },
  ]
}

export function buildLegalComponents(params: {
  customerName: string
  invoiceNumber: string
  amount: string
  daysOverdue: string
  paymentLink: string
  businessName: string
}): TemplateComponent[] {
  return [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.customerName },
        { type: 'text', text: params.invoiceNumber },
        { type: 'text', text: params.amount },
        { type: 'text', text: params.daysOverdue },
        { type: 'text', text: params.paymentLink },
        { type: 'text', text: params.businessName },
      ],
    },
  ]
}

export function buildPaymentConfirmedComponents(params: {
  customerName: string
  amount: string
  invoiceNumber: string
  businessName: string
}): TemplateComponent[] {
  return [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.customerName },
        { type: 'text', text: params.amount },
        { type: 'text', text: params.invoiceNumber },
        { type: 'text', text: params.businessName },
      ],
    },
  ]
}
