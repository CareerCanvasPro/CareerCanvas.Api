-- AlterTable
ALTER TABLE "CustomResumeEducation" ADD COLUMN     "coverLetterResumeId" TEXT;

-- AlterTable
ALTER TABLE "CustomResumeJobSkill" ADD COLUMN     "coverLetterResumeId" TEXT;

-- AlterTable
ALTER TABLE "CustomResumeWorkExperience" ADD COLUMN     "coverLetterResumeId" TEXT;

-- CreateTable
CREATE TABLE "CoverLetter" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CoverLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverLetterJob" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organization" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coverLetterId" TEXT NOT NULL,

    CONSTRAINT "CoverLetterJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverLetterResume" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coverLetterId" TEXT NOT NULL,

    CONSTRAINT "CoverLetterResume_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoverLetterJob_coverLetterId_key" ON "CoverLetterJob"("coverLetterId");

-- CreateIndex
CREATE UNIQUE INDEX "CoverLetterResume_coverLetterId_key" ON "CoverLetterResume"("coverLetterId");

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverLetterJob" ADD CONSTRAINT "CoverLetterJob_coverLetterId_fkey" FOREIGN KEY ("coverLetterId") REFERENCES "CoverLetter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverLetterResume" ADD CONSTRAINT "CoverLetterResume_coverLetterId_fkey" FOREIGN KEY ("coverLetterId") REFERENCES "CoverLetter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeEducation" ADD CONSTRAINT "CustomResumeEducation_coverLetterResumeId_fkey" FOREIGN KEY ("coverLetterResumeId") REFERENCES "CoverLetterResume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeJobSkill" ADD CONSTRAINT "CustomResumeJobSkill_coverLetterResumeId_fkey" FOREIGN KEY ("coverLetterResumeId") REFERENCES "CoverLetterResume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeWorkExperience" ADD CONSTRAINT "CustomResumeWorkExperience_coverLetterResumeId_fkey" FOREIGN KEY ("coverLetterResumeId") REFERENCES "CoverLetterResume"("id") ON DELETE SET NULL ON UPDATE CASCADE;
