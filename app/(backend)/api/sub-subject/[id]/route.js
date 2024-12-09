import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const subSubject = await prisma.subSubject.findUnique({
      where: { id: Number(id) },
    });

    if (!subSubject) {
      return NextResponse.json({ error: "Sub subject not found" }, { status: 404 });
    }

    return NextResponse.json(subSubject, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { subjectTypeId, subjectId } = await req.json();
  
  // Validate input
  if (!subjectTypeId) {
    return NextResponse.json({ error: "Subject type ID is required" }, { status: 400 });
  }
  if (!subjectId) {
    return NextResponse.json({ error: "Subject ID is required" }, { status: 400 });
  }

  try {
    const updatedSubSubject = await prisma.subSubject.update({
      where: { id: Number(id) },
      data: { subjectTypeId, subjectId }
    });

    return NextResponse.json(updatedSubSubject, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedSubSubject = await prisma.subSubject.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedSubSubject, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
