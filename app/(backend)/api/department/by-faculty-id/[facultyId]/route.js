import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { facultyId } = params;
    const departments = await prisma.department.findMany({
      where: {
        facultyId: parseInt(facultyId),
      },
    });

    return NextResponse.json(departments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
