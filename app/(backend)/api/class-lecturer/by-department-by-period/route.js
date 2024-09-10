import prisma from "@/app/(backend)/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Extract departmentId from the query parameters
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");
    const PeriodId = searchParams.get("periodId");

    if (!departmentId || !PeriodId) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Query the database to find class lecturers by departmentId
    const classLecturers = await prisma.classLecturer.findMany({
      where: {
        class: {
          subSubject: {
            subject: {
              studyProgram: {
                department: {
                  id: parseInt(departmentId), // Use departmentId in the query
                },
              },
            },
          },
          idAcademicPeriod: parseInt(PeriodId),
        },
      },
      include: {
        lecturer: {
          select: {
            lecturerName: true,
          },
        },
        lecturer2: {
          select: {
            lecturerName: true,
          },
        },
        class: {
          select: {
            className: true,
            classCapacity: true,
            academicPeriod: {
              select: {
                periodName: true,
              },
            },
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
