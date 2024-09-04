import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const schedules = await prisma.schedule.findMany();
    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { day, idClassLecturer, idRoom, idScheduleSession } = await req.json();
  
      // Validate input
      if (!day) {
        return NextResponse.json({ error: "Day is required" }, { status: 400 });
      }
      if (!idClassLecturer) {
        return NextResponse.json({ error: "Class lecturer ID is required" }, { status: 400 });
      }
      if (!idRoom) {
        return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
      }
      if (!idScheduleSession) {
        return NextResponse.json({ error: "Schedule session ID is required" }, { status: 400 });
      }
  
      // Create a new schedule
      const newSchedule = await prisma.schedule.create({
        data: {
          day,
          idClassLecturer,
          idRoom,
          idScheduleSession
        },
      });
  
      return NextResponse.json(newSchedule, { status: 201 });
    } catch (error) {
      console.error("Error creating schedule:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }