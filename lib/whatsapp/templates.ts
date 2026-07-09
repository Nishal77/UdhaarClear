// Names below are the ACTUAL names registered in Meta WhatsApp Manager
// (confirmed 2026-07-05) — several got a _v2/_v3 suffix because Meta
// enforces a ~4-week cooldown on reusing a name+language combo after a
// prior version of that template was deleted. Do not rename these without
// also resubmitting to Meta — see docs/waba-template-submission.md.
export const TEMPLATE_NAMES = {
  GENTLE:           'invoice_update_alert_v3',
  FIRM:             'payment_reminder_firm_v2',
  LEGAL_WARNING:    'payment_reminder_legal_warning_v2', // Day 22-27 — MSMED Act warning, still automated
  LEGAL_28:         'payment_reminder_legal_28_v2',   // Day 28 — owner-approved formal demand, 7-day window
  LEGAL_35:         'payment_reminder_legal_35_v2',   // 48-hour ultimatum
  LEGAL_42:         'payment_reminder_legal_42_v2',   // proceedings initiated
  PAYMENT_CONFIRMED:'payment_confirmed',
  CA_OTP:           'ca_partner_otp',              // AUTHENTICATION category — see docs/waba-template-submission.md — pending, confirm with user once submitted
} as const

export type TemplateName = (typeof TEMPLATE_NAMES)[keyof typeof TEMPLATE_NAMES]

/**
 * WhatsApp template language code. MUST exactly match the language each
 * template is registered under in Meta WhatsApp Manager — a mismatch (e.g.
 * sending "en" when Meta has "en_US") makes Meta reject the message even
 * though the template is approved, and it fails silently at send time.
 *
 * Configurable via WHATSAPP_TEMPLATE_LANG so it can be corrected to whatever
 * Meta actually shows without a code change. Defaults to "en".
 */
export const TEMPLATE_LANGUAGE_CODE = process.env.WHATSAPP_TEMPLATE_LANG || 'en'


export interface TemplateComponent {
  type: 'body' | 'button' | 'header'
  sub_type?: 'url'
  index?: number
  parameters: Array<{ type: 'text'; text: string }>
}

// ── Shared component helpers ────────────────────────────────────────────────
// Every reminder + confirmation template registered in Meta shares the same
// outer shape: a TEXT header "... — {{1}}" whose one param is the business
// name, and a single dynamic URL button whose one param is the invoice id
// (button URL is https://udhaarclear.in/pay/{{1}}). These helpers keep that
// shape in one place so a builder can't drift from the registered template.

/** Header param — the business name shown after the "— " in every header. */
function headerBusinessName(businessName: string): TemplateComponent {
  return { type: 'header', parameters: [{ type: 'text', text: businessName }] }
}

/** The single dynamic URL button — its variable is the invoice id suffix. */
function payButton(invoiceId: string): TemplateComponent {
  return { type: 'button', sub_type: 'url', index: 0, parameters: [{ type: 'text', text: invoiceId }] }
}


/** Pick the right legal template name based on the exact overdue day. */
export function getLegalTemplateName(daysOverdue: number): string {
  if (daysOverdue < 35) return TEMPLATE_NAMES.LEGAL_28
  if (daysOverdue < 42) return TEMPLATE_NAMES.LEGAL_35
  return TEMPLATE_NAMES.LEGAL_42
}

// ─── GENTLE ─────────────────────────────────────────────────────────────────
// Template: invoice_update_alert (register under UTILITY category — this is
// a transactional payment notice, not marketing; see docs/waba-template-submission.md)
//
// Body must use NUMBERED placeholders ({{1}}, {{2}}...), matching the plain
// positional params this function sends — named placeholders like
// {{customer_name}} require a `parameter_name` field per param that this
// code does not send, and Meta will reject the message if the registered
// template expects named params.
//
// Body: Hi {{1}}, this is a payment notification from {{2}} regarding invoice #{{3}}.
//       Amount Due: {{4}}
//       Due Date: {{5}}
// Button: dynamic Pay Now CTA linking to https://udhaarclear.in/pay/{{1}} (button param)

export function buildGentleComponents(params: {
  customerName: string
  businessName: string
  invoiceNumber: string
  invoiceDate: string
  amount: string
  dueDate: string
  invoiceId: string
}): TemplateComponent[] {
  return [
    {
      type: 'header',
      parameters: [
        { type: 'text', text: params.businessName },
      ],
    },
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.customerName },
        { type: 'text', text: params.invoiceNumber },
        { type: 'text', text: params.amount },
        { type: 'text', text: params.dueDate },
      ],
    },
  ]
}

// ─── FIRM ────────────────────────────────────────────────────────────────────
// Template body (PRD 6.1.2 Phase 2, Day 8-21 — "mentions overdue days,
// references late fee policy if set, more direct language"). There's no
// lateFee field on Invoice/Business yet (PRD 6.1.3's late-fee auto-calc was
// never built), so this stays a generic policy reference rather than a
// numeric placeholder that doesn't exist:
//
// Dear {{1}}, invoice {{2}} from {{3}} for {{4}} is {{5}} days overdue.
// A late fee may apply as per our payment terms. Please pay by {{6}} to
// avoid further action: {{7}}

export function buildFirmComponents(params: {
  customerName: string
  invoiceNumber: string
  amount: string
  daysOverdue: string
  deadlineDate: string
  businessName: string
  invoiceId: string
}): TemplateComponent[] {
  // Registered payment_reminder_firm_v2:
  //   HEADER "Payment Reminder — {{1}}"        → businessName
  //   BODY   {{1}}name {{2}}invoice {{3}}amount {{4}}daysOverdue {{5}}deadline
  //   BUTTON URL https://udhaarclear.in/pay/{{1}} → invoiceId
  return [
    headerBusinessName(params.businessName),
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.customerName },
        { type: 'text', text: params.invoiceNumber },
        { type: 'text', text: params.amount },
        { type: 'text', text: params.daysOverdue },
        { type: 'text', text: params.deadlineDate },
      ],
    },
    payButton(params.invoiceId),
  ]
}

// ─── LEGAL WARNING — Day 22-27 ───────────────────────────────────────────────
// Template body (PRD 6.1.2 Phase 3 — "legal warning tone, references MSMED
// Act 45-day rule, signals formal action is coming, stern"). Still fully
// automated — the human gate only kicks in at Day 28 (see
// lib/cron/reminder-engine.ts). This is the message that comes right before
// that gate, so it warns without yet naming a filed legal notice.
//
// ⚠️ Dear {{1}}, invoice {{2}} from {{3}} for {{4}} is now {{5}} days
// overdue. Under the MSMED Act, payment is due within 45 days of delivery.
// Please clear this immediately to avoid formal action: {{6}}

export function buildLegalWarningComponents(params: {
  customerName: string
  invoiceNumber: string
  amount: string
  daysOverdue: string
  businessName: string
  invoiceId: string
}): TemplateComponent[] {
  // Registered payment_reminder_legal_warning_v2:
  //   HEADER "Important: Payment Notice — {{1}}" → businessName
  //   BODY   {{1}}name {{2}}invoice {{3}}amount {{4}}daysOverdue
  //   BUTTON URL → invoiceId
  return [
    headerBusinessName(params.businessName),
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.customerName },
        { type: 'text', text: params.invoiceNumber },
        { type: 'text', text: params.amount },
        { type: 'text', text: params.daysOverdue },
      ],
    },
    payButton(params.invoiceId),
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
  amount: string
  legalRefNo: string
  businessName: string
  invoiceId: string
}): TemplateComponent[] {
  // Registered payment_reminder_legal_28_v2:
  //   HEADER "Formal Notice — {{1}}" → businessName
  //   BODY   {{1}}name {{2}}invoice {{3}}amount {{4}}legalRef
  //   BUTTON URL → invoiceId
  return [
    headerBusinessName(params.businessName),
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.customerName },
        { type: 'text', text: params.invoiceNumber },
        { type: 'text', text: params.amount },
        { type: 'text', text: params.legalRefNo },
      ],
    },
    payButton(params.invoiceId),
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
  businessName: string
  invoiceId: string
}): TemplateComponent[] {
  // Registered payment_reminder_legal_35_v2:
  //   HEADER "Formal Notice — {{1}}" → businessName
  //   BODY   {{1}}name {{2}}invoice {{3}}amount
  //   BUTTON URL → invoiceId
  return [
    headerBusinessName(params.businessName),
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.customerName },
        { type: 'text', text: params.invoiceNumber },
        { type: 'text', text: params.amount },
      ],
    },
    payButton(params.invoiceId),
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
  businessName: string
  invoiceId: string
}): TemplateComponent[] {
  // Registered payment_reminder_legal_42_v2:
  //   HEADER "Formal Notice — {{1}}" → businessName
  //   BODY   {{1}}name {{2}}amount {{3}}invoice {{4}}businessPhone {{5}}legalRef
  //   BUTTON URL → invoiceId
  return [
    headerBusinessName(params.businessName),
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
    payButton(params.invoiceId),
  ]
}

// ─── PAYMENT CONFIRMED ───────────────────────────────────────────────────────

export function buildPaymentConfirmedComponents(params: {
  customerName: string
  amount: string
  invoiceNumber: string
  businessName: string
  invoiceId: string
}): TemplateComponent[] {
  // Registered payment_confirmed:
  //   HEADER "Payment Confirmed — {{1}}" → businessName
  //   BODY   {{1}}name {{2}}amount {{3}}invoice
  //   BUTTON URL "View Receipt" → base https://udhaarclear.in/pay/{{1}},
  //          sample suffix "abc123/confirm" → links to the /pay/[id]/confirm page
  return [
    headerBusinessName(params.businessName),
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.customerName },
        { type: 'text', text: params.amount },
        { type: 'text', text: params.invoiceNumber },
      ],
    },
    payButton(`${params.invoiceId}/confirm`),
  ]
}

// ─── CA PARTNER OTP ──────────────────────────────────────────────────────────
// Template: ca_partner_otp (register under AUTHENTICATION category)
// Body: {{1}} is your UdhaarClear CA partner verification code. Valid for 10 minutes.
//
// This is a CA's very first message from the business's WABA number, so a
// free-form text message (sendTextMessage) would be rejected outside an
// existing 24-hour conversation window — an approved template is required
// for first contact, which is what this is for.

export function buildCAOtpComponents(otp: string): TemplateComponent[] {
  return [
    {
      type: 'body',
      parameters: [{ type: 'text', text: otp }],
    },
  ]
}
