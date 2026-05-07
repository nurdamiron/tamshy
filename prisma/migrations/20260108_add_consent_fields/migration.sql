-- Add consent fields to User table
-- Run this as the table owner (prometric) or a superuser on the RDS instance.
-- If using prisma db push, ensure the DB user owns the User table.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "consentPd"    BOOLEAN   NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "consentPdAt"  TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "consentSms"   BOOLEAN   NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "consentSmsAt" TIMESTAMP(3);
