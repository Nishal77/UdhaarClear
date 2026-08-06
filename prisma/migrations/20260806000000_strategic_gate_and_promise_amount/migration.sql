-- Strategic-account hard automation gate + promise-to-pay amount capture
ALTER TABLE "customers" ADD COLUMN "isStrategic" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "invoices" ADD COLUMN "promisedAmount" DECIMAL(12,2);
