import { formatINR } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'

export function paymentReceivedEmail(params: {
  ownerName: string
  customerName: string
  invoiceNumber: string
  amount: number
  paidAt: Date
}): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h1 style="color:#22C55E">Payment Received!</h1>
      <p>Hi ${params.ownerName},</p>
      <p><strong>${params.customerName}</strong> has paid <strong>${formatINR(params.amount)}</strong> against Invoice ${params.invoiceNumber}.</p>
      <p>Payment date: ${formatDate(params.paidAt)}</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
         style="background:#4F46E5;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px">
        View Dashboard
      </a>
    </div>
  `
}
