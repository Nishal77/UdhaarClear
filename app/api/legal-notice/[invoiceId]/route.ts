import { getBusinessFromSession } from '@/lib/utils/auth'
import { apiError, apiSuccess } from '@/lib/utils/api-error'
import { prisma } from '@/lib/prisma/client'
import { generateLegalNoticePDF } from '@/lib/pdf/generate'
import { daysOverdue } from '@/lib/utils/date'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function POST(request: Request, { params }: { params: Promise<{ invoiceId: string }> }) {
  const session = await getBusinessFromSession()
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated', 401)

  const { invoiceId } = await params
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, businessId: session.businessId },
    include: { customer: true, business: true },
  })
  if (!invoice) return apiError('NOT_FOUND', 'Invoice not found', 404)

  const days = daysOverdue(invoice.dueDate)
  if (days < 30) {
    return apiError('NOT_ELIGIBLE', 'Legal notice only available for invoices 30+ days overdue', 400)
  }

  const pdfBuffer = await generateLegalNoticePDF({
    business: invoice.business,
    customer: invoice.customer,
    invoice: {
      invoiceNumber: invoice.invoiceNumber,
      amount: Number(invoice.amount),
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      daysOverdue: days,
    },
  })

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const fileName = `legal-notices/${session.businessId}/${invoiceId}-${Date.now()}.pdf`
  const { error } = await supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET ?? 'documents')
    .upload(fileName, pdfBuffer, { contentType: 'application/pdf', upsert: true })

  if (error) {
    return apiError('STORAGE_ERROR', 'Failed to save PDF', 500)
  }

  const signedResult = await supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET ?? 'documents')
    .createSignedUrl(fileName, 3600)

  const signedUrl = signedResult.data?.signedUrl ?? null

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { legalNoticeGeneratedAt: new Date(), documentUrl: signedUrl },
  })

  return apiSuccess({ url: signedUrl, generatedAt: new Date().toISOString() })
}
