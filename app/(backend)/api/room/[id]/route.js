import prisma from "@/app/(backend)/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const room = await prisma.room.findUnique({
      where: { id: Number(id) },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { roomName, roomCapacity, isTheory, isPracticum, isLab, idDepartment } =
    await req.json();

  // Validate input
  if (!roomName) {
    return NextResponse.json(
      { error: "Room name is required" },
      { status: 400 }
    );
  }
  if (!roomCapacity) {
    return NextResponse.json(
      { error: "Room capacity is required" },
      { status: 400 }
    );
  }
  if (!idDepartment) {
    return NextResponse.json(
      { error: "Department is required" },
      { status: 400 }
    );
  }

  try {
    const updatedRoom = await prisma.room.update({
      where: { id: Number(id) },
      data: {
        roomName,
        roomCapacity: parseInt(roomCapacity),
        idDepartment,
        isTheory,
        isPracticum,
        isLab,
      },
    });

    return NextResponse.json(updatedRoom, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedRoom = await prisma.room.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedRoom, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
