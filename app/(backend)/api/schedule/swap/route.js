import prisma from "@/app/(backend)/lib/db";
import { NextResponse } from "next/server";

// GET: Fetch schedules filtered by dayId, departmentId, academicPeriodId, and semesterTypeId
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");
    const academicPeriodId = searchParams.get("academicPeriodId");
    const semesterTypeId = searchParams.get("semesterTypeId");

    // Ensure all required query params are provided
    if ( !departmentId || !academicPeriodId || !semesterTypeId) {
      return NextResponse.json(
        { error: "departmentId, academicPeriodId, and semesterTypeId are required" },
        { status: 400 }
      );
    }

    // Fetch schedules based on query params
    const schedules = await prisma.schedule.findMany({
      where: {
        classLecturer: {
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
                subSubject: {
                  select: {
                    subjectTypeId: true,
                    subject: { select: { subjectName: true } },
                    subjectType: { select: { typeName: true, id: true } },
                  },
                },
                studyProgramClass: {
                  select: {
                    className: true,
                  },
                },
              },
            },
          },
        },
        scheduleDay: { select: { day: true, id: true } },
        scheduleSession: {
          select: {
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

