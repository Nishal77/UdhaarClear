-- AlterEnum
ALTER TYPE "InvoiceStatus" ADD VALUE 'PENDING_CONFIRMATION';

-- AlterEnum
ALTER TYPE "ReminderChannel" ADD VALUE 'BOTH';

-- AlterTable
ALTER TABLE "reminders" ADD COLUMN "outcome" TEXT;

-- CreateIndex
CREATE INDEX "invoices_businessId_idx" ON "invoices"("businessId");

-- CreateIndex
CREATE INDEX "invoices_customerId_idx" ON "invoices"("customerId");

-- CreateIndex
CREATE INDEX "invoices_paidAt_idx" ON "invoices"("paidAt");

-- CreateIndex
CREATE INDEX "reminders_businessId_idx" ON "reminders"("businessId");

-- CreateIndex
CREATE INDEX "reminders_invoiceId_idx" ON "reminders"("invoiceId");
