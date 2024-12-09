import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const lecturers = await prisma.lecturer.findMany({
      include: {
        department: {
          select: {
            departmentName: true,
          },
        },
      },
    });
    return NextResponse.json(lecturers, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Parse the request body once
    const { lecturerName, lecturerNIP, lecturerEmail, departmentId } = await req.json();

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
    if (!departmentId) {
      return NextResponse.json({ error: "Department ID is required" }, { status: 400 });
    }

    // Create a new lecturer
    const newLecturer = await prisma.lecturer.create({
      data: {
        lecturerName,
        lecturerNIP,
        lecturerEmail,
        departmentId,
      },
    });

    return NextResponse.json(newLecturer, { status: 201 });
  } catch (error) {
    console.error("Error creating lecturer:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}