import prisma from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = {
      departments: await prisma.department.findMany(),
      faculties: await prisma.faculty.findMany(),
      studyPrograms: await prisma.studyProgram.findMany(),
      subjects: await prisma.subject.findMany(),
      rooms: await prisma.room.findMany(),
      lecturers: await prisma.lecturer.findMany(),
      curriculums: await prisma.curriculum.findMany(),
      semesters: await prisma.semester.findMany(),
      semesterTypes: await prisma.semesterType.findMany(),
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
