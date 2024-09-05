import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const scheduleSession = await prisma.scheduleSession.findUnique({
      where: { id: Number(id) },
    });

    if (!scheduleSession) {
      return NextResponse.json({ error: "schedule session not found" }, { status: 404 });
    }

    return NextResponse.json(scheduleSession, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { startTime, endTime, sessionNumber } = await req.json();
  
  // Validate input
  if (!sessionNumber) {
    return NextResponse.json({ error: "Session number is required" }, { status: 400 });
  }
  if (!startTime) {
    return NextResponse.json({ error: "Start time is required" }, { status: 400 });
  }
  if (!endTime) {
    return NextResponse.json({ error: "End time is required" }, { status: 400 });
  }

  try {
    const updatedScheduleSession = await prisma.scheduleSession.update({
      where: { id: Number(id) },
      data: { startTime, endTime, sessionNumber }
    });

    return NextResponse.json(updatedScheduleSession, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedScheduleSession = await prisma.scheduleSession.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedScheduleSession, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
