import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const studyPrograms = await prisma.studyProgram.findMany({
      include: {
        department: {
          select: {
            departmentName: true,
            faculty: {
              select: {
                facultyName: true
              }
            }
          }
        }
      }
    });
    return NextResponse.json(studyPrograms, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { studyProgramName, idDepartment } = await req.json();
      // Validate input
      if (!studyProgramName) {
        return NextResponse.json({ error: "Study program name is required" }, { status: 400 });
      }
      if (!idDepartment) {
        return NextResponse.json({ error: "Department is required" }, { status: 400 });
      }
  
      // Create a new study program
      const newStudyProgram = await prisma.studyProgram.create({
        data: {
          studyProgramName,
          idDepartment
        },
      });
  
      return NextResponse.json(newStudyProgram, { status: 201 });
    } catch (error) {
      console.error("Error creating study program:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }