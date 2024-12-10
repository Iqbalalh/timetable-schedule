import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const assistant = await prisma.assistant.findUnique({
      where: { id: Number(id) },
    });

    if (!assistant) {
      return NextResponse.json({ error: "Assistant not found" }, { status: 404 });
    }

    return NextResponse.json(assistant, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
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

  try {
    const updatedAssistant = await prisma.assistant.update({
      where: { id: Number(id) },
      data: { assistantName, assistantNPM, semesterId, studyProgramClassId }
    });

    return NextResponse.json(updatedAssistant, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedAssistant = await prisma.assistant.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedAssistant, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
