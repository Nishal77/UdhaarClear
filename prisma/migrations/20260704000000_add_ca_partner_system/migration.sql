-- NOTE: this assumes "ca_profiles" is empty (CA partner system had no
-- registration flow before this migration, per the Phase 0 audit), which is
-- why new NOT NULL / UNIQUE columns can be added directly without a backfill
-- step. If that assumption is wrong in your environment, backfill first.

-- CreateEnum
CREATE TYPE "CAVerificationStatus" AS ENUM ('PENDING', 'OTP_SENT', 'VERIFIED', 'MANUAL_REVIEW', 'REJECTED');

-- CreateEnum
CREATE TYPE "CAPayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED');

-- AlterTable
ALTER TABLE "ca_profiles"
  ADD COLUMN "phone" TEXT NOT NULL,
  ADD COLUMN "icaiMembershipNumber" TEXT NOT NULL,
  ADD COLUMN "copNumber" TEXT,
  ADD COLUMN "verificationStatus" "CAVerificationStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "verifiedAt" TIMESTAMP(3),
  ADD COLUMN "otpCode" TEXT,
  ADD COLUMN "otpExpiresAt" TIMESTAMP(3),
  ADD COLUMN "otpAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "referralCode" TEXT NOT NULL,
  ADD COLUMN "razorpayContactId" TEXT,
  ADD COLUMN "razorpayFundAccountId" TEXT,
  ADD COLUMN "bankAccountNo" TEXT,
  ADD COLUMN "bankIfsc" TEXT,
  ADD COLUMN "bankAccountName" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "ca_profiles_phone_key" ON "ca_profiles"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "ca_profiles_icaiMembershipNumber_key" ON "ca_profiles"("icaiMembershipNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ca_profiles_referralCode_key" ON "ca_profiles"("referralCode");

-- CreateTable
CREATE TABLE "ca_earnings" (
    "id" TEXT NOT NULL,
    "caId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "planTier" "PlanTier" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "periodMonth" INTEGER NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "payoutId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ca_earnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ca_payouts" (
    "id" TEXT NOT NULL,
    "caId" TEXT NOT NULL,
    "periodMonth" INTEGER NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "grossAmount" DECIMAL(10,2) NOT NULL,
    "tdsAmount" DECIMAL(10,2) NOT NULL,
    "netAmount" DECIMAL(10,2) NOT NULL,
    "status" "CAPayoutStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayPayoutId" TEXT,
    "failureReason" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ca_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ca_earnings_caId_idx" ON "ca_earnings"("caId");

-- CreateIndex
CREATE UNIQUE INDEX "ca_earnings_caId_businessId_periodMonth_periodYear_key" ON "ca_earnings"("caId", "businessId", "periodMonth", "periodYear");

-- CreateIndex
CREATE UNIQUE INDEX "ca_payouts_caId_periodMonth_periodYear_key" ON "ca_payouts"("caId", "periodMonth", "periodYear");

-- AddForeignKey
ALTER TABLE "ca_earnings" ADD CONSTRAINT "ca_earnings_caId_fkey" FOREIGN KEY ("caId") REFERENCES "ca_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ca_earnings" ADD CONSTRAINT "ca_earnings_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ca_earnings" ADD CONSTRAINT "ca_earnings_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "ca_payouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ca_payouts" ADD CONSTRAINT "ca_payouts_caId_fkey" FOREIGN KEY ("caId") REFERENCES "ca_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
