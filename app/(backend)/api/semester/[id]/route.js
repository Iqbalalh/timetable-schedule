import prisma from "@/app/(backend)/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const semester = await prisma.semester.findUnique({
      where: { id: Number(id) },
    });

    if (!semester) {
      return NextResponse.json({ error: "Semester not found" }, { status: 404 });
    }

    return NextResponse.json(semester, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { semesterName } =
    await req.json();

  // Validate input
  if (!semesterName) {
    return NextResponse.json(
      { error: "Semester name is required" },
      { status: 400 }
    );
  }

  // Calculate semesterTypeId based on semesterName % 2
  const semesterTypeId = semesterName % 2 === 0 ? 2 : 1;

  try {
    const updatedSemester = await prisma.semester.update({
      where: { id: Number(id) },
      data: {
        semesterName, 
        semesterTypeId
      },
    });

    return NextResponse.json(updatedSemester, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedSemester = await prisma.semester.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedSemester, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
