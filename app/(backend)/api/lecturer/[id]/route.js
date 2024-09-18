import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const lecturer = await prisma.lecturer.findUnique({
      where: { id: Number(id) },
      include: {
        department: {
          select: {
            id: true,
            departmentName: true,
          },
        },
        faculty: {
          select: {
            id: true,
            facultyName: true,
          }
        }
      },
    });

    if (!lecturer) {
      return NextResponse.json({ error: "Lecturer not found" }, { status: 404 });
    }

    return NextResponse.json(lecturer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { lecturerName, lecturerNIP, lecturerEmail, idDepartment } = await req.json();

  // Validate input
  if (!lecturerName) {
    return NextResponse.json({ error: "Lecturer name is required" }, { status: 400 });
  }
  if (!lecturerNIP) {
    return NextResponse.json({ error: "Lecturer NIP is required" }, { status: 400 });
  }
  if (!lecturerEmail) {
    return NextResponse.json({ error: "Lecturer email is required" }, { status: 400 });
  }
  if (!idDepartment) {
    return NextResponse.json({ error: "Department ID is required" }, { status: 400 });
  }

  try {
    const updatedLecturer = await prisma.lecturer.update({
      where: { id: Number(id) },
      data: { lecturerName, lecturerNIP, lecturerEmail, idDepartment }
    });

    return NextResponse.json(updatedLecturer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedLecturer = await prisma.lecturer.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedLecturer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
