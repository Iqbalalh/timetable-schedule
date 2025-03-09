import prisma from "@/app/(backend)/lib/db";
import { NextResponse } from "next/server";

// PATCH: Swap schedule details between two schedules
export async function PATCH(req) {
  try {
    const { scheduleId1, scheduleId2 } = await req.json(); // Read from request body

    // Ensure both schedule IDs are provided
    if (!scheduleId1 || !scheduleId2) {
      return NextResponse.json(
        { error: "Both scheduleId1 and scheduleId2 are required" },
        { status: 400 }
      );
    }

    const id1 = parseInt(scheduleId1);
    const id2 = parseInt(scheduleId2);

    // Fetch both schedules
    const schedules = await prisma.schedule.findMany({
      where: { id: { in: [id1, id2] } },
    });

    if (schedules.length !== 2) {
      return NextResponse.json(
        { error: "One or both schedules not found" },
        { status: 404 }
      );
    }

    const [schedule1, schedule2] = schedules;

    // Swap schedule details using a transaction
    await prisma.$transaction([
      prisma.schedule.update({
        where: { id: id1 },
        data: {
          scheduleDayId: schedule2.scheduleDayId,
          classLecturerId: schedule2.classLecturerId,
          scheduleSessionId: schedule2.scheduleSessionId,
          roomId: schedule2.roomId,
        },
      }),
      prisma.schedule.update({
        where: { id: id2 },
        data: {
          scheduleDayId: schedule1.scheduleDayId,
          classLecturerId: schedule1.classLecturerId,
          scheduleSessionId: schedule1.scheduleSessionId,
          roomId: schedule1.roomId,
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Schedules swapped successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error swapping schedules:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
