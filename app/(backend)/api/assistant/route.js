import StudyProgram from "@/app/(frontend)/(route)/dashboard/study-program/page";
import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const assistants = await prisma.assistant.findMany({
      include: {
        semester: {
          select: {
            semesterName: true,
          },
        },
        studyProgramClass: {
            select: {
                studyProgram: {
                    select: {
                        studyProgramName: true
                    }
                },
                className: true,
            }
        }
      },
    });
    return NextResponse.json(assistants, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Parse the request body once
    const { assistantName, assistantNPM, semesterId, studyProgramClassId } = await req.json();

    // Validate input
    if (!assistantName) {
      return NextResponse.json({ error: "Assistant name is required" }, { status: 400 });
    }
    if (!assistantNPM) {
      return NextResponse.json({ error: "Assistant NPM is required" }, { status: 400 });
    }
    if (!semesterId) {
      return NextResponse.json({ error: "Semester ID is required" }, { status: 400 });
    }
    if (!studyProgramClassId) {
      return NextResponse.json({ error: "Study program class ID is required" }, { status: 400 });
    }

    // Create a new assistant
    const newAssistant = await prisma.assistant.create({
      data: {
        assistantName,
        assistantNPM, 
        semesterId, 
        studyProgramClassId
      },
    });

    return NextResponse.json(newAssistant, { status: 201 });
  } catch (error) {
    console.error("Error creating assistant:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}