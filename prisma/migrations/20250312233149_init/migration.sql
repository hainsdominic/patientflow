-- CreateTable
CREATE TABLE "QuestionnaireSession" (
    "id" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientEmail" TEXT NOT NULL,
    "questionnaireKey" TEXT NOT NULL,
    "linkToken" TEXT NOT NULL,
    "messages" JSONB,
    "summary" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionnaireSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionnaireSession_linkToken_key" ON "QuestionnaireSession"("linkToken");
