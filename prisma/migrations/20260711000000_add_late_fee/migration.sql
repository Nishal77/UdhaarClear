-- MSMED Act §16 late fee support
-- Business opts in per-business; Invoice tracks the accrued amount + when last calculated.

ALTER TABLE "businesses" ADD COLUMN "lateFeeEnabled" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "invoices" ADD COLUMN "lateFeeAccrued" DECIMAL(12,2);
ALTER TABLE "invoices" ADD COLUMN "lateFeeLastCalculatedAt" TIMESTAMP(3);
