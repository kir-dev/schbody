-- CreateEnum
CREATE TYPE "ProfilePictureStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "ProfilePicture" ADD COLUMN     "status" "ProfilePictureStatus" NOT NULL DEFAULT 'PENDING';
