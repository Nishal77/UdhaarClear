import { createClient as createServiceClient } from '@supabase/supabase-js'

/**
 * Uploads a generated report PDF to Supabase Storage and returns a
 * time-boxed signed URL. Used to hand WhatsApp Cloud API a publicly-fetchable
 * link for document messages (Meta fetches the URL server-side).
 *
 * Mirrors the storage pattern already used by the legal-notice route
 * (app/api/legal-notice/[invoiceId]/route.ts).
 */
export async function uploadReportPDF(params: {
  businessId: string
  buffer: Buffer
  /** Signed-URL lifetime in seconds. Default 1 hour — long enough for Meta to fetch. */
  expiresIn?: number
}): Promise<string | null> {
  const { businessId, buffer, expiresIn = 60 * 60 } = params

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'documents'
  const fileName = `reports/${businessId}/recovery-report-${Date.now()}.pdf`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, { contentType: 'application/pdf', upsert: true })

  if (error) {
    console.error('Report PDF upload failed:', error)
    return null
  }

  const signed = await supabase.storage.from(bucket).createSignedUrl(fileName, expiresIn)
  return signed.data?.signedUrl ?? null
}
