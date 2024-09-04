import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const faculties = await prisma.faculty.findMany();
    return NextResponse.json(faculties, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { facultyName } = await req.json();
  
      // Validate input
      if (!facultyName) {
        return NextResponse.json({ error: "Faculty name is required" }, { status: 400 });
      }
  
      // Create a new faculty
      const newFaculty = await prisma.faculty.create({
        data: {
          facultyName,
        },
      });
  
      return NextResponse.json(newFaculty, { status: 201 });
    } catch (error) {
      console.error("Error creating faculty:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }