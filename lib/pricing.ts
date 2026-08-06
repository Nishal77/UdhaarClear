import type { PlanTier } from '@prisma/client'

/**
 * SINGLE SOURCE OF TRUTH for plan pricing, limits, and display copy.
 *
 * This file is deliberately free of any server-only imports (no Prisma, no
 * `razorpay`, no `fs`) so it can be imported from BOTH server code
 * (checkout route, Razorpay plan creation, limit checks) AND client
 * components (settings BillingSection, landing Pricing). If prices ever need
 * to change, change them HERE and every surface follows — the landing page,
 * the in-app upgrade cards, and the amount actually charged by Razorpay all
 * read from these constants.
 *
 * Tier → plan mapping (schema enum → product name, per PRD §6.1):
 *   FREE    → Shuruat (Free)
 *   STARTER → Chota Vyaapar   ₹399/mo
 *   GROWTH  → Vyaapaar Pro    ₹999/mo
 *   CA_PRO  → Udyog Enterprise ₹9,999/mo
 */

export type PaidPlanTier = 'STARTER' | 'GROWTH' | 'CA_PRO'

export interface PlanPricing {
  /** Rupees per month on monthly billing — this is the number Razorpay charges. */
  monthly: number
  /**
   * Rupees-per-month when billed annually (i.e. the discounted headline rate
   * shown on the pricing toggle). Annual billing is display-only for now —
   * only monthly is wired to a real Razorpay plan (see lib/razorpay/plans.ts).
   */
  annualPerMonth: number
}

/** The one place prices live. Change here → landing, settings, and Razorpay all update. */
export const PLAN_PRICING: Record<PaidPlanTier, PlanPricing> = {
  STARTER: { monthly: 999, annualPerMonth: 319 },
  GROWTH: { monthly: 3499, annualPerMonth: 799 },
  CA_PRO: { monthly: 9999, annualPerMonth: 7999 },
}

export interface PlanLimits {
  customers: number
  invoices: number
  /** Client businesses a CA can manage under this tier (CA program). */
  clients: number
  /** Whether Tally / Excel CSV import is available on this tier. */
  tallyImport: boolean
}

/**
 * Per-tier usage limits — aligned with the customer-facing promise on the
 * landing page (`components/landing/Pricing.tsx`). `Infinity` renders as
 * "Unlimited" in the UI (see `formatLimit`) and short-circuits the count
 * checks below.
 */
export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  FREE: { customers: 3, invoices: 10, clients: 0, tallyImport: false },
  STARTER: { customers: 15, invoices: Infinity, clients: 0, tallyImport: true },
  GROWTH: { customers: Infinity, invoices: Infinity, clients: 0, tallyImport: true },
  CA_PRO: { customers: Infinity, invoices: Infinity, clients: 20, tallyImport: true },
}

/** Human-readable plan names for UI, keyed by tier. */
export const PLAN_DISPLAY_NAMES: Record<PlanTier, string> = {
  FREE: 'Shuruat — Free',
  STARTER: 'Chota Vyaapar — Starter',
  GROWTH: 'Vyaapaar — Pro',
  CA_PRO: 'Udyog — Enterprise',
}

/** Ordered low → high, for upgrade/downgrade comparisons. */
export const PLAN_ORDER: PlanTier[] = ['FREE', 'STARTER', 'GROWTH', 'CA_PRO']

export function isPaidPlanTier(tier: PlanTier): tier is PaidPlanTier {
  return tier === 'STARTER' || tier === 'GROWTH' || tier === 'CA_PRO'
}

/** Monthly price in paise (integer) — the unit Razorpay's API expects. */
export function monthlyPriceInPaise(tier: PaidPlanTier): number {
  return Math.round(PLAN_PRICING[tier].monthly * 100)
}
