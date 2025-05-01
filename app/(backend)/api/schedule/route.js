import prisma from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        classLecturer: {
          select: {
            primaryLecturer: {
              select: {
                id: true,
                lecturerName: true,
              },
            },
            secondaryLecturer: {
              select: {
                id: true,
                lecturerName: true,
              },
            },
            class: {
              select: {
                // className: true, 
                subSubject: {
                  select: {
                    subject: {
                      select: {
                        subjectName: true,
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
        },
        scheduleDay: {
          select: {
            day: true,
          },
        },
        scheduleSession: {
          select: {
            startTime: true,
            endTime: true,
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
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

