import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const studyProgram = await prisma.studyProgram.findUnique({
      where: { id: Number(id) },
    });

    if (!studyProgram) {
      return NextResponse.json({ error: "Study program not found" }, { status: 404 });
    }

    return NextResponse.json(studyProgram, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { studyProgramName, departmentId } = await req.json();

  // Validate input
  if (!studyProgramName) {
    return NextResponse.json({ error: "Study program name is required" }, { status: 400 });
  }
  if (!departmentId) {
    return NextResponse.json({ error: "Department is required" }, { status: 400 });
  }

  try {
    const updatedStudyProgram = await prisma.studyProgram.update({
      where: { id: Number(id) },
      data: { studyProgramName, departmentId },
    });

    return NextResponse.json(updatedStudyProgram, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedStudyProgram = await prisma.studyProgram.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedStudyProgram, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
