import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        classLecturer: {
          select: {
            lecturer: {
              select: {
                lecturerName: true
              },
            },
            lecturer2: {
              select: {
                lecturerName: true
              },
            },
            class: {
              select: {
                className: true,
                subSubject: {
                  select: {
                    subject: {
                      select: {
                        subjectName: true
                      },
                    },
                    subjectType: {
                      select: {
                        typeName: true
                      },
                    },
                  },
                },
              }
            }
          }
        },
        scheduleDay: {
          select: {
            day: true
          }
        },
        scheduleSession: {
          select: {
            startTime: true,
            endTime: true
          }
        },
        room: {
          select: {
            roomName: true,
            roomCapacity: true,
            isPracticum: true,
            isTheory: true,
          }
        }
      }
    });
    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { idScheduleDay, idClassLecturer, idScheduleSession } = await req.json();
  
      // Validate input
      if (!idScheduleDay) {
        return NextResponse.json({ error: "Day is required" }, { status: 400 });
      }
      if (!idClassLecturer) {
        return NextResponse.json({ error: "Class lecturer ID is required" }, { status: 400 });
      }
      if (!idScheduleSession) {
        return NextResponse.json({ error: "Schedule session ID is required" }, { status: 400 });
      }
  
      // Create a new schedule
      const newSchedule = await prisma.schedule.create({
        data: {
          idScheduleDay,
          idClassLecturer,
          idScheduleSession
        },
      });
  
      return NextResponse.json(newSchedule, { status: 201 });
    } catch (error) {
      console.error("Error creating schedule:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }