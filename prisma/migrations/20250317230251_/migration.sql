/*
  Warnings:

  - You are about to drop the column `memoryId` on the `MemoryItems` table. All the data in the column will be lost.
  - You are about to drop the `Memory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MemoryItems" DROP CONSTRAINT "MemoryItems_memoryId_fkey";

-- AlterTable
ALTER TABLE "MemoryItems" DROP COLUMN "memoryId";

-- DropTable
DROP TABLE "Memory";
