-- ─────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY — DEFENSE IN DEPTH
-- ─────────────────────────────────────────────────────────────────────────
--
-- IMPORTANT CONTEXT FOR FUTURE READERS:
-- This app's API routes use Prisma, connected via DATABASE_URL (a direct
-- Postgres connection). That connection is NOT subject to Row Level
-- Security — RLS only applies to Postgres roles it's enabled for, and
-- Prisma's connection runs as a role that already has full table access.
--
-- So the PRIMARY tenant-isolation control in this app is: every API route
-- manually filters Prisma queries by `businessId` (see lib/utils/auth.ts
-- and every route under app/api/). That is what actually protects one
-- customer's data from another today.
--
-- This migration adds RLS anyway, as a SECOND independent layer. It matters
-- if, in the future, any code path queries these tables directly through
-- Supabase's client library (@supabase/supabase-js) using the anon or
-- authenticated key instead of going through our API + Prisma. Without RLS,
-- that mistake would expose every business's data to every logged-in user.
-- With RLS, the same mistake is contained to "the user sees nothing"
-- instead of "the user sees everyone's invoices."
--
-- Policies below scope every business-owned table to rows where the
-- calling Supabase user (auth.uid()) owns the business. Tables with no
-- direct end-user relevance (otp_sessions, rate_limits, webhook_events)
-- get RLS enabled with zero policies, which denies all access to the
-- anon/authenticated roles by default.

-- ── users: a user can only ever see their own row ──────────────────────
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_row" ON "users"
  FOR SELECT
  USING ("supabaseId" = auth.uid()::text);

-- ── businesses: only the owner may read/write their business ──────────
ALTER TABLE "businesses" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "businesses_owner_full_access" ON "businesses"
  FOR ALL
  USING (
    "ownerId" IN (SELECT "id" FROM "users" WHERE "supabaseId" = auth.uid()::text)
  );

-- ── ca_profiles: a CA can only see/manage their own profile ───────────
ALTER TABLE "ca_profiles" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ca_profiles_owner_full_access" ON "ca_profiles"
  FOR ALL
  USING (
    "userId" IN (SELECT "id" FROM "users" WHERE "supabaseId" = auth.uid()::text)
  );

-- ── customers: scoped to the business that owns them ───────────────────
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers_business_scoped" ON "customers"
  FOR ALL
  USING (
    "businessId" IN (
      SELECT "id" FROM "businesses"
      WHERE "ownerId" IN (SELECT "id" FROM "users" WHERE "supabaseId" = auth.uid()::text)
    )
  );

-- ── invoices: scoped to the business that owns them ─────────────────────
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices_business_scoped" ON "invoices"
  FOR ALL
  USING (
    "businessId" IN (
      SELECT "id" FROM "businesses"
      WHERE "ownerId" IN (SELECT "id" FROM "users" WHERE "supabaseId" = auth.uid()::text)
    )
  );

-- ── reminders: scoped to the business that owns them ────────────────────
ALTER TABLE "reminders" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reminders_business_scoped" ON "reminders"
  FOR ALL
  USING (
    "businessId" IN (
      SELECT "id" FROM "businesses"
      WHERE "ownerId" IN (SELECT "id" FROM "users" WHERE "supabaseId" = auth.uid()::text)
    )
  );

-- ── subscriptions: scoped to the user who owns the subscription ────────
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_owner_scoped" ON "subscriptions"
  FOR ALL
  USING (
    "userId" IN (SELECT "id" FROM "users" WHERE "supabaseId" = auth.uid()::text)
  );

-- ── ai_insights: scoped to the business it was generated for ───────────
ALTER TABLE "ai_insights" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_insights_business_scoped" ON "ai_insights"
  FOR ALL
  USING (
    "businessId" IN (
      SELECT "id" FROM "businesses"
      WHERE "ownerId" IN (SELECT "id" FROM "users" WHERE "supabaseId" = auth.uid()::text)
    )
  );

-- ── System-internal tables: RLS enabled, no policies = deny by default ─
-- These have no per-tenant concept an end user should ever query directly.
-- Only server-side code (via the direct Prisma connection) touches them.
ALTER TABLE "otp_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rate_limits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "webhook_events" ENABLE ROW LEVEL SECURITY;
