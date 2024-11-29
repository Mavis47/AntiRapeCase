-- DropForeignKey
ALTER TABLE "queries" DROP CONSTRAINT "queries_mediaId_fkey";

-- AlterTable
ALTER TABLE "queries" ALTER COLUMN "mediaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "queries" ADD CONSTRAINT "queries_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
