/*
  Warnings:

  - You are about to drop the `MemoryItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MemoryItems";

-- CreateTable
CREATE TABLE "MemoryItem" (
    "id" TEXT NOT NULL,
    "hint" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemoryItem_pkey" PRIMARY KEY ("id")
);
