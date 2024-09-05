import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { subSubjectId } = params;
    const classes = await prisma.class.findMany({
      where: {
        idSubSubject: parseInt(subSubjectId),
      },
    });

    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
