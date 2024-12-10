import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        studyProgram: {
          select: {
            studyProgramName: true,
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
        },
        curriculum: {
          select: {
            curriculumName: true,
          }
        },
        semester: {
          select: {
            semesterName: true,
          }
        } 
      }
    });
    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { subjectCode, subjectName, subjectSKS, subjectCategory, studyProgramId, curriculumId, semesterId, selectedType } = await req.json();
    
    // Validate input
    if (!subjectCode) {
      return NextResponse.json({ error: "Subject code is required" }, { status: 400 });
    }
    if (!subjectName) {
      return NextResponse.json({ error: "Subject name is required" }, { status: 400 });
    }
    if (!subjectSKS) {
      return NextResponse.json({ error: "Subject SKS is required" }, { status: 400 });
    }
    if (!subjectCategory) {
      return NextResponse.json({ error: "Subject category is required" }, { status: 400 });
    }
    if (!studyProgramId) {
      return NextResponse.json({ error: "Study program is required" }, { status: 400 });
    }
    if (!curriculumId) {
      return NextResponse.json({ error: "Curriculum is required" }, { status: 400 });
    }
    if (!semesterId) {
      return NextResponse.json({ error: "Semester is required" }, { status: 400 });
    }
    if (subjectSKS > 2 && !selectedType) {
      return NextResponse.json({ error: "Selected type is required" }, { status: 400 });
    }

    // Create a new subject
    const newSubject = await prisma.subject.create({
      data: {
        subjectCode,
        subjectName,
        subjectSKS: parseInt(subjectSKS),
        subjectCategory,
        studyProgramId,
        curriculumId,
        semesterId
      },
    });

    // Determine sub-subject creation logic
    if (subjectSKS > 2) {
      // Create sub-subjects for selected type (R/P) + T
      await prisma.subSubject.createMany({
        data: [
          { subjectTypeId: 1, subjectId: newSubject.id }, // T
          { subjectTypeId: selectedType, subjectId: newSubject.id }, // R or P
        ],
      });
    } else {
      // Create a sub-subject for T only
      await prisma.subSubject.create({
        data: { subjectTypeId: 1, subjectId: newSubject.id }, // T
      });
    }

    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}