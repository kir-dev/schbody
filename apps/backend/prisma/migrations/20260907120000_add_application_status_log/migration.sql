-- CreateTable
CREATE TABLE "ApplicationStatusLog" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "changedById" TEXT,
    "previousStatus" "ApplicationStatus",
    "newStatus" "ApplicationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationStatusLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApplicationStatusLog_applicationId_idx" ON "ApplicationStatusLog"("applicationId");

-- CreateIndex
CREATE INDEX "ApplicationStatusLog_changedById_idx" ON "ApplicationStatusLog"("changedById");

-- AddForeignKey
ALTER TABLE "ApplicationStatusLog" ADD CONSTRAINT "ApplicationStatusLog_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStatusLog" ADD CONSTRAINT "ApplicationStatusLog_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("authSchId") ON DELETE SET NULL ON UPDATE CASCADE;
