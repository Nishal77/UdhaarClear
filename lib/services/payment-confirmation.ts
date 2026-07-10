import { prisma } from '@/lib/prisma/client'
import { sendTemplateMessage } from '@/lib/whatsapp/client'
import { TEMPLATE_NAMES, buildPaymentConfirmedComponents } from '@/lib/whatsapp/templates'
import { formatINR } from '@/lib/utils/currency'

/**
 * Central payment-confirmation service.
 *
 * The single source of truth for "a payment on this invoice is confirmed" —
 * so EVERY approval path (Razorpay auto-webhook, web dashboard Mark Paid, the
 * WhatsApp bot "[name] paid" command, and the new owner Approve flow) marks the
 * invoice paid AND sends the buyer the payment_confirmed receipt. Previously
 * only the Razorpay path sent a receipt, so buyers paying by bank transfer /
 * manual confirmation never got one.
 */

/** Minimal invoice shape needed to build + send the buyer receipt. */
interface InvoiceForReceipt {
  id: string
  invoiceNumber: string
  customer: { name: string; contactName: string | null; phone: string }
  business: { name: string }
}

/**
 * Sends the buyer the approved `payment_confirmed` WhatsApp template.
 * Best-effort: a WhatsApp failure is logged but never throws, so it can't
 * roll back a payment that already happened. Safe to `await`.
 */
export async function sendBuyerPaymentReceipt(invoice: InvoiceForReceipt, amount: number): Promise<void> {
  try {
    await sendTemplateMessage({
      to: invoice.customer.phone,
      templateName: TEMPLATE_NAMES.PAYMENT_CONFIRMED,
      components: buildPaymentConfirmedComponents({
        customerName: invoice.customer.contactName ?? invoice.customer.name,
        amount: formatINR(amount),
        invoiceNumber: invoice.invoiceNumber,
        businessName: invoice.business.name,
        invoiceId: invoice.id,
      }),
    })
  } catch (err) {
    console.error('sendBuyerPaymentReceipt failed:', err)
  }
}

export interface ConfirmPaymentResult {
  ok: boolean
  alreadyPaid?: boolean
  notFound?: boolean
  paidAmount?: number
}

/**
 * Marks an invoice fully PAID and sends the buyer the receipt. Used by the
 * owner-approval paths (bot "Approve [name]", WhatsApp Approve button) where
 * we always settle the full remaining balance. Idempotent: a call on an
 * already-PAID invoice is a no-op success (never sends a duplicate receipt).
 *
 * `expectedBusinessId` scopes the lookup so one business can never confirm
 * another business's invoice (multi-tenant safety) — pass it whenever the
 * caller has a known business context.
 */
export async function confirmInvoicePayment(params: {
  invoiceId: string
  expectedBusinessId?: string
  paymentMethod?: string
  paymentRef?: string | null
  sendReceipt?: boolean
}): Promise<ConfirmPaymentResult> {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: params.invoiceId,
      ...(params.expectedBusinessId ? { businessId: params.expectedBusinessId } : {}),
    },
    include: { customer: true, business: true },
  })

  if (!invoice) return { ok: false, notFound: true }
  if (invoice.status === 'PAID') return { ok: true, alreadyPaid: true }

  const fullAmount = Number(invoice.amount)

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      status: 'PAID',
      paidAt: new Date(),
      paidAmount: fullAmount,
      autoReminder: false,
      remindersPaused: false,
      remindersPausedUntil: null,
      ...(params.paymentMethod ? { paymentMethod: params.paymentMethod } : {}),
      ...(params.paymentRef !== undefined ? { paymentRef: params.paymentRef } : {}),
    },
  })

  if (params.sendReceipt !== false) {
    await sendBuyerPaymentReceipt(invoice, fullAmount)
  }

  return { ok: true, paidAmount: fullAmount }
}
