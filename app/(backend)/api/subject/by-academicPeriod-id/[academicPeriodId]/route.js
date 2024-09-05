import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { academicPeriodId } = params;
    const subjects = await prisma.subject.findMany({
      where: {
        idAcademicPeriod: parseInt(academicPeriodId),
      },
    });

    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
