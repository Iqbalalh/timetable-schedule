import prisma from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        department: {
          select: {
            departmentName: true,
          },
        },
      },
    });
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const {
      roomName,
      roomCapacity,
      isTheory,
      isPracticum,
      isResponse,
      departmentId,
    } = await req.json();

    // Validate input
    if (!roomName) {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 }
      );
    }
    if (roomCapacity == null || isNaN(parseInt(roomCapacity))) {
      return NextResponse.json(
        { error: "Valid room capacity is required" },
        { status: 400 }
      );
    }
    if (!departmentId) {
      return NextResponse.json(
        { error: "Department is required" },
        { status: 400 }
      );
    }

    // Create a new room
    const newRoom = await prisma.room.create({
      data: {
        roomName,
        roomCapacity: parseInt(roomCapacity),
        departmentId,
        isTheory,
        isPracticum,
        isResponse,
      },
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
