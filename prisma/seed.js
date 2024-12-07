const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const faculty = await prisma.faculty.create({
    data: {
      facultyName: 'Matematika dan Ilmu Pengetahuan Alam',
      departments: {
        create: [
          {
            departmentName: 'Ilmu Komputer',
            studyPrograms: {
              create: [
                {
                  studyProgramName: 'S1 Ilmu Komputer',
                  subjects: {
                    create: [
                      {
                        subjectCode: 'COM620103',
                        subjectName: 'Dasar-Dasar Pemrograman',
                        subjectSKS: 3,
                        curriculum: {
                          create: {
                            curriculumName: '2020',
                          },
                        },
                        subSubjects: {
                          create: [
                            {
                              subjectType: {
                                create: {
                                  typeName: 'Teori',
                                },
                              },
                            },
                            {
                              subjectType: {
                                create: {
                                  typeName: 'Praktikum',
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
                  roomName: 'GIK L1. C',
                  roomCapacity: 100,
                  isPracticum: false,
                  isTheory: true,
                  isLab: false,
                },
                {
                  roomName: 'GIK L1. A',
                  roomCapacity: 100,
                  isPracticum: false,
                  isTheory: true,
                  isLab: false,
                },
                {
                  roomName: 'GIK L1. B',
                  roomCapacity: 100,
                  isPracticum: false,
                  isTheory: true,
                  isLab: false,
                },
                {
                  roomName: 'MIPA T L1. A',
                  roomCapacity: 40,
                  isPracticum: true,
                  isTheory: false,
                  isLab: true,
                },
                {
                  roomName: 'MIPA T L1. B',
                  roomCapacity: 40,
                  isPracticum: true,
                  isTheory: false,
                  isLab: true,
                },
                {
                  roomName: 'MIPA T LAB RPL',
                  roomCapacity: 40,
                  isPracticum: true,
                  isTheory: false,
                  isLab: true,
                },
                {
                  roomName: 'MIPA T LAB R1',
                  roomCapacity: 40,
                  isPracticum: true,
                  isTheory: false,
                  isLab: true,
                },
                {
                  roomName: 'MIPA T LAB R2',
                  roomCapacity: 40,
                  isPracticum: true,
                  isTheory: false,
                  isLab: true,
                },
                {
                  roomName: 'MIPA T LAB R3',
                  roomCapacity: 40,
                  isPracticum: true,
                  isTheory: false,
                  isLab: true,
                },
              ],
            },
            lecturers: {
              create: [
                {
                  lecturerName: '-',
                  lecturerNIP: '-',
                  lecturerEmail: '-',
                },
                {
                  lecturerName: 'Tristiyanto, Ph.D',
                  lecturerNIP: '198104142005011001',
                  lecturerEmail: 'tristyanto@gmail.com',
                },
                {
                  lecturerName: 'Bambang Hermanto, S.Kom, M.Cs.',
                  lecturerNIP: '197909122008121001',
                  lecturerEmail: 'bambang@gmail.com',
                },
                {
                  lecturerName: 'Anie Rose Irawati, S.T., M.Cs.',
                  lecturerNIP: '197910312006042002',
                  lecturerEmail: 'anie@gmail.com',
                },
                {
                  lecturerName: 'Febi Eka Febriansyah, M.T',
                  lecturerNIP: '198002192006041001',
                  lecturerEmail: 'ilkom737@gmail.com',
                  users: {
                    create: {
                      username: 'admin',
                      password: '$2a$12$mMX2.YS5fJsT4hxg53UNnu60pvjOEDyyAk/RyOK5r2KsG49PHxrNu',
                      userRole: 'admin',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });
  const scheduleSession = await prisma.scheduleSession.createMany({
    data: [
      {
        startTime: '07:30',
        endTime: '09:10',
        sessionNumber: 1,
      },
      {
        startTime: '09:15',
        endTime: '10:55',
        sessionNumber: 2,
      },
      {
        startTime: '11:00',
        endTime: '12:40',
        sessionNumber: 3,
      },
    ],
  });

  // Create ScheduleDay
  const scheduleDay = await prisma.scheduleDay.createMany({
    data: [
      { day: 'Senin' },
      { day: 'Selasa' },
      { day: 'Rabu' },
      { day: 'Kamis' },
      { day: 'Jumat' },
    ],
  });

  console.log('Database has been seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
