/*
  Warnings:

  - You are about to drop the column `url` on the `media` table. All the data in the column will be lost.
  - Added the required column `userId` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media" DROP COLUMN "url",
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
