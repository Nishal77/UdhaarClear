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
  await resend.emails.send({
    from: params.from ?? `UdhaarClear <noreply@udhaarclear.in>`,
    to: params.to,
    subject: params.subject,
    html: params.html,
  })
}
