import prisma from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const classLecturers = await prisma.classLecturer.findMany({
      include: {
        lecturer: {
          select: {
            lecturerName: true,
          },
        },
        secondaryLecturer: {
          select: {
            lecturerName: true,
          },
        },
        class: {
          select: {
            className: true,
            classCapacity: true,
            subSubject: {
              select: {
                subject: {
                  select: {
                    subjectCode: true,
                    subjectName: true,
                    studyProgram: {
                      select: {
                        studyProgramName: true,
                        department: {
                          select: {
                            departmentName: true,
                          },
                        },
                      },
                    },
                  },
                },
                subjectType: {
                  select: {
                    typeName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return NextResponse.json(classLecturers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { primaryLecturerId, secondaryLecturerId, classId } = await req.json();

    // Validate input
    if (!primaryLecturerId) {
      return NextResponse.json(
        { error: "Lecturer ID is required" },
        { status: 400 }
      );
    }
    if (!classId) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }
    if (!secondaryLecturerId) {
      return NextResponse.json(
        { error: "Lecturer 2 ID is required" },
        { status: 400 }
      );
    }

    // Create a new class lecturer
    const newClassLecturer = await prisma.classLecturer.create({
      data: {
        primaryLecturerId,
        secondaryLecturerId,
        classId,
      },
    });

    return NextResponse.json(newClassLecturer, { status: 201 });
  } catch (error) {
    console.error("Error creating class lecturer:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
