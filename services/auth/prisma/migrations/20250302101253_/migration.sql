-- CreateEnum
CREATE TYPE "Category" AS ENUM ('EI', 'SN', 'TF', 'JP');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('BDT', 'USD');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('Bangla', 'English');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('Beginner', 'Intermediate', 'Expert');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('Hybrid', 'On-site', 'Remote');

-- CreateEnum
CREATE TYPE "PersonalityTestStatus" AS ENUM ('Complete', 'Pending');

-- CreateEnum
CREATE TYPE "PersonalityType" AS ENUM ('INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP');

-- CreateEnum
CREATE TYPE "SalaryInterval" AS ENUM ('Annum', 'Month');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('Contractual', 'Full-time', 'Intern', 'Part-time');

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "duration" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL,
    "ratingCount" INTEGER NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "studentCount" INTEGER NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "companyLogo" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "deadline" BIGINT NOT NULL,
    "location" TEXT NOT NULL,
    "locationType" "LocationType" NOT NULL,
    "organization" TEXT NOT NULL,
    "personalityTypes" "PersonalityType"[],
    "position" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "salaryInterval" "SalaryInterval" NOT NULL,
    "salaryMax" INTEGER,
    "type" "Type" NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalityTestAnswer" (
    "id" TEXT NOT NULL,
    "answer" INTEGER NOT NULL,
    "questionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PersonalityTestAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalityTestQuestion" (
    "id" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "question" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "PersonalityTestQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "aboutMe" TEXT,
    "address" TEXT,
    "email" TEXT,
    "fcmToken" TEXT,
    "languages" "Language"[],
    "name" TEXT,
    "personalityTestResultEI" DOUBLE PRECISION,
    "personalityTestResultSN" DOUBLE PRECISION,
    "personalityTestResultTF" DOUBLE PRECISION,
    "personalityTestResultJP" DOUBLE PRECISION,
    "personalityTestStatus" "PersonalityTestStatus",
    "personalityType" "PersonalityType",
    "phone" TEXT,
    "profilePicture" TEXT,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appreciation" (
    "id" TEXT NOT NULL,
    "date" BIGINT,
    "name" TEXT,
    "organization" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Appreciation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "achievements" TEXT,
    "certificateName" TEXT,
    "certificateSize" INTEGER,
    "certificateType" TEXT,
    "certificateUploadedAt" BIGINT,
    "certificateUrl" TEXT,
    "field" TEXT,
    "graduationDate" BIGINT,
    "institute" TEXT,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occupation" (
    "id" TEXT NOT NULL,
    "designation" TEXT,
    "endDate" BIGINT,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "organization" TEXT,
    "startDate" BIGINT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Occupation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "uploadedAt" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AuthorToCourse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AuthorToCourse_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FieldToJob" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FieldToJob_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FieldToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FieldToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GoalToJob" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GoalToJob_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GoalToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GoalToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SkillToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SkillToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CourseToGoal" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToGoal_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Field_name_key" ON "Field"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Goal_name_key" ON "Goal"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalityTestAnswer_questionId_userId_key" ON "PersonalityTestAnswer"("questionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_fcmToken_key" ON "User"("fcmToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "_AuthorToCourse_B_index" ON "_AuthorToCourse"("B");

-- CreateIndex
CREATE INDEX "_FieldToJob_B_index" ON "_FieldToJob"("B");

-- CreateIndex
CREATE INDEX "_FieldToUser_B_index" ON "_FieldToUser"("B");

-- CreateIndex
CREATE INDEX "_GoalToJob_B_index" ON "_GoalToJob"("B");

-- CreateIndex
CREATE INDEX "_GoalToUser_B_index" ON "_GoalToUser"("B");

-- CreateIndex
CREATE INDEX "_SkillToUser_B_index" ON "_SkillToUser"("B");

-- CreateIndex
CREATE INDEX "_CourseToGoal_B_index" ON "_CourseToGoal"("B");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalityTestAnswer" ADD CONSTRAINT "PersonalityTestAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "PersonalityTestQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalityTestAnswer" ADD CONSTRAINT "PersonalityTestAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appreciation" ADD CONSTRAINT "Appreciation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occupation" ADD CONSTRAINT "Occupation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToCourse" ADD CONSTRAINT "_AuthorToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToCourse" ADD CONSTRAINT "_AuthorToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FieldToJob" ADD CONSTRAINT "_FieldToJob_A_fkey" FOREIGN KEY ("A") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FieldToJob" ADD CONSTRAINT "_FieldToJob_B_fkey" FOREIGN KEY ("B") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FieldToUser" ADD CONSTRAINT "_FieldToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FieldToUser" ADD CONSTRAINT "_FieldToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GoalToJob" ADD CONSTRAINT "_GoalToJob_A_fkey" FOREIGN KEY ("A") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GoalToJob" ADD CONSTRAINT "_GoalToJob_B_fkey" FOREIGN KEY ("B") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GoalToUser" ADD CONSTRAINT "_GoalToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GoalToUser" ADD CONSTRAINT "_GoalToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToUser" ADD CONSTRAINT "_SkillToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToUser" ADD CONSTRAINT "_SkillToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToGoal" ADD CONSTRAINT "_CourseToGoal_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToGoal" ADD CONSTRAINT "_CourseToGoal_B_fkey" FOREIGN KEY ("B") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
