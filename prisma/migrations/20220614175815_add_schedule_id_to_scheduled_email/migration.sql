/*
  Warnings:

  - Added the required column `scheduleId` to the `ScheduledEmail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScheduledEmail" ADD COLUMN     "scheduleId" TEXT NOT NULL;
