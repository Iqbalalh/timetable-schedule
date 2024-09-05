import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const scheduleDay = await prisma.scheduleDay.findUnique({
      where: { id: Number(id) },
    });

    if (!scheduleDay) {
      return NextResponse.json({ error: "Schedule day not found" }, { status: 404 });
    }

    return NextResponse.json(scheduleDay, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { day } = await req.json();
  
  // Validate input
  if (!day) {
    return NextResponse.json({ error: "Day is required" }, { status: 400 });
  }

  try {
    const updatedScheduleDay = await prisma.scheduleDay.update({
      where: { id: Number(id) },
      data: { day }
    });

    return NextResponse.json(updatedScheduleDay, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedScheduleDay = await prisma.scheduleDay.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedScheduleDay, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
