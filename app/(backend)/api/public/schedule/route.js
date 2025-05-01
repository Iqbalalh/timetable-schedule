export const dynamic = "force-dynamic";
import prisma from "@/app/(backend)/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
      const body = await request.json();
  
      // Ensure body is an array
      if (!Array.isArray(body)) {
        return NextResponse.json(
          { error: "Request body must be an array of schedule entries" },
          { status: 400 }
        );
      }
  
      // Validate all entries
      const invalidEntries = body.filter(
        (entry) =>
          !entry.scheduleDayId ||
          !entry.classLecturerId ||
          !entry.scheduleSessionId ||
          !entry.roomId
      );
  
      if (invalidEntries.length > 0) {
        return NextResponse.json(
          { error: "All fields are required for each schedule entry" },
          { status: 400 }
        );
      }
  
      // Insert data into the Schedule table as a bulk operation
      const schedules = await prisma.schedule.createMany({
        data: body.map((entry) => ({
          scheduleDayId: entry.scheduleDayId,
          classLecturerId: entry.classLecturerId,
          scheduleSessionId: entry.scheduleSessionId,
          roomId: entry.roomId,
        })),
        skipDuplicates: true, // Optional: Skip entries with duplicate unique constraints
      });
  
      return NextResponse.json(
        { message: "Schedules created successfully", count: schedules.count },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error inserting schedules:", error);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  }
  