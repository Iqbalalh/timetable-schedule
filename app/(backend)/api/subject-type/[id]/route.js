import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const subjectType = await prisma.subjectType.findUnique({
      where: { id: Number(id) },
    });

    if (!subjectType) {
      return NextResponse.json({ error: "Subject type not found" }, { status: 404 });
    }

    return NextResponse.json(subjectType, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { typeName } = await req.json();

  // Validate input
  if (!typeName) {
    return NextResponse.json({ error: "Subject type name is required" }, { status: 400 });
  }

  try {
    const updatedSubjectType = await prisma.subjectType.update({
      where: { id: Number(id) },
      data: { typeName },
    });

    return NextResponse.json(updatedSubjectType, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedSubjectType = await prisma.subjectType.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedSubjectType, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
