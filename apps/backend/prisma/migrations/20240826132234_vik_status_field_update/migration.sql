/*
  Warnings:

  - You are about to drop the column `profileSeenAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileSeenAt",
ADD COLUMN     "vikStatusUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
