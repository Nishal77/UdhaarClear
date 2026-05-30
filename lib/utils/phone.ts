export function normalizeIndianPhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-().]/g, '')
  if (cleaned.startsWith('0091')) cleaned = cleaned.slice(4)
  if (cleaned.startsWith('+91')) cleaned = cleaned.slice(3)
  if (cleaned.startsWith('91') && cleaned.length === 12) cleaned = cleaned.slice(2)
  return `+91${cleaned}`
}

export function isValidIndianPhone(phone: string): boolean {
  const normalized = normalizeIndianPhone(phone)
  return /^\+91[6-9]\d{9}$/.test(normalized)
}
