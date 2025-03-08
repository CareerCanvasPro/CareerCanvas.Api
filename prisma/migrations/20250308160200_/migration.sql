/*
  Warnings:

  - Made the column `testStatus` on table `Personality` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Personality" ALTER COLUMN "testStatus" SET NOT NULL;
