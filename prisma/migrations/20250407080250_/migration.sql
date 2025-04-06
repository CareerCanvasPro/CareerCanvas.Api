/*
  Warnings:

  - You are about to drop the column `currency` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `personalityTypes` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `salaryInterval` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `salaryMax` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the `_FieldToJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GoalToJob` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FieldToJob" DROP CONSTRAINT "_FieldToJob_A_fkey";

-- DropForeignKey
ALTER TABLE "_FieldToJob" DROP CONSTRAINT "_FieldToJob_B_fkey";

-- DropForeignKey
ALTER TABLE "_GoalToJob" DROP CONSTRAINT "_GoalToJob_A_fkey";

-- DropForeignKey
ALTER TABLE "_GoalToJob" DROP CONSTRAINT "_GoalToJob_B_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "currency",
DROP COLUMN "personalityTypes",
DROP COLUMN "salary",
DROP COLUMN "salaryInterval",
DROP COLUMN "salaryMax";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isInterests" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "_FieldToJob";

-- DropTable
DROP TABLE "_GoalToJob";
