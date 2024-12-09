import prisma from "@/app/(backend)/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = {
      departments: await prisma.department.findMany({
        include: {
          faculty: true,
          studyPrograms: {
            include: {
              subjects: {
                include: {
                  curriculum: true,
                  semester: {
                    include: {
                      semesterType: true,
                    },
                  },
                },
              },
            },
          },
          rooms: true,
          lecturers: true,
        },
      }),
      faculties: await prisma.faculty.findMany({
        include: {
          departments: true,
        },
      }),
      studyPrograms: await prisma.studyProgram.findMany({
        include: {
          subjects: {
            include: {
              curriculum: true,
              semester: {
                include: {
                  semesterType: true,
                },
              },
            },
          },
          department: true,
        },
      }),
      subjects: await prisma.subject.findMany({
        include: {
          curriculum: true,
          semester: {
            include: {
              semesterType: true,
            },
          },
          studyProgram: true,
        },
      }),
      rooms: await prisma.room.findMany({
        include: {
          department: true,
        },
      }),
      lecturers: await prisma.lecturer.findMany({
        include: {
          department: true,
        },
      }),
      curriculums: await prisma.curriculum.findMany({
        include: {
          subjects: true,
        },
      }),
      semesters: await prisma.semester.findMany({
        include: {
          semesterType: true,
          subjects: true,
        },
      }),
      semesterTypes: await prisma.semesterType.findMany(),
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
