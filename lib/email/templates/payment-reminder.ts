/**
 * Payment reminder email templates — 3 tones (GENTLE · FIRM · LEGAL)
 * Sent only when payment has NOT been received.
 * Inline styles only — email clients strip <style>. Resend-compatible.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://udhaarclear.in'

export interface ReminderEmailParams {
  reminderId?: string | null
  customerName: string
  businessName: string
  businessPhone: string
  businessGstin?: string | null
  businessCity?: string | null
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  amount: string           // pre-formatted e.g. "₹45,000" — the REMAINING balance, never the original invoice total
  paidSoFarText?: string   // e.g. "₹7,500 already paid" — set only when a partial payment has been recorded
  daysOverdue: number
  paymentLink: string
  bankAccountNo?: string | null
  bankIfsc?: string | null
  bankAccountName?: string | null
  upiId?: string | null
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function firstName(fullName: string): string {
  return fullName.split(' ')[0]
}

function parseAmountStr(amountStr: string): number {
  return parseFloat(amountStr.replace(/[^0-9.]/g, '')) || 0
}

function formatAmountVal(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val)
}

function legalRefNo(invoiceNumber: string): string {
  return `UC-${new Date().getFullYear()}-${invoiceNumber.replace(/[^A-Z0-9]/gi, '').toUpperCase()}`
}

/** Returns a date string N days from today (e.g. "Friday, 13 June 2026") */
function dateInDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Shared layout shell ────────────────────────────────────────────────────

interface ShellOptions {
  accentColor: string
  previewText: string
  badgeHtml: string
  bodyHtml: string
  showInstallments: boolean
  params: ReminderEmailParams
}

function shell(opts: ShellOptions): string {
  const { accentColor, previewText, badgeHtml, bodyHtml, showInstallments, params } = opts

  const rawAmount = parseAmountStr(params.amount)
  const halfAmount = formatAmountVal(Math.round(rawAmount / 2))

  const isPreview = params.reminderId === 'preview-mode-no-id'
  const hasBankNo = !!params.bankAccountNo || isPreview
  const hasUpi = !!params.upiId || isPreview

  const displayAccountName = params.bankAccountName || params.businessName
  const displayAccountNo = params.bankAccountNo || (isPreview ? '918789876567' : '')
  const displayIfsc = params.bankIfsc || (isPreview ? 'SBIN0003490' : '')
  const displayUpi = params.upiId || (isPreview ? 'sbi3490@ibl' : '')

  // Timeline Logic
  const days = params.daysOverdue
  const step1Color = '#10B981' // Issued is always completed
  const step2Color = days >= 0 ? '#10B981' : '#CBD5E1'
  const step3Color = days > 0 ? accentColor : '#CBD5E1'
  
  const step1Text = '#10B981'
  const step2Text = days >= 0 ? '#10B981' : '#64748B'
  const step3Text = days > 0 ? accentColor : '#64748B'

  const timelineHtml = `
    <!-- PROGRESS TIMELINE WIDGET -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0 28px; border-collapse: collapse; font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
      <tr>
        <!-- Step 1 -->
        <td align="left" width="30%">
          <div style="font-size: 10px; font-weight: 700; color: ${step1Text}; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Issued</div>
          <div style="height: 6px; background-color: ${step1Color}; border-radius: 3px;"></div>
        </td>
        <!-- Connector -->
        <td width="5%" style="padding: 0 4px; vertical-align: bottom;">
          <div style="height: 6px; background-color: ${days >= 0 ? '#10B981' : '#E2E8F0'}; border-radius: 3px; margin-bottom: 0px;"></div>
        </td>
        <!-- Step 2 -->
        <td align="center" width="30%">
          <div style="font-size: 10px; font-weight: 700; color: ${step2Text}; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Due Date</div>
          <div style="height: 6px; background-color: ${step2Color}; border-radius: 3px;"></div>
        </td>
        <!-- Connector -->
        <td width="5%" style="padding: 0 4px; vertical-align: bottom;">
          <div style="height: 6px; background-color: ${days > 0 ? accentColor : '#E2E8F0'}; border-radius: 3px; margin-bottom: 0px;"></div>
        </td>
        <!-- Step 3 -->
        <td align="right" width="30%">
          <div style="font-size: 10px; font-weight: 700; color: ${step3Text}; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Overdue</div>
          <div style="height: 6px; background-color: ${step3Color}; border-radius: 3px;"></div>
        </td>
      </tr>
    </table>
  `

  const installmentsHtml = showInstallments ? `
      <!-- INSTALLMENTS (Flexible split payment) -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E2E8F0;border-radius:16px;border-collapse:separate;margin-bottom:24px;font-size:13px;overflow:hidden;background-color:#ffffff">
        <tr>
          <td style="padding:12px 20px;border-bottom:1px solid #E2E8F0;background-color:#F8FAFC">
            <span style="font-size:11px;font-weight:700;color:#0F766E;text-transform:uppercase;letter-spacing:0.05em">💡 Flexible Split Payment Option</span>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 20px;border-bottom:1px solid #F1F5F9">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <div style="font-size:11px;color:#64748B;margin-bottom:2px;text-transform:uppercase;font-weight:600">Term 1 — Pay 50%</div>
                  <div style="font-size:18px;font-weight:700;color:#0F172A;font-family:'Plus Jakarta Sans',-apple-system,sans-serif">${halfAmount}</div>
                </td>
                <td align="right" width="130">
                  <a href="${params.paymentLink}?split=1" style="display:inline-block;background-color:#0F766E;color:#ffffff;font-size:12px;font-weight:700;padding:8px 18px;border-radius:8px;text-decoration:none;box-shadow:0 2px 4px rgba(15,118,110,0.1)">Pay Term 1</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 20px">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <div style="font-size:11px;color:#94A3B8;margin-bottom:2px;text-transform:uppercase;font-weight:600">Term 2 — Remaining 50%</div>
                  <div style="font-size:18px;font-weight:700;color:#94A3B8;font-family:'Plus Jakarta Sans',-apple-system,sans-serif">${halfAmount}</div>
                </td>
                <td align="right" width="130">
                  <span style="display:inline-block;background:#F0FDF4;color:#15803D;font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;border:1px solid #DCFCE7">Due in 15 days</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>` : ''

  const bankHtml = (hasBankNo || hasUpi) ? `
        <!-- DIRECT TRANSFER DETAILS CARD -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E2E8F0;border-radius:16px;border-collapse:separate;margin-top:24px;overflow:hidden;background-color:#ffffff">
          <tr>
            <td colspan="2" style="padding:12px 20px;border-bottom:1px solid #E2E8F0;background-color:#F8FAFC">
              <span style="font-size:11px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.05em">🏦 Direct Bank / UPI Transfer</span>
            </td>
          </tr>
          ${hasBankNo ? `
          <tr>
            <td width="40%" style="padding:14px 20px;border-bottom:1px solid #F1F5F9;color:#64748B;font-size:13px">Account Name</td>
            <td width="60%" align="right" style="padding:14px 20px;border-bottom:1px solid #F1F5F9;font-weight:600;color:#0F172A;font-size:13px">${displayAccountName}</td>
          </tr>
          <tr>
            <td width="40%" style="padding:14px 20px;border-bottom:1px solid #F1F5F9;color:#64748B;font-size:13px">Account Number</td>
            <td width="60%" align="right" style="padding:14px 20px;border-bottom:1px solid #F1F5F9;font-weight:700;color:#0F172A;font-family:monospace;font-size:13.5px">${displayAccountNo}</td>
          </tr>
          <tr>
            <td width="40%" style="padding:14px 20px;${hasUpi ? 'border-bottom:1px solid #F1F5F9;' : ''}color:#64748B;font-size:13px">IFSC Code</td>
            <td width="60%" align="right" style="padding:14px 20px;${hasUpi ? 'border-bottom:1px solid #F1F5F9;' : ''}font-weight:700;color:#0F172A;font-family:monospace;font-size:13.5px">${displayIfsc}</td>
          </tr>` : ''}
          ${hasUpi ? `
          <tr>
            <td width="40%" style="padding:14px 20px;color:#64748B;font-size:13px">UPI ID</td>
            <td width="60%" align="right" style="padding:14px 20px;font-weight:700;color:#0F172A;font-family:monospace;font-size:13.5px">${displayUpi}</td>
          </tr>` : ''}
        </table>` : ''

  const utrHtml = `
        <!-- UTR SUBMISSION CARD -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F8FAFC;border:1px dashed #CBD5E1;border-radius:16px;margin-top:24px">
          <tr>
            <td style="padding:20px;text-align:center">
              <div style="font-size:14px;font-weight:700;color:#0F172A;margin-bottom:6px">Already Paid via Bank Transfer?</div>
              <p style="font-size:12px;color:#64748B;margin:0 0 16px;line-height:1.5">Please share your Transaction ID / UTR reference. We will immediately verify the transfer and turn off future reminders.</p>
              <a href="${params.paymentLink}/confirm" style="display:inline-block;background-color:#475569;color:#ffffff;border-radius:8px;padding:10px 24px;font-size:12.5px;font-weight:600;text-decoration:none;box-shadow:0 2px 4px rgba(71,85,105,0.1)">Submit UTR Reference</a>
            </td>
          </tr>
        </table>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${params.invoiceNumber} · ${params.businessName}</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">

<div style="display:none;max-height:0;overflow:hidden">${previewText}</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F8FAFC;padding:40px 16px">
<tr><td align="center">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 10px 30px -10px rgba(0,0,0,0.04)">

    <!-- HEADER -->
    <tr>
      <td style="padding:32px 32px 24px;border-bottom:1px solid #F1F5F9;background-color:#ffffff">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:28px;height:28px;background-color:#0F172A;border-radius:8px;text-align:center;vertical-align:middle">
                    <span style="font-size:14px;font-weight:900;color:#ffffff;line-height:28px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif">U</span>
                  </td>
                  <td style="padding-left:10px;font-size:16px;font-weight:800;color:#0F172A;vertical-align:middle;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;letter-spacing:-0.02em">UdhaarClear</td>
                  <td style="padding-left:8px;font-size:12px;color:#64748B;vertical-align:middle;font-family:-apple-system,sans-serif">/ via ${params.businessName}</td>
                </tr>
              </table>
            </td>
            <td align="right">${badgeHtml}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="padding:32px 32px 40px">
        
        ${timelineHtml}

        <div style="font-size:14.5px;color:#334155;line-height:1.65">
          ${bodyHtml}
        </div>

        <!-- AMOUNT DUE CARD -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%); border: 1px solid #E2E8F0; border-radius: 16px; border-collapse: separate; margin: 28px 0 24px; overflow: hidden;">
          <tr>
            <td style="padding: 24px; text-align: center;">
              <span style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 6px;">Total Amount Outstanding</span>
              <span style="font-size: 38px; font-weight: 800; color: #0F172A; letter-spacing: -0.03em; display: block; font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">${params.amount}</span>
              <span style="font-size: 12.5px; font-weight: 600; color: ${days > 0 ? '#EF4444' : '#10B981'}; display: block; margin-top: 6px;">
                ${days > 0 ? `⚠️ Overdue by ${days} days (Due Date: ${params.dueDate})` : `⏰ Due on ${params.dueDate}`}
              </span>
              ${params.paidSoFarText ? `
              <span style="font-size: 12px; font-weight: 600; color: #0F766E; display: block; margin-top: 4px;">
                ✓ ${params.paidSoFarText} — amount above is what's still pending
              </span>` : ''}
            </td>
          </tr>
          <tr style="background-color: #ffffff;">
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #E2E8F0;">
                <tr>
                  <td style="padding: 14px 20px; font-size: 13px; color: #64748B; border-right: 1px solid #E2E8F0;">Invoice Number</td>
                  <td align="right" style="padding: 14px 20px; font-size: 13px; font-weight: 650; color: #0F172A; font-family: monospace;">#${params.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px; font-size: 13px; color: #64748B; border-right: 1px solid #E2E8F0;">Invoice Date</td>
                  <td align="right" style="padding: 14px 20px; font-size: 13px; font-weight: 500; color: #0F172A;">${params.invoiceDate}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        ${installmentsHtml}

        <!-- CTA BUTTON -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 8px">
          <tr>
            <td align="center">
              <a href="${params.paymentLink}" style="display:inline-block;background-color:${accentColor};color:#ffffff;font-size:15px;font-weight:700;padding:16px 48px;border-radius:12px;text-decoration:none;letter-spacing:-0.01em;box-shadow:0 4px 12px ${accentColor}33;font-family:'Plus Jakarta Sans',-apple-system,sans-serif">
                Pay Securely Now &nbsp;→
              </a>
            </td>
          </tr>
        </table>
        
        <!-- SECURE SEALS -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px">
          <tr>
            <td align="center" style="font-size: 11px; color: #64748B; font-weight: 500;">
              <span style="display: inline-block; vertical-align: middle; margin-right: 4px;">🛡️ 256-bit SSL Secure Checkout</span>
              <span style="display: inline-block; vertical-align: middle; color: #CBD5E1; margin: 0 6px;">•</span>
              <span style="display: inline-block; vertical-align: middle;">💳 UPI, Cards, Netbanking & Wallets</span>
            </td>
          </tr>
        </table>

        ${bankHtml}

        ${utrHtml}

        <p style="margin-top:32px;padding-top:24px;border-top:1px solid #F1F5F9;font-size:12px;color:#64748B;line-height:1.6;text-align:center">
          Questions or concerns? Reach out to ${params.businessName} at <strong style="color:#0F172A">${params.businessPhone}</strong>
        </p>

      </td>
    </tr>
  </table>

  <!-- FOOTER -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;margin-top:24px">
    <tr>
      <td align="center">
        <p style="font-size:11px;color:#94A3B8;margin:0 0 4px;font-weight:500;letter-spacing:0.02em">Powered by UdhaarClear.in</p>
      </td>
    </tr>
  </table>

</td></tr>
</table>
${params.reminderId ? `<img src="${APP_URL}/api/reminders/track/email-open?reminderId=${params.reminderId}" width="1" height="1" style="display:none" alt="" />` : ''}
</body>
</html>`
}


// ─── GENTLE tone ─────────────────────────────────────────────────────────────
// Days: -3, 0, +3, +7

export function buildGentleEmail(params: ReminderEmailParams): { subject: string; html: string } {
  const name = firstName(params.customerName)
  const isDue = params.daysOverdue === 0
  const isPreDue = params.daysOverdue < 0
  const daysAbs = Math.abs(params.daysOverdue)

  const subject = isDue
    ? `Invoice ${params.invoiceNumber} is due today — ${params.businessName}`
    : isPreDue
      ? `Invoice ${params.invoiceNumber} is due in ${daysAbs} ${daysAbs === 1 ? 'day' : 'days'} — ${params.businessName}`
      : params.daysOverdue <= 3
        ? `Invoice ${params.invoiceNumber} is ${params.daysOverdue} days overdue — ${params.businessName}`
        : `Last reminder — invoice ${params.invoiceNumber} is 7 days overdue`

  const preview = isDue
    ? `Your invoice of ${params.amount} is due today.`
    : isPreDue
      ? `Invoice ${params.invoiceNumber} for ${params.amount} is due in ${daysAbs} ${daysAbs === 1 ? 'day' : 'days'}.`
      : `Invoice ${params.invoiceNumber} for ${params.amount} is ${params.daysOverdue} days overdue.`

  const badge = `<span style="background-color:#E6F4EA;color:#137333;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.02em;">Payment Reminder</span>`

  let body: string

  if (isPreDue) {
    // Day −3
    body = `
      <p style="font-size:16px;font-weight:700;color:#0F172A;margin:0 0 12px">Hi ${name},</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 12px">
        This is a friendly note that your invoice from <strong style="color:#0F172A">${params.businessName}</strong> for <strong style="color:#0F172A">${params.amount}</strong> is due on <strong style="color:#0F172A">${params.dueDate}</strong> (${daysAbs} ${daysAbs === 1 ? 'day' : 'days'} from now).
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0">
        You can pay using the link below, or select the installment option to split the payment across two terms.
      </p>`
  } else if (isDue) {
    // Day 0
    body = `
      <p style="font-size:16px;font-weight:700;color:#0F172A;margin:0 0 12px">Hi ${name},</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 12px">
        Your invoice from <strong style="color:#0F172A">${params.businessName}</strong> for <strong style="color:#0F172A">${params.amount}</strong> is due today. Please settle it using the payment link below.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0">
        If you would prefer to split this payment, the 2-term installment option is available at checkout.
      </p>`
  } else if (params.daysOverdue <= 3) {
    // Day +3
    body = `
      <p style="font-size:16px;font-weight:700;color:#0F172A;margin:0 0 12px">Hi ${name},</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 12px">
        We hope you are doing well. Invoice <strong style="color:#0F172A">${params.invoiceNumber}</strong> from <strong style="color:#0F172A">${params.businessName}</strong> for <strong style="color:#0F172A">${params.amount}</strong> was due on ${params.dueDate} and is now <strong style="color:#0F172A">${params.daysOverdue} days overdue</strong>.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0">
        Please take a moment to settle it using the link below at your earliest convenience.
      </p>`
  } else {
    // Day +7 — last gentle touch
    body = `
      <p style="font-size:16px;font-weight:700;color:#0F172A;margin:0 0 12px">Hi ${name},</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 16px">
        Invoice <strong style="color:#0F172A">${params.invoiceNumber}</strong> from <strong style="color:#0F172A">${params.businessName}</strong> for <strong style="color:#0F172A">${params.amount}</strong> is now <strong style="color:#0F172A">7 days overdue</strong>. This is our last informal reminder regarding this payment.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 20px">
        If there's any concern or discrepancy, please reach out at <strong style="color:#0F172A">${params.businessPhone}</strong> so we can resolve it directly.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#FFFBEB;border:1px solid #FEF3C7;border-radius:12px;padding:14px 18px;font-size:13px;color:#B45309;line-height:1.6">
            <strong>Please Note:</strong> After today, outstanding invoice reminders will escalate and follow-ups will become more formal.
          </td>
        </tr>
      </table>`
  }

  return {
    subject,
    html: shell({ accentColor: '#0F766E', previewText: preview, badgeHtml: badge, bodyHtml: body, showInstallments: parseAmountStr(params.amount) < 200_000, params }),
  }
}

// ─── FIRM tone ────────────────────────────────────────────────────────────────
// Days: +10, +15, +21

export function buildFirmEmail(params: ReminderEmailParams): { subject: string; html: string } {
  const name = firstName(params.customerName)
  const deadlineDate = dateInDays(5)  // for day +10: pay within 5 days of this notice
  const fridayDate = dateInDays(3)  // for day +15: 3 days from now

  let subject: string
  let preview: string
  let body: string

  if (params.daysOverdue < 15) {
    // Day +10 — tone shift, first firm touch
    subject = `Action required — invoice ${params.invoiceNumber} is 10 days overdue`
    preview = `Payment of ${params.amount} is 10 days overdue. Please settle by ${deadlineDate}.`
    body = `
      <p style="font-size:16px;font-weight:700;color:#0F172A;margin:0 0 12px">Dear ${name},</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 16px">
        Invoice <strong style="color:#0F172A">${params.invoiceNumber}</strong> from <strong style="color:#0F172A">${params.businessName}</strong> for <strong style="color:#0F172A">${params.amount}</strong> is now <strong style="color:#C2410C">10 days overdue</strong>. Please ensure the full outstanding balance is settled by <strong style="color:#0F172A">${deadlineDate}</strong>.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 20px">
        If you have any questions or are facing payment delays, please contact us immediately at <strong style="color:#0F172A">${params.businessPhone}</strong>.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#FFFBEB;border:1px solid #FEF3C7;border-radius:12px;padding:14px 18px;font-size:13px;color:#B45309;line-height:1.6">
            <strong>Escalation Warning:</strong> If payment is not received by ${deadlineDate}, this account may be escalated to our legal recovery team.
          </td>
        </tr>
      </table>`
  } else if (params.daysOverdue < 21) {
    // Day +15 — hard deadline
    subject = `Final deadline — settle by ${fridayDate} | invoice ${params.invoiceNumber}`
    preview = `Invoice ${params.invoiceNumber} for ${params.amount} is 15 days overdue. Settle by ${fridayDate} or this escalates.`
    body = `
      <p style="font-size:16px;font-weight:700;color:#0F172A;margin:0 0 12px">Dear ${name},</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 16px">
        Invoice <strong style="color:#0F172A">${params.invoiceNumber}</strong> from <strong style="color:#0F172A">${params.businessName}</strong> for <strong style="color:#0F172A">${params.amount}</strong> is now <strong style="color:#C2410C">15 days overdue</strong>. Multiple previous reminders regarding this outstanding balance have gone unanswered.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 20px">
        This is your final opportunity to settle directly with us. Full payment must be received no later than <strong style="color:#0F172A">${fridayDate}</strong>.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#FEF2F2;border:1px solid #FEE2E2;border-radius:12px;padding:14px 18px;font-size:13px;color:#991B1B;line-height:1.6">
            <strong>Important:</strong> If payment is not processed by <strong style="color:#991B1B">${fridayDate}</strong>, we will refer this matter to our legal counsel without further communication.
          </td>
        </tr>
      </table>`
  } else {
    // Day +21 — final warning
    subject = `Final warning — invoice ${params.invoiceNumber} is 21 days overdue · legal review begins in 7 days`
    preview = `Invoice ${params.invoiceNumber} is 21 days overdue. Legal proceedings begin at 28 days under the MSME Act.`
    body = `
      <p style="font-size:16px;font-weight:700;color:#0F172A;margin:0 0 12px">Dear ${name},</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 16px">
        Invoice <strong style="color:#0F172A">${params.invoiceNumber}</strong> from <strong style="color:#0F172A">${params.businessName}</strong> for <strong style="color:#0F172A">${params.amount}</strong> is now <strong style="color:#C2410C">21 days overdue</strong>. Legal recovery proceedings are scheduled to begin automatically when this invoice reaches 28 days past due, in accordance with the MSME Development Act, 2006.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#FEF2F2;border:1px solid #FEE2E2;border-radius:12px;padding:14px 18px;font-size:13px;color:#991B1B;line-height:1.6">
            <strong>Action Required:</strong> You have <strong style="color:#991B1B">7 days</strong> to settle this invoice before formal proceedings begin. After that, filing before the MSME Facilitation Council and credit bureau reporting will commence, which cannot be reversed.
          </td>
        </tr>
      </table>`
  }

  const badge = `<span style="background-color:#FFFBEB;color:#D97706;border:1px solid #FEF3C7;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.02em;">Action Required</span>`

  return {
    subject,
    html: shell({ accentColor: '#C2410C', previewText: preview, badgeHtml: badge, bodyHtml: body, showInstallments: false, params }),
  }
}

// ─── LEGAL tone ───────────────────────────────────────────────────────────────
// Days: +28, +35, +42

export function buildLegalEmail(params: ReminderEmailParams): { subject: string; html: string } {
  const refNo = legalRefNo(params.invoiceNumber)

  let subject: string
  let preview: string
  let body: string

  if (params.daysOverdue < 35) {
    // Day +28 — MSME threshold, 7-day window
    subject = `Formal legal demand notice — MSME Act 2006 applies | ${params.invoiceNumber}`
    preview = `Formal demand. ${params.amount} is 28 days overdue. Settle within 7 days or proceedings begin. Ref: ${refNo}.`
    body = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
        <tr>
          <td style="background-color:#FEF2F2;border:1px solid #FEE2E2;border-radius:12px;padding:14px 18px">
            <span style="font-size:11px;font-weight:800;color:#991B1B;letter-spacing:0.05em;text-transform:uppercase;display:block;margin-bottom:2px">Formal Legal Demand Notice</span>
            <span style="font-size:11px;color:#991B1B;font-family:monospace;font-weight:700">Ref: ${refNo}</span>
          </td>
        </tr>
      </table>
      <p style="font-size:16px;font-weight:700;color:#0F172A;margin:0 0 4px">Dear ${params.customerName},</p>
      <p style="font-size:12px;color:#64748B;margin:0 0 16px;font-weight:500">Re: Invoice ${params.invoiceNumber} &nbsp;·&nbsp; ${params.amount} &nbsp;·&nbsp; 28 days overdue</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 14px">
        This is a <strong style="color:#0F172A">formal legal demand notice</strong>. Invoice <strong style="color:#0F172A">${params.invoiceNumber}</strong> from <strong style="color:#0F172A">${params.businessName}</strong> for <strong style="color:#0F172A">${params.amount}</strong> is now <strong style="color:#B91C1C">28 days overdue</strong>.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 20px">
        You are required to settle the full outstanding amount within <strong style="color:#0F172A">7 days</strong> of this notice. Failure to do so will result in formal escalation.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#FEF2F2;border:1px solid #FEE2E2;border-radius:12px;padding:14px 18px;font-size:12.5px;color:#991B1B;line-height:1.65">
            Under the <strong style="color:#991B1B">MSME Development Act, 2006</strong>, buyers are legally required to pay MSME suppliers within 45 days. Non-payment attracts compound interest at 3× the RBI bank rate. Continued non-payment may result in: filing before the <strong style="color:#991B1B">MSME Facilitation Council</strong>, CIBIL credit bureau reporting, and civil recovery proceedings. Reference: ${refNo}.
          </td>
        </tr>
      </table>`
  } else if (params.daysOverdue < 42) {
    // Day +35 — 48-hour ultimatum
    subject = `48 hours remaining — MSME Facilitation Council filing pending | Ref: ${refNo}`
    preview = `Our formal notice has not been acted upon. 48 hours remain before MSME filing. Ref: ${refNo}.`
    body = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
        <tr>
          <td style="background-color:#FEF2F2;border:1px solid #FEE2E2;border-radius:12px;padding:14px 18px">
            <span style="font-size:11px;font-weight:800;color:#991B1B;letter-spacing:0.05em;text-transform:uppercase;display:block;margin-bottom:2px">Urgent Legal Notice</span>
            <span style="font-size:11px;color:#991B1B;font-family:monospace;font-weight:700">Ref: ${refNo}</span>
          </td>
        </tr>
      </table>
      <p style="font-size:16px;font-weight:700;color:#0F172A;margin:0 0 4px">Dear ${params.customerName},</p>
      <p style="font-size:12px;color:#64748B;margin:0 0 16px;font-weight:500">Re: Invoice ${params.invoiceNumber} &nbsp;·&nbsp; ${params.amount} &nbsp;·&nbsp; 35 days overdue</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 14px">
        Our formal demand notice (Ref: <strong style="color:#0F172A">${refNo}</strong>) issued 7 days ago has not been resolved. Invoice <strong style="color:#0F172A">${params.invoiceNumber}</strong> for <strong style="color:#0F172A">${params.amount}</strong> is now <strong style="color:#B91C1C">35 days overdue</strong>.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 20px">
        You have <strong style="color:#0F172A">48 hours</strong> from this notice to make full payment. After this window, we will file before the MSME Facilitation Council without further warning.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#FEF2F2;border:1px solid #FEE2E2;border-radius:12px;padding:14px 18px;font-size:12.5px;color:#991B1B;line-height:1.65">
            Filing will result in: compound interest recovery at 3× RBI bank rate, CIBIL credit impact, and legal fees added to your outstanding liability. This is your final opportunity to settle before formal proceedings begin.
          </td>
        </tr>
      </table>`
  } else {
    // Day +42 — final demand, proceedings initiated
    subject = `Final demand — legal proceedings initiated | Ref: ${refNo}`
    preview = `Formal proceedings have been initiated for non-payment of ${params.amount}. Ref: ${refNo}.`
    body = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
        <tr>
          <td style="background-color:#FEF2F2;border:1px solid #FEE2E2;border-radius:12px;padding:14px 18px">
            <span style="font-size:11px;font-weight:800;color:#991B1B;letter-spacing:0.05em;text-transform:uppercase;display:block;margin-bottom:2px">Final Demand Notice</span>
            <span style="font-size:11px;color:#991B1B;font-family:monospace;font-weight:700">Ref: ${refNo}</span>
          </td>
        </tr>
      </table>
      <p style="font-size:16px;font-weight:700;color:#0F172A;margin:0 0 4px">Dear ${params.customerName},</p>
      <p style="font-size:12px;color:#64748B;margin:0 0 16px;font-weight:500">Re: Invoice ${params.invoiceNumber} &nbsp;·&nbsp; ${params.amount} &nbsp;·&nbsp; 42 days overdue</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 14px">
        Please be advised that <strong style="color:#0F172A">formal legal proceedings have been initiated</strong> against you for non-payment of invoice <strong style="color:#0F172A">${params.invoiceNumber}</strong> from <strong style="color:#0F172A">${params.businessName}</strong> for <strong style="color:#0F172A">${params.amount}</strong>. This invoice is now 42 days overdue.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 20px">
        All automated communications cease. This matter is now handled by our legal representatives. Ref: <strong style="color:#0F172A">${refNo}</strong>.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#FEF2F2;border:1px solid #FEE2E2;border-radius:12px;padding:14px 18px;font-size:12.5px;color:#991B1B;line-height:1.65">
            To halt proceedings at this stage, full payment including applicable interest must be made immediately. Confirm your transaction reference to <strong style="color:#991B1B">${params.businessPhone}</strong>.
          </td>
        </tr>
      </table>`
  }

  const badge = `<span style="background-color:#FEF2F2;color:#DC2626;border:1px solid #FEE2E2;font-size:11px;font-weight:800;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.02em;">${params.daysOverdue >= 42 ? 'Final Demand' : 'Legal Notice'}</span>`

  return {
    subject,
    html: shell({ accentColor: '#B91C1C', previewText: preview, badgeHtml: badge, bodyHtml: body, showInstallments: false, params }),
  }
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

export function buildReminderEmail(
  tone: 'GENTLE' | 'FIRM' | 'LEGAL',
  params: ReminderEmailParams
): { subject: string; html: string } {
  if (tone === 'FIRM') return buildFirmEmail(params)
  if (tone === 'LEGAL') return buildLegalEmail(params)
  return buildGentleEmail(params)
}
