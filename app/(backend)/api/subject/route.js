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
            // academicPeriod: {
            //   select: {
            //     periodName: true
            //   }
            // }
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
    const { subjectCode, subjectName, subjectSKS, studyProgramId, curriculumId } = await req.json();
    
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
    if (!studyProgramId) {
      return NextResponse.json({ error: "Study program is required" }, { status: 400 });
    }
    if (!curriculumId) {
      return NextResponse.json({ error: "Curriculum is required" }, { status: 400 });
    }

    // Create a new subject
    const newSubject = await prisma.subject.create({
      data: {
        subjectCode,
        subjectName,
        subjectSKS: parseInt(subjectSKS),
        studyProgramId,
        curriculumId
      },
    });

    // Automatically create subsubjects based on subjectSKS
    if (subjectSKS > 2) {
      // If subjectSKS > 2, create subsubjects for both subject types 1 and 2
      await prisma.subSubject.createMany({
        data: [
          { subjectTypeId: 1, subjectId: newSubject.id },
          { subjectTypeId: 2, subjectId: newSubject.id }
        ]
      });
    } else {
      // If subjectSKS <= 2, create a subsubject for subject type 1
      await prisma.subSubject.create({
        data: {
          subjectTypeId: 1,
          subjectId: newSubject.id
        },
      });
    }

    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}