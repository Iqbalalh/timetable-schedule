-- CreateTable
CREATE TABLE "faculties" (
    "id" SERIAL NOT NULL,
    "facultyName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faculties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "departmentName" TEXT NOT NULL,
    "idFaculty" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studyPrograms" (
    "id" SERIAL NOT NULL,
    "studyProgramName" TEXT NOT NULL,
    "idDepartment" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studyPrograms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculums" (
    "id" SERIAL NOT NULL,
    "curriculumName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curriculums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" SERIAL NOT NULL,
    "subjectCode" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "subjectSKS" INTEGER NOT NULL,
    "idCurriculum" INTEGER NOT NULL,
    "idStudyProgram" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjectTypes" (
    "id" SERIAL NOT NULL,
    "typeName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjectTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subSubjects" (
    "id" SERIAL NOT NULL,
    "idSubjectType" INTEGER NOT NULL,
    "idSubject" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subSubjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "roomName" TEXT NOT NULL,
    "roomCapacity" INTEGER NOT NULL,
    "idDepartment" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPracticum" BOOLEAN NOT NULL,
    "isTheory" BOOLEAN NOT NULL,
    "isLab" BOOLEAN NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academicPeriods" (
    "id" SERIAL NOT NULL,
    "periodName" TEXT NOT NULL,
    "curriculumId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academicPeriods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" SERIAL NOT NULL,
    "className" TEXT NOT NULL,
    "classCapacity" INTEGER NOT NULL,
    "idSubSubject" INTEGER NOT NULL,
    "idAcademicPeriod" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecturers" (
    "id" SERIAL NOT NULL,
    "lecturerName" TEXT NOT NULL,
    "lecturerNIP" TEXT NOT NULL,
    "lecturerEmail" TEXT NOT NULL,
    "idDepartment" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lecturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classLecturers" (
    "id" SERIAL NOT NULL,
    "idLecturer" INTEGER NOT NULL,
    "idLecturer2" INTEGER NOT NULL,
    "idClass" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classLecturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "idLecturer" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduleSessions" (
    "id" SERIAL NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "sessionNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduleSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduleDays" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduleDays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "idDay" INTEGER NOT NULL,
    "idClassLecturer" INTEGER NOT NULL,
    "idScheduleSession" INTEGER NOT NULL,
    "idRoom" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subjects_subjectCode_key" ON "subjects"("subjectCode");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_lecturerNIP_key" ON "lecturers"("lecturerNIP");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_lecturerEmail_key" ON "lecturers"("lecturerEmail");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_idFaculty_fkey" FOREIGN KEY ("idFaculty") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studyPrograms" ADD CONSTRAINT "studyPrograms_idDepartment_fkey" FOREIGN KEY ("idDepartment") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_idCurriculum_fkey" FOREIGN KEY ("idCurriculum") REFERENCES "curriculums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_idStudyProgram_fkey" FOREIGN KEY ("idStudyProgram") REFERENCES "studyPrograms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subSubjects" ADD CONSTRAINT "subSubjects_idSubjectType_fkey" FOREIGN KEY ("idSubjectType") REFERENCES "subjectTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subSubjects" ADD CONSTRAINT "subSubjects_idSubject_fkey" FOREIGN KEY ("idSubject") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_idDepartment_fkey" FOREIGN KEY ("idDepartment") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academicPeriods" ADD CONSTRAINT "academicPeriods_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "curriculums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_idSubSubject_fkey" FOREIGN KEY ("idSubSubject") REFERENCES "subSubjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_idAcademicPeriod_fkey" FOREIGN KEY ("idAcademicPeriod") REFERENCES "academicPeriods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturers" ADD CONSTRAINT "lecturers_idDepartment_fkey" FOREIGN KEY ("idDepartment") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classLecturers" ADD CONSTRAINT "classLecturers_idLecturer_fkey" FOREIGN KEY ("idLecturer") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classLecturers" ADD CONSTRAINT "classLecturers_idLecturer2_fkey" FOREIGN KEY ("idLecturer2") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classLecturers" ADD CONSTRAINT "classLecturers_idClass_fkey" FOREIGN KEY ("idClass") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_idLecturer_fkey" FOREIGN KEY ("idLecturer") REFERENCES "lecturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_idDay_fkey" FOREIGN KEY ("idDay") REFERENCES "scheduleDays"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_idClassLecturer_fkey" FOREIGN KEY ("idClassLecturer") REFERENCES "classLecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_idScheduleSession_fkey" FOREIGN KEY ("idScheduleSession") REFERENCES "scheduleSessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_idRoom_fkey" FOREIGN KEY ("idRoom") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
