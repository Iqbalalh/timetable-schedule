import AcademicPeriods from "@/app/(frontend)/(route)/dashboard/periods/page";
import prisma from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const classes = await prisma.class.findMany({
      include: {
        subSubject: {
          select: {
            subject: {
              select: {
                subjectCode: true,
                subjectName: true,
                subjectCategory: true
              },
            },
            subjectType: {
              select: {
                typeName: true,
              },
            },
          },
        },
        academicPeriod: {
          select: {
            academicYear: true,
            semesterType: {
              select: {
                typeName: true
              }
            }
          },
        },
        studyProgramClass: {
          select: {
            className: true,
            studyProgram: {
              select: {
                studyProgramName: true
              }
            }
          }
        }
      },
    });
    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const {
      studyProgramClassId,
      classCapacity,
      subjectId,
      academicPeriodId,
      primaryLecturerId,
      secondaryLecturerId,
      // primaryAssistantId,
      // secondaryAssistantId
    } = await req.json();

    // Validate input
    if (!studyProgramClassId) {
      return NextResponse.json(
        { error: "Study program class ID is required" },
        { status: 400 }
      );
    }
    if (!classCapacity) {
      return NextResponse.json(
        { error: "Class capacity is required" },
        { status: 400 }
      );
    }
    if (!subjectId) {
      return NextResponse.json(
        { error: "Subject ID is required" },
        { status: 400 }
      );
    }
    if (!academicPeriodId) {
      return NextResponse.json(
        { error: "Academic period ID is required" },
        { status: 400 }
      );
    }

    // Retrieve all subSubjects related to the subjectId
    const subSubjects = await prisma.subSubject.findMany({
      where: { subjectId: subjectId },
      select: { id: true },
    });

    if (subSubjects.length === 0) {
      return NextResponse.json(
        { error: "No subSubjects found for the given subjectId" },
        { status: 404 }
      );
    }

    const createdClasses = [];
    // Create a class for each subSubjectId
    for (const subSubject of subSubjects) {
      const newClass = await prisma.class.create({
        data: {
          studyProgramClassId,
          classCapacity: parseInt(classCapacity),
          subSubjectId: subSubject.id,
          academicPeriodId,
        },
      });

      createdClasses.push(newClass);

      // Create an entry for ClassLecturer if provided
      if (primaryLecturerId && secondaryLecturerId) {
        await prisma.classLecturer.create({
          data: {
            primaryLecturerId,
            secondaryLecturerId,
            classId: newClass.id,
          },
        });
      }
    }
    return NextResponse.json({ createdClasses }, { status: 201 });

  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
