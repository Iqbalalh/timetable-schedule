import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const curiculum = await prisma.curiculum.findUnique({
      where: { id: Number(id) },
    });

    if (!curiculum) {
      return NextResponse.json({ error: "Curiculum not found" }, { status: 404 });
    }

    return NextResponse.json(curiculum, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { curiculumName } = await req.json();

  // Validate input
  if (!curiculumName) {
    return NextResponse.json({ error: "CUriculum name is required" }, { status: 400 });
  }

  try {
    const updatedCuriculum = await prisma.curiculum.update({
      where: { id: Number(id) },
      data: { curiculumName },
    });

    return NextResponse.json(updatedCuriculum, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedCuriculum = await prisma.curiculum.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedCuriculum, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
