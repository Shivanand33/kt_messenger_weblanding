-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "mfaAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mfaCodeExp" TIMESTAMP(3),
ADD COLUMN     "mfaCodeHash" TEXT,
ADD COLUMN     "mfaSentAt" TIMESTAMP(3),
ADD COLUMN     "recoveryCodes" JSONB,
ADD COLUMN     "twoFactorEmail" TEXT,
ADD COLUMN     "twoFactorEnabledAt" TIMESTAMP(3);
