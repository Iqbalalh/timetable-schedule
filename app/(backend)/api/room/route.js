import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        subjectType: {
          select: {
            typeName: true
          }
        },
        department: {
          select: {
            departmentName: true
          }
        }
      }
    });
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { roomName, roomCapacity, idSubjectType, idDepartment } = await req.json();
  
      // Validate input
      if (!roomName) {
        return NextResponse.json({ error: "Room name is required" }, { status: 400 });
      }
      if (!roomCapacity) {
        return NextResponse.json({ error: "Room capacity is required" }, { status: 400 });
      }
      if (!idSubjectType) {
        return NextResponse.json({ error: "Subject type is required" }, { status: 400 });
      }
      if (!idDepartment) {
        return NextResponse.json({ error: "Department is required" }, { status: 400 });
      }
      if (!idAcademicPeriod) {
        return NextResponse.json({ error: "Academic period is required" }, { status: 400 });
      }
  
      // Create a new room
      const newRoom = await prisma.room.create({
        data: {
          roomName,
          roomCapacity,
          idSubjectType,
          idDepartment
        },
      });
  
      return NextResponse.json(newRoom, { status: 201 });
    } catch (error) {
      console.error("Error creating room:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }