import { PlanTier } from '@prisma/client'
import { prisma } from '@/lib/prisma/client'

export const PLAN_LIMITS: Record<PlanTier, { customers: number; invoices: number; clients: number }> = {
  FREE: { customers: 10, invoices: 30, clients: 0 },
  STARTER: { customers: 25, invoices: 100, clients: 0 },
  GROWTH: { customers: 100, invoices: Infinity, clients: 0 },
  CA_PRO: { customers: Infinity, invoices: Infinity, clients: 20 },
}

export const PLAN_PRICES = {
  STARTER: { monthly: 799, annual: 799 * 10 },
  GROWTH: { monthly: 1999, annual: 1999 * 10 },
  CA_PRO: { monthly: 4999, annual: 4999 * 10 },
}

export async function checkCustomerLimit(businessId: string): Promise<boolean> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { planTier: true },
  })
  if (!business) return false
  const count = await prisma.customer.count({ where: { businessId } })
  const limit = PLAN_LIMITS[business.planTier].customers
  return count < limit
}

export async function checkInvoiceLimit(businessId: string): Promise<boolean> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { planTier: true },
  })
  if (!business) return false
  const count = await prisma.invoice.count({ where: { businessId } })
  const limit = PLAN_LIMITS[business.planTier].invoices
  return count < limit
}
