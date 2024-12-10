import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { studyProgramId } = params;
    const studyProgramClasses = await prisma.studyProgramClass.findMany({
      where: {
        studyProgramId: parseInt(studyProgramId),
      },
    });

    return NextResponse.json(studyProgramClasses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
