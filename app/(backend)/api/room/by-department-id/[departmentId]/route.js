import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { departmentId } = params;
    const rooms = await prisma.room.findMany({
      where: {
        departmentId: parseInt(departmentId),
      },
    });

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
