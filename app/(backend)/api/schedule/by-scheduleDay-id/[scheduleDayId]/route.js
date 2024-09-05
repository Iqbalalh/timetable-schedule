import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { scheduleDayId } = params;
    const schedules = await prisma.schedule.findMany({
      where: {
        idScheduleDay: parseInt(scheduleDayId),
      },
    });

    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
