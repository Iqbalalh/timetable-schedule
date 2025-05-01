import { NextResponse } from 'next/server';
import prisma from "@/app/(backend)/lib/db";

// GET method to fetch the schedule based on selected options
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const scheduleDayId = searchParams.get('scheduleDayId');
  const scheduleSessionId = searchParams.get('scheduleSessionId');
  const roomId = searchParams.get('roomId');
  const academicPeriodId = searchParams.get('academicPeriodId'); // Required for fetching schedule
  const departmentId = searchParams.get('departmentId'); // Required for fetching schedule

  // Validate input parameters
  if (!scheduleDayId || !scheduleSessionId || !roomId || !academicPeriodId || !departmentId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
      // Fetch the schedule based on the provided parameters
      const scheduleTarget = await prisma.schedule.findFirst({
          where: {
              scheduleDayId: parseInt(scheduleDayId),
              scheduleSessionId: parseInt(scheduleSessionId),
              roomId: parseInt(roomId),
              classLecturer: {
                class: {
                  studyProgramClass: {
                    studyProgram: {
                      departmentId: departmentId ? parseInt(departmentId) : undefined,
                    },
                  },
                  academicPeriodId: academicPeriodId
                    ? parseInt(academicPeriodId)
                    : undefined,
                },
              },
          },
          select: {
              classLecturer: {
                  select: {
                      class: {
                          select: {
                              academicPeriodId: true,
                              studyProgramClass: {
                                  select: {
                                      className: true,
                                      studyProgram: {
                                        select: {
                                          departmentId: true,
                                        }
                                      }
                                  },
                              },
                              subSubject: {
                                  select: {
                                      subjectType: {
                                        select: {
                                            typeName: true,
                                        },
                                      },
                                      subject: {
                                          select: {
                                            subjectName: true,
                                            semester: {
                                              select: {
                                                  semesterName: true,
                                              },
                                            },
                                          },
                                      },
                                  },
                              },
                          },
                      },
                      primaryLecturer: {
                          select: {
                              lecturerName: true,
                          },
                      },
                      secondaryLecturer: {
                          select: {
                              lecturerName: true,
                          },
                      },
                  },
              },
              scheduleDay: true,
              scheduleSession: true,
              room: true,
          },
      });

      if (!scheduleTarget) {
          return NextResponse.json({ message: 'No schedule found for the selected options.' }, { status: 404 });
      }

      // Return the found schedule
      return NextResponse.json(scheduleTarget);
  } catch (error) {
      console.error("Error in GET schedule:", error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}