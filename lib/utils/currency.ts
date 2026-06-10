export function formatINR(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatINRCompact(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000
    return `₹${parseFloat(cr.toFixed(2))}cr`
  }
  if (amount >= 100000) {
    const lakh = amount / 100000
    return `₹${parseFloat(lakh.toFixed(2))}L`
  }
  if (amount >= 1000) {
    const k = amount / 1000
    return `₹${parseFloat(k.toFixed(2))}k`
  }
  return formatINR(amount)
}

