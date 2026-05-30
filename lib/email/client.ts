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

  // Default from: use verified Resend sandbox for dev, custom domain for prod
  const from =
    params.from ??
    (process.env.NODE_ENV === 'production'
      ? 'UdhaarClear <noreply@udhaarclear.in>'
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
