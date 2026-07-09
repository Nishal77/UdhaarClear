/**
 * @vitest-environment node
 *
 * WABA template shape guard.
 *
 * Every WhatsApp template builder must emit components whose count and
 * per-component parameter count EXACTLY match the template registered in Meta
 * WhatsApp Manager (see docs/waba-template-submission.md). A mismatch is not a
 * build error — it fails silently at send time with Meta error 132000
 * ("number of parameters does not match"), which is how all reminders + payment
 * confirmations were broken before this guard existed.
 *
 * The expected shapes below are the ACTUAL structures fetched live from the
 * WABA on 2026-07-09. If a template is re-registered with a different shape,
 * update BOTH the builder and the expectation here (and re-verify against a
 * live send).
 */
import { describe, it, expect } from 'vitest'
import {
  buildGentleComponents,
  buildFirmComponents,
  buildLegalWarningComponents,
  buildLegal28Components,
  buildLegal35Components,
  buildLegal42Components,
  buildPaymentConfirmedComponents,
  type TemplateComponent,
} from '@/lib/whatsapp/templates'

/** Summarise a component list as "type:paramCount" per component, in order. */
function shape(components: TemplateComponent[]): string[] {
  return components.map((c) => {
    const kind = c.type === 'button' ? `button(${c.sub_type})` : c.type
    return `${kind}:${c.parameters.length}`
  })
}

describe('WABA template builders match the registered Meta template shapes', () => {
  it('GENTLE (invoice_update_alert_v3): header 1 + body 4, quick-reply buttons carry no params', () => {
    const c = buildGentleComponents({
      customerName: 'Ramesh', businessName: 'Sharma', invoiceNumber: 'INV-1',
      invoiceDate: '1 Jul', amount: '₹1', dueDate: '15 Jul', invoiceId: 'abc',
    })
    expect(shape(c)).toEqual(['header:1', 'body:4'])
  })

  it('FIRM (payment_reminder_firm_v2): header 1 + body 5 + url button 1', () => {
    const c = buildFirmComponents({
      customerName: 'Ramesh', invoiceNumber: 'INV-1', amount: '₹1',
      daysOverdue: '10', deadlineDate: '25 Jul', businessName: 'Sharma', invoiceId: 'abc',
    })
    expect(shape(c)).toEqual(['header:1', 'body:5', 'button(url):1'])
  })

  it('LEGAL WARNING (payment_reminder_legal_warning_v2): header 1 + body 4 + url button 1', () => {
    const c = buildLegalWarningComponents({
      customerName: 'Ramesh', invoiceNumber: 'INV-1', amount: '₹1',
      daysOverdue: '24', businessName: 'Sharma', invoiceId: 'abc',
    })
    expect(shape(c)).toEqual(['header:1', 'body:4', 'button(url):1'])
  })

  it('LEGAL 28 (payment_reminder_legal_28_v2): header 1 + body 4 + url button 1', () => {
    const c = buildLegal28Components({
      customerName: 'Ramesh', invoiceNumber: 'INV-1', amount: '₹1',
      legalRefNo: 'LGL-1', businessName: 'Sharma', invoiceId: 'abc',
    })
    expect(shape(c)).toEqual(['header:1', 'body:4', 'button(url):1'])
  })

  it('LEGAL 35 (payment_reminder_legal_35_v2): header 1 + body 3 + url button 1', () => {
    const c = buildLegal35Components({
      customerName: 'Ramesh', invoiceNumber: 'INV-1', amount: '₹1',
      businessName: 'Sharma', invoiceId: 'abc',
    })
    expect(shape(c)).toEqual(['header:1', 'body:3', 'button(url):1'])
  })

  it('LEGAL 42 (payment_reminder_legal_42_v2): header 1 + body 5 + url button 1', () => {
    const c = buildLegal42Components({
      customerName: 'Ramesh', amount: '₹1', invoiceNumber: 'INV-1',
      businessPhone: '+91', legalRefNo: 'LGL-1', businessName: 'Sharma', invoiceId: 'abc',
    })
    expect(shape(c)).toEqual(['header:1', 'body:5', 'button(url):1'])
  })

  it('PAYMENT CONFIRMED (payment_confirmed): header 1 + body 3 + url button 1, button links to /confirm', () => {
    const c = buildPaymentConfirmedComponents({
      customerName: 'Ramesh', amount: '₹1', invoiceNumber: 'INV-1',
      businessName: 'Sharma', invoiceId: 'abc',
    })
    expect(shape(c)).toEqual(['header:1', 'body:3', 'button(url):1'])
    // Button variable must carry the "<id>/confirm" suffix so the receipt
    // button opens the /pay/[id]/confirm page, per the registered template.
    expect(c.at(-1)?.parameters[0].text).toBe('abc/confirm')
  })
})
