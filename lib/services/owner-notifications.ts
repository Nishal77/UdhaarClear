import { sendTextMessage, sendTemplateMessage } from '@/lib/whatsapp/client'
import { formatINR } from '@/lib/utils/currency'
import { TEMPLATE_NAMES, buildPaymentPendingApprovalComponents } from '@/lib/whatsapp/templates'

/**
 * Best-effort WhatsApp notifications to the BUSINESS OWNER (the seller) about
 * payment activity on their invoices.
 *
 * Why free-form text (sendTextMessage) and not an approved template: this is
 * the same channel the Day-28 human gate already uses to reach the owner
 * (see lib/cron/reminder-engine.ts). The owner is an active UdhaarClear user
 * who has messaged the bot, so a normal text reply is appropriate here —
 * unlike buyer-facing messages, which must be pre-approved WABA templates.
 *
 * Every function here is fire-and-forget: a WhatsApp failure must NEVER block
 * the payment flow (the payment already happened / was recorded). Callers can
 * `await` these safely — they swallow their own errors and only log.
 */

/** Owner confirmation: a buyer's payment was CONFIRMED (Razorpay webhook path). */
export async function notifyOwnerPaymentConfirmed(params: {
  ownerPhone: string | null | undefined
  customerName: string
  invoiceNumber: string
  amount: number
  paymentMethod: string
}): Promise<void> {
  const { ownerPhone, customerName, invoiceNumber, amount, paymentMethod } = params
  if (!ownerPhone) return

  try {
    await sendTextMessage({
      to: ownerPhone,
      body:
        `✅ Payment received!\n\n` +
        `${formatINR(amount)} from ${customerName}\n` +
        `Invoice ${invoiceNumber} · via ${paymentMethod}\n\n` +
        `This invoice is now marked paid and reminders have stopped.`,
    })
  } catch (err) {
    console.error('notifyOwnerPaymentConfirmed failed:', err)
  }
}

/**
 * Owner alert: buyer submitted a UTR by replying to a WhatsApp reminder.
 * Primary: UTILITY template with Approve/Reject quick-reply buttons (reliable
 * delivery outside 24h window, pending Meta approval). Fallback: free-text with
 * text-command instructions for when the template isn't yet approved.
 */
export async function notifyOwnerPaymentPendingApproval(params: {
  ownerPhone: string | null | undefined
  customerName: string
  invoiceNumber: string
  amount: number
  utr: string
  invoiceId: string
}): Promise<void> {
  const { ownerPhone, customerName, invoiceNumber, amount, utr, invoiceId } = params
  if (!ownerPhone) return

  try {
    await sendTemplateMessage({
      to: ownerPhone,
      templateName: TEMPLATE_NAMES.PAYMENT_PENDING_APPROVAL,
      components: buildPaymentPendingApprovalComponents({
        customerName,
        amount: formatINR(amount),
        invoiceNumber,
        utr,
        invoiceId,
      }),
    })
  } catch {
    // Template not yet Meta-approved — fall back to free-text.
    // Owner is an active bot user so the 24h window is usually open.
    try {
      await sendTextMessage({
        to: ownerPhone,
        body:
          `🔔 Payment UTR received!\n\n` +
          `*${customerName}* submitted UTR *${utr}* for invoice ${invoiceNumber} ` +
          `(${formatINR(amount)}).\n\n` +
          `Check your bank statement, then:\n` +
          `✅ Reply *Approve ${customerName}* to mark paid & send buyer receipt\n` +
          `❌ Reply *Reject ${customerName}* if UTR is invalid`,
      })
    } catch (err) {
      console.error('notifyOwnerPaymentPendingApproval failed:', err)
    }
  }
}

/**
 * Owner alert: a buyer SELF-REPORTED a bank transfer (manual UTR path) that
 * still needs the owner to verify against their bank statement.
 */
export async function notifyOwnerTransferSubmitted(params: {
  ownerPhone: string | null | undefined
  customerName: string
  invoiceNumber: string
  amount: number
  transferRef?: string | null
  payerBank?: string | null
}): Promise<void> {
  const { ownerPhone, customerName, invoiceNumber, amount, transferRef, payerBank } = params
  if (!ownerPhone) return

  try {
    await sendTextMessage({
      to: ownerPhone,
      body:
        `🔔 Payment proof submitted — please verify.\n\n` +
        `${customerName} says they paid ${formatINR(amount)} for invoice ${invoiceNumber}` +
        `${payerBank ? ` via ${payerBank}` : ''}.\n` +
        `${transferRef ? `UTR / Ref: ${transferRef}\n` : ''}` +
        `\nCheck your bank statement, then mark it paid in the dashboard. Automated reminders are paused until you do.`,
    })
  } catch (err) {
    console.error('notifyOwnerTransferSubmitted failed:', err)
  }
}
