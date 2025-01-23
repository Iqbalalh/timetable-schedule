const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");
  
  const filePath = path.resolve(__dirname, '../public/database/DATA.xlsx');
  
  const workbook = xlsx.readFile(filePath);

  // Faculties
  const faculty = await prisma.faculty.create({
    data: {
      facultyName: 'Matematika dan Ilmu Pengetahuan Alam',
    },
  });

  // Departments
  const department = await prisma.department.create({
    data: {
      departmentName: 'Ilmu Komputer',
      facultyId: faculty.id,
    },
  });

  // Curriculum
  const curriculum = await prisma.curriculum.create({
    data: {
      curriculumName: '2020',
    },
  });

  // Semester Types
  await prisma.semesterType.createMany({
    data: [
      {
        typeName: 'Ganjil',
      },
      {
        typeName: 'Genap',
      }
    ],
  });

  //Assistants

  for (const sheetName of workbook.SheetNames) {
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    switch (sheetName) {

      // Study Programs
      case 'studyProgram':
        await prisma.studyProgram.createMany({
          data: sheetData.map((row) => ({
            studyProgramName: row.studyProgramName,
            departmentId: row.departmentId,
          })),
        });
        break;

      // Semesters
      case 'semester':
        await prisma.semester.createMany({
          data: sheetData.map((row) => ({
            semesterName: row.semesterName,
            semesterTypeId: row.semesterTypeId,
          })),
        });
        break;

      // Study Program Classes
      case 'studyProgramClass':
        await prisma.studyProgramClass.createMany({
          data: sheetData.map((row) => ({
            className: row.className,
            studyProgramId: row.studyProgramId,
          })),
        });
        break;

      // Subjects
      case 'subject':
        await prisma.subject.createMany({
          data: sheetData.map((row) => ({
            subjectCode: row.subjectCode,
            subjectName: row.subjectName,
            subjectSKS: row.subjectSKS,
            subjectCategory: row.subjectCategory,
            curriculumId: row.curriculumId,
            studyProgramId: row.studyProgramId,
            semesterId: row.semesterId,
          })),
        });
        break;

      // Subject Types
      case 'subjectType':
        await prisma.subjectType.createMany({
          data: sheetData.map((row) => ({
            typeName: row.typeName,
          })),
        });
        break;

      // Sub Subjects
      case 'subSubject':
        await prisma.subSubject.createMany({
          data: sheetData.map((row) => ({
            subjectTypeId: row.subjectTypeId,
            subjectId: row.subjectId,
          })),
        });
        break;

      // Rooms
      case 'room':
        await prisma.room.createMany({
          data: sheetData.map((row) => ({
            roomName: row.roomName,
            roomCapacity: row.roomCapacity,
            isPracticum: row.isPracticum,
            isTheory: row.isTheory,
            isResponse: row.isResponse,
            departmentId: row.departmentId,
            roomType: row.roomType,
          })),
        });
        break;

      // Academic Periods
      case 'academicPeriod':
        await prisma.academicPeriod.createMany({
          data: sheetData.map((row) => ({
            academicYear: row.academicYear,
            curriculumId: row.curriculumId,
            semesterTypeId: row.semesterTypeId,
          })),
        });
        break;

      // Classes
      case 'class':
        await prisma.class.createMany({
          data: sheetData.map((row) => ({
            classCapacity: row.classCapacity,
            studyProgramClassId: row.studyProgramClassId,
            subSubjectId: row.subSubjectId,
            academicPeriodId: row.academicPeriodId,
          })),
        });
        break;

      // Lecturers
      case 'lecturer':
        await prisma.lecturer.createMany({
          data: sheetData.map((row) => ({
            lecturerName: row.lecturerName,
            lecturerNIP: row.lecturerNIP,
            lecturerEmail: row.lecturerEmail,
            departmentId: row.departmentId,
          })),
        });
        break;

      // Class Lecturers
      case 'classLecturer':
        await prisma.classLecturer.createMany({
          data: sheetData.map((row) => ({
            classId: row.classId,
            primaryLecturerId: row.primaryLecturerId,
            secondaryLecturerId: row.secondaryLecturerId,
            primaryAssistantId: row.primaryAssistantId,
            secondaryAssistantId: row.secondaryAssistantId,
          })),
        });
        break;

      // Schedule Sessions
      case 'scheduleSession':
        await prisma.scheduleSession.createMany({
          data: sheetData.map((row) => ({
            startTime: row.startTime,
            endTime: row.endTime,
            sessionNumber: row.sessionNumber,
          })),
        });
        break;

      // Schedule Days
      case 'scheduleDay':
        await prisma.scheduleDay.createMany({
          data: sheetData.map((row) => ({
            day: row.day,
          })),
        });
        break;

      default:
        console.warn(`No matching table for sheet: ${sheetName}`);
    }
  }

  // User
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      password: '$2a$12$zZeNjPxjEyWsvU78f7MlOuPIxTI9fjGmjNqgtrZpILGxUdpXlHUGu',
      role: 'admin',
      lecturerId: 1,
    }
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
