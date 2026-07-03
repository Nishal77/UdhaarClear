-- Extends the defense-in-depth RLS policies from migration
-- 20260702000001_enable_rls_defense_in_depth to the two new CA tables. Same
-- caveat applies: the app's real access control is Prisma's businessId/caId
-- filtering in each API route (Prisma connects directly, bypassing RLS) —
-- this is a second layer in case a future code path queries these tables
-- through the Supabase client instead of Prisma.
--
-- Earnings/payouts are commission data belonging to the CA, not the
-- referred business — so unlike customers/invoices (scoped by owning
-- business), these are scoped by which CA's own userId owns the row.

ALTER TABLE "ca_earnings" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ca_earnings_owner_scoped" ON "ca_earnings"
  FOR ALL
  USING (
    "caId" IN (
      SELECT "id" FROM "ca_profiles"
      WHERE "userId" IN (SELECT "id" FROM "users" WHERE "supabaseId" = auth.uid()::text)
    )
  );

ALTER TABLE "ca_payouts" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ca_payouts_owner_scoped" ON "ca_payouts"
  FOR ALL
  USING (
    "caId" IN (
      SELECT "id" FROM "ca_profiles"
      WHERE "userId" IN (SELECT "id" FROM "users" WHERE "supabaseId" = auth.uid()::text)
    )
  );
