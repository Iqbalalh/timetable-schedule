import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const curiculums = await prisma.curiculum.findMany();
    return NextResponse.json(curiculums, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { curiculumName } = await req.json();
  
      // Validate input
      if (!curiculumName) {
        return NextResponse.json({ error: "Curiculum name is required" }, { status: 400 });
      }
  
      // Create a new academic period
      const newCuriculum = await prisma.curiculum.create({
        data: {
          curiculumName,
        },
      });
  
      return NextResponse.json(newCuriculum, { status: 201 });
    } catch (error) {
      console.error("Error creating curiculum:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }