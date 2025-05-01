/*
  Warnings:

  - You are about to drop the column `periodName` on the `academicPeriods` table. All the data in the column will be lost.
  - You are about to drop the column `className` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `isLab` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `classIdLecturer` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `primaryLecturerId` on the `users` table. All the data in the column will be lost.
  - Added the required column `academicYear` to the `academicPeriods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semesterTypeId` to the `academicPeriods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyProgramClassId` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isResponse` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomType` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classLecturerId` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semesterId` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectCategory` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lecturerId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_classIdLecturer_fkey";

-- DropForeignKey
ALTER TABLE "studyPrograms" DROP CONSTRAINT "studyPrograms_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "subSubjects" DROP CONSTRAINT "subSubjects_subjectTypeId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_primaryLecturerId_fkey";

-- DropIndex
DROP INDEX "lecturers_lecturerEmail_key";

-- DropIndex
DROP INDEX "lecturers_lecturerNIP_key";

-- DropIndex
DROP INDEX "subjects_subjectCode_key";

-- AlterTable
ALTER TABLE "academicPeriods" DROP COLUMN "periodName",
ADD COLUMN     "academicYear" INTEGER NOT NULL,
ADD COLUMN     "semesterTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "classLecturers" ADD COLUMN     "primaryAssistantId" INTEGER,
ADD COLUMN     "secondaryAssistantId" INTEGER,
ALTER COLUMN "secondaryLecturerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "className",
ADD COLUMN     "studyProgramClassId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "lecturers" ALTER COLUMN "lecturerNIP" DROP NOT NULL,
ALTER COLUMN "lecturerEmail" DROP NOT NULL,
ALTER COLUMN "departmentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "isLab",
ADD COLUMN     "isResponse" BOOLEAN NOT NULL,
ADD COLUMN     "roomType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "classIdLecturer",
ADD COLUMN     "classLecturerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "semesterId" INTEGER NOT NULL,
ADD COLUMN     "subjectCategory" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "primaryLecturerId",
ADD COLUMN     "lecturerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "semesterTypes" (
    "id" SERIAL NOT NULL,
    "typeName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "semesterTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semesters" (
    "id" SERIAL NOT NULL,
    "semesterName" INTEGER NOT NULL,
    "semesterTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "semesters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studyProgramClasses" (
    "id" SERIAL NOT NULL,
    "className" TEXT NOT NULL,
    "studyProgramId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studyProgramClasses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assistants" (
    "id" SERIAL NOT NULL,
    "assistantName" TEXT NOT NULL,
    "assistantNPM" TEXT NOT NULL,
    "semesterId" INTEGER NOT NULL,
    "studyProgramClassId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assistants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studyPrograms" ADD CONSTRAINT "studyPrograms_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semesters" ADD CONSTRAINT "semesters_semesterTypeId_fkey" FOREIGN KEY ("semesterTypeId") REFERENCES "semesterTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studyProgramClasses" ADD CONSTRAINT "studyProgramClasses_studyProgramId_fkey" FOREIGN KEY ("studyProgramId") REFERENCES "studyPrograms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semesters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subSubjects" ADD CONSTRAINT "subSubjects_subjectTypeId_fkey" FOREIGN KEY ("subjectTypeId") REFERENCES "subjectTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academicPeriods" ADD CONSTRAINT "academicPeriods_semesterTypeId_fkey" FOREIGN KEY ("semesterTypeId") REFERENCES "semesterTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_studyProgramClassId_fkey" FOREIGN KEY ("studyProgramClassId") REFERENCES "studyProgramClasses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assistants" ADD CONSTRAINT "assistants_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semesters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assistants" ADD CONSTRAINT "assistants_studyProgramClassId_fkey" FOREIGN KEY ("studyProgramClassId") REFERENCES "studyProgramClasses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classLecturers" ADD CONSTRAINT "classLecturers_primaryAssistantId_fkey" FOREIGN KEY ("primaryAssistantId") REFERENCES "assistants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classLecturers" ADD CONSTRAINT "classLecturers_secondaryAssistantId_fkey" FOREIGN KEY ("secondaryAssistantId") REFERENCES "assistants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_classLecturerId_fkey" FOREIGN KEY ("classLecturerId") REFERENCES "classLecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
