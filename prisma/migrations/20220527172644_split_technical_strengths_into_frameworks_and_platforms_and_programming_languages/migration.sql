/*
  Warnings:

  - You are about to drop the column `technicalStrengths` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "technicalStrengths",
ADD COLUMN     "frameworksAndPlatforms" TEXT,
ADD COLUMN     "programmingLanguages" TEXT;
