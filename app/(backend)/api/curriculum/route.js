import prisma from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const curriculums = await prisma.curriculum.findMany();
    return NextResponse.json(curriculums, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { curriculumName } = await req.json();

    // Validate input
    if (!curriculumName) {
      return NextResponse.json(
        { error: "Curriculum name is required" },
        { status: 400 }
      );
    }

    // Create a new academic period
    const newCurriculum = await prisma.curriculum.create({
      data: {
        curriculumName,
      },
    });

    return NextResponse.json(newCurriculum, { status: 201 });
  } catch (error) {
    console.error("Error creating curriculum:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
