import prisma from "../../lib/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const scheduleSessions = await prisma.scheduleSession.findMany();
    return NextResponse.json(scheduleSessions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const { startTime, endTime, sessionNumber } = await req.json();
  
      // Validate input
      if (!sessionNumber) {
        return NextResponse.json({ error: "Session number is required" }, { status: 400 });
      }
      if (!startTime) {
        return NextResponse.json({ error: "Start time is required" }, { status: 400 });
      }
      if (!endTime) {
        return NextResponse.json({ error: "End time is required" }, { status: 400 });
      }
  
      // Create a new schedule session
      const newScheduleSession = await prisma.scheduleSession.create({
        data: {
          startTime,
          endTime,
          sessionNumber
        },
      });
  
      return NextResponse.json(newScheduleSession, { status: 201 });
    } catch (error) {
      console.error("Error creating schedule session:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }