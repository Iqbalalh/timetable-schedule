import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { scheduleId } = params;
    const scheduleRooms = await prisma.scheduleRoom.findMany({
      where: {
        idSchedule: parseInt(scheduleId),
      },
    });

    return NextResponse.json(scheduleRooms, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
