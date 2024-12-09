import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const scheduleRoom = await prisma.scheduleRoom.findUnique({
      where: { id: Number(id) },
    });

    if (!scheduleRoom) {
      return NextResponse.json({ error: "Schedule room not found" }, { status: 404 });
    }

    return NextResponse.json(scheduleRoom, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { roomId, idSchedule } = await req.json();
  
  // Validate input
  if (!roomId) {
    return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
  }
  if (!idSchedule) {
    return NextResponse.json({ error: "Schedule ID is required" }, { status: 400 });
  }

  try {
    const updatedScheduleRoom = await prisma.scheduleRoom.update({
      where: { id: Number(id) },
      data: { roomId, idSchedule }
    });

    return NextResponse.json(updatedScheduleRoom, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedScheduleRoom = await prisma.scheduleRoom.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedScheduleRoom, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
