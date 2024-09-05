import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const scheduleRooms = await prisma.scheduleRoom.findMany({
        include: {
            room: {
                select: {
                    roomName: true
                }
            },
            schedule: {
                classLecturer: {
                    select: {
                      lecturer: {
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
                  }
            }
        }
    });
    return NextResponse.json(scheduleRooms, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { idRoom, idSchedule } = await req.json();
  
      // Validate input
      if (!idRoom) {
        return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
      }
      if (!idSchedule) {
        return NextResponse.json({ error: "Schedule ID is required" }, { status: 400 });
      }

      // Create a new schedule session
      const newScheduleRoom = await prisma.scheduleRoom.create({
        data: {
          idRoom,
          idSchedule
        },
      });
  
      return NextResponse.json(newScheduleRoom, { status: 201 });
    } catch (error) {
      console.error("Error creating schedule room:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }