import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const departments = await prisma.department.findMany();
    return NextResponse.json(departments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { departmentName } = await req.json();
      const { idFaculty } = await req.json();
  
      // Validate input
      if (!departmentName) {
        return NextResponse.json({ error: "Department name is required" }, { status: 400 });
      }
      if (!idFaculty) {
        return NextResponse.json({ error: "Faculty is required" }, { status: 400 });
      }
  
      // Create a new deaprtment
      const newDepartment = await prisma.department.create({
        data: {
          departmentName,
          idFaculty
        },
      });
  
      return NextResponse.json(newDepartment, { status: 201 });
    } catch (error) {
      console.error("Error creating department:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }