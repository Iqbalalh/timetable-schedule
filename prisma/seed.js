const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

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

  // Study Programs
  const studyPrograms = await prisma.studyProgram.createMany({
    data: [
      {
        studyProgramName: 'S1 Ilmu Komputer',
        departmentId: department.id,
      },
      {
        studyProgramName: 'D3 Manajemen Informatika',
        departmentId: department.id,
      }
    ],
  });

  // Curriculum
  const curriculum = await prisma.curriculum.create({
    data: {
      curriculumName: '2020',
    },
  });

  // Semester Types
  const semesterTypes = await prisma.semesterType.createMany({
    data: [
      {
        typeName: 'Ganjil',
      },
      {
        typeName: 'Genap',
      }
    ],
  });

  // Semesters
  const semesters = await prisma.semester.createMany({
    data: [
      {
        semesterName: 1,
        semesterTypeId: 1,
      },
      {
        semesterName: 2,
        semesterTypeId: 2,
      },
      {
        semesterName: 3,
        semesterTypeId: 1,
      }
    ],
  });

  // Subjects
  const subjects = await prisma.subject.createMany({
    data: [
      {
        subjectCode: 'COM101',
        subjectName: 'Dasar-Dasar Pemrograman',
        subjectSKS: 3,
        subjectCategory: 'Wajib',
        curriculumId: curriculum.id,
        studyProgramId: 1,
        semesterId: 1,
      },
      {
        subjectCode: 'MI101',
        subjectName: 'Dasar-Dasar Pemrograman',
        subjectSKS: 3,
        subjectCategory: 'Wajib',
        curriculumId: curriculum.id,
        studyProgramId: 2,
        semesterId: 1,
      },
      {
        subjectCode: 'COM111',
        subjectName: 'Logika',
        subjectSKS: 3,
        subjectCategory: 'Peminatan',
        curriculumId: curriculum.id,
        studyProgramId: 1,
        semesterId: 1,
      },
    ],
  });

  // Study Program Classes
  const studyProgramClasses = await prisma.studyProgramClass.createMany({
    data: [
      {
        className: 'A',
        studyProgramId: 1,
      },
      {
        className: 'AB',
        studyProgramId: 1,
      },
      {
        className: 'D3MI',
        studyProgramId: 2,
      },
    ],
  });

  // Assistants
  const assistant = await prisma.assistant.create({
    data: {
      assistantName: 'Jihan',
      assistantNPM: '123456789',
      semesterId: 3,
      studyProgramClassId: 1,
    },
  });

  // Subject Types
  const subjectTypes = await prisma.subjectType.createMany({
    data: [
      {
        typeName: 'T',
      },
      {
        typeName: 'P',
      },
      {
        typeName: 'R',
      },
    ],
  });

  // Sub Subjects
  const subSubjects = await prisma.subSubject.createMany({
    data: [
      {
        subjectId: 1,
        subjectTypeId: 1,
      },
      {
        subjectId: 1,
        subjectTypeId: 2,
      },
    ],
  });

  // Rooms
  const rooms = await prisma.room.createMany({
    data: [
      {
        roomName: 'LAB RPL',
        roomCapacity: 25,
        isPracticum: true,
        isTheory: false,
        isResponse: false,
        departmentId: department.id,
      },
      {
        roomName: 'GIK L1A',
        roomCapacity: 50,
        isPracticum: false,
        isTheory: true,
        isResponse: true,
        departmentId: department.id,
      },
    ],
  });

  // Academic Periods
  const academicPeriod = await prisma.academicPeriod.create({
    data: {
      academicYear: 2023,
      curriculumId: curriculum.id,
      semesterTypeId: 1,
    },
  });

  // Classes
  const classData = await prisma.class.create({
    data: {
      classCapacity: 30,
      studyProgramClassId: 1,
      subSubjectId: 1,
      academicPeriodId: academicPeriod.id,
    },
  });

  // Lecturers
  const lecturer = await prisma.lecturer.create({
    data: {
      lecturerName: 'Febi Eka Febriansyah',
      lecturerNIP: '987654321',
      lecturerEmail: 'febi@example.com',
      departmentId: department.id,
    },
  });

  const user = await prisma.user.create({
    data: {
      username: 'admin',
      password: '$2a$12$zZeNjPxjEyWsvU78f7MlOuPIxTI9fjGmjNqgtrZpILGxUdpXlHUGu',
      role: 'admin',
      lecturerId: lecturer.id,
    }
  });

  // Schedule Days
  const scheduleDay = await prisma.scheduleDay.create({
    data: {
      day: 'Senin',
    },
  });

  // Schedule Sessions
  const scheduleSession = await prisma.scheduleSession.createMany({
    data: [
      {
        startTime: '07:30',
        endTime: '09:10',
        sessionNumber: 1,
      },
    ],
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
