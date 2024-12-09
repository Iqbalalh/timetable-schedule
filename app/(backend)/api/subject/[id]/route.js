import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const subject = await prisma.subject.findUnique({
      where: { id: Number(id) },
    });

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json(subject, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { subjectCode, subjectName, subjectSKS, studyProgramId, academicPeriodId } = await req.json();

  // Validate input
  if (!subjectCode) {
    return NextResponse.json({ error: "Subject code is required" }, { status: 400 });
  }
  if (!subjectName) {
    return NextResponse.json({ error: "Subject name is required" }, { status: 400 });
  }
  if (!subjectSKS) {
    return NextResponse.json({ error: "Subject SKS is required" }, { status: 400 });
  }
  if (!studyProgramId) {
    return NextResponse.json({ error: "Study program is required" }, { status: 400 });
  }
  if (!academicPeriodId) {
    return NextResponse.json({ error: "Academic period is required" }, { status: 400 });
  }

  try {
    const updatedSubject = await prisma.subject.update({
      where: { id: Number(id) },
      data: { subjectCode, subjectName, subjectSKS, studyProgramId, academicPeriodId },
    });

    return NextResponse.json(updatedSubject, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedSubject = await prisma.subject.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedSubject, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
