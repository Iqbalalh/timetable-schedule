import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const curriculum = await prisma.curriculum.findUnique({
      where: { id: Number(id) },
    });

    if (!curriculum) {
      return NextResponse.json({ error: "Curriculum not found" }, { status: 404 });
    }

    return NextResponse.json(curriculum, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { curriculumName } = await req.json();

  // Validate input
  if (!curriculumName) {
    return NextResponse.json({ error: "Curriculum name is required" }, { status: 400 });
  }

  try {
    const updatedCurriculum = await prisma.curriculum.update({
      where: { id: Number(id) },
      data: { curriculumName },
    });

    return NextResponse.json(updatedCurriculum, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedCurriculum = await prisma.curriculum.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedCurriculum, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
