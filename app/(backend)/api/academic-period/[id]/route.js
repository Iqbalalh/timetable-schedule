import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const academicPeriod = await prisma.academicPeriod.findUnique({
      where: { id: Number(id) },
    });

    if (!academicPeriod) {
      return NextResponse.json({ error: "Academic period not found" }, { status: 404 });
    }

    return NextResponse.json(academicPeriod, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { periodName } = await req.json();

  // Validate input
  if (!periodName) {
    return NextResponse.json({ error: "Academic period name is required" }, { status: 400 });
  }

  try {
    const updatedAcademicPeriod = await prisma.academicPeriod.update({
      where: { id: Number(id) },
      data: { periodName },
    });

    return NextResponse.json(updatedAcademicPeriod, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedAcademicPeriod = await prisma.academicPeriod.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedAcademicPeriod, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
