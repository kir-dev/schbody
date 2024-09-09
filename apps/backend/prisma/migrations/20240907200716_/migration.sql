-- CreateTable
CREATE TABLE "PassBackgroundPicture" (
    "id" SERIAL NOT NULL,
    "periodId" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "backgroundImage" BYTEA NOT NULL,

    CONSTRAINT "PassBackgroundPicture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PassBackgroundPicture_periodId_key" ON "PassBackgroundPicture"("periodId");

-- CreateIndex
CREATE INDEX "PassBackgroundPicture_periodId_idx" ON "PassBackgroundPicture"("periodId");

-- AddForeignKey
ALTER TABLE "PassBackgroundPicture" ADD CONSTRAINT "PassBackgroundPicture_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "ApplicationPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
