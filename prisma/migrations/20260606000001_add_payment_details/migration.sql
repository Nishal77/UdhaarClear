-- Add payment collection fields to businesses table
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "upiId" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "bankAccountNo" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "bankIfsc" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "bankAccountName" TEXT;
