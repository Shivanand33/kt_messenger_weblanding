-- AlterTable
ALTER TABLE "contact_messages" ADD COLUMN     "repliedAt" TIMESTAMP(3),
ADD COLUMN     "repliedById" TEXT,
ADD COLUMN     "replyBody" TEXT;

-- AddForeignKey
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_repliedById_fkey" FOREIGN KEY ("repliedById") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
