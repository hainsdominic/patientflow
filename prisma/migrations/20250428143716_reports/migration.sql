-- CreateTable
CREATE TABLE "CompletedClinicalReport" (
    "id" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientEmail" TEXT NOT NULL,
    "reportTitle" TEXT NOT NULL,
    "reportContent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompletedClinicalReport_pkey" PRIMARY KEY ("id")
);
