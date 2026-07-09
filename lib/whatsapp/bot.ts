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

/** Parses the trailing due-date text in a "New invoice" command, defaulting to 30 days credit. */
function parseDueDate(dateStr?: string): Date {
  return parseFlexibleDate(dateStr, 30)
}

/**
 * Main command router for inbound WhatsApp messages sent by Sellers.
 */
export async function handleInboundMessage(message: WhatsAppMessage): Promise<void> {
  const incomingPhone = message.from
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

      await sendTextMessage({
        to: incomingPhone,
        body: `✅ Payment recorded for ${customer.name}!\n📝 ${messageSuffix}\nAutomated alerts paused for this invoice.`,
      })
      return
    }

    // Command 5: "Pause [Name]" or "Pause [Name] [N] days"
    // Pause recovery sequences for a customer — either indefinitely (no
    // duration given, resumed only by the owner), or for a fixed window
    // (e.g. "Pause Ramesh 7 days" when the buyer promises to pay soon).
    // A time-boxed pause auto-resumes via autoExpireSnoozedInvoices() in
    // lib/cron/reminder-engine.ts once the window passes.
    const pauseRegex = /^pause\s+(.+?)(?:\s+(\d+)\s*days?)?$/i
    const pauseMatch = body.match(pauseRegex)

    if (pauseMatch) {
      const [_, customerName, daysStr] = pauseMatch
      const snoozeDays = daysStr ? parseInt(daysStr, 10) : null

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
        },
      })

      const confirmation = remindersPausedUntil
        ? `⏸️ Paused automated reminders for ${customer.name} for ${snoozeDays} day${snoozeDays === 1 ? '' : 's'}. They'll resume automatically on ${formatDate(remindersPausedUntil)} unless you resume sooner from the dashboard.`
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
