import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { lecturerId } = params;
    const classLecturers = await prisma.classLecturer.findMany({
      where: {
        primaryLecturerId: parseInt(lecturerId),
      },
    });

    return NextResponse.json(classLecturers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
