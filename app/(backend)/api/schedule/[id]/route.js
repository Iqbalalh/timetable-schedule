import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id: Number(id) },
    });

    if (!schedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    return NextResponse.json(schedule, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { idScheduleDay, classIdLecturer, scheduleSessionId } = await req.json();
  
  // Validate input
  if (!idScheduleDay) {
    return NextResponse.json({ error: "Day is required" }, { status: 400 });
  }
  if (!classIdLecturer) {
    return NextResponse.json({ error: "Class lecturer ID is required" }, { status: 400 });
  }
  if (!scheduleSessionId) {
    return NextResponse.json({ error: "Schedule session ID is required" }, { status: 400 });
  }

  try {
    const updatedSchedule = await prisma.schedule.update({
      where: { id: Number(id) },
      data: { idScheduleDay, classIdLecturer, scheduleSessionId }
    });

    return NextResponse.json(updatedSchedule, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Fetch the schedule and room details
    const schedule = await prisma.schedule.findUnique({
      where: { id: Number(id) },
      include: {
        room: true, // Include room details to get the room capacity
        classLecturer: {
          include: {
            class: true, // Include class to update the capacity
          },
        },
      },
    });

    if (!schedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    // Fetch the class capacity for the class associated with the lecturer
    const classLecturer = schedule.classLecturer;
    const roomCapacity = schedule.room.roomCapacity;
    const classCapacity = classLecturer.class.classCapacity;

    // Calculate the new class capacity
    const newClassCapacity = classCapacity + roomCapacity;

    // Ensure that class capacity does not exceed the maximum allowed
    await prisma.class.update({
      where: { id: classLecturer.class.id },
      data: { classCapacity: newClassCapacity },
    });

    // Delete the schedule
    await prisma.schedule.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Schedule deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}