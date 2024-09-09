-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERUSER', 'BODY_ADMIN', 'BODY_MEMBER', 'USER');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'ACCEPTED', 'REJECTED', 'NEEDS_REVIEW', 'FINISHED');

-- CreateTable
CREATE TABLE "User" (
    "authSchId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "neptun" TEXT,
    "email" TEXT,
    "isSchResident" BOOLEAN NOT NULL,
    "isActiveVikStudent" BOOLEAN NOT NULL,
    "roomNumber" INTEGER,
    "canHelpNoobs" BOOLEAN NOT NULL DEFAULT false,
    "publicDesc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vikStatusUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("authSchId")
);

-- CreateTable
CREATE TABLE "ProfilePicture" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "profileImage" BYTEA NOT NULL,

    CONSTRAINT "ProfilePicture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationPeriod" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "applicationPeriodStartAt" TIMESTAMP(3) NOT NULL,
    "applicationPeriodEndAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ticketsAreValid" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "ApplicationPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationPeriodId" INTEGER NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "preview" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_neptun_key" ON "User"("neptun");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePicture_userId_key" ON "ProfilePicture"("userId");

-- CreateIndex
CREATE INDEX "ProfilePicture_userId_idx" ON "ProfilePicture"("userId");

-- CreateIndex
CREATE INDEX "ApplicationPeriod_authorId_idx" ON "ApplicationPeriod"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_userId_applicationPeriodId_key" ON "Application"("userId", "applicationPeriodId");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- AddForeignKey
ALTER TABLE "ProfilePicture" ADD CONSTRAINT "ProfilePicture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("authSchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationPeriod" ADD CONSTRAINT "ApplicationPeriod_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("authSchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("authSchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicationPeriodId_fkey" FOREIGN KEY ("applicationPeriodId") REFERENCES "ApplicationPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("authSchId") ON DELETE RESTRICT ON UPDATE CASCADE;
