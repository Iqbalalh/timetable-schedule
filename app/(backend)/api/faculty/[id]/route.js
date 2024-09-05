import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const faculty = await prisma.faculty.findUnique({
      where: { id: Number(id) },
    });

    if (!faculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }

    return NextResponse.json(faculty, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { facultyName } = await req.json();
  
  // Validate input
  if (!facultyName) {
    return NextResponse.json({ error: "Faculty name is required" }, { status: 400 });
  }

  try {
    const updatedFaculty = await prisma.faculty.update({
      where: { id: Number(id) },
      data: { facultyName }
    });

    return NextResponse.json(updatedFaculty, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedFaculty = await prisma.faculty.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedFaculty, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
