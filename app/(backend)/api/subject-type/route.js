import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const subjectTypes = await prisma.subjectType.findMany();
    return NextResponse.json(subjectTypes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { typeName } = await req.json();
  
      // Validate input
      if (!typeName) {
        return NextResponse.json({ error: "Subject type name is required" }, { status: 400 });
      }
  
      // Create a new subject type
      const newSubjectType = await prisma.subjectType.create({
        data: {
          typeName,
        },
      });
  
      return NextResponse.json(newSubjectType, { status: 201 });
    } catch (error) {
      console.error("Error creating subject type:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }