import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { generateAuditorReportPDF } from '@/lib/pdf/auditor-report'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { ownedBusiness: true },
    })

    if (!dbUser?.ownedBusiness) {
      return new Response('Business profile not found', { status: 404 })
    }

    const buffer = await generateAuditorReportPDF(dbUser.ownedBusiness.id)
    if (!buffer) return new Response('Business profile not found', { status: 404 })

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=udhaarclear_auditor_report_${Date.now()}.pdf`,
      },
    })
  } catch (err) {
    console.error('Failed to compile PDF Auditor Report:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
