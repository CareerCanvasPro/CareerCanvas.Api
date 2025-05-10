/*
  Warnings:

  - You are about to drop the column `coverLetterResumeId` on the `CustomResumeEducation` table. All the data in the column will be lost.
  - You are about to drop the column `coverLetterResumeId` on the `CustomResumeJobSkill` table. All the data in the column will be lost.
  - You are about to drop the column `coverLetterResumeId` on the `CustomResumeWorkExperience` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomResumeEducation" DROP CONSTRAINT "CustomResumeEducation_coverLetterResumeId_fkey";

-- DropForeignKey
ALTER TABLE "CustomResumeJobSkill" DROP CONSTRAINT "CustomResumeJobSkill_coverLetterResumeId_fkey";

-- DropForeignKey
ALTER TABLE "CustomResumeWorkExperience" DROP CONSTRAINT "CustomResumeWorkExperience_coverLetterResumeId_fkey";

-- AlterTable
ALTER TABLE "CustomResumeEducation" DROP COLUMN "coverLetterResumeId";

-- AlterTable
ALTER TABLE "CustomResumeJobSkill" DROP COLUMN "coverLetterResumeId";

-- AlterTable
ALTER TABLE "CustomResumeWorkExperience" DROP COLUMN "coverLetterResumeId";

-- CreateTable
CREATE TABLE "CoverLetterResumeEducation" (
    "id" TEXT NOT NULL,
    "cgpa" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "degree" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "graduationDate" TIMESTAMP(3) NOT NULL,
    "institute" TEXT NOT NULL,
    "instituteLocation" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CoverLetterResumeEducation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverLetterResumeJobSkill" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CoverLetterResumeJobSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverLetterResumeWorkExperience" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "designation" TEXT NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "organization" TEXT NOT NULL,
    "organizationLocation" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CoverLetterResumeWorkExperience_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoverLetterResumeEducation" ADD CONSTRAINT "CoverLetterResumeEducation_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CoverLetterResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverLetterResumeJobSkill" ADD CONSTRAINT "CoverLetterResumeJobSkill_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CoverLetterResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverLetterResumeWorkExperience" ADD CONSTRAINT "CoverLetterResumeWorkExperience_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CoverLetterResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
