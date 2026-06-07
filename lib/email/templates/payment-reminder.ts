/**
 * Payment reminder email templates — 3 tones matching WhatsApp tone engine.
 * Returns a complete HTML string suitable for Resend.
 * Inline styles throughout — email clients strip <style> blocks.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://udhaarclear.in'

interface ReminderEmailParams {
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

function parseAmountStr(amountStr: string): number {
  const clean = amountStr.replace(/[^0-9.]/g, '')
  return parseFloat(clean) || 0
}

function formatAmountVal(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val)
}

// ─── Shared layout shell ────────────────────────────────────────────────────

function emailShell(
  accentColor: string,
  previewText: string,
  headerTitle: string,
  headerIcon: string,
  bodyTextHtml: string,
  params: ReminderEmailParams
): string {
  const rawAmount = parseAmountStr(params.amount)
  const splitAmountVal = Math.round(rawAmount / 2)
  const splitAmountStr = formatAmountVal(splitAmountVal)

  const splitPaymentHtml = `
  <!-- SPLIT PAYMENT OPTIONS -->
  <div style="background-color:#ffffff;border:1px solid #f3f4f6;border-radius:12px;padding:20px;margin-bottom:24px;box-shadow:0 1px 2px rgba(0,0,0,0.02)">
    <div style="font-size:12px;font-weight:600;color:#1f2937;margin-bottom:8px">
      Flexible 2-term installments
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <!-- Term 1 Row -->
      <tr>
        <td align="left" valign="middle" style="padding:12px 0;border-bottom:1px solid #f3f4f6;text-align:left">
          <div style="font-size:11px;color:#6b7280;font-weight:550;margin-bottom:2px">Term 1 (50%)</div>
          <div style="font-size:16px;font-weight:700;color:#111827">${splitAmountStr}</div>
        </td>
        <td align="right" valign="middle" width="140" style="padding:12px 0;border-bottom:1px solid #f3f4f6;text-align:right;width:140px">
          <a href="${params.paymentLink}?split=1" style="display:inline-block;background-color:${accentColor};color:#ffffff;font-size:12px;font-weight:600;padding:8px 16px;border-radius:6px;text-decoration:none;box-shadow:0 2px 4px rgba(0,0,0,0.02);white-space:nowrap">
            Pay term 1
          </a>
        </td>
      </tr>
      <!-- Term 2 Row -->
      <tr>
        <td align="left" valign="middle" style="padding:12px 0;text-align:left">
          <div style="font-size:11px;color:#6b7280;font-weight:550;margin-bottom:2px">Term 2 (50%)</div>
          <div style="font-size:16px;font-weight:700;color:#6b7280">${splitAmountStr}</div>
        </td>
        <td align="right" valign="middle" width="140" style="padding:12px 0;text-align:right;width:140px">
          <div style="display:inline-block;background-color:#f5f3ff;color:#6d28d9;font-size:11px;font-weight:600;padding:4px 10px;border-radius:9999px;white-space:nowrap">
            Due in 15 days
          </div>
        </td>
      </tr>
    </table>
  </div>
  `

  const hasBankDetails = !!params.bankAccountNo
  const hasUpiDetails = !!params.upiId
  const isPreview = params.reminderId === 'preview-mode-no-id'

  const showBankRows = hasBankDetails || isPreview
  const showUpiRow = hasUpiDetails || isPreview

  const displayAccountName = params.bankAccountName || params.businessName
  const displayAccountNo = params.bankAccountNo || (isPreview ? '918789876567' : '')
  const displayIfsc = params.bankIfsc || (isPreview ? 'SBIN0003490' : '')
  const displayUpi = params.upiId || (isPreview ? 'sbi3490@ibl' : '')

  const bankFooter = (showBankRows || showUpiRow)
    ? `<!-- TRANSFER DETAILS -->
       <div style="background-color:#f9fafb;border:1px solid #f3f4f6;border-radius:12px;padding:20px;margin-top:24px;box-shadow:0 1px 2px rgba(0,0,0,0.01)">
        <div style="font-size:12px;font-weight:600;color:#1f2937;margin-bottom:12px">Direct transfer details</div>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:12.5px;color:#4b5563;line-height:1.6">
          ${showBankRows ? `
          <tr>
            <td align="left" style="color:#6b7280;padding-bottom:8px;width:150px;text-align:left">Account holder name</td>
            <td align="right" style="font-weight:600;color:#111827;padding-bottom:8px;text-align:right">${displayAccountName}</td>
          </tr>
          <tr>
            <td align="left" style="color:#6b7280;padding-bottom:8px;text-align:left">Account number</td>
            <td align="right" style="font-weight:600;color:#111827;font-family:monospace;padding-bottom:8px;text-align:right">${displayAccountNo}</td>
          </tr>
          <tr>
            <td align="left" style="color:#6b7280;padding-bottom:${showUpiRow ? '8px' : '0'};text-align:left">IFSC Code</td>
            <td align="right" style="font-weight:600;color:#111827;font-family:monospace;padding-bottom:${showUpiRow ? '8px' : '0'};text-align:right">${displayIfsc}</td>
          </tr>
          ` : ''}
          ${showUpiRow ? `
          <tr>
            <td align="left" style="color:#6b7280;padding-bottom:0;text-align:left">UPI ID</td>
            <td align="right" style="font-weight:600;color:#111827;font-family:monospace;padding-bottom:0;text-align:right">${displayUpi}</td>
          </tr>
          ` : ''}
        </table>
       </div>`
    : ''

  const cleanPhone = params.businessPhone.replace(/[^0-9]/g, '')
  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone
  const waText = encodeURIComponent(`Hi, I paid Invoice ${params.invoiceNumber} of ${params.amount}. Here is my UTR proof: `)

  const submitProofHtml = `
  <!-- SUBMIT PROOF OF PAYMENT -->
  <div style="background-color:#f8fafc;border:1px dashed #e2e8f0;border-radius:12px;padding:20px;margin-top:20px;text-align:center">
    <div style="font-size:13px;font-weight:600;color:#1e293b;margin-bottom:6px">Already transferred?</div>
    <p style="font-size:12px;color:#475569;margin:0 0 12px 0;line-height:1.5">
      If you paid directly via bank transfer or a personal UPI app, submit your UTR Transaction ID below or use our automated WhatsApp bot to upload the receipt.
    </p>
    <form action="${params.paymentLink}" method="GET">
      <input type="hidden" name="proof" value="1" />
      <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin:12px auto;width:100%;max-width:360px">
        <tr>
          <td style="padding-right:8px">
            <input type="text" name="utr" placeholder="Enter 12-digit UTR / txn ID" style="width:100%;box-sizing:border-box;border:1px solid #cbd5e1;background-color:#ffffff;border-radius:6px;padding:8px 12px;font-size:12.5px;color:#1e293b;outline:none" />
          </td>
          <td style="width:80px">
            <button type="submit" style="width:100%;box-sizing:border-box;background-color:${accentColor};color:#ffffff;border:none;border-radius:6px;padding:8.5px 14px;font-size:12px;font-weight:600;cursor:pointer">
              Submit
            </button>
          </td>
        </tr>
      </table>
    </form>
    <div style="margin-top:14px;padding-top:12px;border-top:1px dashed #e2e8f0">
      <a href="https://wa.me/${waPhone}?text=${waText}" style="color:#16a34a;font-size:12.5px;font-weight:600;text-decoration:none;display:inline-block;vertical-align:middle">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;display:inline-block"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg><span style="vertical-align:middle">Submit via WhatsApp bot</span>
      </a>
    </div>
  </div>
  `

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>${params.invoiceNumber} — Payment reminder</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<!-- preview text (hidden) -->
<div style="display:none;max-height:0;overflow:hidden">${previewText}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;padding:40px 16px">
<tr>
  <td align="center">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e1e4ea;box-shadow:0 4px 12px rgba(0,0,0,0.04)">
      
      <!-- HERO BANNER WITH OVERLAID BRANDING -->
      <tr>
      <!-- HERO BANNER WITH OVERLAID BRANDING -->
      <tr>
        <td background="https://i.pinimg.com/1200x/a6/11/9e/a6119e4ef5594227d591e6fdbf44e7b0.jpg" bgcolor="#e0f2fe" width="600" height="140" valign="top" style="background-image:url('https://i.pinimg.com/1200x/a6/11/9e/a6119e4ef5594227d591e6fdbf44e7b0.jpg');background-repeat:no-repeat;background-size:cover;background-position:center;height:140px;padding:0 28px;vertical-align:top;border-top-left-radius:16px;border-top-right-radius:16px;overflow:hidden">
          
          <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" style="height:140px">
            <!-- Logo Row (Top Left) -->
            <tr>
              <td valign="top" align="left" style="padding-top:16px;vertical-align:top;text-align:left">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="width:24px;height:24px;background:#000000;border-radius:5px;text-align:center;vertical-align:middle">
                      <span style="font-size:12px;font-weight:900;color:#ffffff;line-height:24px">U</span>
                    </td>
                    <td style="padding-left:8px;font-size:15px;font-weight:600;color:#000000;vertical-align:middle;letter-spacing:-0.02em">
                      udhaarclear
                    </td>
                    <td style="padding-left:8px;font-size:11.5px;color:#4b5563;font-weight:600;vertical-align:middle">
                      / via ${params.businessName}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Payment Reminder Title (Center) -->
            <tr>
              <td valign="middle" align="center" style="vertical-align:middle;text-align:center;padding-bottom:16px">
                <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto">
                  <tr>
                    <td style="vertical-align:middle;padding-right:8px">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" style="vertical-align:middle;display:block">
                        <path d="M20.016 2C18.903 2 18 4.686 18 8h2.016c.972 0 1.457 0 1.758-.335c.3-.336.248-.778.144-1.661C21.64 3.67 20.894 2 20.016 2Z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18 8.054v10.592c0 1.511 0 2.267-.462 2.565c-.755.486-1.922-.534-2.509-.904c-.485-.306-.727-.458-.996-.467c-.291-.01-.538.137-1.062.467l-1.911 1.205c-.516.325-.773.488-1.06.488s-.545-.163-1.06-.488l-1.91-1.205c-.486-.306-.728-.458-.997-.467c-.291-.01-.538.137-1.062.467c-.587.37-1.754 1.39-2.51.904C2 20.913 2 20.158 2 18.646V8.054c0-2.854 0-4.28.879-5.167C3.757 2 5.172 2 8 2h12M6 6h8m-6 4H6"/>
                        <path stroke-linecap="round" d="M12.5 10.875c-.828 0-1.5.588-1.5 1.313c0 .724.672 1.312 1.5 1.312m0-5.25c.653 0 1.209.365 1.415.875m-1.415-.875V10m0 6.125c-.653 0-1.209-.365-1.415-.875m1.415.875V17"/>
                      </svg>
                    </td>
                    <td style="font-size:22px;font-weight:600;color:#000000;vertical-align:middle;line-height:1.2;letter-spacing:-0.01em">
                      ${headerTitle}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
        </td>
      </tr>

      <!-- CONTENT CARD ROW -->
      <tr>
        <td style="background-color:#ffffff;padding:28px 36px 36px 36px">
                
                <!-- BODY TEXT -->
                <div style="font-size:14.5px;color:#3c3a43;line-height:1.65;margin-bottom:24px">
                  ${bodyTextHtml}
                </div>

                <!-- BILLING SUMMARY TABLE -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border:1px solid #f3f4f6;border-radius:12px;border-collapse:separate;border-spacing:0;margin-bottom:24px;box-shadow:0 1px 2px rgba(0,0,0,0.02)">
                  <tr>
                    <td style="padding:18px 20px">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="left" style="font-size:13px;color:#6b7280;padding-bottom:10px;text-align:left">Invoice Number</td>
                          <td align="right" style="font-size:13px;font-weight:600;color:#111827;font-family:monospace;text-align:right;padding-bottom:10px">${params.invoiceNumber}</td>
                        </tr>
                        <tr>
                          <td align="left" style="font-size:13px;color:#6b7280;padding-bottom:10px;text-align:left">Invoice Date</td>
                          <td align="right" style="font-size:13px;font-weight:500;color:#111827;text-align:right;padding-bottom:10px">${params.invoiceDate}</td>
                        </tr>
                        <tr>
                          <td align="left" style="font-size:13px;color:#6b7280;text-align:left">Due Date</td>
                          <td align="right" style="font-size:13px;font-weight:600;color:#111827;text-align:right">${params.dueDate}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 20px;border-top:1px solid #f3f4f6;background-color:#f9fafb;border-bottom-left-radius:12px;border-bottom-right-radius:12px">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="left" style="font-size:13px;font-weight:600;color:#374151;text-align:left">Amount Due</td>
                          <td align="right" style="font-size:18px;font-weight:750;color:#111827;text-align:right">${params.amount}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- SPLIT PAYMENT OPTIONS -->
                ${splitPaymentHtml}

                <!-- MAIN CTA BUTTON -->
                <div style="text-align:center;margin:32px 0 20px 0">
                  <a href="${params.paymentLink}" style="display:inline-block;background-color:${accentColor};color:#ffffff;font-size:15px;font-weight:600;padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:-0.01em;box-shadow:0 4px 14px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)">
                    Pay ${params.amount} now &nbsp;➜
                  </a>
                </div>

                <!-- ONLINE CHANNELS SUPPORTED -->
                <div style="text-align:center;margin-bottom:32px">
                  <span style="font-size:11.5px;color:#88909c;font-weight:500;display:block;margin-bottom:8px">Supported payment methods</span>
                  <div style="font-size:12px;color:#4b5563;line-height:20px;vertical-align:middle">
                    <span style="display:inline-block;vertical-align:middle;white-space:nowrap">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#88909c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;display:inline-block"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><span style="vertical-align:middle;font-weight:500">UPI (GPay, PhonePe, Paytm)</span>
                    </span>
                    <span style="color:#cbd5e1;margin:0 10px;vertical-align:middle">•</span>
                    <span style="display:inline-block;vertical-align:middle;white-space:nowrap">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#88909c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;display:inline-block"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg><span style="vertical-align:middle;font-weight:500">Cards</span>
                    </span>
                    <span style="color:#cbd5e1;margin:0 10px;vertical-align:middle">•</span>
                    <span style="display:inline-block;vertical-align:middle;white-space:nowrap">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#88909c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;display:inline-block"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg><span style="vertical-align:middle;font-weight:500">Netbanking</span>
                    </span>
                    <span style="color:#cbd5e1;margin:0 10px;vertical-align:middle">•</span>
                    <span style="display:inline-block;vertical-align:middle;white-space:nowrap">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#88909c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;display:inline-block"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4v-6z"/></svg><span style="vertical-align:middle;font-weight:500">Wallets</span>
                    </span>
                  </div>
                </div>

                <!-- BANK / UPI TRANSFER INFO -->
                ${bankFooter}

                <!-- SUBMIT PAYMENT PROOF -->
                ${submitProofHtml}

                <!-- DISCREPANCY NOTE -->
                <div style="margin-top:28px;padding-top:20px;border-top:1px solid #f0edf4;font-size:12px;color:#9b98a2;line-height:1.5">
                  For any discrepancies or customized split plans, please contact the business directly at <strong>${params.businessPhone}</strong> or click the dispute link below.
                </div>

              <!-- (Inner table removed for single card layout) -->

        </td>
      </tr>
    </table>

    <!-- WATERMARK FOOTER -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;text-align:center">
      <tr>
        <td align="center">
          <div style="width:24px;height:24px;background-color:#d4d7e1;border-radius:6px;display:inline-block;text-align:center;vertical-align:middle;margin-bottom:12px">
            <span style="font-size:12px;font-weight:800;color:#fff;line-height:24px">U</span>
          </div>
          <p style="font-size:12px;color:#7e8494;margin:0 0 6px 0;font-weight:550">
            Powered by UdhaarClear
          </p>
          <p style="font-size:11px;color:#a6acba;margin:0;line-height:1.5">
            This email was sent on behalf of ${params.businessName}.<br/>
            <a href="${APP_URL}/unsubscribe" style="color:#8c93a3;text-decoration:underline">Change email preferences</a> · 
            <a href="${APP_URL}/dispute?inv=${params.invoiceNumber}" style="color:#8c93a3;text-decoration:underline">Dispute invoice</a>
          </p>
        </td>
      </tr>
    </table>

  </td>
</tr>
</table>
${
  params.reminderId
    ? `<img src="${APP_URL}/api/reminders/track/email-open?reminderId=${params.reminderId}" width="1" height="1" style="display:none;width:1px;height:1px" alt="" />`
    : ''
}
</body>
</html>`
}

// ─── GENTLE tone ────────────────────────────────────────────────────────────

export function buildGentleEmail(params: ReminderEmailParams): { subject: string; html: string } {
  const subject = `Payment reminder — ${params.invoiceNumber} from ${params.businessName}`
  const preview = `Invoice ${params.invoiceNumber} for ${params.amount} is due. Please arrange payment.`

  const bodyHtml = `
    <p style="font-size:15px;font-weight:600;color:#111;margin:0 0 12px">Dear ${params.customerName},</p>
    <p style="margin:0">
      Hope you're having a great week. Just a quick reminder that your invoice for ${params.businessName} is due soon. To make things easier, you can settle the full amount today, or take advantage of our flexible installment plan below.
    </p>`

  const headerIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`

  return {
    subject,
    html: emailShell('#5551ff', preview, 'Payment Reminder', headerIcon, bodyHtml, params)
  }
}

// ─── FIRM tone ──────────────────────────────────────────────────────────────

export function buildFirmEmail(params: ReminderEmailParams): { subject: string; html: string } {
  const subject = `Action required — ${params.invoiceNumber} overdue ${params.daysOverdue} days`
  const preview = `Invoice ${params.invoiceNumber} for ${params.amount} is ${params.daysOverdue} days overdue. Immediate payment required.`

  const bodyHtml = `
    <p style="font-size:15px;font-weight:600;color:#111;margin:0 0 12px">Dear ${params.customerName},</p>
    <p style="margin:0 0 16px">
      Despite our earlier reminder, payment for the invoice below remains outstanding and is now
      <strong style="color:#d97706">${params.daysOverdue} days overdue</strong>.
      We request you to settle this amount immediately.
    </p>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 14px;font-size:13px;color:#92400e;line-height:1.5">
      Further delay will result in escalation to our legal recovery team. Please pay today to avoid additional action.
    </div>`

  const headerIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`

  return {
    subject,
    html: emailShell('#d97706', preview, 'Action Required', headerIcon, bodyHtml, params)
  }
}

// ─── LEGAL tone ─────────────────────────────────────────────────────────────

export function buildLegalEmail(params: ReminderEmailParams): { subject: string; html: string } {
  const subject = `FINAL NOTICE — ${params.invoiceNumber} — Legal action pending`
  const preview = `Final demand notice. Invoice ${params.invoiceNumber} for ${params.amount} is ${params.daysOverdue} days overdue. Pay within 7 days.`

  const bodyHtml = `
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:6px 12px;margin-bottom:16px;font-size:11px;font-weight:700;color:#dc2626;display:inline-block;letter-spacing:0.02em">
      FORMAL LEGAL DEMAND NOTICE
    </div>
    <p style="font-size:15px;font-weight:600;color:#111;margin:0 0 4px">Dear ${params.customerName},</p>
    <p style="font-size:13px;color:#777;margin:0 0 16px">Re: Invoice ${params.invoiceNumber} · ${params.amount} · ${params.daysOverdue} days overdue</p>
    
    <p style="margin:0 0 16px">
      This is a <strong>formal final demand notice</strong>. Despite repeated reminders, Invoice ${params.invoiceNumber} for ${params.amount} remains unpaid and is now
      <strong style="color:#dc2626">${params.daysOverdue} days overdue</strong>.
    </p>
    <p style="margin:0 0 16px">
      If full payment is not received within <strong>7 days</strong>, we will initiate legal proceedings under Section 8 of the MSME Development Act, 2006 and applicable laws, without further notice.
    </p>
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 14px;font-size:12px;color:#7f1d1d;line-height:1.6">
      This notice constitutes a formal legal demand. Non-payment may result in: filing before the MSME Facilitation Council, credit bureau reporting (CIBIL), and recovery proceedings.
      Reference No: UC-LEGAL-${new Date().getFullYear()}-${params.invoiceNumber.replace('INV-', '')}.
    </div>`

  const headerIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`

  return {
    subject,
    html: emailShell('#dc2626', preview, 'Final Notice', headerIcon, bodyHtml, params)
  }
}

// ─── Dispatcher ─────────────────────────────────────────────────────────────

export function buildReminderEmail(
  tone: 'GENTLE' | 'FIRM' | 'LEGAL',
  params: ReminderEmailParams
): { subject: string; html: string } {
  if (tone === 'FIRM') return buildFirmEmail(params)
  if (tone === 'LEGAL') return buildLegalEmail(params)
  return buildGentleEmail(params)
}
