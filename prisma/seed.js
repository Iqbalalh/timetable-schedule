const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a Faculty with Department and Study Programs
  const faculty = await prisma.faculty.create({
    data: {
      facultyName: "Faculty of Engineering",
      departments: {
        create: [
          {
            departmentName: "Computer Science",
            studyPrograms: {
              create: [
                {
                  studyProgramName: "Software Engineering",
                  subjects: {
                    create: [
                      {
                        subjectCode: "CS101",
                        subjectName: "Introduction to Programming",
                        subjectSKS: 3,
                        academicPeriod: {
                          create: {
                            periodName: "2024/2025",
                          },
                        },
                        subSubjects: {
                          create: [
                            {
                              subjectType: {
                                create: { typeName: "Theory" },
                              },
                              classes: {
                                create: {
                                  className: "Class A",
                                  classCapacity: 30,
                                  classLecturers: {
                                    create: {
                                      lecturer: {
                                        create: {
                                          lecturerName: "Dr. John Doe",
                                          lecturerNIP: "1234567890",
                                          lecturerEmail: "jdoe@university.com",
                                          department: {
                                            connect: { id: 1 }, // Connect to "Computer Science" department
                                          },
                                        },
                                      },
                                    },
                                  },
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
                  roomName: "Room 101",
                  roomCapacity: 40,
                  isPracticum: false,
                  isTheory: true,
                  subjectType: { connect: { id: 1 } }, // Connect to subject type "Theory"
                },
                {
                  roomName: "Room 102",
                  roomCapacity: 30,
                  isPracticum: true,
                  isTheory: false,
                  subjectType: { connect: { id: 2 } }, // Connect to subject type "Practicum"
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Create Schedule Day
  const scheduleDay = await prisma.scheduleDay.create({
    data: {
      day: "Monday",
      schedules: {
        create: [
          {
            idClassLecturer: 1, // Assumes there is a ClassLecturer with ID 1
            idScheduleSession: 1, // Assumes there is a ScheduleSession with ID 1
            idRoom: 1, // Room 101
          },
        ],
      },
    },
  });

  // Create Schedule Session
  const scheduleSession = await prisma.scheduleSession.create({
    data: {
      startTime: "08:00",
      endTime: "10:00",
      sessionNumber: 1,
      schedules: {
        create: [
          {
            idClassLecturer: 1,
            idRoom: 1, // Room 101
            idDay: scheduleDay.id,
          },
        ],
      },
    },
  });

  console.log({ faculty, scheduleDay, scheduleSession });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
