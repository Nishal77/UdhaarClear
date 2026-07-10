import { prisma } from '@/lib/prisma/client'
import { sendTextMessage } from '@/lib/whatsapp/client'
import { normalizeIndianPhone } from '@/lib/utils/phone'
import { formatINR } from '@/lib/utils/currency'
import { formatDateLong, addDays } from '@/lib/utils/date'
import type { WhatsAppMessage } from '@/types/whatsapp'

// How long reminders pause after a buyer chooses to pay in two parts, giving
// them room to clear the second half. Uses the existing remindersPausedUntil
// field (auto-resumed by the cron engine once it passes).
const HALF_PAYMENT_SNOOZE_DAYS = 12

type NegotiationChoice = 'full' | 'half' | null

/**
 * Detects whether an inbound WhatsApp message is a quick-reply button tap
 * (from the GENTLE template's "Pay Full Amount" / "Pay Half Amount" buttons),
 * and if so which choice. Meta auto-assigns the button payload, so we match
 * defensively on both the payload and the visible label, by keyword.
 */
export function detectNegotiationChoice(message: WhatsAppMessage): NegotiationChoice {
  const raw =
    message.button?.payload ??
    message.button?.text ??
    message.interactive?.button_reply?.title ??
    message.interactive?.button_reply?.id ??
    ''
  const t = raw.toLowerCase()
  if (!t) return null
  if (t.includes('half') || t.includes('two') || t.includes('part') || t.includes('split')) return 'half'
  if (t.includes('full')) return 'full'
  return null
}

/** True if this inbound message is a template quick-reply / interactive button tap. */
export function isButtonReply(message: WhatsAppMessage): boolean {
  return message.type === 'button' || message.type === 'interactive'
}

/**
 * Resolves which invoice a button tap refers to. The reliable path is the
 * reply's context.id — the wamid of the template message tapped, which we
 * stored as Reminder.waMessageId. Falls back to the buyer's most recent
 * unpaid invoice matched by phone if no context is present.
 */
async function resolveInvoiceForTap(message: WhatsAppMessage) {
  const contextId = message.context?.id
  if (contextId) {
    const reminder = await prisma.reminder.findFirst({
      where: { waMessageId: contextId },
      include: { invoice: { include: { business: true, customer: true } } },
    })
    if (reminder?.invoice) return reminder.invoice
  }

  // Fallback: match the sender's phone to a customer, take their newest
  // still-open invoice. Phone normalised to the same shapes stored on customers.
  const senderPhone = normalizeIndianPhone(message.from)
  const plain = senderPhone.replace(/^\+91/, '')
  const invoice = await prisma.invoice.findFirst({
    where: {
      status: { in: ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID', 'PENDING_CONFIRMATION'] },
      customer: { phone: { in: [senderPhone, plain, `+91${plain}`, `91${plain}`] } },
    },
    orderBy: { createdAt: 'desc' },
    include: { business: true, customer: true },
  })
  return invoice
}

/**
 * Handles a buyer tapping a quick-reply button on the GENTLE reminder.
 *
 *  "Pay Full Amount" → send the payment link for the full remaining balance.
 *  "Pay Half Amount" → send a link for half now, tell them when the rest is
 *                      due, and snooze automated reminders for a window.
 *
 * Free-text replies are allowed here because the buyer's own button tap just
 * opened a 24-hour customer-service window, so no template is required.
 */
export async function handleNegotiationButton(message: WhatsAppMessage): Promise<void> {
  const choice = detectNegotiationChoice(message)
  if (!choice) return // a button we don't recognise — ignore rather than misfire

  const invoice = await resolveInvoiceForTap(message)
  if (!invoice) {
    await sendTextMessage({
      to: message.from,
      body: `Thanks for your response! We couldn't find a matching open invoice for this number. Please contact the business directly for payment details.`,
    }).catch(() => {})
    return
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://udhaarclear.in'
  const payLink = `${appUrl}/pay/${invoice.id}`
  const remaining = Number(invoice.amount) - Number(invoice.paidAmount ?? 0)
  const businessName = invoice.business.name
  const customerName = invoice.customer.contactName ?? invoice.customer.name

  if (choice === 'full') {
    await sendTextMessage({
      to: message.from,
      body:
        `Great, thank you ${customerName}! 🙏\n\n` +
        `Please pay the full amount of *${formatINR(remaining)}* for invoice ${invoice.invoiceNumber} here:\n${payLink}\n\n` +
        `You'll get an instant confirmation once ${businessName} receives it.`,
    }).catch(() => {})
    return
  }

  // Half: compute half of the remaining balance, snooze reminders, and tell
  // the buyer when the second half is due. The actual payment still flows
  // through the normal pay page + partial-payment tracking (no invoice is
  // marked paid here) — this only records the plan and pauses chasing.
  const half = Math.round(remaining / 2)
  const secondHalfDue = addDays(new Date(), HALF_PAYMENT_SNOOZE_DAYS)

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      remindersPaused: true,
      remindersPausedUntil: secondHalfDue,
    },
  })

  await sendTextMessage({
    to: message.from,
    body:
      `No problem, ${customerName} — you can split it. 👍\n\n` +
      `Please pay *${formatINR(half)}* now for invoice ${invoice.invoiceNumber}:\n${payLink}\n\n` +
      `The remaining *${formatINR(remaining - half)}* will be due by *${formatDateLong(secondHalfDue)}*. ` +
      `We'll pause reminders until then. Thank you!`,
  }).catch(() => {})
}
