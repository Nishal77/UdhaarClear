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
  amount: string           // pre-formatted e.g. "₹45,000"
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
  const hasBankNo  = !!params.bankAccountNo || isPreview
  const hasUpi     = !!params.upiId || isPreview

  const displayAccountName = params.bankAccountName || params.businessName
  const displayAccountNo   = params.bankAccountNo   || (isPreview ? '918789876567' : '')
  const displayIfsc        = params.bankIfsc         || (isPreview ? 'SBIN0003490'  : '')
  const displayUpi         = params.upiId            || (isPreview ? 'sbi3490@ibl'  : '')

  const cleanPhone = params.businessPhone.replace(/[^0-9]/g, '')
  const waPhone    = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone
  const waText     = encodeURIComponent(`Hi, I paid Invoice ${params.invoiceNumber} of ${params.amount}. UTR: `)

  const installmentsHtml = showInstallments ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e8e8e8;border-radius:10px;border-collapse:separate;margin-bottom:20px;font-size:13px">
      <tr>
        <td style="padding:14px 16px;border-bottom:1px solid #f0f0f0">
          <span style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.05em">Flexible 2-term option</span>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <div style="font-size:11px;color:#888;margin-bottom:3px">Term 1 — 50%</div>
                <div style="font-size:16px;font-weight:700;color:#111">${halfAmount}</div>
              </td>
              <td align="right" width="130">
                <a href="${params.paymentLink}?split=1" style="display:inline-block;background-color:${accentColor};color:#fff;font-size:12px;font-weight:700;padding:8px 18px;border-radius:6px;text-decoration:none">Pay term 1</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 16px">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <div style="font-size:11px;color:#888;margin-bottom:3px">Term 2 — 50%</div>
                <div style="font-size:16px;font-weight:700;color:#bbb">${halfAmount}</div>
              </td>
              <td align="right" width="130">
                <span style="display:inline-block;background:#f5f3ff;color:#6d28d9;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px">Due in 15 days</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>` : ''

  const bankHtml = (hasBankNo || hasUpi) ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9fafb;border:1px solid #f0f0f0;border-radius:10px;border-collapse:separate;margin-top:20px">
      <tr>
        <td style="padding:14px 16px 10px">
          <span style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.05em">Direct transfer details</span>
        </td>
      </tr>
      <tr>
        <td style="padding:0 16px 14px">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:12.5px">
            ${hasBankNo ? `
            <tr>
              <td style="color:#888;padding-bottom:7px">Account name</td>
              <td align="right" style="font-weight:600;color:#111;padding-bottom:7px">${displayAccountName}</td>
            </tr>
            <tr>
              <td style="color:#888;padding-bottom:7px">Account number</td>
              <td align="right" style="font-weight:600;color:#111;font-family:monospace;padding-bottom:7px">${displayAccountNo}</td>
            </tr>
            <tr>
              <td style="color:#888;padding-bottom:${hasUpi ? '7px' : '0'}">IFSC</td>
              <td align="right" style="font-weight:600;color:#111;font-family:monospace;padding-bottom:${hasUpi ? '7px' : '0'}">${displayIfsc}</td>
            </tr>` : ''}
            ${hasUpi ? `
            <tr>
              <td style="color:#888">UPI ID</td>
              <td align="right" style="font-weight:600;color:#111;font-family:monospace">${displayUpi}</td>
            </tr>` : ''}
          </table>
        </td>
      </tr>
    </table>` : ''

  const utrHtml = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;border:1px dashed #e2e8f0;border-radius:10px;margin-top:16px">
      <tr>
        <td style="padding:16px;text-align:center">
          <div style="font-size:13px;font-weight:600;color:#1e293b;margin-bottom:4px">Paid via bank transfer?</div>
          <p style="font-size:12px;color:#64748b;margin:0 0 12px;line-height:1.5">Share your UTR / transaction ID and we'll mark this invoice as settled.</p>
          <table align="center" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:360px;margin:0 auto">
            <tr>
              <td style="padding-right:8px">
                <input type="text" placeholder="Enter UTR / txn ID" style="width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:6px;padding:8px 12px;font-size:12.5px;color:#1e293b;background:#fff;outline:none" />
              </td>
              <td width="80">
                <a href="${params.paymentLink}?proof=1" style="display:block;background:${accentColor};color:#fff;text-align:center;border-radius:6px;padding:9px 0;font-size:12px;font-weight:700;text-decoration:none">Submit</a>
              </td>
            </tr>
          </table>
          <div style="margin-top:14px;padding-top:12px;border-top:1px dashed #e2e8f0">
            <a href="https://wa.me/${waPhone}?text=${waText}" style="color:#16a34a;font-size:12.5px;font-weight:600;text-decoration:none">
              Submit via WhatsApp bot ↗
            </a>
          </div>
        </td>
      </tr>
    </table>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="x-apple-disable-message-reformatting"/>
<title>${params.invoiceNumber} · ${params.businessName}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">

<div style="display:none;max-height:0;overflow:hidden">${previewText}&nbsp;&#847;&nbsp;</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:32px 16px">
<tr><td align="center">

  <!-- Outer card -->
  <table width="580" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7">

    <!-- Accent bar -->
    <tr><td style="height:4px;background:${accentColor};font-size:0">&nbsp;</td></tr>

    <!-- Header -->
    <tr>
      <td style="padding:20px 28px 16px;border-bottom:1px solid #f4f4f5">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:22px;height:22px;background:#111;border-radius:5px;text-align:center;vertical-align:middle">
                    <span style="font-size:11px;font-weight:900;color:#fff;line-height:22px">U</span>
                  </td>
                  <td style="padding-left:7px;font-size:13px;font-weight:700;color:#111;vertical-align:middle;letter-spacing:-0.01em">udhaarclear</td>
                  <td style="padding-left:6px;font-size:12px;color:#888;vertical-align:middle">/ via ${params.businessName}</td>
                </tr>
              </table>
            </td>
            <td align="right">
              ${badgeHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:28px 28px 32px">

        ${bodyHtml}

        <!-- Invoice summary -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #f0f0f0;border-radius:10px;border-collapse:separate;margin:20px 0;font-size:13px">
          <tr>
            <td style="padding:13px 16px;border-bottom:1px solid #f0f0f0;color:#888">Invoice number</td>
            <td align="right" style="padding:13px 16px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#111;font-family:monospace">${params.invoiceNumber}</td>
          </tr>
          <tr>
            <td style="padding:13px 16px;border-bottom:1px solid #f0f0f0;color:#888">Invoice date</td>
            <td align="right" style="padding:13px 16px;border-bottom:1px solid #f0f0f0;font-weight:500;color:#111">${params.invoiceDate}</td>
          </tr>
          <tr>
            <td style="padding:13px 16px;border-bottom:1px solid #f0f0f0;color:#888">Due date</td>
            <td align="right" style="padding:13px 16px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#111">${params.dueDate}</td>
          </tr>
          <tr>
            <td style="padding:14px 16px;background:#fafafa;border-bottom-left-radius:10px;font-size:13px;font-weight:600;color:#555">Amount due</td>
            <td align="right" style="padding:14px 16px;background:#fafafa;border-bottom-right-radius:10px;font-size:20px;font-weight:800;color:#111">${params.amount}</td>
          </tr>
        </table>

        <!-- Installments (GENTLE only) -->
        ${installmentsHtml}

        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 8px">
          <tr>
            <td align="center">
              <a href="${params.paymentLink}" style="display:inline-block;background:${accentColor};color:#fff;font-size:15px;font-weight:700;padding:14px 40px;border-radius:10px;text-decoration:none;letter-spacing:-0.01em">
                Pay ${params.amount} now &nbsp;→
              </a>
            </td>
          </tr>
        </table>

        <!-- Payment methods -->
        <p style="text-align:center;font-size:11.5px;color:#aaa;margin:8px 0 20px">
          UPI (GPay, PhonePe, Paytm) &nbsp;·&nbsp; Cards &nbsp;·&nbsp; Netbanking &nbsp;·&nbsp; Wallets
        </p>

        <!-- Bank / UPI details -->
        ${bankHtml}

        <!-- UTR submission -->
        ${utrHtml}

        <!-- Discrepancy note -->
        <p style="margin-top:24px;padding-top:16px;border-top:1px solid #f4f4f5;font-size:11.5px;color:#aaa;line-height:1.6;text-align:center">
          For discrepancies, contact ${params.businessName} at <strong style="color:#888">${params.businessPhone}</strong>
        </p>

      </td>
    </tr>
  </table>

  <!-- Footer watermark -->
  <table width="580" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px">
    <tr>
      <td align="center" style="padding-bottom:8px">
        <div style="width:20px;height:20px;background:#d4d4d8;border-radius:5px;display:inline-block;text-align:center;vertical-align:middle">
          <span style="font-size:10px;font-weight:800;color:#fff;line-height:20px">U</span>
        </div>
      </td>
    </tr>
    <tr>
      <td align="center">
        <p style="font-size:11.5px;color:#a1a1aa;margin:0 0 4px">Powered by UdhaarClear</p>
        <p style="font-size:11px;color:#c4c4c7;margin:0;line-height:1.6">
          Sent on behalf of ${params.businessName}.&nbsp;
          <a href="${APP_URL}/unsubscribe" style="color:#a1a1aa;text-decoration:underline">Unsubscribe</a> &nbsp;·&nbsp;
          <a href="${APP_URL}/dispute?inv=${params.invoiceNumber}" style="color:#a1a1aa;text-decoration:underline">Dispute invoice</a>
        </p>
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
  const name     = firstName(params.customerName)
  const isDue    = params.daysOverdue === 0
  const isPreDue = params.daysOverdue < 0
  const daysAbs  = Math.abs(params.daysOverdue)

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

  const badge = `<span style="background:#e6f4f0;color:#0f6e56;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:0.03em">Payment reminder</span>`

  let body: string

  if (isPreDue) {
    // Day −3
    body = `
      <p style="font-size:15px;font-weight:600;color:#111;margin:0 0 10px">Hi ${name},</p>
      <p style="font-size:14px;color:#444;line-height:1.65;margin:0 0 12px">
        Your invoice from <strong>${params.businessName}</strong> for <strong>${params.amount}</strong> is due on <strong>${params.dueDate}</strong> — ${daysAbs} ${daysAbs === 1 ? 'day' : 'days'} from now.
      </p>
      <p style="font-size:14px;color:#444;line-height:1.65;margin:0">
        You can pay using the link below, or use the 2-term installment option if you'd prefer to split the payment.
      </p>`
  } else if (isDue) {
    // Day 0
    body = `
      <p style="font-size:15px;font-weight:600;color:#111;margin:0 0 10px">Hi ${name},</p>
      <p style="font-size:14px;color:#444;line-height:1.65;margin:0 0 12px">
        Your invoice from <strong>${params.businessName}</strong> for <strong>${params.amount}</strong> is due today. Please settle it using the payment link below.
      </p>
      <p style="font-size:14px;color:#444;line-height:1.65;margin:0">
        The 2-term installment option is also available if you'd prefer to split the payment.
      </p>`
  } else if (params.daysOverdue <= 3) {
    // Day +3
    body = `
      <p style="font-size:15px;font-weight:600;color:#111;margin:0 0 10px">Hi ${name},</p>
      <p style="font-size:14px;color:#444;line-height:1.65;margin:0 0 12px">
        Invoice <strong>${params.invoiceNumber}</strong> from <strong>${params.businessName}</strong> for <strong>${params.amount}</strong> was due on ${params.dueDate} and is now <strong>${params.daysOverdue} days overdue</strong>.
      </p>
      <p style="font-size:14px;color:#444;line-height:1.65;margin:0">
        Please settle it at the earliest. For any questions about this invoice, reach out at <strong>${params.businessPhone}</strong>.
      </p>`
  } else {
    // Day +7 — last gentle touch
    body = `
      <p style="font-size:15px;font-weight:600;color:#111;margin:0 0 10px">Hi ${name},</p>
      <p style="font-size:14px;color:#444;line-height:1.65;margin:0 0 12px">
        Invoice <strong>${params.invoiceNumber}</strong> from <strong>${params.businessName}</strong> for <strong>${params.amount}</strong> is now <strong>7 days overdue</strong>. This is our last informal reminder before our follow-ups become more formal.
      </p>
      <p style="font-size:14px;color:#444;line-height:1.65;margin:0 0 16px">
        If there's a specific concern with this invoice, please reach out at <strong>${params.businessPhone}</strong> — we'd rather resolve it directly.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 14px;font-size:13px;color:#92400e;line-height:1.55">
            After today, our follow-up reminders will become more formal.
          </td>
        </tr>
      </table>`
  }

  return {
    subject,
    html: shell({ accentColor: '#0f6e56', previewText: preview, badgeHtml: badge, bodyHtml: body, showInstallments: true, params }),
  }
}

// ─── FIRM tone ────────────────────────────────────────────────────────────────
// Days: +10, +15, +21

export function buildFirmEmail(params: ReminderEmailParams): { subject: string; html: string } {
  const name         = firstName(params.customerName)
  const deadlineDate = dateInDays(5)  // for day +10: pay within 5 days of this notice
  const fridayDate   = dateInDays(3)  // for day +15: 3 days from now

  let subject: string
  let preview: string
  let body: string

  if (params.daysOverdue <= 10) {
    // Day +10 — tone shift, first firm touch
    subject = `Action required — invoice ${params.invoiceNumber} is 10 days overdue`
    preview = `Payment of ${params.amount} is 10 days overdue. Please settle by ${deadlineDate}.`
    body = `
      <p style="font-size:15px;font-weight:600;color:#111;margin:0 0 10px">Dear ${name},</p>
      <p style="font-size:14px;color:#444;line-height:1.65;margin:0 0 12px">
        Invoice <strong>${params.invoiceNumber}</strong> from <strong>${params.businessName}</strong> for <strong>${params.amount}</strong> is now <strong style="color:#b45309">10 days overdue</strong>. Please settle the full outstanding amount by <strong>${deadlineDate}</strong>.
      </p>
      <p style="font-size:14px;color:#444;line-height:1.65;margin:0 0 16px">
        For any concerns regarding this invoice, contact us at <strong>${params.businessPhone}</strong>.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 14px;font-size:13px;color:#92400e;line-height:1.55">
            If payment is not received by ${deadlineDate}, this matter will be escalated to our legal recovery team.
          </td>
        </tr>
      </table>`
  } else if (params.daysOverdue <= 15) {
    // Day +15 — hard deadline
    subject = `Final deadline — settle by ${fridayDate} | invoice ${params.invoiceNumber}`
    preview = `Invoice ${params.invoiceNumber} for ${params.amount} is 15 days overdue. Settle by ${fridayDate} or this escalates.`
    body = `
      <p style="font-size:15px;font-weight:600;color:#111;margin:0 0 10px">Dear ${name},</p>
      <p style="font-size:14px;color:#444;line-height:1.65;margin:0 0 12px">
        Invoice <strong>${params.invoiceNumber}</strong> from <strong>${params.businessName}</strong> for <strong>${params.amount}</strong> is now <strong style="color:#b45309">15 days overdue</strong>. Multiple prior reminders have not been acted upon.
      </p>
      <p style="font-size:14px;color:#444;line-height:1.65;margin:0 0 16px">
        This is your final opportunity to settle before escalation. Full payment must be received by <strong>${fridayDate}</strong>.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 14px;font-size:13px;color:#7f1d1d;line-height:1.55">
            If payment is not received by <strong>${fridayDate}</strong>, this matter will be referred to our legal team without further notice.
          </td>
        </tr>
      </table>`
  } else {
    // Day +21 — final warning
    subject = `Final warning — invoice ${params.invoiceNumber} is 21 days overdue · legal review begins in 7 days`
    preview = `Invoice ${params.invoiceNumber} is 21 days overdue. Legal proceedings begin at 28 days under the MSME Act.`
    body = `
      <p style="font-size:15px;font-weight:600;color:#111;margin:0 0 10px">Dear ${name},</p>
      <p style="font-size:14px;color:#444;line-height:1.65;margin:0 0 12px">
        Invoice <strong>${params.invoiceNumber}</strong> from <strong>${params.businessName}</strong> for <strong>${params.amount}</strong> is now <strong style="color:#b45309">21 days overdue</strong>. Legal recovery proceedings will begin automatically when this invoice crosses 28 days overdue, in accordance with the MSME Development Act, 2006.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 14px;font-size:13px;color:#7f1d1d;line-height:1.55">
            You have <strong>7 days</strong> to settle this invoice before formal proceedings begin. After that, we will file before the MSME Facilitation Council and report to credit bureaus — a process that cannot be reversed once initiated.
          </td>
        </tr>
      </table>`
  }

  const badge = `<span style="background:#fef3c7;color:#92400e;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:0.03em">Action required</span>`

  return {
    subject,
    html: shell({ accentColor: '#b45309', previewText: preview, badgeHtml: badge, bodyHtml: body, showInstallments: false, params }),
  }
}

// ─── LEGAL tone ───────────────────────────────────────────────────────────────
// Days: +28, +35, +42

export function buildLegalEmail(params: ReminderEmailParams): { subject: string; html: string } {
  const refNo = legalRefNo(params.invoiceNumber)

  let subject: string
  let preview: string
  let body: string

  if (params.daysOverdue <= 28) {
    // Day +28 — MSME threshold, 7-day window
    subject = `Formal legal demand notice — MSME Act 2006 applies | ${params.invoiceNumber}`
    preview = `Formal demand. ${params.amount} is 28 days overdue. Settle within 7 days or proceedings begin. Ref: ${refNo}.`
    body = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
        <tr>
          <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:10px 14px">
            <span style="font-size:11px;font-weight:800;color:#991b1b;letter-spacing:0.05em;text-transform:uppercase">Formal Legal Demand Notice</span>
            <span style="font-size:11px;color:#b91c1c;margin-left:12px">Ref: ${refNo}</span>
          </td>
        </tr>
      </table>
      <p style="font-size:15px;font-weight:600;color:#111;margin:0 0 4px">Dear ${params.customerName},</p>
      <p style="font-size:12px;color:#888;margin:0 0 16px">Re: Invoice ${params.invoiceNumber} &nbsp;·&nbsp; ${params.amount} &nbsp;·&nbsp; 28 days overdue</p>
      <p style="font-size:14px;color:#333;line-height:1.65;margin:0 0 14px">
        This is a <strong>formal legal demand notice</strong>. Invoice <strong>${params.invoiceNumber}</strong> from <strong>${params.businessName}</strong> for <strong>${params.amount}</strong> is now <strong style="color:#dc2626">28 days overdue</strong>.
      </p>
      <p style="font-size:14px;color:#333;line-height:1.65;margin:0 0 14px">
        You are required to settle the full outstanding amount within <strong>7 days</strong> of this notice. Failure to do so will result in formal proceedings being initiated without further communication.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 14px;font-size:12.5px;color:#7f1d1d;line-height:1.65">
            Under the <strong>MSME Development Act, 2006</strong>, buyers are legally required to pay MSME suppliers within 45 days. Non-payment attracts compound interest at 3× the RBI bank rate. Continued non-payment may result in: filing before the <strong>MSME Facilitation Council</strong>, CIBIL credit bureau reporting, and civil recovery proceedings. Reference: ${refNo}.
          </td>
        </tr>
      </table>`
  } else if (params.daysOverdue <= 35) {
    // Day +35 — 48-hour ultimatum
    subject = `48 hours remaining — MSME Facilitation Council filing pending | Ref: ${refNo}`
    preview = `Our formal notice has not been acted upon. 48 hours remain before MSME filing. Ref: ${refNo}.`
    body = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
        <tr>
          <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:10px 14px">
            <span style="font-size:11px;font-weight:800;color:#991b1b;letter-spacing:0.05em;text-transform:uppercase">Urgent Legal Notice</span>
            <span style="font-size:11px;color:#b91c1c;margin-left:12px">Ref: ${refNo}</span>
          </td>
        </tr>
      </table>
      <p style="font-size:15px;font-weight:600;color:#111;margin:0 0 4px">Dear ${params.customerName},</p>
      <p style="font-size:12px;color:#888;margin:0 0 16px">Re: Invoice ${params.invoiceNumber} &nbsp;·&nbsp; ${params.amount} &nbsp;·&nbsp; 35 days overdue</p>
      <p style="font-size:14px;color:#333;line-height:1.65;margin:0 0 14px">
        Our formal demand notice (Ref: <strong>${refNo}</strong>) issued 7 days ago has not been acted upon. Invoice <strong>${params.invoiceNumber}</strong> for <strong>${params.amount}</strong> is now <strong style="color:#dc2626">35 days overdue</strong>.
      </p>
      <p style="font-size:14px;color:#333;line-height:1.65;margin:0 0 14px">
        You have <strong>48 hours</strong> from the time of this notice to make full payment. After this window, we will file before the MSME Facilitation Council without any further communication.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 14px;font-size:12.5px;color:#7f1d1d;line-height:1.65">
            Filing will result in: compound interest recovery at 3× RBI bank rate, CIBIL credit impact, and legal fees added to your outstanding liability. This is your final opportunity to settle before formal proceedings begin.
          </td>
        </tr>
      </table>`
  } else {
    // Day +42 — final demand, proceedings initiated
    subject = `Final demand — legal proceedings initiated | Ref: ${refNo}`
    preview = `Formal proceedings have been initiated for non-payment of ${params.amount}. Ref: ${refNo}.`
    body = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
        <tr>
          <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:10px 14px">
            <span style="font-size:11px;font-weight:800;color:#991b1b;letter-spacing:0.05em;text-transform:uppercase">Final Demand Notice</span>
            <span style="font-size:11px;color:#b91c1c;margin-left:12px">Ref: ${refNo}</span>
          </td>
        </tr>
      </table>
      <p style="font-size:15px;font-weight:600;color:#111;margin:0 0 4px">Dear ${params.customerName},</p>
      <p style="font-size:12px;color:#888;margin:0 0 16px">Re: Invoice ${params.invoiceNumber} &nbsp;·&nbsp; ${params.amount} &nbsp;·&nbsp; 42 days overdue</p>
      <p style="font-size:14px;color:#333;line-height:1.65;margin:0 0 14px">
        Please be advised that <strong>formal legal proceedings have been initiated</strong> against you for non-payment of invoice <strong>${params.invoiceNumber}</strong> from <strong>${params.businessName}</strong> for <strong>${params.amount}</strong>. This invoice is now 42 days overdue.
      </p>
      <p style="font-size:14px;color:#333;line-height:1.65;margin:0 0 14px">
        All automated communications cease from this point. This matter is now being handled by our legal representatives. Reference: <strong>${refNo}</strong>.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 14px;font-size:12.5px;color:#7f1d1d;line-height:1.65">
            To halt proceedings at this stage, full payment including applicable interest must be made immediately. Confirm your transaction reference to <strong>${params.businessPhone}</strong>. Partial payment will not be accepted without prior written agreement.
          </td>
        </tr>
      </table>`
  }

  const badge = `<span style="background:#fef2f2;color:#991b1b;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:0.03em">${params.daysOverdue >= 42 ? 'Final demand' : 'Legal notice'}</span>`

  return {
    subject,
    html: shell({ accentColor: '#991b1b', previewText: preview, badgeHtml: badge, bodyHtml: body, showInstallments: false, params }),
  }
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

export function buildReminderEmail(
  tone: 'GENTLE' | 'FIRM' | 'LEGAL',
  params: ReminderEmailParams
): { subject: string; html: string } {
  if (tone === 'FIRM')  return buildFirmEmail(params)
  if (tone === 'LEGAL') return buildLegalEmail(params)
  return buildGentleEmail(params)
}
