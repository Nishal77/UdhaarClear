import { prisma } from '@/lib/prisma/client'
import { sendTemplateMessage } from '@/lib/whatsapp/client'
import { selectTone } from '@/lib/whatsapp/tone-engine'
import {
  getLegalTemplateName,
  buildGentleComponents,
  buildFirmComponents,
  buildLegal28Components,
  buildLegal35Components,
  buildLegal42Components,
} from '@/lib/whatsapp/templates'
import { buildReminderEmail } from '@/lib/email/templates/payment-reminder'
import { sendEmail } from '@/lib/email/client'
import { createPaymentLink } from '@/lib/razorpay/payment-link'
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
    const amount = formatINR(Number(invoice.amount))

    // 1. Resolve or create Razorpay payment link
    let paymentLink = invoice.razorpayLinkUrl
    if (!paymentLink) {
      try {
        const link = await createPaymentLink({
          invoiceId,
          businessId: invoice.businessId,
          invoiceNumber: invoice.invoiceNumber,
          amount: Number(invoice.amount),
          customerName,
          customerPhone: invoice.customer.phone,
          customerEmail: invoice.customer.email,
        })
        paymentLink = link.short_url
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: { razorpayLinkId: link.id, razorpayLinkUrl: link.short_url },
        })
      } catch (err) {
        // Fallback to local payment view if Razorpay fails
        paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoiceId}`
      }
    }

    let whatsappMessageId: string | undefined
    let emailSent = false
    let whatsappError: string | undefined
    let emailError: string | undefined

    // Temporarily disabled WhatsApp sending and routed notifications to Email until WABA is configured
    const shouldSendWhatsApp = false
    const shouldSendEmail = (channel === 'EMAIL' || channel === 'BOTH' || channel === 'WHATSAPP') && !!invoice.customer.email

    const legalRef = `UC-${new Date().getFullYear()}-${invoice.invoiceNumber.replace(/[^A-Z0-9]/gi, '').toUpperCase()}`

    // Pick the correct WhatsApp template name (LEGAL has 3 day-specific variants)
    const templateName = tone === 'LEGAL'
      ? getLegalTemplateName(days)
      : tone === 'FIRM'
        ? 'payment_reminder_firm'
        : 'payment_reminder_gentle'

    let messageBody = ''

    // Build WABA components and a plain-text fallback for the DB log
    let components
    if (tone === 'GENTLE') {
      components = buildGentleComponents({
        customerName,
        businessName: invoice.business.name,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: formatDate(invoice.invoiceDate),
        amount,
        dueDate: formatDate(invoice.dueDate),
        paymentLink: paymentLink ?? '',
      })
      messageBody = `Hi ${customerName}, invoice ${invoice.invoiceNumber} from ${invoice.business.name} for ${amount} is ${days <= 0 ? `due on ${formatDate(invoice.dueDate)}` : `${days} days overdue`}. Pay: ${paymentLink}`
    } else if (tone === 'FIRM') {
      const deadlineDate = new Date()
      deadlineDate.setDate(deadlineDate.getDate() + 5)
      const deadlineStr = deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      components = buildFirmComponents({
        customerName,
        invoiceNumber: invoice.invoiceNumber,
        amount,
        daysOverdue: String(days),
        deadlineDate: deadlineStr,
        paymentLink: paymentLink ?? '',
        businessPhone: invoice.business.phone,
        businessName: invoice.business.name,
      })
      messageBody = `Dear ${customerName}, invoice ${invoice.invoiceNumber} for ${amount} is ${days} days overdue. Pay by ${deadlineStr}: ${paymentLink}`
    } else if (days <= 28) {
      // LEGAL day +28 — formal demand, 7-day window
      components = buildLegal28Components({
        customerName,
        invoiceNumber: invoice.invoiceNumber,
        businessName: invoice.business.name,
        amount,
        paymentLink: paymentLink ?? '',
        legalRefNo: legalRef,
      })
      messageBody = `⚠️ Dear ${customerName}, a formal legal demand notice has been sent to your email. Invoice ${invoice.invoiceNumber} for ${amount} is 28 days overdue. Pay within 7 days to avoid MSME Facilitation Council filing: ${paymentLink} — Ref: ${legalRef}`
    } else if (days <= 35) {
      // LEGAL day +35 — 48-hour ultimatum
      components = buildLegal35Components({
        customerName,
        invoiceNumber: invoice.invoiceNumber,
        amount,
        paymentLink: paymentLink ?? '',
      })
      messageBody = `🚨 Dear ${customerName}, 48-hour window running. Invoice ${invoice.invoiceNumber} for ${amount} is 35 days overdue. Filing with MSME Facilitation Council cannot be reversed once initiated. Pay immediately: ${paymentLink}`
    } else {
      // LEGAL day +42 — proceedings initiated
      components = buildLegal42Components({
        customerName,
        amount,
        invoiceNumber: invoice.invoiceNumber,
        businessPhone: invoice.business.phone,
        legalRefNo: legalRef,
      })
      messageBody = `🔴 Dear ${customerName}, formal legal proceedings have been initiated for non-payment of ${amount} (Invoice ${invoice.invoiceNumber}, Ref: ${legalRef}). Pay immediately and share UTR with ${invoice.business.phone} to halt proceedings.`
    }

    // 2. Dispatch WhatsApp Template message
    if (shouldSendWhatsApp) {
      if (invoice.business.waConnected) {
        try {
          const waResponse = await sendTemplateMessage({
            to: invoice.customer.phone,
            templateName,
            languageCode: 'hi',
            components,
          })
          whatsappMessageId = waResponse.messages?.[0]?.id
        } catch (err: any) {
          whatsappError = err.message || String(err)
        }
      } else {
        whatsappError = 'WhatsApp account not connected for business'
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
