/*
  Warnings:

  - You are about to drop the column `testStatus` on the `Personality` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Personality" DROP COLUMN "testStatus";

-- DropEnum
DROP TYPE "PersonalityTestStatus";
