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
              },
            },
            subjectType: {
              select: {
                typeName: true,
              },
            },
          },
        },
        AcademicPeriod: {
          select: {
            periodName: true,
          },
        },
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
      className,
      classCapacity,
      idSubject,
      idAcademicPeriod,
      idLecturer,
      idLecturer2,
    } = await req.json();

    // Validate input
    if (!className) {
      return NextResponse.json(
        { error: "Class name is required" },
        { status: 400 }
      );
    }
    if (!classCapacity) {
      return NextResponse.json(
        { error: "Class capacity is required" },
        { status: 400 }
      );
    }
    if (!idSubject) {
      return NextResponse.json(
        { error: "Subject ID is required" },
        { status: 400 }
      );
    }
    if (!idAcademicPeriod) {
      return NextResponse.json(
        { error: "Academic period is required" },
        { status: 400 }
      );
    }

    // Retrieve all subSubjects related to the subjectId
    const subSubjects = await prisma.subSubject.findMany({
      where: { idSubject: idSubject },
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
          className,
          classCapacity: parseInt(classCapacity),
          idSubSubject: subSubject.id,
          idAcademicPeriod,
        },
      });

      createdClasses.push(newClass);

      // Create an entry for ClassLecturer if provided
      if (idLecturer && idLecturer2) {
        await prisma.classLecturer.create({
          data: {
            idLecturer,
            idLecturer2,
            idClass: newClass.id,
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
