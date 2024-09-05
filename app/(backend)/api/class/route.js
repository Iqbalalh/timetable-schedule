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
      },
    });
    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { className, classCapacity, idSubSubject } = await req.json();
  
      // Validate input
      if (!className) {
        return NextResponse.json({ error: "Class name is required" }, { status: 400 });
      }
      if (!classCapacity) {
        return NextResponse.json({ error: "Class capacity is required" }, { status: 400 });
      }
      if (!idSubSubject) {
        return NextResponse.json({ error: "Sub Subject ID is required" }, { status: 400 });
      }
  
      // Create a new class
      const newClass = await prisma.class.create({
        data: {
          className,
          classCapacity,
          idSubSubject
        },
      });
  
      return NextResponse.json(newClass, { status: 201 });
    } catch (error) {
      console.error("Error creating class:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }