/*
  Warnings:

  - You are about to drop the column `comment` on the `media` table. All the data in the column will be lost.
  - Added the required column `url` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media" DROP COLUMN "comment",
ADD COLUMN     "url" TEXT NOT NULL;
