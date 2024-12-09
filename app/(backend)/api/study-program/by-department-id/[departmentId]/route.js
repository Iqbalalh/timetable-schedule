import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { departmentId } = params;
    const studyPrograms = await prisma.studyProgram.findMany({
      where: {
        departmentId: parseInt(departmentId),
      },
    });

    return NextResponse.json(studyPrograms, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
