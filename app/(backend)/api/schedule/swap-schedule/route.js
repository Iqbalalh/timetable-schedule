// app/api/schedule/swap-schedule/route.js
import { NextResponse } from 'next/server';
import prisma from "@/app/(backend)/lib/db";

export async function POST(req) {
  const { currentScheduleId, targetDayId, targetSessionId, targetRoomId } = await req.json();

  // Validasi input
  if (!currentScheduleId || !targetDayId || !targetSessionId || !targetRoomId) {
    return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
  }

  try {
    // 1. Ambil data schedule saat ini
    const currentSchedule = await prisma.schedule.findUnique({
      where: { id: currentScheduleId },
    });

    if (!currentSchedule) {
      return NextResponse.json({ error: "Jadwal saat ini tidak ditemukan" }, { status: 404 });
    }

    // 2. Cek apakah ada jadwal di lokasi target
    const targetSchedule = await prisma.schedule.findFirst({
      where: {
        scheduleDayId: targetDayId,
        scheduleSessionId: targetSessionId,
        roomId: targetRoomId,
      },
    });

    // 3. Jika target ada, lakukan swap dengan transaction
    if (targetSchedule) {
      await prisma.$transaction([
        // Langsung swap tanpa temporary spot
        prisma.schedule.update({
          where: { id: currentSchedule.id },
          data: {
            scheduleDayId: targetSchedule.scheduleDayId,
            scheduleSessionId: targetSchedule.scheduleSessionId,
            roomId: targetSchedule.roomId,
          },
        }),
        prisma.schedule.update({
          where: { id: targetSchedule.id },
          data: {
            scheduleDayId: currentSchedule.scheduleDayId,
            scheduleSessionId: currentSchedule.scheduleSessionId,
            roomId: currentSchedule.roomId,
          },
        }),
      ]);
    } else {
      // Jika target kosong, pindahkan current
      await prisma.schedule.update({
        where: { id: currentSchedule.id },
        data: {
          scheduleDayId: targetDayId,
          scheduleSessionId: targetSessionId,
          roomId: targetRoomId,
        },
      });
    }

    return NextResponse.json({ message: "Swap berhasil!" });
  } catch (error) {
    console.error("Error detail:", error);
    return NextResponse.json(
      { error: `Gagal swap: ${error.message}` },
      { status: 500 }
    );
  }
}