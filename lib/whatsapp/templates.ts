export const TEMPLATE_NAMES = {
  GENTLE:           'payment_reminder_gentle',
  FIRM:             'payment_reminder_firm',
  LEGAL_28:         'payment_reminder_legal_28',   // 7-day window — formal demand
  LEGAL_35:         'payment_reminder_legal_35',   // 48-hour ultimatum
  LEGAL_42:         'payment_reminder_legal_42',   // proceedings initiated
  PAYMENT_CONFIRMED:'payment_confirmed',
} as const

export type TemplateName = (typeof TEMPLATE_NAMES)[keyof typeof TEMPLATE_NAMES]

export interface TemplateComponent {
  type: 'body'
  parameters: Array<{ type: 'text'; text: string }>
}

/** Pick the right legal template name based on the exact overdue day. */
export function getLegalTemplateName(daysOverdue: number): string {
  if (daysOverdue <= 28) return TEMPLATE_NAMES.LEGAL_28
  if (daysOverdue <= 35) return TEMPLATE_NAMES.LEGAL_35
  return TEMPLATE_NAMES.LEGAL_42
}

// ─── GENTLE ─────────────────────────────────────────────────────────────────
// Template body (pre-approved by Meta):
// Hi {{1}}, your invoice {{2}} from {{3}} for {{4}} is due on {{5}}.
// Pay here: {{6}}

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
        { type: 'text', text: params.invoiceNumber },
        { type: 'text', text: params.businessName },
        { type: 'text', text: params.amount },
        { type: 'text', text: params.dueDate },
        { type: 'text', text: params.paymentLink },
      ],
    },
  ]
}

// ─── FIRM ────────────────────────────────────────────────────────────────────
// Template body:
// Dear {{1}}, invoice {{2}} from {{3}} for {{4}} is {{5}} days overdue.
// Please pay by {{6}}: {{7}}

export function buildFirmComponents(params: {
  customerName: string
  invoiceNumber: string
  amount: string
  daysOverdue: string
  deadlineDate: string
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
        { type: 'text', text: params.businessName },
        { type: 'text', text: params.amount },
        { type: 'text', text: params.daysOverdue },
        { type: 'text', text: params.deadlineDate },
        { type: 'text', text: params.paymentLink },
      ],
    },
  ]
}

// ─── LEGAL — Day +28 ─────────────────────────────────────────────────────────
// Template body:
// ⚠️ Dear {{1}}, a formal legal demand notice has been sent to your email.
//
// Invoice {{2}} from {{3}} for {{4}} is now 28 days overdue.
//
// You have 7 days to pay before we file with the MSME Facilitation Council.
// Consequences: permanent non-payment record, CIBIL credit impact, compound
// interest at 3× RBI rate.
//
// Pay now: {{5}}
// Ref: {{6}}

export function buildLegal28Components(params: {
  customerName: string
  invoiceNumber: string
  businessName: string
  amount: string
  paymentLink: string
  legalRefNo: string
}): TemplateComponent[] {
  return [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.customerName },
        { type: 'text', text: params.invoiceNumber },
        { type: 'text', text: params.businessName },
        { type: 'text', text: params.amount },
        { type: 'text', text: params.paymentLink },
        { type: 'text', text: params.legalRefNo },
      ],
    },
  ]
}

// ─── LEGAL — Day +35 ─────────────────────────────────────────────────────────
// Template body:
// 🚨 Dear {{1}}, your 48-hour window is now running.
//
// Invoice {{2}} for {{3}} is 35 days overdue. Once we file with the MSME
// Facilitation Council, this cannot be reversed — CIBIL impact and legal
// costs will be added to your outstanding liability.
//
// This is your last chance to avoid legal action.
//
// Pay immediately: {{4}}

export function buildLegal35Components(params: {
  customerName: string
  invoiceNumber: string
  amount: string
  paymentLink: string
}): TemplateComponent[] {
  return [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.customerName },
        { type: 'text', text: params.invoiceNumber },
        { type: 'text', text: params.amount },
        { type: 'text', text: params.paymentLink },
      ],
    },
  ]
}

// ─── LEGAL — Day +42 ─────────────────────────────────────────────────────────
// Template body:
// 🔴 Dear {{1}}, formal legal proceedings have been initiated for non-payment
// of {{2}} (Invoice {{3}}).
//
// You will not receive further automated reminders. The matter is now with
// our legal team.
//
// To halt proceedings, pay immediately and share your UTR with {{4}}.
// Ref: {{5}}

export function buildLegal42Components(params: {
  customerName: string
  amount: string
  invoiceNumber: string
  businessPhone: string
  legalRefNo: string
}): TemplateComponent[] {
  return [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.customerName },
        { type: 'text', text: params.amount },
        { type: 'text', text: params.invoiceNumber },
        { type: 'text', text: params.businessPhone },
        { type: 'text', text: params.legalRefNo },
      ],
    },
  ]
}

// ─── PAYMENT CONFIRMED ───────────────────────────────────────────────────────

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
