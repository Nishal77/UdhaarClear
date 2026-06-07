import { Resend } from 'resend'

let resendInstance: Resend | null = null

export function getResend(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

export async function sendEmail(params: {
  to: string
  subject: string
  html: string
  from?: string
}): Promise<void> {
  const resend = getResend()

  // Default from: use environment variable if set, otherwise fallback to custom domain for prod or sandbox for dev
  const from =
    params.from ??
    process.env.RESEND_FROM_EMAIL ??
    (process.env.NODE_ENV === 'production'
      ? 'UdhaarClear <noreply@arogyavaan.com>'
      : 'UdhaarClear <onboarding@resend.dev>')

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }
}
