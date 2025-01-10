import { Select } from "antd";
import prisma from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get("departmentId");
    const curriculumId = searchParams.get("curriculumId");
    const semesterTypeId = searchParams.get("semesterTypeId");
    const academicPeriodId = searchParams.get("academicPeriodId");

    const data = {
      academicPeriods: await prisma.academicPeriod.findMany({
        where: {
          curriculumId: curriculumId ? parseInt(curriculumId) : undefined,
          semesterTypeId: semesterTypeId ? parseInt(semesterTypeId) : undefined,
        },
        include: {
          curriculum: true,
          semesterType: true,
          classes: true,
        },
      }),
      studyPrograms: await prisma.studyProgram.findMany({
        where: {
          departmentId: departmentId ? parseInt(departmentId) : undefined,
        },
      }),
      semesters: await prisma.semester.findMany({
        where: {
          semesterTypeId: semesterTypeId ? parseInt(semesterTypeId) : undefined,
        },
      }),
      studyProgramClasses: await prisma.studyProgramClass.findMany({
        where: {
          studyProgram: {
            departmentId: departmentId ? parseInt(departmentId) : undefined,
          },
        },
        include: { studyProgram: true },
      }),
      assistants: await prisma.assistant.findMany({
        where: {
          studyProgramClass: {
            studyProgram: {
              departmentId: departmentId ? parseInt(departmentId) : undefined,
            },
          },
        },
      }),
      subjects: await prisma.subject.findMany({
        where: {
          curriculumId: curriculumId ? parseInt(curriculumId) : undefined,
          semester: {
            semesterTypeId: semesterTypeId
              ? parseInt(semesterTypeId)
              : undefined,
          },
          studyProgram: {
            departmentId: departmentId ? parseInt(departmentId) : undefined,
          },
        },
      }),
      subSubjects: await prisma.subSubject.findMany({
        where: {
          subject: {
            curriculumId: curriculumId ? parseInt(curriculumId) : undefined,
            semester: {
              semesterTypeId: semesterTypeId
                ? parseInt(semesterTypeId)
                : undefined,
            },
            studyProgram: {
              departmentId: departmentId ? parseInt(departmentId) : undefined,
            },
          },
        },
        include: {
          subject: true,
        },
      }),
      rooms: await prisma.room.findMany({
        where: {
          departmentId: departmentId ? parseInt(departmentId) : undefined,
        },
      }),
      classLecturers: await prisma.classLecturer.findMany({
        where: {
          class: {
            studyProgramClass: {
              studyProgram: {
                departmentId: departmentId ? parseInt(departmentId) : undefined,
              },
            },
            subSubject: {
              subject: {
                curriculumId: curriculumId ? parseInt(curriculumId) : undefined,
                semester: {
                  semesterTypeId: semesterTypeId
                    ? parseInt(semesterTypeId)
                    : undefined,
                },
              },
            },
            academicPeriodId: academicPeriodId
              ? parseInt(academicPeriodId)
              : undefined,
          },
        },
        include: {
          class: {
            include: {
              subSubject: {
                include: {
                  subject: {
                    include: {
                      semester: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      classes: await prisma.class.findMany({
        where: {
          studyProgramClass: {
            studyProgram: {
              departmentId: departmentId ? parseInt(departmentId) : undefined,
            },
          },
          academicPeriodId: academicPeriodId
            ? parseInt(academicPeriodId)
            : undefined,
        },
      }),
      lecturers: await prisma.lecturer.findMany({
        where: {
          departmentId: departmentId ? parseInt(departmentId) : undefined,
        },
      }),
      scheduleSessions: await prisma.scheduleSession.findMany(),
      scheduleDays: await prisma.scheduleDay.findMany(),
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
