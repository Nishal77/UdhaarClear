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
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Poppins',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">

          <!-- Header -->
          <tr>
            <td style="background:#0d0c08;padding:28px 40px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#ECA828;border-radius:8px;width:32px;height:32px;text-align:center;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:16px;font-weight:800;">₹</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="color:#ffffff;font-size:16px;font-weight:600;letter-spacing:-0.3px;">UdhaarClear</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.4px;">
                Verify your email
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.6;">
                Hi ${name}, use the code below to complete your sign-up. It expires in 10 minutes.
              </p>

              <!-- OTP Code -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center" style="background:#fafafa;border:1px solid #e4e4e7;border-radius:12px;padding:24px;">
                    <span style="font-size:40px;font-weight:700;letter-spacing:12px;color:#111827;font-family:monospace;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
                If you didn't create an account with UdhaarClear, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #f3f4f6;padding:20px 40px;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © 2024 UdhaarClear · Built for Indian MSMEs
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
