export function welcomeEmail(name: string): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h1 style="color:#4F46E5">Welcome to UdhaarClear!</h1>
      <p>Hi ${name},</p>
      <p>Your account is ready. Start adding your customers and invoices to automate payment recovery.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
         style="background:#4F46E5;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px">
        Go to Dashboard
      </a>
      <p style="margin-top:32px;color:#6B7280;font-size:14px">
        UdhaarClear — Automated payment recovery for Indian businesses
      </p>
    </div>
  `
}
