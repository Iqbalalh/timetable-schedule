import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const semesterType = await prisma.semesterType.findUnique({
      where: { id: Number(id) },
    });

    if (!semesterType) {
      return NextResponse.json({ error: "Semester type not found" }, { status: 404 });
    }

    return NextResponse.json(semesterType, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { typeName } = await req.json();
  
  // Validate input
  if (!typeName) {
    return NextResponse.json({ error: "Type name is required" }, { status: 400 });
  }

  try {
    const updatedSemesterType = await prisma.semesterType.update({
      where: { id: Number(id) },
      data: { typeName }
    });

    return NextResponse.json(updatedSemesterType, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedSemesterType = await prisma.semesterType.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedSemesterType, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
