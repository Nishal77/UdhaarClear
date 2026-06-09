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
  const hasBankNo = !!params.bankAccountNo || isPreview
  const hasUpi = !!params.upiId || isPreview

  const displayAccountName = params.bankAccountName || params.businessName
  const displayAccountNo = params.bankAccountNo || (isPreview ? '918789876567' : '')
  const displayIfsc = params.bankIfsc || (isPreview ? 'SBIN0003490' : '')
  const displayUpi = params.upiId || (isPreview ? 'sbi3490@ibl' : '')

  const installmentsHtml = showInstallments ? `
      <!-- INSTALLMENTS (2-term option) -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:12px;border-collapse:separate;margin-bottom:24px;font-size:13px;overflow:hidden">
        <tr>
          <td style="padding:10px 20px;border-bottom:1px solid #e2e8f0;background-color:#F5F4EE">
            <span style="font-size:10px;font-weight:600;color:#475569;text-transform:uppercase;letter-spacing:0.05em">Flexible 2-term option</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 20px;border-bottom:1px solid #f1f5f9">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <div style="font-size:10.5px;color:#334155;margin-bottom:2px">Term 1 — 50%</div>
                  <div style="font-size:15px;font-weight:600;color:#0f172a">${halfAmount}</div>
                </td>
                <td align="right" width="130">
                  <a href="${params.paymentLink}?split=1" style="display:inline-block;background-color:#376E55;color:#fff;font-size:11.5px;font-weight:500;padding:7px 16px;border-radius:6px;text-decoration:none">Pay term 1</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 20px">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <div style="font-size:10.5px;color:#334155;margin-bottom:2px">Term 2 — 50%</div>
                  <div style="font-size:15px;font-weight:600;color:#94a3b8">${halfAmount}</div>
                </td>
                <td align="right" width="130">
                  <span style="display:inline-block;background:#f5f3ff;color:#6d28d9;font-size:10.5px;font-weight:500;padding:5px 12px;border-radius:20px">Due in 15 days</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>` : ''

  const bankHtml = (hasBankNo || hasUpi) ? `
        <!-- BANK / UPI DETAILS -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:12px;border-collapse:separate;margin-top:24px;overflow:hidden;background-color:#ffffff">
          <tr>
            <td colspan="2" style="padding:10px 20px;border-bottom:1px solid #e2e8f0;background-color:#F5F4EE">
              <span style="font-size:10px;font-weight:600;color:#475569;text-transform:uppercase;letter-spacing:0.05em">Direct transfer details</span>
            </td>
          </tr>
          ${hasBankNo ? `
          <tr>
            <td width="50%" style="padding:12px 20px;border-bottom:1px solid #e2e8f0;color:#334155;font-size:13px">Account name</td>
            <td width="50%" align="right" style="padding:12px 20px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#0f172a;font-size:13.5px">${displayAccountName}</td>
          </tr>
          <tr>
            <td width="50%" style="padding:12px 20px;border-bottom:1px solid #e2e8f0;color:#334155;font-size:13px">Account number</td>
            <td width="50%" align="right" style="padding:12px 20px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#0f172a;font-family:monospace;font-size:13.5px">${displayAccountNo}</td>
          </tr>
          <tr>
            <td width="50%" style="padding:12px 20px;${hasUpi ? 'border-bottom:1px solid #e2e8f0;' : ''}color:#334155;font-size:13px">IFSC</td>
            <td width="50%" align="right" style="padding:12px 20px;${hasUpi ? 'border-bottom:1px solid #e2e8f0;' : ''}font-weight:600;color:#0f172a;font-family:monospace;font-size:13.5px">${displayIfsc}</td>
          </tr>` : ''}
          ${hasUpi ? `
          <tr>
            <td width="50%" style="padding:12px 20px;color:#334155;font-size:13px">UPI ID</td>
            <td width="50%" align="right" style="padding:12px 20px;font-weight:600;color:#0f172a;font-family:monospace;font-size:13.5px">${displayUpi}</td>
          </tr>` : ''}
        </table>` : ''

  const utrHtml = `
        <!-- UTR SUBMISSION -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5F4EE;border:1px dashed #cbd5e1;border-radius:12px;margin-top:24px">
          <tr>
            <td style="padding:20px;text-align:center">
              <div style="font-size:13.5px;font-weight:600;color:#0f172a;margin-bottom:6px">Paid via bank transfer?</div>
              <p style="font-size:12px;color:#475569;margin:0 0 16px;line-height:1.5">Share your UTR / transaction ID and we'll mark this invoice as settled.</p>
              <a href="${params.paymentLink}/confirm" style="display:inline-block;background:#376E55;color:#ffffff;border-radius:6px;padding:10px 24px;font-size:12.5px;font-weight:500;text-decoration:none">Submit UTR</a>
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
</head>
<body style="margin:0;padding:0;background-color:#F5F4EE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">

<div style="display:none;max-height:0;overflow:hidden">${previewText}</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5F4EE;padding:32px 16px">
<tr><td align="center">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">

    <!-- HEADER -->
    <tr>
      <td style="padding:24px 32px 20px;border-bottom:1px solid #f1f5f9">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:24px;height:24px;background-color:#0f172a;border-radius:6px;text-align:center;vertical-align:middle">
                    <span style="font-size:12px;font-weight:900;color:#ffffff;line-height:24px">U</span>
                  </td>
                  <td style="padding-left:8px;font-size:14px;font-weight:700;color:#0f172a;vertical-align:middle">udhaarclear</td>
                  <td style="padding-left:6px;font-size:12px;color:#64748b;vertical-align:middle">/ via ${params.businessName}</td>
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
        
        <div style="font-size:14.5px;color:#334155;line-height:1.6">
          ${bodyHtml}
        </div>
        

        <!-- INVOICE SUMMARY -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:12px;border-collapse:separate;margin:24px 0;overflow:hidden">
          <tr>
            <td width="50%" style="padding:12px 20px;border-bottom:1px solid #e2e8f0;color:#334155;font-size:13px">Invoice number</td>
            <td width="50%" align="right" style="padding:12px 20px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#0f172a;font-family:monospace;font-size:13.5px">#${params.invoiceNumber}</td>
          </tr>
          <tr>
            <td width="50%" style="padding:12px 20px;border-bottom:1px solid #e2e8f0;color:#334155;font-size:13px">Invoice date</td>
            <td width="50%" align="right" style="padding:12px 20px;border-bottom:1px solid #e2e8f0;font-weight:500;color:#0f172a;font-size:13.5px">${params.invoiceDate}</td>
          </tr>
          <tr>
            <td width="50%" style="padding:12px 20px;border-bottom:1px solid #e2e8f0;color:#334155;font-size:13px">Due date</td>
            <td width="50%" align="right" style="padding:12px 20px;border-bottom:1px solid #e2e8f0;font-weight:600;color:${accentColor};font-size:13.5px">${params.dueDate}</td>
          </tr>
          <tr>
            <td width="50%" style="padding:16px 20px;background-color:#F5F4EE;font-size:14px;font-weight:600;color:#475569">Amount due</td>
            <td width="50%" align="right" style="padding:16px 20px;background-color:#F5F4EE;font-size:20px;font-weight:600;color:#0f172a">${params.amount}</td>
          </tr>
        </table>
        
        ${installmentsHtml}

        <!-- CTA BUTTON -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 10px">
          <tr>
            <td align="center">
              <a href="${params.paymentLink}" style="display:inline-block;background-color:#376E55;color:#ffffff;font-size:15px;font-weight:500;padding:14px 40px;border-radius:8px;text-decoration:none">
                Pay ${params.amount} now &nbsp;→
              </a>
            </td>
          </tr>
        </table>

  <div style="display: flex; justify-content: center; margin: 8px 0 24px;">
  <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px;">
    
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#376E55" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>

    <span style="font-weight: 600; color: #376E55;">100% Secure:</span>
    <span style="color: #475569; font-weight: 500;">UPI &nbsp;·&nbsp; Cards &nbsp;·&nbsp; Netbanking &nbsp;·&nbsp; Wallets</span>
    
  </div>
</div>

        ${bankHtml}

        ${utrHtml}

        <p style="margin-top:28px;padding-top:20px;border-top:1px solid #f1f5f9;font-size:11.5px;color:#475569;line-height:1.6;text-align:center">
          For support, contact ${params.businessName} at <strong style="color:#64748b">${params.businessPhone}</strong>
        </p>

      </td>
    </tr>
  </table>

  <!-- FOOTER -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;margin-top:24px">
    <tr>
      <td align="center">
        <p style="font-size:11.5px;color:#94a3b8;margin:0 0 4px;font-weight:500">Powered by UdhaarClear.in</p>
       
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

  const badge = `<span style="background-color:#f0fdf4;color:#16a34a;font-size:11px;font-weight:500;padding:4px 12px;border-radius:20px;">Payment Reminder</span>`

  let body: string

  if (isPreDue) {
    // Day −3
    body = `
      <p style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 10px">Hi ${name},</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 12px">
        Your invoice from <strong style="color:#0f172a">${params.businessName}</strong> for <strong style="color:#0f172a">${params.amount}</strong> is due on <strong style="color:#0f172a">${params.dueDate}</strong> — ${daysAbs} ${daysAbs === 1 ? 'day' : 'days'} from now.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0">
        You can pay using the link below, or use the 2-term installment option if you'd prefer to split the payment.
      </p>`
  } else if (isDue) {
    // Day 0
    body = `
      <p style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 10px">Hi ${name},</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 12px">
        Your invoice from <strong style="color:#0f172a">${params.businessName}</strong> for <strong style="color:#0f172a">${params.amount}</strong> is due today. Please settle it using the payment link below.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0">
        The 2-term installment option is also available if you'd prefer to split the payment.
      </p>`
  } else if (params.daysOverdue <= 3) {
    // Day +3
    body = `
      <p style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 10px">Hi ${name},</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 12px">
        Invoice <strong style="color:#0f172a">${params.invoiceNumber}</strong> from <strong style="color:#0f172a">${params.businessName}</strong> for <strong style="color:#0f172a">${params.amount}</strong> was due on ${params.dueDate} and is now <strong style="color:#0f172a">${params.daysOverdue} days overdue</strong>.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0">
        Please settle it at the earliest. For any questions about this invoice, reach out at <strong style="color:#0f172a">${params.businessPhone}</strong>.
      </p>`
  } else {
    // Day +7 — last gentle touch
    body = `
      <p style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 10px">Hi ${name},</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 12px">
        Invoice <strong style="color:#0f172a">${params.invoiceNumber}</strong> from <strong style="color:#0f172a">${params.businessName}</strong> for <strong style="color:#0f172a">${params.amount}</strong> is now <strong style="color:#0f172a">7 days overdue</strong>. This is our last informal reminder before our follow-ups become more formal.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 18px">
        If there's a specific concern with this invoice, please reach out at <strong style="color:#0f172a">${params.businessPhone}</strong> — we'd rather resolve it directly.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#fffbeb;border:1px solid #fef3c7;border-radius:8px;padding:12px 16px;font-size:13px;color:#b45309;line-height:1.55">
            After today, our follow-up reminders will become more formal.
          </td>
        </tr>
      </table>`
  }

  return {
    subject,
    // Hide installment option above ₹2L — showing it contradicts the urgency
    // of FIRM/LEGAL tones and looks weak for large B2B invoices.
    html: shell({ accentColor: '#376E55', previewText: preview, badgeHtml: badge, bodyHtml: body, showInstallments: parseAmountStr(params.amount) < 200_000, params }),
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
      <p style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 10px">Dear ${name},</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 12px">
        Invoice <strong style="color:#0f172a">${params.invoiceNumber}</strong> from <strong style="color:#0f172a">${params.businessName}</strong> for <strong style="color:#0f172a">${params.amount}</strong> is now <strong style="color:#b45309">10 days overdue</strong>. Please settle the full outstanding amount by <strong style="color:#0f172a">${deadlineDate}</strong>.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 18px">
        For any concerns regarding this invoice, contact us at <strong style="color:#0f172a">${params.businessPhone}</strong>.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#fffbeb;border:1px solid #fef3c7;border-radius:8px;padding:12px 16px;font-size:13px;color:#b45309;line-height:1.55">
            If payment is not received by ${deadlineDate}, this matter will be escalated to our legal recovery team.
          </td>
        </tr>
      </table>`
  } else if (params.daysOverdue < 21) {
    // Day +15 — hard deadline
    subject = `Final deadline — settle by ${fridayDate} | invoice ${params.invoiceNumber}`
    preview = `Invoice ${params.invoiceNumber} for ${params.amount} is 15 days overdue. Settle by ${fridayDate} or this escalates.`
    body = `
      <p style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 10px">Dear ${name},</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 12px">
        Invoice <strong style="color:#0f172a">${params.invoiceNumber}</strong> from <strong style="color:#0f172a">${params.businessName}</strong> for <strong style="color:#0f172a">${params.amount}</strong> is now <strong style="color:#b45309">15 days overdue</strong>. Multiple prior reminders have not been acted upon.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 18px">
        This is your final opportunity to settle before escalation. Full payment must be received by <strong style="color:#0f172a">${fridayDate}</strong>.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#fef2f2;border:1px solid #fee2e2;border-radius:8px;padding:12px 16px;font-size:13px;color:#991b1b;line-height:1.55">
            If payment is not received by <strong style="color:#991b1b">${fridayDate}</strong>, this matter will be referred to our legal team without further notice.
          </td>
        </tr>
      </table>`
  } else {
    // Day +21 — final warning
    subject = `Final warning — invoice ${params.invoiceNumber} is 21 days overdue · legal review begins in 7 days`
    preview = `Invoice ${params.invoiceNumber} is 21 days overdue. Legal proceedings begin at 28 days under the MSME Act.`
    body = `
      <p style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 10px">Dear ${name},</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 12px">
        Invoice <strong style="color:#0f172a">${params.invoiceNumber}</strong> from <strong style="color:#0f172a">${params.businessName}</strong> for <strong style="color:#0f172a">${params.amount}</strong> is now <strong style="color:#b45309">21 days overdue</strong>. Legal recovery proceedings will begin automatically when this invoice crosses 28 days overdue, in accordance with the MSME Development Act, 2006.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#fef2f2;border:1px solid #fee2e2;border-radius:8px;padding:12px 16px;font-size:13px;color:#991b1b;line-height:1.55">
            You have <strong style="color:#991b1b">7 days</strong> to settle this invoice before formal proceedings begin. After that, we will file before the MSME Facilitation Council and report to credit bureaus — a process that cannot be reversed once initiated.
          </td>
        </tr>
      </table>`
  }

  const badge = `<span style="background-color:#fffbeb;color:#d97706;border:1px solid #fef3c7;font-size:11px;font-weight:500;padding:4px 12px;border-radius:20px;">Action required</span>`

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

  if (params.daysOverdue < 35) {
    // Day +28 — MSME threshold, 7-day window
    subject = `Formal legal demand notice — MSME Act 2006 applies | ${params.invoiceNumber}`
    preview = `Formal demand. ${params.amount} is 28 days overdue. Settle within 7 days or proceedings begin. Ref: ${refNo}.`
    body = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px">
        <tr>
          <td style="background-color:#fef2f2;border:1px solid #fee2e2;border-radius:8px;padding:12px 16px">
            <span style="font-size:11px;font-weight:800;color:#991b1b;letter-spacing:0.05em;text-transform:uppercase">Formal Legal Demand Notice</span>
            <span style="font-size:11px;color:#991b1b;margin-left:12px;font-family:monospace;font-weight:600">Ref: ${refNo}</span>
          </td>
        </tr>
      </table>
      <p style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 4px">Dear ${params.customerName},</p>
      <p style="font-size:12px;color:#64748b;margin:0 0 16px">Re: Invoice ${params.invoiceNumber} &nbsp;·&nbsp; ${params.amount} &nbsp;·&nbsp; 28 days overdue</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 14px">
        This is a <strong style="color:#0f172a">formal legal demand notice</strong>. Invoice <strong style="color:#0f172a">${params.invoiceNumber}</strong> from <strong style="color:#0f172a">${params.businessName}</strong> for <strong style="color:#0f172a">${params.amount}</strong> is now <strong style="color:#dc2626">28 days overdue</strong>.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 18px">
        You are required to settle the full outstanding amount within <strong style="color:#0f172a">7 days</strong> of this notice. Failure to do so will result in formal proceedings being initiated without further communication.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#fef2f2;border:1px solid #fee2e2;border-radius:8px;padding:12px 16px;font-size:12.5px;color:#991b1b;line-height:1.65">
            Under the <strong style="color:#991b1b">MSME Development Act, 2006</strong>, buyers are legally required to pay MSME suppliers within 45 days. Non-payment attracts compound interest at 3× the RBI bank rate. Continued non-payment may result in: filing before the <strong style="color:#991b1b">MSME Facilitation Council</strong>, CIBIL credit bureau reporting, and civil recovery proceedings. Reference: ${refNo}.
          </td>
        </tr>
      </table>`
  } else if (params.daysOverdue < 42) {
    // Day +35 — 48-hour ultimatum
    subject = `48 hours remaining — MSME Facilitation Council filing pending | Ref: ${refNo}`
    preview = `Our formal notice has not been acted upon. 48 hours remain before MSME filing. Ref: ${refNo}.`
    body = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px">
        <tr>
          <td style="background-color:#fef2f2;border:1px solid #fee2e2;border-radius:8px;padding:12px 16px">
            <span style="font-size:11px;font-weight:800;color:#991b1b;">Urgent Legal Notice</span>
            <span style="font-size:11px;color:#991b1b;margin-left:12px;font-family:monospace;font-weight:600">Ref: ${refNo}</span>
          </td>
        </tr>
      </table>
      <p style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 4px">Dear ${params.customerName},</p>
      <p style="font-size:12px;color:#64748b;margin:0 0 16px">Re: Invoice ${params.invoiceNumber} &nbsp;·&nbsp; ${params.amount} &nbsp;·&nbsp; 35 days overdue</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 14px">
        Our formal demand notice (Ref: <strong style="color:#0f172a">${refNo}</strong>) issued 7 days ago has not been acted upon. Invoice <strong style="color:#0f172a">${params.invoiceNumber}</strong> for <strong style="color:#0f172a">${params.amount}</strong> is now <strong style="color:#dc2626">35 days overdue</strong>.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 18px">
        You have <strong style="color:#0f172a">48 hours</strong> from the time of this notice to make full payment. After this window, we will file before the MSME Facilitation Council without any further communication.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#fef2f2;border:1px solid #fee2e2;border-radius:8px;padding:12px 16px;font-size:12.5px;color:#991b1b;line-height:1.65">
            Filing will result in: compound interest recovery at 3× RBI bank rate, CIBIL credit impact, and legal fees added to your outstanding liability. This is your final opportunity to settle before formal proceedings begin.
          </td>
        </tr>
      </table>`
  } else {
    // Day +42 — final demand, proceedings initiated
    subject = `Final demand — legal proceedings initiated | Ref: ${refNo}`
    preview = `Formal proceedings have been initiated for non-payment of ${params.amount}. Ref: ${refNo}.`
    body = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px">
        <tr>
          <td style="background-color:#fef2f2;border:1px solid #fee2e2;border-radius:8px;padding:12px 16px">
            <span style="font-size:11px;font-weight:800;color:#991b1b;letter-spacing:0.05em;text-transform:uppercase">Final Demand Notice</span>
            <span style="font-size:11px;color:#991b1b;margin-left:12px;font-family:monospace;font-weight:600">Ref: ${refNo}</span>
          </td>
        </tr>
      </table>
      <p style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 4px">Dear ${params.customerName},</p>
      <p style="font-size:12px;color:#64748b;margin:0 0 16px">Re: Invoice ${params.invoiceNumber} &nbsp;·&nbsp; ${params.amount} &nbsp;·&nbsp; 42 days overdue</p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 14px">
        Please be advised that <strong style="color:#0f172a">formal legal proceedings have been initiated</strong> against you for non-payment of invoice <strong style="color:#0f172a">${params.invoiceNumber}</strong> from <strong style="color:#0f172a">${params.businessName}</strong> for <strong style="color:#0f172a">${params.amount}</strong>. This invoice is now 42 days overdue.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.65;margin:0 0 18px">
        All automated communications cease from this point. This matter is now being handled by our legal representatives. Reference: <strong style="color:#0f172a">${refNo}</strong>.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#fef2f2;border:1px solid #fee2e2;border-radius:8px;padding:12px 16px;font-size:12.5px;color:#991b1b;line-height:1.65">
            To halt proceedings at this stage, full payment including applicable interest must be made immediately. Confirm your transaction reference to <strong style="color:#991b1b">${params.businessPhone}</strong>. Partial payment will not be accepted without prior written agreement.
          </td>
        </tr>
      </table>`
  }

  const badge = `<span style="background-color:#fef2f2;color:#dc2626;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;">${params.daysOverdue >= 42 ? 'Final demand' : 'Legal notice'}</span>`

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
  if (tone === 'FIRM') return buildFirmEmail(params)
  if (tone === 'LEGAL') return buildLegalEmail(params)
  return buildGentleEmail(params)
}
