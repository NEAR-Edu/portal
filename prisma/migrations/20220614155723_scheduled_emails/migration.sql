-- CreateTable
CREATE TABLE "ScheduledEmail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "scheduledSendTimeUtc" TIMESTAMP(3) NOT NULL,
    "actualSendTimeUtc" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduledEmail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScheduledEmail" ADD CONSTRAINT "ScheduledEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
