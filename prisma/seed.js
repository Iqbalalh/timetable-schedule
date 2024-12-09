import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create Faculties
  const faculty = await prisma.faculty.create({
    data: {
      facultyName: 'Faculty of Computer Science',
      departments: {
        create: [
          {
            departmentName: 'Department of Informatics',
            studyPrograms: {
              create: [
                {
                  studyProgramName: 'Informatics Engineering',
                  subjects: {
                    create: [
                      {
                        subjectCode: 'INF101',
                        subjectName: 'Introduction to Programming',
                        subjectSKS: 3,
                        subjectCategory: 'Core',
                        curriculum: {
                          create: {
                            curriculumName: 'Curriculum 2024',
                          },
                        },
                        semester: {
                          create: {
                            semesterName: 1,
                            semesterType: {
                              create: { typeName: 'Odd' },
                            },
                          },
                        },
                      },
                    ],
                  },
                  studyProgramClass: {
                    create: [
                      {
                        className: 'A',
                        assistants: {
                          create: [
                            {
                              assistantName: 'John Doe',
                              assistantNPM: '190102001',
                              semester: {
                                create: {
                                  semesterName: 1,
                                  semesterType: { create: { typeName: 'Odd' } },
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            rooms: {
              create: [
                {
                  roomName: 'Room A',
                  roomCapacity: 40,
                  isPracticum: false,
                  isTheory: true,
                  isResponse: false,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log({ faculty });

  // Create Academic Period
  const academicPeriod = await prisma.academicPeriod.create({
    data: {
      academicYear: 2024,
      curriculum: {
        create: {
          curriculumName: 'Curriculum 2024',
        },
      },
      SemesterType: {
        create: {
          typeName: 'Odd',
        },
      },
    },
  });

  console.log({ academicPeriod });

  // Create Schedule Days
  const scheduleDay = await prisma.scheduleDay.create({
    data: {
      day: 'Monday',
    },
  });

  console.log({ scheduleDay });

  // Create Schedule Sessions
  const scheduleSession = await prisma.scheduleSession.create({
    data: {
      startTime: '07:30',
      endTime: '09:10',
      sessionNumber: 1,
    },
  });

  console.log({ scheduleSession });

  // Create Lecturers
  const lecturer = await prisma.lecturer.create({
    data: {
      lecturerName: 'Dr. Alice Johnson',
      lecturerNIDN: '123456789',
      lecturerEmail: 'alice.johnson@example.com',
      department: {
        connect: { id: 1 }, // Adjust department ID if needed
      },
    },
  });

  console.log({ lecturer });

  // Create Users
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      password: '$2a$12$zZeNjPxjEyWsvU78f7MlOuPIxTI9fjGmjNqgtrZpILGxUdpXlHUGu',
      role: 'Admin',
      lecturer: {
        connect: { id: lecturer.id },
      },
    },
  });

  console.log({ user });

  // Create Classes
  const classData = await prisma.class.create({
    data: {
      classCapacity: 30,
      studyProgramClass: {
        connect: { id: 1 }, // Adjust study program class ID if needed
      },
      subSubject: {
        create: {
          subjectType: {
            create: { typeName: 'Lecture' },
          },
          subject: {
            connect: { id: 1 }, // Adjust subject ID if needed
          },
        },
      },
      academicPeriod: {
        connect: { id: academicPeriod.id },
      },
    },
  });

  console.log({ classData });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
