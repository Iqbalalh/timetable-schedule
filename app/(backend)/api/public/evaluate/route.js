// import { Select } from "antd";
import prisma from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get("departmentId");
    const semesterTypeId = searchParams.get("semesterTypeId");
    const academicPeriodId = searchParams.get("academicPeriodId");

    const data = {
        schedules: await prisma.schedule.findMany({
            where: {
                classLecturer: {
                    class: {
                            studyProgramClass: {
                                studyProgram: {
                                    departmentId: departmentId ? parseInt(departmentId) : undefined,
                                },
                            },
                            academicPeriodId: academicPeriodId ? parseInt(academicPeriodId) : undefined,
                    },
                },
            },
            include: {
                classLecturer: {
                    select: {
                        id: true,
                        classId: true,
                        primaryLecturerId: true,
                        secondaryLecturerId: true,
                        class: {
                            select: {
                                classCapacity: true,
                                subSubjectId: true,
                                studyProgramClassId: true,
                                studyProgramClass: {
                                    select: {
                                        className: true,
                                    }
                                },
                                subSubject: {
                                    select: {
                                        subjectId: true,
                                        subjectTypeId: true,
                                        subject: {
                                            select: {
                                                subjectCode: true,
                                                subjectName: true,
                                                subjectSKS: true,
                                                subjectCategory: true,
                                                semesterId: true,
                                                semester: {
                                                    select: {
                                                        semesterName: true
                                                    }
                                                },
                                            },
                                        },
                                        subjectType: {
                                            select: {
                                                typeName: true
                                            }
                                        },
                                    },
                                }
                            },
                        },
                    }
                },
                room: {
                    select: {
                        roomType: true,
                        roomCapacity: true
                    }
                },
                scheduleDay: {
                    select: {
                        day: true
                    }
                },
                scheduleSession: {
                    select: {
                        sessionNumber: true
                    }
                }
            },
        }),
        classLecturers: await prisma.classLecturer.findMany({
            where: {
                class: {
                    studyProgramClass: {
                        studyProgram: {
                            departmentId: departmentId ? parseInt(departmentId) : undefined,
                        },
                    },
                    academicPeriodId: academicPeriodId ? parseInt(academicPeriodId) : undefined,
                },
            },
            select: {
                id: true,
                classId: true,
                primaryLecturerId: true,
                secondaryLecturerId: true,
                class: {
                    select: {
                        classCapacity: true,
                        subSubjectId: true,
                        studyProgramClassId: true,
                        studyProgramClass: {
                            select: {
                                className: true,
                            }
                        },
                        subSubject: {
                            select: {
                                subjectId: true,
                                subjectTypeId: true,
                                subject: {
                                    select: {
                                        subjectCode: true,
                                        subjectName: true,
                                        subjectSKS: true,
                                        subjectCategory: true,
                                        semesterId: true,
                                        semester: {
                                            select: {
                                                semesterName: true
                                            }
                                        },
                                    },
                                },
                                subjectType: {
                                    select: {
                                        typeName: true
                                    }
                                },
                            },
                        }
                    },
                },
            }
        }),
        rooms: await prisma.room.findMany({
            where: {
              departmentId: departmentId ? parseInt(departmentId) : undefined,
            },
        }),
        scheduleSessions: await prisma.scheduleSession.findMany(),
        scheduleDays: await prisma.scheduleDay.findMany(),
        lecturers: await prisma.lecturer.findMany({
            where: {
                departmentId: departmentId ? parseInt(departmentId) : undefined,
            },
        }),
        rooms: await prisma.room.findMany({
            where: {
                departmentId: departmentId ? parseInt(departmentId) : undefined,
            },
        }),
        studyProgramClasses: await prisma.studyProgramClass.findMany({
            where: {
                studyProgram: {
                    departmentId: departmentId ? parseInt(departmentId) : undefined,
                },
            },
        }),
        semesters: await prisma.semester.findMany({
            where: {
              semesterTypeId: semesterTypeId ? parseInt(semesterTypeId) : undefined,
            },
          }),
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
