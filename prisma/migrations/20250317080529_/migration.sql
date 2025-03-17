/*
  Warnings:

  - You are about to drop the column `url` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Resume` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "url";

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "url";
