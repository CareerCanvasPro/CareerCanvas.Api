/*
  Warnings:

  - You are about to drop the column `currency` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `ratingCount` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `studentCount` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `topicId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `_AuthorToCourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CourseToGoal` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_topicId_fkey";

-- DropForeignKey
ALTER TABLE "_AuthorToCourse" DROP CONSTRAINT "_AuthorToCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_AuthorToCourse" DROP CONSTRAINT "_AuthorToCourse_B_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToGoal" DROP CONSTRAINT "_CourseToGoal_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToGoal" DROP CONSTRAINT "_CourseToGoal_B_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "currency",
DROP COLUMN "duration",
DROP COLUMN "image",
DROP COLUMN "level",
DROP COLUMN "price",
DROP COLUMN "rating",
DROP COLUMN "ratingCount",
DROP COLUMN "studentCount",
DROP COLUMN "topicId",
ADD COLUMN     "description" TEXT NOT NULL;

-- DropTable
DROP TABLE "_AuthorToCourse";

-- DropTable
DROP TABLE "_CourseToGoal";

-- CreateTable
CREATE TABLE "CourseTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CourseTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseToCourseTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToCourseTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseTag_name_key" ON "CourseTag"("name");

-- CreateIndex
CREATE INDEX "_CourseToCourseTag_B_index" ON "_CourseToCourseTag"("B");

-- AddForeignKey
ALTER TABLE "_CourseToCourseTag" ADD CONSTRAINT "_CourseToCourseTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseTag" ADD CONSTRAINT "_CourseToCourseTag_B_fkey" FOREIGN KEY ("B") REFERENCES "CourseTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
