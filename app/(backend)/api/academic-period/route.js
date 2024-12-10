import prisma from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const academicPeriods = await prisma.academicPeriod.findMany({
      include: {
        curriculum: {
          select: {
            curriculumName: true
          }
        },
        semesterType: {
          select: {
            typeName: true
          }
        }
      },
    });
    return NextResponse.json(academicPeriods, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { academicYear, semesterTypeId, curriculumId } = await req.json();

    // Validate input
    if (!academicYear) {
      return NextResponse.json(
        { error: "Academic year is required" },
        { status: 400 }
      );
    }
    if (!semesterTypeId) {
      return NextResponse.json(
        { error: "Semester type ID is required" },
        { status: 400 }
      );
    }
    if (!curriculumId) {
      return NextResponse.json(
        { error: "Curriculum ID is required" },
        { status: 400 }
      );
    }

    // Create a new academic period
    const newAcademicPeriod = await prisma.academicPeriod.create({
      data: {
        academicYear,
        semesterTypeId,
        curriculumId,
      },
    });

    return NextResponse.json(newAcademicPeriod, { status: 201 });
    
  } catch (error) {
    console.error("Error creating academic period:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
