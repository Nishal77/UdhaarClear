import { prisma } from '@/lib/prisma/client'
import { sendTemplateMessage } from '@/lib/whatsapp/client'
import { selectTone } from '@/lib/whatsapp/tone-engine'
import {
  TEMPLATE_NAMES,
  getLegalTemplateName,
  buildGentleComponents,
  buildFirmComponents,
  buildLegalWarningComponents,
  buildLegal28Components,
  buildLegal35Components,
  buildLegal42Components,
} from '@/lib/whatsapp/templates'
import { buildReminderEmail } from '@/lib/email/templates/payment-reminder'
import { sendEmail } from '@/lib/email/client'
import { formatINR } from '@/lib/utils/currency'
import { formatDate, daysOverdue } from '@/lib/utils/date'
import { ReminderTone, ReminderChannel, TriggerSource } from '@prisma/client'
import crypto from 'crypto'

export interface SendReminderParams {
  invoiceId: string
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS' | 'BOTH'
  tone?: ReminderTone
  triggeredBy: TriggerSource
}

export interface SendReminderResult {
  success: boolean
  tone: ReminderTone
  whatsappMessageId?: string
  emailSent?: boolean
  error?: string
}

export class ReminderService {
  /**
   * Dispatches a payment reminder via WhatsApp, Email, or both in parallel.
   * Logs a single unified Reminder entry in the database.
   */
  static async sendReminder({
    invoiceId,
    channel,
    tone: customTone,
    triggeredBy,
  }: SendReminderParams): Promise<SendReminderResult> {
    const reminderId = crypto.randomUUID()
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId },
      include: { customer: true, business: true },
    })

    if (!invoice) {
      throw new Error('Invoice not found')
    }

    const days = daysOverdue(invoice.dueDate)
    const tone = customTone ?? selectTone(days, invoice.reminderTone)
    const customerName = invoice.customer.contactName ?? invoice.customer.name

    // A customer who has already paid part of the invoice should only ever
    // be asked for what's left — never the original full amount again.
    const paidSoFar = Number(invoice.paidAmount ?? 0)
    const remainingBalance = Number(invoice.amount) - paidSoFar
    const isPartiallyPaid = paidSoFar > 0 && invoice.status === 'PARTIALLY_PAID'
    const amount = formatINR(remainingBalance)

    // WhatsApp templates are pre-approved by Meta with a single fixed
    // {{amount}} placeholder (see docs/waba-template-submission.md) — there's
    // no separate slot for "amount already paid". So for a partial payment,
    // that context is folded into the same string instead of requiring a new
    // template and another 3-7 day review.
    const waAmountText = isPartiallyPaid
      ? `${amount} (${formatINR(paidSoFar)} already paid of ${formatINR(Number(invoice.amount))})`
      : amount

    // Payment link: always use our hosted pay page — no Razorpay dependency
    const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoiceId}`

    let whatsappMessageId: string | undefined
    let emailSent = false
    let whatsappError: string | undefined
    let emailError: string | undefined

    const useBusinessWhatsApp = invoice.business.waConnected && !!invoice.business.waPhoneId
    const isWhatsAppConfigured = useBusinessWhatsApp || (!!process.env.WHATSAPP_ACCESS_TOKEN && !!process.env.WHATSAPP_PHONE_NUMBER_ID)

    const shouldSendWhatsApp =
      isWhatsAppConfigured &&
      (channel === 'WHATSAPP' || channel === 'BOTH')
    // Fall back to email when WhatsApp is requested but not configured
    const shouldSendEmail =
      (channel === 'EMAIL' || channel === 'BOTH' ||
        (channel === 'WHATSAPP' && !isWhatsAppConfigured)) &&
      !!invoice.customer.email

    const legalRef = `UC-${new Date().getFullYear()}-${invoice.invoiceNumber.replace(/[^A-Z0-9]/gi, '').toUpperCase()}`

    // Days 22-27 are still tone=FIRM in the DB (no schema migration for a
    // dedicated enum value) but get the PRD's separate "Legal Warning"
    // template — same pattern getLegalTemplateName() already uses to pick
    // between the 3 LEGAL-tier variants by day.
    const isLegalWarningWindow = tone === 'FIRM' && days >= 22

    // Pick the correct WhatsApp template name — always resolved from
    // TEMPLATE_NAMES, never a hardcoded literal, so the name sent to Meta
    // can never drift from the name registered in WhatsApp Manager.
    const templateName = tone === 'LEGAL'
      ? getLegalTemplateName(days)
      : isLegalWarningWindow
        ? TEMPLATE_NAMES.LEGAL_WARNING
        : tone === 'FIRM'
          ? TEMPLATE_NAMES.FIRM
          : TEMPLATE_NAMES.GENTLE

    // Plain-language clause appended to the internal log + as a fallback —
    // makes the partial-payment state explicit rather than just showing a
    // smaller number with no explanation of why it changed.
    const partialPaymentNote = isPartiallyPaid
      ? ` (${formatINR(paidSoFar)} paid, ${amount} pending)`
      : ''

    let messageBody = ''

    // Build WABA components and a plain-text fallback for the DB log
    let components
    if (tone === 'GENTLE') {
      components = buildGentleComponents({
        customerName,
        businessName: invoice.business.name,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: formatDate(invoice.invoiceDate),
        amount: waAmountText,
        dueDate: formatDate(invoice.dueDate),
        invoiceId: invoice.id,
      })
      messageBody = `Hi ${customerName}, invoice ${invoice.invoiceNumber} from ${invoice.business.name} for ${amount}${partialPaymentNote} is ${days <= 0 ? `due on ${formatDate(invoice.dueDate)}` : `${days} days overdue`}. Pay: ${paymentLink}`
    } else if (isLegalWarningWindow) {
      // Day 22-27 — PRD Phase 3: stern, references the MSMED Act 45-day
      // rule, signals formal action is coming, still fully automated (the
      // human gate only starts at Day 28).
      components = buildLegalWarningComponents({
        customerName,
        invoiceNumber: invoice.invoiceNumber,
        businessName: invoice.business.name,
        amount: waAmountText,
        daysOverdue: String(days),
        paymentLink: paymentLink ?? '',
      })
      messageBody = `⚠️ Dear ${customerName}, invoice ${invoice.invoiceNumber} for ${amount}${partialPaymentNote} is now ${days} days overdue. Under the MSMED Act, payment is due within 45 days. Please clear this immediately to avoid formal action: ${paymentLink}`
    } else if (tone === 'FIRM') {
      const deadlineDate = new Date()
      deadlineDate.setDate(deadlineDate.getDate() + 5)
      const deadlineStr = deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      components = buildFirmComponents({
        customerName,
        invoiceNumber: invoice.invoiceNumber,
        amount: waAmountText,
        daysOverdue: String(days),
        deadlineDate: deadlineStr,
        paymentLink: paymentLink ?? '',
        businessPhone: invoice.business.phone,
        businessName: invoice.business.name,
      })
      messageBody = `Dear ${customerName}, invoice ${invoice.invoiceNumber} for ${amount}${partialPaymentNote} is ${days} days overdue. A late fee may apply as per our payment terms. Pay by ${deadlineStr}: ${paymentLink}`
    } else if (days < 35) {
      // LEGAL day +28 — formal demand, 7-day window
      components = buildLegal28Components({
        customerName,
        invoiceNumber: invoice.invoiceNumber,
        businessName: invoice.business.name,
        amount: waAmountText,
        paymentLink: paymentLink ?? '',
        legalRefNo: legalRef,
      })
      messageBody = `⚠️ Dear ${customerName}, a formal legal demand notice has been sent to your email. Invoice ${invoice.invoiceNumber} for ${amount}${partialPaymentNote} is 28 days overdue. Pay within 7 days to avoid MSME Facilitation Council filing: ${paymentLink} — Ref: ${legalRef}`
    } else if (days < 42) {
      // LEGAL day +35 — 48-hour ultimatum
      components = buildLegal35Components({
        customerName,
        invoiceNumber: invoice.invoiceNumber,
        amount: waAmountText,
        paymentLink: paymentLink ?? '',
      })
      messageBody = `🚨 Dear ${customerName}, 48-hour window running. Invoice ${invoice.invoiceNumber} for ${amount}${partialPaymentNote} is 35 days overdue. Filing with MSME Facilitation Council cannot be reversed once initiated. Pay immediately: ${paymentLink}`
    } else {
      // LEGAL day +42 — proceedings initiated
      components = buildLegal42Components({
        customerName,
        amount: waAmountText,
        invoiceNumber: invoice.invoiceNumber,
        businessPhone: invoice.business.phone,
        legalRefNo: legalRef,
      })
      messageBody = `🔴 Dear ${customerName}, formal legal proceedings have been initiated for non-payment of ${amount}${partialPaymentNote} (Invoice ${invoice.invoiceNumber}, Ref: ${legalRef}). Pay immediately and share UTR with ${invoice.business.phone} to halt proceedings.`
    }

    // 2. Dispatch WhatsApp Template message
    if (shouldSendWhatsApp) {
      try {
        const formattedPhone = formatPhoneForWhatsApp(invoice.customer.phone)
        const waResponse = await sendTemplateMessage({
          to: formattedPhone,
          templateName,
          languageCode: 'en',
          components,
          phoneNumberId: useBusinessWhatsApp ? invoice.business.waPhoneId || undefined : undefined,
        })
        whatsappMessageId = waResponse.messages?.[0]?.id
      } catch (err: any) {
        whatsappError = err.message || String(err)
      }
    }

    // 3. Dispatch Email message via Resend client
    if (shouldSendEmail && invoice.customer.email) {
      try {
        const emailParams = {
          reminderId,
          customerName,
          businessName: invoice.business.name,
          businessPhone: invoice.business.phone,
          businessGstin: invoice.business.gstin,
          businessCity: invoice.business.city,
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: formatDate(invoice.invoiceDate),
          dueDate: formatDate(invoice.dueDate),
          amount,
          paidSoFarText: isPartiallyPaid ? `${formatINR(paidSoFar)} already paid` : undefined,
          daysOverdue: days,
          paymentLink: paymentLink ?? `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoiceId}`,
          bankAccountNo: invoice.business.bankAccountNo,
          bankIfsc: invoice.business.bankIfsc,
          bankAccountName: invoice.business.bankAccountName,
          upiId: invoice.business.upiId,
        }
        const { subject, html } = buildReminderEmail(tone, emailParams)
        await sendEmail({ to: invoice.customer.email, subject, html })
        emailSent = true

        if (!messageBody) {
          messageBody = subject
        }
      } catch (err: any) {
        emailError = err.message || String(err)
      }
    } else if ((channel === 'EMAIL' || channel === 'BOTH') && !invoice.customer.email) {
      emailError = 'Customer email address is not defined'
    }

    // Check overall delivery status
    const isWhatsAppRequested = shouldSendWhatsApp
    const isEmailRequested = shouldSendEmail

    const whatsappFailed = isWhatsAppRequested && !whatsappMessageId
    const emailFailed = isEmailRequested && !emailSent

    // We are failed if all requested channels failed
    const isFailed = (isWhatsAppRequested || isEmailRequested) &&
      (!isWhatsAppRequested || whatsappFailed) &&
      (!isEmailRequested || emailFailed)

    const errorMsg = isFailed
      ? `Failed to deliver reminder. ${
          isWhatsAppRequested ? `WhatsApp: ${whatsappError ?? 'None'}` : ''
        }${
          isWhatsAppRequested && isEmailRequested ? '. ' : ''
        }${
          isEmailRequested ? `Email: ${emailError ?? 'None'}` : ''
        }`
      : undefined

    const hasPartialFailure = !isFailed && (whatsappFailed || emailFailed)
    const partialFailureReason = hasPartialFailure
      ? `Partial delivery. ${
          whatsappFailed ? `WhatsApp failed: ${whatsappError ?? 'Unknown'}` : ''
        }${
          whatsappFailed && emailFailed ? '. ' : ''
        }${
          emailFailed ? `Email failed: ${emailError ?? 'Unknown'}` : ''
        }`
      : undefined

    let outcome: string | undefined = undefined
    if (isFailed) {
      outcome = 'Delivery failed'
    } else if (hasPartialFailure) {
      if (whatsappFailed) {
        outcome = 'Email sent · WhatsApp failed'
      } else if (emailFailed) {
        outcome = 'WhatsApp sent · Email failed'
      }
    }

    // 4. Save a single consolidated database row representing the communication run
    await prisma.reminder.create({
      data: {
        id: reminderId,
        businessId: invoice.businessId,
        invoiceId: invoiceId,
        tone,
        templateName: channel === 'EMAIL' ? `email_${tone.toLowerCase()}_d${days}` : templateName,
        messageBody,
        dayOverdue: days,
        status: isFailed ? 'FAILED' : 'SENT',
        waMessageId: whatsappMessageId,
        paymentLinkUrl: paymentLink,
        triggeredBy,
        channel: channel as ReminderChannel,
        outcome,
        failReason: errorMsg || partialFailureReason || null,
      },
    })

    if (isFailed) {
      throw new Error(errorMsg)
    }

    return {
      success: true,
      tone,
      whatsappMessageId,
      emailSent,
      error: (whatsappError || emailError)
        ? `WhatsApp: ${whatsappError ?? 'OK'}, Email: ${emailError ?? 'OK'}`
        : undefined,
    }
  }
}

/**
 * Cleans and formats phone numbers for the WhatsApp Cloud API.
 * Strips all non-digit characters and prefixes 10-digit Indian numbers with the '91' country code.
 */
export function formatPhoneForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
    cleaned = '91' + cleaned
  }

  return cleaned
}

