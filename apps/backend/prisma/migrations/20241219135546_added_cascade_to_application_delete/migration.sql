-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_applicationPeriodId_fkey";

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicationPeriodId_fkey" FOREIGN KEY ("applicationPeriodId") REFERENCES "ApplicationPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
