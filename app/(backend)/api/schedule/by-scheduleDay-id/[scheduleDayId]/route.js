import prisma from "@/app/(backend)/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { scheduleDayId } = params;

    const schedules = await prisma.schedule.findMany({
      where: {
        scheduleDayId: parseInt(scheduleDayId),
      },
      include: {
        classLecturer: {
          select: {
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
