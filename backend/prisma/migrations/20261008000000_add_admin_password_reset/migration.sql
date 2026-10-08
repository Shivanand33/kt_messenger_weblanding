-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "resetTokenHash" TEXT,
ADD COLUMN     "resetTokenExp" TIMESTAMP(3);
