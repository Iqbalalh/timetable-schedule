import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const lecturers = await prisma.lecturer.findMany();
    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { lecturerName } = await req.json();
      const { lecturerNIP } = await req.json();
      const { lecturerEmail } = await req.json();
      const { idDepartment } = await req.json();
  
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
  
      // Create a new lecturer
      const newLecturer = await prisma.lecturer.create({
        data: {
          lecturerName,
          lecturerNIP,
          lecturerEmail,
          idDepartment
        },
      });
  
      return NextResponse.json(newLecturer, { status: 201 });
    } catch (error) {
      console.error("Error creating lecturer:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }