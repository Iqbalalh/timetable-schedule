import prisma from "@/app/(backend)/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET: Fetch schedules filtered by dayId, departmentId, academicPeriodId, and semesterTypeId
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const dayId = searchParams.get("dayId");
    const departmentId = searchParams.get("departmentId");
    const academicPeriodId = searchParams.get("academicPeriodId");
    const semesterTypeId = searchParams.get("semesterTypeId");

    // Ensure all required query params are provided
    if (!dayId || !departmentId || !academicPeriodId || !semesterTypeId) {
      return NextResponse.json(
        { error: "dayId, departmentId, academicPeriodId, and semesterTypeId are required" },
        { status: 400 }
      );
    }

    // Fetch schedules based on query params
    const schedules = await prisma.schedule.findMany({
      where: {
        scheduleDayId: parseInt(dayId), // Parse dayId as integer
        classLecturer: {
          // primaryLecturer: {
          //   departmentId: parseInt(departmentId), // Parse departmentId as integer
          // },
          class: {
            academicPeriodId: parseInt(academicPeriodId), // Parse academicPeriodId as integer
            academicPeriod: {
              semesterTypeId: parseInt(semesterTypeId), // Parse semesterTypeId as integer
            },
            studyProgramClass: {
              studyProgram: {
                departmentId: departmentId ? parseInt(departmentId) : undefined,
              },
            },
          },
        },
      },
      include: {
        classLecturer: {
          select: {
            primaryLecturerId: true,
            primaryLecturer: {
              select: { id: true, lecturerName: true, lecturerNIP: true },
            },
            secondaryLecturerId: true,
            secondaryLecturer: {
              select: { id: true, lecturerName: true, lecturerNIP: true },
            },
            class: {
              select: {
                academicPeriodId: true,
                classCapacity: true,
                subSubject: {
                  select: {
                    subjectTypeId: true,
                    subject: { 
                      select: { 
                        subjectName: true,
                        semester: {
                          select: {
                            semesterName: true
                          }
                        }
                      } 
                    },
                    subjectType: { select: { typeName: true, id: true } },
                  },
                },
                studyProgramClass: {
                  select: {
                    className: true,
                    studyProgram: {
                      select: {
                        departmentId: true,
                      }
                    }
                  },
                },
              },
            },
          },
        },
        scheduleDay: { select: { day: true, id: true } },
        scheduleSession: {
          select: {
            sessionNumber: true,
            startTime: true,
            endTime: true,
            id: true,
          },
        },
        room: {
          select: {
            roomName: true,
            roomCapacity: true,
            isPracticum: true,
            isTheory: true,
          },
        },
      },
    });

    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
