import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { semesterTypeId } = params;
    const semesters = await prisma.semester.findMany({
      where: {
        semesterTypeId: parseInt(semesterTypeId),
      }
    });

    return NextResponse.json(semesters, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
