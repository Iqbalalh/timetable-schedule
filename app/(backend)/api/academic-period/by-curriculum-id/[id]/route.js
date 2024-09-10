import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { curriculumId } = params;
    const periods = await prisma.academicPeriod.findMany({
      where: {
        curriculumId: curriculumId,
      },
    });

    return NextResponse.json(periods, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
