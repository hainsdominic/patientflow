/*
  Warnings:

  - You are about to drop the column `questionnaireKey` on the `QuestionnaireSession` table. All the data in the column will be lost.
  - Added the required column `questionnaireContent` to the `QuestionnaireSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionnaireTitle` to the `QuestionnaireSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestionnaireSession" DROP COLUMN "questionnaireKey",
ADD COLUMN     "questionnaireContent" TEXT NOT NULL,
ADD COLUMN     "questionnaireTitle" TEXT NOT NULL;
