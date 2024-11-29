/*
  Warnings:

  - You are about to drop the column `postId` on the `media` table. All the data in the column will be lost.
  - Added the required column `mediaId` to the `queries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_postId_fkey";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "postId";

-- AlterTable
ALTER TABLE "queries" ADD COLUMN     "mediaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "queries" ADD CONSTRAINT "queries_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
