import prisma from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        classLecturer: {
          select: {
            lecturer: {
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

export async function POST(req) {
  try {
    const { scheduleDayId, classIdLecturer, scheduleSessionId, roomId } =
      await req.json();

    // Validate input
    if (!scheduleDayId) {
      return NextResponse.json({ error: "Day is required" }, { status: 400 });
    }
    if (!classIdLecturer) {
      return NextResponse.json(
        { error: "Class lecturer ID is required" },
        { status: 400 }
      );
    }
    if (!scheduleSessionId) {
      return NextResponse.json(
        { error: "Schedule session ID is required" },
        { status: 400 }
      );
    }
    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // Fetch the room capacity
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { roomCapacity: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Create a new schedule
    const newSchedule = await prisma.schedule.create({
      data: {
        scheduleDayId,
        classIdLecturer,
        scheduleSessionId,
        roomId,
      },
    });

    // Fetch the class capacity for the class associated with the lecturer
    const classLecturer = await prisma.classLecturer.findUnique({
      where: { id: classIdLecturer },
      include: {
        class: true, // Include class to get the current capacity
      },
    });

    if (!classLecturer || !classLecturer.class) {
      return NextResponse.json(
        { error: "Class or Class Lecturer not found" },
        { status: 404 }
      );
    }

    // Calculate the new class capacity
    const newClassCapacity =
      classLecturer.class.classCapacity - room.roomCapacity;

    // Ensure that class capacity does not become negative
    // if (newClassCapacity < 0) {
    //   return NextResponse.json(
    //     { error: "Class capacity cannot be negative" },
    //     { status: 400 }
    //   );
    // }

    // Update the class capacity
    await prisma.class.update({
      where: { id: classLecturer.class.id },
      data: { classCapacity: newClassCapacity },
    });

    // Return the new schedule and updated class capacity
    return NextResponse.json(
      {
        schedule: newSchedule,
        updatedClassCapacity: newClassCapacity,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
