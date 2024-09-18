import prisma from "@/app/(backend)/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET: Fetch schedules filtered by dayId and departmentId
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const dayId = searchParams.get("dayId");
    const departmentId = searchParams.get("departmentId");
    const academicPeriodId = searchParams.get("academicPeriodId");

    // Ensure the query params are provided
    if (!dayId || !departmentId || !academicPeriodId) {
      return NextResponse.json(
        { error: "dayId, academicPeriodId, and departmentId are required" },
        { status: 400 }
      );
    }

    // Fetch schedules based on dayId and departmentId
    const schedules = await prisma.schedule.findMany({
      where: {
        idDay: parseInt(dayId), // assuming dayId is an integer
        classLecturer: {
          lecturer: {
            idDepartment: parseInt(departmentId), // assuming departmentId is an integer
          },
          class: {
            idAcademicPeriod: parseInt(academicPeriodId),
          },
        },
      },
      include: {
        classLecturer: {
          select: {
            idLecturer: true,
            lecturer: {
              select: { id: true, lecturerName: true, lecturerNIP: true },
            },
            idLecturer2: true,
            lecturer2: {
              select: { id: true, lecturerName: true, lecturerNIP: true },
            },
            class: {
              select: {
                className: true,
                subSubject: {
                  select: {
                    idSubjectType: true,
                    subject: { select: { subjectName: true } },
                    subjectType: { select: { typeName: true, id: true } },
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
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
