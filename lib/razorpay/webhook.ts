import crypto from 'crypto'

export function verifyRazorpaySignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  const expectedBuf = Buffer.from(expectedSignature)
  const receivedBuf = Buffer.from(signature)

  // timingSafeEqual throws if the two buffers aren't the same length, so a
  // malformed/missing signature header must fail the length check first
  // instead of crashing the webhook route.
  if (expectedBuf.length !== receivedBuf.length) return false

  return crypto.timingSafeEqual(expectedBuf, receivedBuf)
}
