import prisma from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const classLecturers = await prisma.classLecturer.findMany({
      include: {
        class: {
          select: {
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
            studyProgramClass: {
              select: {
                className: true,
              }
            },
            classCapacity: true,
          },
        },
        primaryLecturer: {
          select: {
            lecturerName: true,
          },
        },
        secondaryLecturer: {
          select: {
            lecturerName: true,
          },
        },
        primaryAssistant: {
          select: {
            assistantName: true,
          },
        },
        secondaryAssistant: {
          select: {
            assistantName: true,
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
    const { classId, primaryLecturerId, secondaryLecturerId, primaryAssistantId, secondaryAssistantId } = await req.json();

    // Validate input
    if (!classId) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }
    if (!primaryLecturerId) {
      return NextResponse.json(
        { error: "Primary lecturer ID is required" },
        { status: 400 }
      );
    }

    // Create a new class lecturer
    const newClassLecturer = await prisma.classLecturer.create({
      data: {
        // class: {
        //   connect: {
        //     id: classId,
        //   },
        // },
        // primaryLecturer: {
        //   connect: {
        //     id: primaryLecturerId,
        //   },
        // },
        // secondaryLecturer: secondaryLecturerId
        //  # ? {
        //       connect: {
        //         id: secondaryLecturerId,
        //       },
        //     }
        //   : null,
        // primaryAssistant: primaryAssistantId
        //   #? {
        //       connect: {
        //         id: primaryAssistantId,
        //       },
        //     }
        //   : null,
        // secondaryAssistant: secondaryAssistantId
        //   #? {
        //       connect: {
        //         id: secondaryAssistantId,
        //       },
        //     }
        //   : null,
        classId, primaryLecturerId, secondaryLecturerId, primaryAssistantId, secondaryAssistantId
      },
    });

    return NextResponse.json(newClassLecturer, { status: 201 });
  } catch (error) {
    console.error("Error creating class lecturer:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },  // Menyertakan detail error untuk informasi lebih lanjut
      { status: 500 }
    );
  }
}
