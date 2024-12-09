import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { studyProgramId } = params;
    const subjects = await prisma.subject.findMany({
      where: {
        studyProgramId: parseInt(studyProgramId),
      },
    });

    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
