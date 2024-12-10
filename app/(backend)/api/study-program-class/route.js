import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const studyProgramClasses = await prisma.studyProgramClass.findMany({
      include: {
        studyProgram: {
          select: {
            studyProgramName: true,
          }
        }
      }
    });
    return NextResponse.json(studyProgramClasses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { className, studyProgramId } = await req.json();
      // Validate input
      if (!className) {
        return NextResponse.json({ error: "Class name is required" }, { status: 400 });
      }
      if (!studyProgramId) {
        return NextResponse.json({ error: "Study program ID is required" }, { status: 400 });
      }
  
      // Create a new study program class
      const newStudyProgramClass = await prisma.studyProgramClass.create({
        data: {
            className,
            studyProgramId
        },
      });
  
      return NextResponse.json(newStudyProgramClass, { status: 201 });
    } catch (error) {
      console.error("Error creating study program class:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }