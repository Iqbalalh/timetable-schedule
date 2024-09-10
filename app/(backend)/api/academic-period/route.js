import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const academicPeriods = await prisma.academicPeriod.findMany();
    return NextResponse.json(academicPeriods, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { periodName, idCurriculum } = await req.json();
  
      // Validate input
      if (!periodName) {
        return NextResponse.json({ error: "Period name is required" }, { status: 400 });
      }
      if (!idCurriculum) {
        return NextResponse.json({ error: "Curriculum ID is required" }, { status: 400 });
      }
  
      // Create a new academic period
      const newAcademicPeriod = await prisma.academicPeriod.create({
        data: {
          periodName,
          idCurriculum
        },
      });
  
      return NextResponse.json(newAcademicPeriod, { status: 201 });
    } catch (error) {
      console.error("Error creating academic period:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }