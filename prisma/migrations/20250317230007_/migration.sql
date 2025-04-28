-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryItems" (
    "id" TEXT NOT NULL,
    "hint" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "memoryId" TEXT,

    CONSTRAINT "MemoryItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemoryItems" ADD CONSTRAINT "MemoryItems_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
