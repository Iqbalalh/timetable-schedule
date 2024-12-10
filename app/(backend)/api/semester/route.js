import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const semesters = await prisma.semester.findMany({
        include: {
            semesterType: {
                select: {
                    typeName: true,
                },
            },
        },
    });
    return NextResponse.json(semesters, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { semesterName } = await req.json();

      // Validate input
      if (!semesterName) {
        return NextResponse.json(
          { error: "Semester name is required" },
          { status: 400 }
        );
      }

      // Calculate semesterTypeId based on semesterName % 2
      const semesterTypeId = semesterName % 2 === 0 ? 2 : 1;
  
      // Create a new schedule session
      const newSemester = await prisma.semester.create({
        data: {
            semesterName, 
            semesterTypeId
        },
      });
  
      return NextResponse.json(newSemester, { status: 201 });
    } catch (error) {
      console.error("Error creating semester:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }