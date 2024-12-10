import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const semesterTypes = await prisma.semesterType.findMany();
    return NextResponse.json(semesterTypes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { typeName } = await req.json();
  
      // Validate input
      if (!typeName) {
        return NextResponse.json({ error: "Type name is required" }, { status: 400 });
      }
  
      // Create a new schedule session
      const newSemesterType = await prisma.semesterType.create({
        data: {
          typeName
        },
      });
  
      return NextResponse.json(newSemesterType, { status: 201 });
    } catch (error) {
      console.error("Error creating semester type day:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }