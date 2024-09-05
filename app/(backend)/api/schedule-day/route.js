import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const scheduleDays = await prisma.scheduleDay.findMany();
    return NextResponse.json(scheduleDays, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { day } = await req.json();
  
      // Validate input
      if (!day) {
        return NextResponse.json({ error: "Day is required" }, { status: 400 });
      }
  
      // Create a new schedule session
      const newScheduleDay = await prisma.scheduleDay.create({
        data: {
          day
        },
      });
  
      return NextResponse.json(newScheduleDay, { status: 201 });
    } catch (error) {
      console.error("Error creating schedule day:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }