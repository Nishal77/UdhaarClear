const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

export function isValidGSTIN(gstin: string): boolean {
  return GSTIN_REGEX.test(gstin.toUpperCase())
}

export function formatGSTIN(gstin: string): string {
  return gstin.toUpperCase()
}
