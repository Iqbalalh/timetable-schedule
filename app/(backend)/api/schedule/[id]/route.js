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

  try {
    const updatedSchedule = await prisma.schedule.update({
      where: { id: Number(id) },
      data: { idScheduleDay, idClassLecturer, idScheduleSession }
    });

    return NextResponse.json(updatedSchedule, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedSchedule = await prisma.schedule.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedSchedule, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
