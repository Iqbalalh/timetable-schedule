import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const classes = await prisma.class.findUnique({
      where: { id: Number(id) },
    });

    if (!classes) {
      return NextResponse.json({ error: "class not found" }, { status: 404 });
    }

    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { studyProgramClassId, classCapacity, subSubjectId, academicPeriodId } = await req.json();

  // Validate input
  if (!studyProgramClassId) {
    return NextResponse.json({ error: "Study program class ID is required" }, { status: 400 });
  }
  if (!classCapacity) {
    return NextResponse.json({ error: "Class capacity is required" }, { status: 400 });
  }
  if (!subSubjectId) {
    return NextResponse.json({ error: "Sub subject is required" }, { status: 400 });
  }
  if (!academicPeriodId) {
    return NextResponse.json({ error: "Academic period is required" }, { status: 400 });
  }

  try {
    const updatedClass = await prisma.class.update({
      where: { id: Number(id) },
      data: { studyProgramClassId, classCapacity, subSubjectId, academicPeriodId },
    });

    return NextResponse.json(updatedClass, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedClass = await prisma.class.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedClass, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
