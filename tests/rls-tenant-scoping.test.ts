/**
 * @vitest-environment node
 *
 * Cross-tenant isolation guard (Phase 0.5 — PRD's #1 non-negotiable).
 *
 * Two independent invariants, checked statically so they fail CI the moment a
 * future change regresses tenant isolation:
 *
 *  1. RLS AUDIT — every table backing a Prisma model has ROW LEVEL SECURITY
 *     enabled somewhere in the migrations. A new model with no RLS statement
 *     fails this test.
 *
 *  2. ROUTE SCOPING — every protected single-resource API route ([id] routes
 *     that read a business-owned record) filters its Prisma lookup by
 *     businessId. This is the control that actually stops business A from
 *     reading business B's invoice/customer by guessing an id. A route that
 *     forgets the businessId filter fails this test.
 */
import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()

// ── The @@map table names for every model in prisma/schema.prisma ──────────
// Kept explicit (not parsed) so adding a model forces a conscious update here
// AND an RLS statement in a migration — exactly the friction we want.
const ALL_TABLES = [
  'users',
  'businesses',
  'ca_profiles',
  'ca_earnings',
  'ca_payouts',
  'customers',
  'invoices',
  'reminders',
  'subscriptions',
  'ai_insights',
  'otp_sessions',
  'rate_limits',
  'webhook_events',
]

function readAllMigrations(): string {
  const dir = path.join(ROOT, 'prisma', 'migrations')
  const files: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const sql = path.join(dir, entry.name, 'migration.sql')
      if (fs.existsSync(sql)) files.push(fs.readFileSync(sql, 'utf8'))
    }
  }
  return files.join('\n')
}

describe('RLS audit — every table has Row Level Security enabled', () => {
  const migrations = readAllMigrations()

  it.each(ALL_TABLES)('table "%s" has ENABLE ROW LEVEL SECURITY', (table) => {
    const enabled = new RegExp(`ALTER TABLE\\s+"${table}"\\s+ENABLE ROW LEVEL SECURITY`, 'i')
    expect(migrations).toMatch(enabled)
  })

  it('the model↔schema table list stays in sync with prisma/schema.prisma @@map names', () => {
    const schema = fs.readFileSync(path.join(ROOT, 'prisma', 'schema.prisma'), 'utf8')
    const mapped = [...schema.matchAll(/@@map\("([^"]+)"\)/g)].map((m) => m[1]).sort()
    expect(mapped).toEqual([...ALL_TABLES].sort())
  })
})

describe('Route scoping — protected [id] routes filter by businessId', () => {
  // Single-resource routes that read a business-owned record by id. Each MUST
  // constrain its Prisma query by the session's businessId so a cross-tenant
  // id returns nothing. (Public buyer /pay/[id]/* routes are intentionally
  // excluded — the unguessable invoice id is itself the capability there.)
  const PROTECTED_ROUTES = [
    'app/api/customers/[id]/route.ts',
    'app/api/invoices/[id]/route.ts',
    'app/api/invoices/[id]/remind/route.ts',
    'app/api/invoices/[id]/payment-link/route.ts',
    'app/api/invoices/[id]/preview-email/route.ts',
    'app/api/legal-notice/[invoiceId]/route.ts',
  ]

  it.each(PROTECTED_ROUTES)('%s authenticates and scopes by businessId', (rel) => {
    const src = fs.readFileSync(path.join(ROOT, rel), 'utf8')
    // Must gate on the session-derived business...
    expect(src).toMatch(/getBusinessFromSession\s*\(/)
    // ...and constrain the record lookup by that business.
    expect(src).toMatch(/businessId/)
  })
})
