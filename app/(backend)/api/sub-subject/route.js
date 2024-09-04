import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const subSubjects = await prisma.subSubject.findMany();
    return NextResponse.json(subSubjects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { idSubjectType } = await req.json();
      const { idSubject } = await req.json();
  
      // Validate input
      if (!idSubjectType) {
        return NextResponse.json({ error: "Subject type ID is required" }, { status: 400 });
      }
      if (!idSubject) {
        return NextResponse.json({ error: "Subject ID is required" }, { status: 400 });
      }
  
      // Create a new sub subject
      const newSubSubject = await prisma.subSubject.create({
        data: {
          idSubjectType,
          idSubject,
        },
      });
  
      return NextResponse.json(newSubSubject, { status: 201 });
    } catch (error) {
      console.error("Error creating sub subject:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }