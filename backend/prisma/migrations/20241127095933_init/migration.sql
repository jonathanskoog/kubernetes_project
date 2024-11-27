-- CreateTable
CREATE TABLE "AudioEntry" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioEntry_pkey" PRIMARY KEY ("id")
);
