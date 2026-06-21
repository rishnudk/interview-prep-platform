-- CreateTable: hint_usages (was missing from init migration)
CREATE TABLE "hint_usages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hint_usages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hint_usages_userId_problemId_createdAt_idx" ON "hint_usages"("userId", "problemId", "createdAt");

-- AddForeignKey
ALTER TABLE "hint_usages" ADD CONSTRAINT "hint_usages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hint_usages" ADD CONSTRAINT "hint_usages_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
