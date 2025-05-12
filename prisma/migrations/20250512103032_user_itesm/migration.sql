/*
  Warnings:

  - Added the required column `userId` to the `CompletedClinicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `MemoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `QuestionnaireSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SystemPrompt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompletedClinicalReport" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MemoryItem" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuestionnaireSession" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SystemPrompt" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "QuestionnaireSession" ADD CONSTRAINT "QuestionnaireSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryItem" ADD CONSTRAINT "MemoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemPrompt" ADD CONSTRAINT "SystemPrompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedClinicalReport" ADD CONSTRAINT "CompletedClinicalReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
