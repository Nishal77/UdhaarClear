import { prisma } from '@/lib/prisma/client'
import { sendTextMessage } from '@/lib/whatsapp/client'
import { notifyOwnerPaymentPendingApproval } from '@/lib/services/owner-notifications'
import { formatINR } from '@/lib/utils/currency'
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
    customerName: invoice.customer.contactName ?? invoice.customer.name,
    invoiceNumber: invoice.invoiceNumber,
    amount: remaining,
    utr,
    invoiceId: invoice.id,
  })

  return true
}
