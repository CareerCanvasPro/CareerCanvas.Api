/*
  Warnings:

  - The `date` column on the `Appreciation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `price` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `rating` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the column `certificateName` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `certificateSize` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `certificateType` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `certificateUploadedAt` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `certificateUrl` on the `Education` table. All the data in the column will be lost.
  - The `graduationDate` column on the `Education` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `endDate` column on the `Occupation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `personalityTestResultEI` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `personalityTestResultJP` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `personalityTestResultSN` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `personalityTestResultTF` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `personalityTestStatus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `personalityType` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Appreciation` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Appreciation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organization` on table `Appreciation` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Made the column `field` on table `Education` required. This step will fail if there are existing NULL values in that column.
  - Made the column `institute` on table `Education` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `deadline` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `locationType` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Occupation` table without a default value. This is not possible if the table is not empty.
  - Made the column `designation` on table `Occupation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organization` on table `Occupation` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `startDate` to the `Occupation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `expiresAt` on the `Otp` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `PersonalityTestAnswer` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `PersonalityTestQuestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `uploadedAt` on the `Resume` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `address` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profilePicture` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `coins` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "JobLocationType" AS ENUM ('Hybrid', 'On-site', 'Remote');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('Contractual', 'Full-time', 'Intern', 'Part-time');

-- CreateEnum
CREATE TYPE "PersonalityTestQuestionCategory" AS ENUM ('EI', 'SN', 'TF', 'JP');

-- DropIndex
DROP INDEX "User_fcmToken_key";

-- AlterTable
ALTER TABLE "Appreciation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3),
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "organization" SET NOT NULL;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "ratingCount" SET DEFAULT 0,
ALTER COLUMN "studentCount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "certificateName",
DROP COLUMN "certificateSize",
DROP COLUMN "certificateType",
DROP COLUMN "certificateUploadedAt",
DROP COLUMN "certificateUrl",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "field" SET NOT NULL,
DROP COLUMN "graduationDate",
ADD COLUMN     "graduationDate" TIMESTAMP(3),
ALTER COLUMN "institute" SET NOT NULL;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "deadline",
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
DROP COLUMN "locationType",
ADD COLUMN     "locationType" "JobLocationType" NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "JobType" NOT NULL;

-- AlterTable
ALTER TABLE "Occupation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "designation" SET NOT NULL,
DROP COLUMN "endDate",
ADD COLUMN     "endDate" TIMESTAMP(3),
ALTER COLUMN "organization" SET NOT NULL,
DROP COLUMN "startDate",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "expiresAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "otp" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PersonalityTestAnswer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PersonalityTestQuestion" DROP COLUMN "category",
ADD COLUMN     "category" "PersonalityTestQuestionCategory" NOT NULL;

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "uploadedAt",
ADD COLUMN     "uploadedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "personalityTestResultEI",
DROP COLUMN "personalityTestResultJP",
DROP COLUMN "personalityTestResultSN",
DROP COLUMN "personalityTestResultTF",
DROP COLUMN "personalityTestStatus",
DROP COLUMN "personalityType",
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "profilePicture" SET NOT NULL,
ALTER COLUMN "coins" SET NOT NULL,
ALTER COLUMN "coins" SET DEFAULT 0;

-- DropEnum
DROP TYPE "Category";

-- DropEnum
DROP TYPE "LocationType";

-- DropEnum
DROP TYPE "Type";

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "educationId" TEXT NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personality" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "testResultEI" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "testResultSN" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "testResultTF" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "testResultJP" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "testStatus" "PersonalityTestStatus",
    "type" "PersonalityType",
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Personality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_educationId_key" ON "Certificate"("educationId");

-- CreateIndex
CREATE UNIQUE INDEX "Personality_userId_key" ON "Personality"("userId");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "Education"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personality" ADD CONSTRAINT "Personality_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
