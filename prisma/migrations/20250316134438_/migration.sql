-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isEducations" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOccupations" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSkills" BOOLEAN NOT NULL DEFAULT false;
