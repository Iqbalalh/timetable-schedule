import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const studyProgramClass = await prisma.studyProgramClass.findUnique({
      where: { id: Number(id) },
    });

    if (!studyProgramClass) {
      return NextResponse.json({ error: "Study program class not found" }, { status: 404 });
    }

    return NextResponse.json(studyProgramClass, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
    const { id } = params;
    const { className, studyProgramId } = await req.json();

    // Validate input
    if (!className) {
    return NextResponse.json({ error: "Class name is required" }, { status: 400 });
    }
    if (!studyProgramId) {
    return NextResponse.json({ error: "Study program ID is required" }, { status: 400 });
    }

    try {
        const updatedStudyProgramClass = await prisma.studyProgramClass.update({
        where: { id: Number(id) },
        data: { className, studyProgramId },
        });

        return NextResponse.json(updatedStudyProgramClass, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedStudyProgramClass = await prisma.studyProgramClass.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedStudyProgramClass, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
