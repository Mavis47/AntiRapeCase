-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
