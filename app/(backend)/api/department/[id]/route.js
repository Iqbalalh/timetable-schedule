import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const department = await prisma.department.findUnique({
      where: { id: Number(id) },
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    return NextResponse.json(department, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { departmentName, facultyId } = await req.json();

  // Validate input
  if (!departmentName) {
    return NextResponse.json({ error: "Department name is required" }, { status: 400 });
  }
  if (!facultyId) {
    return NextResponse.json({ error: "Faculty is required" }, { status: 400 });
  }

  try {
    const updatedDepartment = await prisma.department.update({
      where: { id: Number(id) },
      data: { departmentName, facultyId },
    });

    return NextResponse.json(updatedDepartment, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedDepartment = await prisma.department.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedDepartment, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
