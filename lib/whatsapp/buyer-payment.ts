import { prisma } from '@/lib/prisma/client'
import { sendTextMessage } from '@/lib/whatsapp/client'
import { notifyOwnerPaymentPendingApproval } from '@/lib/services/owner-notifications'
import { formatINR } from '@/lib/utils/currency'
import { addDays } from '@/lib/utils/date'
import { classifyReply } from '@/lib/whatsapp/reply-classifier'
import type { WhatsAppMessage } from '@/types/whatsapp'

/**
 * Matches Indian payment reference numbers:
 * - NEFT/RTGS UTR: bank-prefix (2-4 alpha) + alphanumeric sequence, 12-22 chars total
 * - IMPS ref: 12-digit numeric
 * - UPI Ref: typically 12+ digit numeric
 * Requires ≥12 chars to avoid false positives on order numbers, phone numbers etc.
 */
const UTR_REGEX = /\b(?:[A-Z]{2,4}[A-Z0-9]{8,18}|\d{12,16})\b/i

export function detectUtr(body: string): string | null {
  // Explicit "UTR" / "ref" keyword shortcut
  const explicitMatch = body.match(/(?:utr|ref(?:erence)?|transaction)[^A-Z0-9]*([A-Z0-9]{8,22})/i)
  if (explicitMatch) return explicitMatch[1].toUpperCase()

  const m = body.match(UTR_REGEX)
  return m ? m[0].toUpperCase() : null
}

/**
 * Handles a buyer replying to a WhatsApp reminder with a UTR/transaction reference.
 *
 * Requires `context.id` (the wamid of the reminder being replied to) so we can
 * route the reply to the correct invoice + business without guessing. Cold texts
 * (no context) are NOT treated as UTR submissions — returns false immediately.
 *
 * On success:
 *   1. Sets invoice to PENDING_CONFIRMATION and stores the UTR.
 *   2. Sends buyer an instant "received, owner will confirm" reply.
 *   3. Alerts the business owner (UTILITY template + Approve/Reject buttons,
 *      falling back to free-text if template not yet approved).
 *
 * Returns true if the message was handled, false if it should fall through to
 * the seller-command path.
 */
export async function tryHandleBuyerUtrReply(message: WhatsAppMessage): Promise<boolean> {
  const contextId = message.context?.id
  if (!contextId) return false

  const body = message.text?.body?.trim()
  if (!body) return false

  const utr = detectUtr(body)
  if (!utr) return false

  // Resolve the invoice this reply is for via the reminder that was tapped/replied to
  const reminder = await prisma.reminder.findFirst({
    where: { waMessageId: contextId },
    include: {
      invoice: {
        include: {
          business: true,
          customer: true,
        },
      },
    },
  })

  if (!reminder?.invoice) return false

  const invoice = reminder.invoice

  // Already settled — nothing to do (idempotent)
  if (invoice.status === 'PAID' || invoice.status === 'WRITTEN_OFF') {
    await sendTextMessage({
      to: message.from,
      body: `✅ Invoice ${invoice.invoiceNumber} is already fully paid. No action needed!`,
    }).catch(() => {})
    return true
  }

  // Already awaiting confirmation — don't double-process
  if (invoice.status === 'PENDING_CONFIRMATION') {
    await sendTextMessage({
      to: message.from,
      body: `🔄 We already have a payment pending confirmation for invoice ${invoice.invoiceNumber}. You'll get a receipt once ${invoice.business.name} verifies it.`,
    }).catch(() => {})
    return true
  }

  const remaining = Number(invoice.amount) - Number(invoice.paidAmount ?? 0)

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      status: 'PENDING_CONFIRMATION',
      paymentRef: utr,
      paymentMethod: 'NEFT/RTGS',
      autoReminder: false,
    },
  })

  // Instant buyer acknowledgement
  await sendTextMessage({
    to: message.from,
    body:
      `✅ Got it! Your payment reference *${utr}* for invoice ${invoice.invoiceNumber} ` +
      `(${formatINR(remaining)}) has been sent to *${invoice.business.name}* for confirmation.\n\n` +
      `You'll receive a payment receipt on WhatsApp once they verify it. Usually within a few hours.`,
  }).catch(() => {})

  // Alert owner with Approve/Reject
  await notifyOwnerPaymentPendingApproval({
    ownerPhone: invoice.business.phone,
    businessName: invoice.business.name,
    customerName: invoice.customer.contactName ?? invoice.customer.name,
    invoiceNumber: invoice.invoiceNumber,
    amount: remaining,
    utr,
    invoiceId: invoice.id,
  })

  return true
}

/**
 * Handles a buyer's free-text reply that isn't a UTR (product.md §6.3, §7
 * item 12 "reply classification"). Requires `context.id` — same reasoning
 * as tryHandleBuyerUtrReply: only route replies-to-a-reminder, never cold
 * texts, so we never guess which invoice a stranger's message is about.
 *
 * - "promise" → snoozes reminders 7 days (mirrors the owner's WhatsApp
 *   "Pause" command) and tells the owner. Auto follow-up is free: the
 *   existing autoExpireSnoozedInvoices() cron resumes the ladder once the
 *   window passes — a broken promise re-escalates on its own.
 * - "dispute" → marks the invoice DISPUTED and pauses the ladder pending
 *   owner review.
 * - "ignore" → no reply sent (a buyer texting "ok" shouldn't get bounced
 *   with an unauthorized-number warning).
 *
 * Returns true if handled (including "ignore" — nothing more to do).
 */
export async function tryHandleBuyerReplyClassification(message: WhatsAppMessage): Promise<boolean> {
  const contextId = message.context?.id
  if (!contextId) return false

  const body = message.text?.body?.trim()
  if (!body) return false

  const reminder = await prisma.reminder.findFirst({
    where: { waMessageId: contextId },
    include: { invoice: { include: { business: true, customer: true } } },
  })
  if (!reminder?.invoice) return false

  const invoice = reminder.invoice
  if (invoice.status === 'PAID' || invoice.status === 'WRITTEN_OFF' || invoice.status === 'DISPUTED') {
    return true
  }

  const intent = classifyReply(body)
  if (intent === 'ignore') return true

  const ownerPhone = invoice.business.phone
  const customerName = invoice.customer.contactName ?? invoice.customer.name

  if (intent === 'dispute') {
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: 'DISPUTED', remindersPaused: true, autoReminder: false },
    })
    if (ownerPhone) {
      await sendTextMessage({
        to: ownerPhone,
        body: `🚩 ${customerName} disputed invoice ${invoice.invoiceNumber}:\n"${body}"\n\nReminders paused. Review and resolve from the dashboard.`,
      }).catch(() => {})
    }
    return true
  }

  // promise
  const promisedUntil = addDays(new Date(), 7)
  await prisma.invoice.update({
    where: { id: invoice.id },
    data: { remindersPaused: true, remindersPausedUntil: promisedUntil },
  })
  await sendTextMessage({
    to: message.from,
    body: `👍 Thanks, we've noted your payment promise for invoice ${invoice.invoiceNumber}. Reminders are paused for 7 days.`,
  }).catch(() => {})
  if (ownerPhone) {
    await sendTextMessage({
      to: ownerPhone,
      body: `🤝 ${customerName} promised to pay invoice ${invoice.invoiceNumber}:\n"${body}"\n\nReminders auto-paused 7 days, will resume automatically if unpaid.`,
    }).catch(() => {})
  }
  return true
}
