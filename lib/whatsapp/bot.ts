import { prisma } from '@/lib/prisma/client'
import { normalizeIndianPhone } from '@/lib/utils/phone'
import { sendTextMessage, sendDocumentMessage } from '@/lib/whatsapp/client'
import { formatINR } from '@/lib/utils/currency'
import { formatDate, daysOverdue, addDays, parseFlexibleDate } from '@/lib/utils/date'
import { getReminderPhase } from '@/lib/whatsapp/tone-engine'
import type { WhatsAppMessage } from '@/types/whatsapp'
import { InvoiceStatus } from '@prisma/client'
import { ReminderService } from '@/lib/services/reminder-service'
import { generateAuditorReportPDF } from '@/lib/pdf/auditor-report'
import { uploadReportPDF } from '@/lib/storage/report-upload'
import { isButtonReply, handleNegotiationButton } from '@/lib/whatsapp/negotiation'
import { confirmInvoicePayment, sendBuyerPaymentReceipt } from '@/lib/services/payment-confirmation'
import { tryHandleBuyerUtrReply, tryHandleBuyerReplyClassification } from '@/lib/whatsapp/buyer-payment'

/** Parses the trailing due-date text in a "New invoice" command, defaulting to 30 days credit. */
function parseDueDate(dateStr?: string): Date {
  return parseFlexibleDate(dateStr, 30)
}

/**
 * Handles an owner tapping the Approve or Reject quick-reply button on the
 * payment_pending_approval template. The invoiceId is embedded in the payload.
 */
async function handlePaymentApprovalButton(message: WhatsAppMessage, payload: string): Promise<void> {
  const isApprove = payload.startsWith('approve_payment_')
  const invoiceId = isApprove ? payload.slice(16) : payload.slice(15)

  if (isApprove) {
    const result = await confirmInvoicePayment({ invoiceId })
    await sendTextMessage({
      to: message.from,
      body: result.alreadyPaid
        ? `✅ Invoice already marked paid.`
        : result.notFound
        ? `⚠️ Invoice not found — it may have been deleted.`
        : `✅ Payment confirmed! Receipt sent to the buyer on WhatsApp.`,
    }).catch(() => {})
  } else {
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId },
      include: { customer: true },
    })
    if (!invoice) return

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'OVERDUE',
        paymentRef: null,
        autoReminder: true,
      },
    })

    await sendTextMessage({
      to: invoice.customer.phone,
      body: `⚠️ We couldn't verify your payment for invoice ${invoice.invoiceNumber}. Please check your transaction details and resubmit, or contact the business directly.`,
    }).catch(() => {})

    await sendTextMessage({
      to: message.from,
      body: `❌ Payment rejected for ${invoice.customer.name} (${invoice.invoiceNumber}). Buyer notified. Reminders will resume.`,
    }).catch(() => {})
  }
}

/**
 * Main command router for inbound WhatsApp messages sent by Sellers.
 */
export async function handleInboundMessage(message: WhatsAppMessage): Promise<void> {
  const incomingPhone = message.from

  // Button taps arrive from both buyers (Pay Full/Pay Half) and owners
  // (Approve/Reject payment). Distinguish by payload prefix before routing.
  if (isButtonReply(message)) {
    const payload =
      message.button?.payload ??
      message.interactive?.button_reply?.id ??
      ''
    if (payload.startsWith('approve_payment_') || payload.startsWith('reject_payment_')) {
      await handlePaymentApprovalButton(message, payload)
      return
    }
    await handleNegotiationButton(message)
    return
  }

  // Buyer UTR reply — before seller-auth check so buyers (who aren't sellers)
  // can submit payment references by replying to a reminder.
  {
    const handled = await tryHandleBuyerUtrReply(message)
    if (handled) return
  }

  // Buyer free-text reply to a reminder (promise/dispute/ignore) — before
  // seller-auth check for the same reason as the UTR handler above.
  {
    const handled = await tryHandleBuyerReplyClassification(message)
    if (handled) return
  }

  const body = message.text?.body?.trim()

  if (!body) return

  // 1. Authenticate Business from sender's phone number
  const senderPhone = normalizeIndianPhone(incomingPhone)
  const plainPhone = senderPhone.replace(/^\+91/, '')

  const business = await prisma.business.findFirst({
    where: {
      OR: [
        { phone: senderPhone },
        { phone: plainPhone },
        { phone: `+91${plainPhone}` },
        { phone: `91${plainPhone}` },
      ],
    },
  })

  if (!business) {
    // If not a registered seller, send an unauthorized warning
    try {
      await sendTextMessage({
        to: incomingPhone,
        body: `⚠️ Unauthorized: The phone number (${incomingPhone}) is not registered with any UdhaarClear business. Please update your business phone number in UdhaarClear settings.`,
      })
    } catch (err) {
      console.error('Failed to send unauthorized warning response:', err)
    }
    return
  }

  const lowercaseBody = body.toLowerCase()

  try {
    // Command 1: "New invoice [Name] [Amount] [Phone] [Date]" (Format B - Create customer + invoice)
    // Matches: "new invoice Ramesh 15000 9876543210" or "new invoice Ramesh 15000 9876543210 15-07-2026"
    // Captures Name, Amount, Phone (10 digits starting with 6-9), and optional remainder for Date.
    const newInvoiceWithPhoneRegex = /^new\s+invoice\s+(.+?)\s+(\d+(?:\.\d+)?)\s+([6-9]\d{9})\s*(.*)$/i
    const matchWithPhone = body.match(newInvoiceWithPhoneRegex)

    if (matchWithPhone) {
      const [_, customerName, amountStr, customerPhoneRaw, dateStr] = matchWithPhone
      const amount = parseFloat(amountStr)
      const customerPhone = normalizeIndianPhone(customerPhoneRaw)
      const dueDate = parseDueDate(dateStr)

      // Find or create customer
      let customer = await prisma.customer.findFirst({
        where: {
          businessId: business.id,
          phone: customerPhone,
        },
      })

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            businessId: business.id,
            name: customerName.trim(),
            phone: customerPhone,
          },
        })
      }

      // Generate clean unique invoice number
      const invoiceNumber = `INV-BOT-${Math.floor(100000 + Math.random() * 900000)}`

      const invoice = await prisma.invoice.create({
        data: {
          businessId: business.id,
          customerId: customer.id,
          invoiceNumber,
          amount,
          invoiceDate: new Date(),
          dueDate,
          status: 'PENDING',
          autoReminder: true,
          remindersPaused: false,
        },
      })

      const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoice.id}`
      await sendTextMessage({
        to: incomingPhone,
        body: `✅ Invoice ${invoiceNumber} (₹${amount}) created successfully for ${customer.name}!\n📅 Due: ${formatDate(dueDate)}\n🔗 Pay Link: ${paymentLink}\n\nAutomated recovery sequence started.`,
      })
      return
    }

    // Command 2: "New invoice [Name] [Amount] [Date]" (Format A - Uses existing customer)
    // Matches: "new invoice Ramesh 15000" or "new invoice Ramesh 15000 15-07-2026"
    const newInvoiceRegex = /^new\s+invoice\s+(.+?)\s+(\d+(?:\.\d+)?)(?:\s+(.*))?$/i
    const matchSimple = body.match(newInvoiceRegex)

    if (matchSimple) {
      const [_, customerName, amountStr, dateStr] = matchSimple
      const amount = parseFloat(amountStr)
      const dueDate = parseDueDate(dateStr)

      const customer = await prisma.customer.findFirst({
        where: {
          businessId: business.id,
          name: { equals: customerName.trim(), mode: 'insensitive' },
        },
      })

      if (!customer) {
        await sendTextMessage({
          to: incomingPhone,
          body: `⚠️ Customer "${customerName.trim()}" not found. To create a new customer and invoice, please specify their 10-digit phone number:\n👉 "New invoice [Name] [Amount] [Phone] [Date]"\n\nExample: New invoice Ramesh 15000 9876543210 15-07-2026`,
        })
        return
      }

      const invoiceNumber = `INV-BOT-${Math.floor(100000 + Math.random() * 900000)}`
      const invoice = await prisma.invoice.create({
        data: {
          businessId: business.id,
          customerId: customer.id,
          invoiceNumber,
          amount,
          invoiceDate: new Date(),
          dueDate,
          status: 'PENDING',
          autoReminder: true,
          remindersPaused: false,
        },
      })

      const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoice.id}`
      await sendTextMessage({
        to: incomingPhone,
        body: `✅ Invoice ${invoiceNumber} (₹${amount}) created successfully for existing customer ${customer.name}!\n📅 Due: ${formatDate(dueDate)}\n🔗 Pay Link: ${paymentLink}\n\nAutomated recovery sequence started.`,
      })
      return
    }

    // Command 3: "Status"
    // Fetch summary of outstanding recovery pipelines
    if (lowercaseBody === 'status') {
      const unpaidInvoices = await prisma.invoice.findMany({
        where: {
          businessId: business.id,
          status: { in: ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'] },
        },
        include: { customer: true },
        orderBy: { dueDate: 'asc' },
      })

      if (unpaidInvoices.length === 0) {
        await sendTextMessage({
          to: incomingPhone,
          body: `🎉 All clear! Your business has zero outstanding invoices.`,
        })
        return
      }

      let responseBody = `📊 Outstanding Invoices (${unpaidInvoices.length}):\n\n`
      let totalOutstanding = 0

      unpaidInvoices.forEach((inv, idx) => {
        const days = daysOverdue(inv.dueDate)
        const phase = getReminderPhase(days)
        const outstandingAmt = Number(inv.amount) - Number(inv.paidAmount ?? 0)
        totalOutstanding += outstandingAmt

        const daysLabel = days > 0 ? `${days}d overdue` : `due in ${Math.abs(days)}d`
        responseBody += `${idx + 1}. ${inv.customer.name} — ${inv.invoiceNumber}\n   💸 ₹${outstandingAmt.toLocaleString('en-IN')} (${daysLabel} | ${phase})\n\n`
      })

      responseBody += `Total Outstanding: ${formatINR(totalOutstanding)}`
      await sendTextMessage({
        to: incomingPhone,
        body: responseBody,
      })
      return
    }

    // Command 4: "[Name] paid Rs [Amount]" or "[Name] paid"
    // Matches: "Ramesh paid", "Ramesh paid Rs 15000", "Ramesh Kumar paid 15000"
    const paidRegex = /^(.+?)\s+paid(?:\s+(?:rs\s+)?(\d+(?:\.\d+)?))?$/i
    const paidMatch = body.match(paidRegex)

    if (paidMatch && !lowercaseBody.startsWith('new invoice') && !lowercaseBody.startsWith('pause')) {
      const [_, customerName, amountStr] = paidMatch
      const paymentAmount = amountStr ? parseFloat(amountStr) : null

      const customer = await prisma.customer.findFirst({
        where: {
          businessId: business.id,
          name: { equals: customerName.trim(), mode: 'insensitive' },
        },
      })

      if (!customer) {
        await sendTextMessage({
          to: incomingPhone,
          body: `⚠️ Customer "${customerName.trim()}" not found. Please verify the spelling or specify the exact name as saved on your dashboard.`,
        })
        return
      }

      // Fetch oldest unpaid invoice
      const unpaidInvoice = await prisma.invoice.findFirst({
        where: {
          customerId: customer.id,
          businessId: business.id,
          status: { in: ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'] },
        },
        orderBy: { dueDate: 'asc' },
      })

      if (!unpaidInvoice) {
        await sendTextMessage({
          to: incomingPhone,
          body: `✨ Customer "${customer.name}" does not have any pending or overdue invoices to clear.`,
        })
        return
      }

      const totalInvoiceAmt = Number(unpaidInvoice.amount)
      const currentPaid = Number(unpaidInvoice.paidAmount ?? 0)
      const remainingBalance = totalInvoiceAmt - currentPaid

      let finalPaidAmount = totalInvoiceAmt
      let nextStatus: InvoiceStatus = 'PAID'
      let messageSuffix = `Invoice ${unpaidInvoice.invoiceNumber} is now fully PAID.`

      if (paymentAmount !== null) {
        if (paymentAmount < remainingBalance) {
          finalPaidAmount = currentPaid + paymentAmount
          nextStatus = 'PARTIALLY_PAID'
          messageSuffix = `Partial payment logged. Remaining balance: ${formatINR(remainingBalance - paymentAmount)}.`
        } else {
          finalPaidAmount = totalInvoiceAmt
          nextStatus = 'PAID'
          messageSuffix = `Invoice ${unpaidInvoice.invoiceNumber} fully cleared (excess ₹${paymentAmount - remainingBalance} logged).`
        }
      }

      await prisma.invoice.update({
        where: { id: unpaidInvoice.id },
        data: {
          status: nextStatus,
          paidAmount: finalPaidAmount,
          paidAt: new Date(),
          autoReminder: nextStatus === 'PAID' ? false : unpaidInvoice.autoReminder,
        },
      })

      // Buyer receipt on full settlement — same WhatsApp receipt every other
      // approval path sends (Razorpay auto, web Mark Paid, WhatsApp Approve).
      if (nextStatus === 'PAID') {
        await sendBuyerPaymentReceipt(
          {
            id: unpaidInvoice.id,
            invoiceNumber: unpaidInvoice.invoiceNumber,
            customer: { name: customer.name, contactName: customer.contactName, phone: customer.phone },
            business: { name: business.name },
          },
          finalPaidAmount
        )
      }

      await sendTextMessage({
        to: incomingPhone,
        body: `✅ Payment recorded for ${customer.name}!\n📝 ${messageSuffix}\nAutomated alerts paused for this invoice.`,
      })
      return
    }

    // Command 5: "Pause [Name]" or "Pause [Name] [N] days [amount]"
    // Pause recovery sequences for a customer — either indefinitely (no
    // duration given, resumed only by the owner), or for a fixed window
    // (e.g. "Pause Ramesh 7 days" or "Pause Ramesh 7 days 5000" when the
    // buyer promises to pay a specific amount by then — the amount is
    // product.md §6.1's promise-to-pay capture).
    // A time-boxed pause auto-resumes via autoExpireSnoozedInvoices() in
    // lib/cron/reminder-engine.ts once the window passes.
    const pauseRegex = /^pause\s+(.+?)(?:\s+(\d+)\s*days?(?:\s+(\d+(?:\.\d+)?))?)?$/i
    const pauseMatch = body.match(pauseRegex)

    if (pauseMatch) {
      const [_, customerName, daysStr, promisedAmountStr] = pauseMatch
      const snoozeDays = daysStr ? parseInt(daysStr, 10) : null
      const promisedAmount = promisedAmountStr ? parseFloat(promisedAmountStr) : null

      const customer = await prisma.customer.findFirst({
        where: {
          businessId: business.id,
          name: { equals: customerName.trim(), mode: 'insensitive' },
        },
      })

      if (!customer) {
        await sendTextMessage({
          to: incomingPhone,
          body: `⚠️ Customer "${customerName.trim()}" not found. Could not pause recovery.`,
        })
        return
      }

      const remindersPausedUntil = snoozeDays ? addDays(new Date(), snoozeDays) : null

      await prisma.invoice.updateMany({
        where: {
          customerId: customer.id,
          businessId: business.id,
          status: { in: ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'] },
        },
        data: {
          remindersPaused: true,
          remindersPausedUntil,
          ...(promisedAmount !== null ? { promisedAmount } : {}),
        },
      })

      const confirmation = remindersPausedUntil
        ? `⏸️ Paused automated reminders for ${customer.name} for ${snoozeDays} day${snoozeDays === 1 ? '' : 's'}${promisedAmount !== null ? ` (promised ${formatINR(promisedAmount)})` : ''}. They'll resume automatically on ${formatDate(remindersPausedUntil)} unless you resume sooner from the dashboard.`
        : `⏸️ Paused automated reminders for ${customer.name}. You can resume them anytime from the web dashboard.`

      await sendTextMessage({
        to: incomingPhone,
        body: confirmation,
      })
      return
    }

    // Command 6: "Report"
    // Monthly statistics summary
    if (lowercaseBody === 'report') {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const monthlyInvoices = await prisma.invoice.findMany({
        where: {
          businessId: business.id,
          createdAt: { gte: startOfMonth },
        },
      })

      const totalInvoiced = monthlyInvoices.reduce((acc, inv) => acc + Number(inv.amount), 0)
      const totalRecovered = monthlyInvoices
        .filter((inv) => inv.status === 'PAID')
        .reduce((acc, inv) => acc + Number(inv.amount), 0)

      const activeDebtors = await prisma.customer.count({
        where: {
          businessId: business.id,
          invoices: {
            some: {
              status: { in: ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'] },
            },
          },
        },
      })

      const collectionRate = totalInvoiced > 0 ? Math.round((totalRecovered / totalInvoiced) * 100) : 0

      const reportLink = `${process.env.NEXT_PUBLIC_APP_URL}/reports`

      await sendTextMessage({
        to: incomingPhone,
        body: `📈 Recovery Performance (This Month):\n\n📥 Total Invoiced: ${formatINR(totalInvoiced)}\n💰 Total Recovered: ${formatINR(totalRecovered)}\n📊 Collection Rate: ${collectionRate}%\n👥 Active Debtors: ${activeDebtors}\n\nGenerating your full PDF report...`,
      })

      // PRD §3.3: "Report" delivers a PDF summary. Generate the auditor-ready
      // PDF, upload it, and send it as a WhatsApp document. If any step fails,
      // fall back to the dashboard link so the owner is never left empty-handed.
      try {
        const pdf = await generateAuditorReportPDF(business.id)
        const signedUrl = pdf ? await uploadReportPDF({ businessId: business.id, buffer: pdf }) : null

        if (signedUrl) {
          const monthLabel = now.toLocaleString('en-IN', { month: 'short', year: 'numeric' })
          await sendDocumentMessage({
            to: incomingPhone,
            link: signedUrl,
            filename: `UdhaarClear-Recovery-Report-${monthLabel.replace(' ', '-')}.pdf`,
            caption: `📄 Your ${monthLabel} recovery report — ageing analysis, collection rate, and full ledger.`,
          })
        } else {
          await sendTextMessage({
            to: incomingPhone,
            body: `📊 View your detailed ageing analysis and export at:\n🔗 ${reportLink}`,
          })
        }
      } catch (reportErr) {
        console.error('Failed to send PDF report via WhatsApp:', reportErr)
        await sendTextMessage({
          to: incomingPhone,
          body: `📊 Your PDF is taking a moment — view and download it any time at:\n🔗 ${reportLink}`,
        })
      }
      return
    }

    // Command 7: "Yes [Name]" (Approve Day 28 legal notice)
    const yesRegex = /^yes\s+(.+)$/i
    const yesMatch = body.match(yesRegex)

    if (yesMatch) {
      const [_, customerName] = yesMatch

      const customer = await prisma.customer.findFirst({
        where: {
          businessId: business.id,
          name: { equals: customerName.trim(), mode: 'insensitive' },
        },
      })

      if (!customer) {
        await sendTextMessage({
          to: incomingPhone,
          body: `⚠️ Customer "${customerName.trim()}" not found. Could not approve legal notice.`,
        })
        return
      }

      const invoice = await prisma.invoice.findFirst({
        where: {
          customerId: customer.id,
          businessId: business.id,
          status: { in: ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'] },
          legalNoticeSentAt: null,
        },
      })

      if (!invoice) {
        await sendTextMessage({
          to: incomingPhone,
          body: `✨ Customer "${customer.name}" does not have any pending Day 28 legal notices awaiting approval.`,
        })
        return
      }

      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          remindersPaused: false,
          legalNoticeSentAt: new Date(),
        },
      })

      await ReminderService.sendReminder({
        invoiceId: invoice.id,
        channel: 'BOTH',
        tone: 'LEGAL',
        triggeredBy: 'MANUAL',
      })

      await sendTextMessage({
        to: incomingPhone,
        body: `✅ Legal notice warning approved and sent to ${customer.name} on WhatsApp & Email!\nCadence resumed.`,
      })
      return
    }

    // Command 7b: "Approve [Name]" — owner approves a PENDING_CONFIRMATION payment via text
    // (used when the payment_pending_approval template isn't yet Meta-approved, so the
    // owner gets a free-text alert with these instructions instead of buttons)
    const approvePaymentRegex = /^approve\s+(.+)$/i
    const approvePaymentMatch = body.match(approvePaymentRegex)

    if (approvePaymentMatch) {
      const customerName = approvePaymentMatch[1].trim()

      const customer = await prisma.customer.findFirst({
        where: {
          businessId: business.id,
          name: { equals: customerName, mode: 'insensitive' },
        },
      })

      if (!customer) {
        await sendTextMessage({
          to: incomingPhone,
          body: `⚠️ Customer "${customerName}" not found.`,
        })
        return
      }

      const invoice = await prisma.invoice.findFirst({
        where: {
          customerId: customer.id,
          businessId: business.id,
          status: 'PENDING_CONFIRMATION',
        },
      })

      if (!invoice) {
        await sendTextMessage({
          to: incomingPhone,
          body: `✨ No payment pending confirmation from ${customer.name}.`,
        })
        return
      }

      const result = await confirmInvoicePayment({ invoiceId: invoice.id })
      await sendTextMessage({
        to: incomingPhone,
        body: result.ok
          ? `✅ Payment confirmed for ${customer.name}! Receipt sent to them on WhatsApp.`
          : `⚠️ Could not confirm payment — please check the dashboard.`,
      })
      return
    }

    // Command 7c: "Reject [Name]" — owner rejects a PENDING_CONFIRMATION payment
    const rejectPaymentRegex = /^reject\s+(.+)$/i
    const rejectPaymentMatch = body.match(rejectPaymentRegex)

    if (rejectPaymentMatch) {
      const customerName = rejectPaymentMatch[1].trim()

      const customer = await prisma.customer.findFirst({
        where: {
          businessId: business.id,
          name: { equals: customerName, mode: 'insensitive' },
        },
      })

      if (!customer) {
        await sendTextMessage({
          to: incomingPhone,
          body: `⚠️ Customer "${customerName}" not found.`,
        })
        return
      }

      const invoice = await prisma.invoice.findFirst({
        where: {
          customerId: customer.id,
          businessId: business.id,
          status: 'PENDING_CONFIRMATION',
        },
        include: { customer: true },
      })

      if (!invoice) {
        await sendTextMessage({
          to: incomingPhone,
          body: `✨ No payment pending rejection from ${customer.name}.`,
        })
        return
      }

      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: 'OVERDUE',
          paymentRef: null,
          autoReminder: true,
        },
      })

      await sendTextMessage({
        to: invoice.customer.phone,
        body: `⚠️ We couldn't verify your payment for invoice ${invoice.invoiceNumber}. Please check your transaction details and resubmit, or contact the business directly.`,
      }).catch(() => {})

      await sendTextMessage({
        to: incomingPhone,
        body: `❌ Payment rejected for ${customer.name} (${invoice.invoiceNumber}). Buyer notified. Reminders will resume.`,
      })
      return
    }

    // Command 8: "No [Name]" (Dismiss warning)
    const noRegex = /^no\s+(.+)$/i
    const noMatch = body.match(noRegex)

    if (noMatch && !lowercaseBody.startsWith('new invoice')) {
      const [_, customerName] = noMatch

      const customer = await prisma.customer.findFirst({
        where: {
          businessId: business.id,
          name: { equals: customerName.trim(), mode: 'insensitive' },
        },
      })

      if (!customer) {
        await sendTextMessage({
          to: incomingPhone,
          body: `⚠️ Customer "${customerName.trim()}" not found.`,
        })
        return
      }

      await sendTextMessage({
        to: incomingPhone,
        body: `⏸️ Legal notice warning dismissed for ${customer.name}. Automated reminders remain paused.`,
      })
      return
    }

    // Command 9: "Snooze [Name]" (Snooze by shifting due date +7 days)
    const snoozeRegex = /^snooze\s+(.+)$/i
    const snoozeMatch = body.match(snoozeRegex)

    if (snoozeMatch) {
      const [_, customerName] = snoozeMatch

      const customer = await prisma.customer.findFirst({
        where: {
          businessId: business.id,
          name: { equals: customerName.trim(), mode: 'insensitive' },
        },
      })

      if (!customer) {
        await sendTextMessage({
          to: incomingPhone,
          body: `⚠️ Customer "${customerName.trim()}" not found. Could not snooze reminders.`,
        })
        return
      }

      const invoice = await prisma.invoice.findFirst({
        where: {
          customerId: customer.id,
          businessId: business.id,
          status: { in: ['PENDING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'] },
        },
      })

      if (!invoice) {
        await sendTextMessage({
          to: incomingPhone,
          body: `✨ Customer "${customer.name}" does not have any pending invoices to snooze.`,
        })
        return
      }

      const newDueDate = addDays(invoice.dueDate, 7)

      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          dueDate: newDueDate,
          remindersPaused: false,
        },
      })

      await sendTextMessage({
        to: incomingPhone,
        body: `⏰ Snoozed: Invoice ${invoice.invoiceNumber} for ${customer.name} has been snoozed for 7 days.\n📅 New Due Date: ${formatDate(newDueDate)}\nAutomated cadence resumed (recalculated).`,
      })
      return
    }

    // Fallback: Default instructions if command not recognized
    await sendTextMessage({
      to: incomingPhone,
      body: `❓ Command not recognized.\n\nHere are the commands you can use:\n\n1️⃣ Create Invoice:\n👉 "New invoice [Name] [Amount] [Phone] [Due Date]"\n\n2️⃣ Get Status:\n👉 "Status"\n\n3️⃣ Record Payment:\n👉 "[Name] paid Rs [Amount]"\n\n4️⃣ Pause Recovery:\n👉 "Pause [Name]" (indefinitely)\n👉 "Pause [Name] [N] days" (auto-resumes, e.g. "Pause Ramesh 7 days")\n\n5️⃣ Get Monthly Report:\n👉 "Report"\n\n6️⃣ Human Gate (Day 28 approval):\n👉 "Yes [Name]" (Approve & send legal notice)\n👉 "No [Name]" (Keep paused)\n👉 "Snooze [Name]" (Snooze 7 days)`,
    })
  } catch (err) {
    console.error('Error handling WhatsApp Bot command:', err)
    try {
      await sendTextMessage({
        to: incomingPhone,
        body: `❌ Sorry, an error occurred while processing your command. Please try again or check your web dashboard.`,
      })
    } catch (sendErr) {
      console.error('Failed to send error notification:', sendErr)
    }
  }
}
