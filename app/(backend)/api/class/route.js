import AcademicPeriods from "@/app/(frontend)/(route)/dashboard/periods/page";
import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const classes = await prisma.class.findMany({
      include: {
        subSubject: {
          select: {
            subject: {
              select: {
                subjectCode: true,
                subjectName: true
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
            periodName: true
          }
        }
      },
    });
    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { className, classCapacity, idSubSubject, idAcademicPeriod } = await req.json();

      // Validate input
      if (!className) {
        return NextResponse.json({ error: "class name is required" }, { status: 400 });
      }
      if (!classCapacity) {
        return NextResponse.json({ error: "class capacity is required" }, { status: 400 });
      }
      if (!idSubSubject) {
        return NextResponse.json({ error: "Sub subject is required" }, { status: 400 });
      }
      if (!idAcademicPeriod) {
        return NextResponse.json({ error: "Academic period is required" }, { status: 400 });
      }
  
      // Create a new class
      const newClass = await prisma.class.create({
        data: {
          className,
          classCapacity,
          idSubSubject,
          idAcademicPeriod
        },
      });
  
      return NextResponse.json(newClass, { status: 201 });
    } catch (error) {
      console.error("Error creating class:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }