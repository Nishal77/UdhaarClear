interface OtpEmailProps {
  name: string
  otp: string
}

export function otpVerificationEmail({ name, otp }: OtpEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your UdhaarClear verification code</title>
</head>
<body style="margin:0;padding:40px 16px;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:24px;border:1px solid #e4e4e7;border-radius:12px;background-color:#ffffff;">
    <h2 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#09090b;">Verify your email</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#71717a;line-height:1.5;">
      Hi ${name},<br /><br />
      Use the verification code below to sign in to your UdhaarClear account. This code is valid for 10 minutes.
    </p>
    <div style="margin:24px 0;background-color:#f4f4f5;border-radius:8px;padding:16px;text-align:center;font-size:32px;font-weight:700;letter-spacing:6px;color:#09090b;font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;">
      ${otp}
    </div>
    <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;">
      If you did not request this code, you can safely ignore this email.
    </p>
  </div>
</body>
</html>
  `.trim()
}
