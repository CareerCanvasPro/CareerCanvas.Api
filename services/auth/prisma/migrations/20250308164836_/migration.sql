/*
  Warnings:

  - The values [Hybrid,On-site,Remote] on the enum `JobLocationType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Contractual,Full-time,Intern,Part-time] on the enum `JobType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Bangla,English] on the enum `Language` will be removed. If these variants are still used in the database, this will fail.
  - The values [Beginner,Intermediate,Expert] on the enum `Level` will be removed. If these variants are still used in the database, this will fail.
  - The values [Complete,Pending] on the enum `PersonalityTestStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Annum,Month] on the enum `SalaryInterval` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JobLocationType_new" AS ENUM ('HYBRID', 'ON_SITE', 'REMOTE');
ALTER TABLE "Job" ALTER COLUMN "locationType" TYPE "JobLocationType_new" USING ("locationType"::text::"JobLocationType_new");
ALTER TYPE "JobLocationType" RENAME TO "JobLocationType_old";
ALTER TYPE "JobLocationType_new" RENAME TO "JobLocationType";
DROP TYPE "JobLocationType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "JobType_new" AS ENUM ('CONTRACTUAL', 'FULL_TIME', 'INTERN', 'PART_TIME');
ALTER TABLE "Job" ALTER COLUMN "type" TYPE "JobType_new" USING ("type"::text::"JobType_new");
ALTER TYPE "JobType" RENAME TO "JobType_old";
ALTER TYPE "JobType_new" RENAME TO "JobType";
DROP TYPE "JobType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Language_new" AS ENUM ('BANGLA', 'ENGLISH');
ALTER TABLE "User" ALTER COLUMN "languages" TYPE "Language_new"[] USING ("languages"::text::"Language_new"[]);
ALTER TYPE "Language" RENAME TO "Language_old";
ALTER TYPE "Language_new" RENAME TO "Language";
DROP TYPE "Language_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Level_new" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERT');
ALTER TABLE "Course" ALTER COLUMN "level" TYPE "Level_new" USING ("level"::text::"Level_new");
ALTER TYPE "Level" RENAME TO "Level_old";
ALTER TYPE "Level_new" RENAME TO "Level";
DROP TYPE "Level_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PersonalityTestStatus_new" AS ENUM ('COMPLETE', 'PENDING');
ALTER TABLE "Personality" ALTER COLUMN "testStatus" TYPE "PersonalityTestStatus_new" USING ("testStatus"::text::"PersonalityTestStatus_new");
ALTER TYPE "PersonalityTestStatus" RENAME TO "PersonalityTestStatus_old";
ALTER TYPE "PersonalityTestStatus_new" RENAME TO "PersonalityTestStatus";
DROP TYPE "PersonalityTestStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SalaryInterval_new" AS ENUM ('ANNUM', 'MONTH');
ALTER TABLE "Job" ALTER COLUMN "salaryInterval" TYPE "SalaryInterval_new" USING ("salaryInterval"::text::"SalaryInterval_new");
ALTER TYPE "SalaryInterval" RENAME TO "SalaryInterval_old";
ALTER TYPE "SalaryInterval_new" RENAME TO "SalaryInterval";
DROP TYPE "SalaryInterval_old";
COMMIT;
