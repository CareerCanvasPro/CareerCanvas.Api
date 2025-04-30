-- CreateTable
CREATE TABLE "CustomResume" (
    "id" TEXT NOT NULL,
    "address" TEXT,
    "communicationLevel" TEXT,
    "contentCreationLevel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOfBirth" TIMESTAMP(3),
    "drivingLicenseCategory" TEXT,
    "email" TEXT NOT NULL,
    "informationProcessingLevel" TEXT,
    "jobAppliedFor" TEXT,
    "linkedIn" TEXT,
    "mobile" TEXT NOT NULL,
    "motherTongue" TEXT,
    "name" TEXT NOT NULL,
    "nationality" TEXT,
    "personalStatement" TEXT,
    "position" TEXT,
    "preferredJob" TEXT,
    "problemSolvingLevel" TEXT,
    "profilePicture" TEXT,
    "safetyLevel" TEXT,
    "sex" TEXT,
    "studiesAppliedFor" TEXT,
    "telephone" TEXT,
    "website" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CustomResume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeAnnex" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeAnnex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeAward" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeAward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeCertification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeCitation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeCitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeCommunicationSkill" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeCommunicationSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeComputerCertificate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeComputerCertificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeComputerSkill" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeComputerSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeConference" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeConference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeCourse" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeEca" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeEca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeEducation" (
    "id" TEXT NOT NULL,
    "cgpa" DOUBLE PRECISION NOT NULL,
    "completedSemesters" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "degree" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "graduationDate" TIMESTAMP(3) NOT NULL,
    "institute" TEXT NOT NULL,
    "instituteLocation" TEXT NOT NULL,
    "totalSemesters" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeEducation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeJobSkill" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeJobSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeManagerialSkill" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeManagerialSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeMembership" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeOtherLanguage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listeningLevel" TEXT NOT NULL,
    "readingLevel" TEXT NOT NULL,
    "spokenInteractionLevel" TEXT NOT NULL,
    "spokenProductionLevel" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "writingLevel" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeOtherLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeOtherSkill" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeOtherSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumePresentation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumePresentation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeProject" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumePublication" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumePublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeReference" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "department" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "institute" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeResearchExperience" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeResearchExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeSeminar" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeSeminar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeTraining" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "endDate" TIMESTAMP(3),
    "eqfLevel" TEXT,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "organization" TEXT NOT NULL,
    "organizationLocation" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeTraining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomResumeWorkExperience" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "designation" TEXT NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "organization" TEXT NOT NULL,
    "organizationLocation" TEXT,
    "organizationWebsite" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "CustomResumeWorkExperience_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomResume" ADD CONSTRAINT "CustomResume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeAnnex" ADD CONSTRAINT "CustomResumeAnnex_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeAward" ADD CONSTRAINT "CustomResumeAward_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeCertification" ADD CONSTRAINT "CustomResumeCertification_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeCitation" ADD CONSTRAINT "CustomResumeCitation_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeCommunicationSkill" ADD CONSTRAINT "CustomResumeCommunicationSkill_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeComputerCertificate" ADD CONSTRAINT "CustomResumeComputerCertificate_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeComputerSkill" ADD CONSTRAINT "CustomResumeComputerSkill_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeConference" ADD CONSTRAINT "CustomResumeConference_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeCourse" ADD CONSTRAINT "CustomResumeCourse_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeEca" ADD CONSTRAINT "CustomResumeEca_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeEducation" ADD CONSTRAINT "CustomResumeEducation_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeJobSkill" ADD CONSTRAINT "CustomResumeJobSkill_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeManagerialSkill" ADD CONSTRAINT "CustomResumeManagerialSkill_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeMembership" ADD CONSTRAINT "CustomResumeMembership_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeOtherLanguage" ADD CONSTRAINT "CustomResumeOtherLanguage_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeOtherSkill" ADD CONSTRAINT "CustomResumeOtherSkill_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumePresentation" ADD CONSTRAINT "CustomResumePresentation_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeProject" ADD CONSTRAINT "CustomResumeProject_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumePublication" ADD CONSTRAINT "CustomResumePublication_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeReference" ADD CONSTRAINT "CustomResumeReference_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeResearchExperience" ADD CONSTRAINT "CustomResumeResearchExperience_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeSeminar" ADD CONSTRAINT "CustomResumeSeminar_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeTraining" ADD CONSTRAINT "CustomResumeTraining_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomResumeWorkExperience" ADD CONSTRAINT "CustomResumeWorkExperience_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "CustomResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
