import prisma from '@/app/(backend)/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { idSubject } = params;
    const subSubjects = await prisma.subSubject.findMany({
      where: {
        idSubject: parseInt(idSubject),
      },
    });

    return NextResponse.json(subSubjects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
