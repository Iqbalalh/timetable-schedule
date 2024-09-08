import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const classLecturer = await prisma.classLecturer.findUnique({
      where: { id: Number(id) },
    });

    if (!classLecturer) {
      return NextResponse.json({ error: "Class lecturer not found" }, { status: 404 });
    }

    return NextResponse.json(classLecturer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { idLecturer, idClass, idLecturer2 } = await req.json();
  
  // Validate input
  if (!idLecturer) {
    return NextResponse.json({ error: "Lecturer ID is required" }, { status: 400 });
  }
  if (!idLecturer2) {
    return NextResponse.json({ error: "Lecturer 2 ID is required" }, { status: 400 });
  }
  if (!idClass) {
    return NextResponse.json({ error: "Class ID is required" }, { status: 400 });
  }

  try {
    const updatedClassLecturer = await prisma.classLecturer.update({
      where: { id: Number(id) },
      data: { idLecturer, idLecturer2, idClass }
    });

    return NextResponse.json(updatedClassLecturer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedClassLecturer = await prisma.classLecturer.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedClassLecturer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
