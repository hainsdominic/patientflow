/*
  Warnings:

  - A unique constraint covering the columns `[userId,key]` on the table `SystemPrompt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SystemPrompt_userId_key_key" ON "SystemPrompt"("userId", "key");
