import { prisma } from '@/lib/prisma/client'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email/client'
import { formatINR } from '@/lib/utils/currency'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      business: {
        include: {
          owner: true,
        },
      },
      customer: true,
    },
  })

  if (!invoice) return apiError('NOT_FOUND', 'Invoice not found', 404)
  if (invoice.status === 'PAID') return apiError('ALREADY_PAID', 'Invoice is already fully paid', 400)
  if (invoice.status === 'WRITTEN_OFF') return apiError('INVALID', 'Invoice has been written off', 400)

  try {
    const formData = await request.formData()
    
    const transferRef = formData.get('transferRef') as string | null
    const payerName = formData.get('payerName') as string | null
    const payerBank = formData.get('payerBank') as string | null
    const amountStr = formData.get('transferredAmount') as string | null
    const screenshot = formData.get('screenshot') as File | null

    if (!transferRef || !transferRef.trim()) {
      return apiError('VALIDATION_ERROR', 'UTR / Transaction reference is required', 400)
    }

    const transferredAmount = amountStr ? parseFloat(amountStr) : Number(invoice.amount)

    let signedUrl: string | null = null

    // Upload screenshot to Supabase Storage if present
    if (screenshot && screenshot.size > 0) {
      const supabase = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const fileBuffer = Buffer.from(await screenshot.arrayBuffer())
      const fileExt = screenshot.name.split('.').pop() ?? 'png'
      const fileName = `payment-proofs/${id}-${Date.now()}.${fileExt}`

      const { error } = await supabase.storage
        .from(process.env.SUPABASE_STORAGE_BUCKET ?? 'documents')
        .upload(fileName, fileBuffer, {
          contentType: screenshot.type,
          upsert: true,
        })

      if (error) {
        console.error('Supabase upload error:', error)
      } else {
        // Generate a long-lived signed URL (e.g. 1 year)
        const signedResult = await supabase.storage
          .from(process.env.SUPABASE_STORAGE_BUCKET ?? 'documents')
          .createSignedUrl(fileName, 60 * 60 * 24 * 365)

        signedUrl = signedResult.data?.signedUrl ?? null
      }
    }

    // Update invoice status to PENDING_CONFIRMATION
    // autoReminder: false stops reminders while awaiting merchant verification
    await prisma.invoice.update({
      where: { id },
      data: {
        status: 'PENDING_CONFIRMATION',
        paidAmount: transferredAmount,
        paymentMethod: payerBank ? `NEFT/RTGS via ${payerBank}` : 'NEFT/RTGS',
        paymentRef: transferRef.trim(),
        documentUrl: signedUrl ?? undefined,
        autoReminder: false,
      },
    })

    // Log the action in the reminders/activity timeline
    await prisma.reminder.create({
      data: {
        businessId: invoice.businessId,
        invoiceId: invoice.id,
        channel: 'EMAIL',
        tone: 'GENTLE',
        templateName: 'transfer_verification_pending',
        messageBody: `Customer submitted bank transfer details of ${formatINR(transferredAmount)} (UTR: ${transferRef.trim()})${payerName ? ` from ${payerName.trim()}` : ''}${payerBank ? ` via ${payerBank.trim()}` : ''}.${screenshot ? ' Screenshot proof attached.' : ''}`,
        dayOverdue: 0,
        status: 'SENT',
        triggeredBy: 'MANUAL',
      },
    })

    // Notify the merchant/business owner via Resend
    const ownerEmail = invoice.business.owner.email
    if (ownerEmail) {
      const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://udhaarclear.in'
      const invoiceLink = `${APP_URL}/invoices/${invoice.id}`

      const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Payment proof submitted</title>
</head>
<body style="margin:0;padding:24px;background-color:#F5F4EE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;padding:32px">
          <tr>
            <td>
              <h1 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 16px">Payment proof submitted</h1>
              <p style="font-size:14px;color:#334155;line-height:1.5;margin:0 0 20px">
                Your customer <strong style="color:#0f172a">${invoice.customer.name}</strong> has self-reported a bank transfer payment for <strong style="color:#0f172a">Invoice #${invoice.invoiceNumber}</strong>.
              </p>

              <!-- SUBMISSION DETAILS -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:12px;border-collapse:separate;margin:20px 0;overflow:hidden">
                <tr>
                  <td width="40%" style="padding:10px 16px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px">Invoice Number</td>
                  <td width="60%" align="right" style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#0f172a;font-size:13px">#${invoice.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px">Submitted Amount</td>
                  <td align="right" style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#0f172a;font-size:13.5px">${formatINR(transferredAmount)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px">UTR / Reference No.</td>
                  <td align="right" style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#0f172a;font-family:monospace;font-size:13px">${transferRef.trim()}</td>
                </tr>
                ${payerName ? `
                <tr>
                  <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px">Payer Name</td>
                  <td align="right" style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#0f172a;font-size:13px">${payerName.trim()}</td>
                </tr>` : ''}
                ${payerBank ? `
                <tr>
                  <td style="padding:10px 16px;${screenshot ? 'border-bottom:1px solid #e2e8f0;' : ''}color:#64748b;font-size:13px">Payer Bank</td>
                  <td align="right" style="padding:10px 16px;${screenshot ? 'border-bottom:1px solid #e2e8f0;' : ''}font-weight:600;color:#0f172a;font-size:13px">${payerBank.trim()}</td>
                </tr>` : ''}
                ${signedUrl ? `
                <tr>
                  <td style="padding:10px 16px;color:#64748b;font-size:13px">Screenshot Attachment</td>
                  <td align="right" style="padding:10px 16px;font-size:13px">
                    <a href="${signedUrl}" target="_blank" style="color:#FF6A39;font-weight:600;text-decoration:underline">View Receipt</a>
                  </td>
                </tr>` : ''}
              </table>

              <p style="font-size:13px;color:#64748b;line-height:1.5;margin:0 0 24px">
                Automated reminders for this invoice have been paused. Please cross-verify this transfer on your bank statement and mark the invoice paid in the dashboard.
              </p>

              <!-- CTA BUTTON -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 12px">
                <tr>
                  <td align="center">
                    <a href="${invoiceLink}" style="display:inline-block;background-color:#376E55;color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none">
                      Review & Approve in Dashboard
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

      await sendEmail({
        to: ownerEmail,
        subject: `[UdhaarClear] UTR payment confirmation submitted for Invoice #${invoice.invoiceNumber}`,
        html: emailHtml,
      }).catch((e) => {
        console.error('Failed to dispatch notification email:', e)
      })
    }

    return apiSuccess({ message: 'Verification details submitted successfully' })
  } catch (err) {
    console.error('Error confirming payment:', err)
    return apiError('SERVER_ERROR', 'Failed to process confirmation. Please try again.', 500)
  }
}
