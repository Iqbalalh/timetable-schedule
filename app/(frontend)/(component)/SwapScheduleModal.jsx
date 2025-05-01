import React, { useEffect, useState } from "react";
import { Modal, Select, Button, message, Spin } from "antd";
import axios from "axios";
import { API_SCHEDULE_SESSION, API_SCHEDULE_DAY, API_ROOM, API_SWAP_SCHEDULE, API_GET} from "@/app/(backend)/lib/endpoint";

const SwapScheduleModal = ({ open, onClose, schedule, onSwap }) => {
  const [availableDays, setAvailableDays] = useState([]);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedDay, setSelectedDay] = useState(schedule ? schedule.scheduleDayId : null);
  const [selectedSession, setSelectedSession] = useState(schedule ? schedule.scheduleSessionId : null);
  const [selectedRoom, setSelectedRoom] = useState(schedule ? schedule.roomId : null);
  const [targetSchedule, setTargetSchedule] = useState(null);
  const [loadingTargetSchedule, setLoadingTargetSchedule] = useState(false); // Loading state for target schedule
  const [isTargetScheduleFetched, setIsTargetScheduleFetched] = useState(false); // Track if target schedule has been fetched

  useEffect(() => {
    const fetchAvailableOptions = async () => {
      try {
        const [dayResponse, sessionResponse, roomResponse] = await Promise.all([
          axios.get(API_SCHEDULE_DAY),
          axios.get(API_SCHEDULE_SESSION),
          axios.get(API_ROOM),
        ]);
        setAvailableDays(dayResponse.data);
        setAvailableSessions(sessionResponse.data);
        setAvailableRooms(roomResponse.data);
      } catch (error) {
        message.error("Error fetching available options");
      }
    };

    if (open && schedule) {
      fetchAvailableOptions();
      setSelectedDay(schedule.scheduleDayId);
      setSelectedSession(schedule.scheduleSessionId);
      setSelectedRoom(schedule.roomId);
      setTargetSchedule(null); // Reset target schedule when modal opens
      setIsTargetScheduleFetched(false); // Reset fetched state
    }
  }, [open, schedule]);

  const fetchTargetSchedule = async () => {
    if (!selectedDay || !selectedSession || !selectedRoom) {
        message.error("Please select all options.");
        return;
    }

    setLoadingTargetSchedule(true); // Set loading state
    
    try {
        const academicPeriodId = schedule.classLecturer.class?.academicPeriodId;
        const departmentId = schedule.classLecturer.class.studyProgramClass.studyProgram?.departmentId;

        const response = await axios.get(API_GET_SCHEDULE(
            selectedDay,
            selectedSession,
            selectedRoom,
            academicPeriodId, // Include academicPeriodId from the current schedule
            departmentId // Include departmentId from the current schedule
        ));
        
        // Set target schedule, even if it's empty
        setTargetSchedule(response.data || null); // Set to null if no data is returned
    } catch (error) {
        console.error("Error fetching target schedule:", error); // Log the error for debugging
    } finally {
        setLoadingTargetSchedule(false); // Reset loading state
        setIsTargetScheduleFetched(true);
    }
  };

const handleSwap = async () => {
    try {
      const response = await axios.post(API_SWAP_SCHEDULE, {
        currentScheduleId: schedule.id,
        targetDayId: selectedDay,       // Contoh: 1 (harus ada di tabel ScheduleDay)
        targetSessionId: selectedSession, // Contoh: 2 (harus ada di tabel ScheduleSession)
        targetRoomId: selectedRoom,      // Contoh: 3 (harus ada di tabel Room)
      });
  
      if (response.data.message) {
        message.success(response.data.message);
        onClose();
        window.location.reload(); // Refresh data
      }
    } catch (error) {
      message.error(error.response?.data?.error || "Gagal melakukan swap");
      console.error("Detail error:", error.response?.data);
    }
  };

  return (
    <Modal
      visible={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} className="mb-6 mt-2">
          Batal
        </Button>,
        <Button key="swap" onClick={handleSwap} disabled={!isTargetScheduleFetched} className="mr-8 bg-red-600 text-white">
          Ubah
        </Button>,
      ]}
    >
      <div>
        <div className="font-bold text-center text-xl mb-4 mt-8 text-blue-800">Informasi Jadwal</div>
        {schedule ? (
            <div className="mx-4">
                <table style={{width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '8px', textAlign: 'center', width: '33%' }}><strong>Hari:</strong></th>
                            <th style={{ padding: '8px', textAlign: 'center', width: '33%' }}><strong>Sesi:</strong></th>
                            <th style={{ padding: '8px', textAlign: 'center', width: '33%' }}><strong>Ruangan:</strong ></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '2px', textAlign: 'center' }}>{schedule.scheduleDay?.day}</td>
                            <td style={{ padding: '2px', textAlign: 'center' }}>{schedule.scheduleSession?.startTime} - {schedule.scheduleSession?.endTime}</td>
                            <td style={{ padding: '2px', textAlign: 'center' }}>{schedule.room?.roomName}</td>
                        </tr>
                    </tbody>
                </table>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: '4px', verticalAlign: 'top' }}><strong>Mata Kuliah:</strong></td>
                            <td style={{ padding: '4px' }}>{schedule.classLecturer.class.subSubject.subject?.subjectName}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '4px', verticalAlign: 'top' }}><strong>Tipe Perkuliahan:</strong></td>
                            <td style={{ padding: '4px' }}>{schedule.classLecturer.class.subSubject.subjectType?.typeName}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '4px', verticalAlign: 'top' }}><strong>Kelas:</strong></td>
                            <td style={{ padding: '4px' }}>{schedule.classLecturer.class.studyProgramClass?.className}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '4px', verticalAlign: 'top' }}><strong>Semester:</strong></td>
                            <td style={{ padding: '4px' }}>{schedule.classLecturer.class.subSubject.subject.semester?.semesterName}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '4px', verticalAlign: 'top' }}><strong>Kapasitas:</strong></td>
                            <td style={{ padding: '4px' }}>{schedule.classLecturer.class?.classCapacity}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '4px', verticalAlign: 'top' }}><strong>Dosen Pengampu:</strong></td>
                            <td style={{ padding: '4px' }}>
                                <div>1. {schedule.classLecturer.primaryLecturer?.lecturerName}</div>
                                <div>{!schedule.classLecturer.secondaryLecturer ? null : `2. ${schedule.classLecturer.secondaryLecturer?.lecturerName}`}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ) : null}
        <div className="text-center mt-8 mb-4 font-bold text-lg">Ubah Jadwal</div>
        <div className="flex justify-evenly mx-6">
            <Select
                placeholder="Select Day"
                value={selectedDay}
                onChange={setSelectedDay}
                options={availableDays.map(scheduleDay => ({ value: scheduleDay.id, label: scheduleDay.day }))}
            />
            <Select
                placeholder="Select Session"
                value={selectedSession}
                onChange={setSelectedSession}
                options={availableSessions.map(scheduleSession => ({ value: scheduleSession.id, label: scheduleSession.sessionNumber }))}
            />
            <Select
                placeholder="Select Room"
                value={selectedRoom}
                onChange={setSelectedRoom}
                options={availableRooms.map(room => ({ value: room.id, label: room.roomName }))}
            />
            <Button className="border-2 border-blue-700 text-blue-700 font-bold" onClick={fetchTargetSchedule}>
                Cek Jadwal
            </Button>
        </div>
        {loadingTargetSchedule ? (
            <div className="text-center mt-4">
                <Spin />
            </div>
        ) : isTargetScheduleFetched ? (
            <div className="mt-4">
                {targetSchedule ? (
                    <div className="mx-8 mb-8">
                        <div className="font-bold text-blue-600 mb-4">Jadwal Target:</div>
                        <div className="mx-4">
                            <div className="font-bold">Kelas:</div> 
                            <div className="mx-4">
                                {targetSchedule.classLecturer.class.subSubject.subject?.subjectName}{" "}
                                {targetSchedule.classLecturer.class.studyProgramClass?.className}{" "}
                                ({targetSchedule.classLecturer.class.subSubject.subjectType?.typeName})
                            </div>
                        </div>
                        <div className="mx-4">
                            <div className="font-bold">Dosen Pengampu:</div> 
                            < div className="mx-4">
                                <div>1. {targetSchedule.classLecturer.primaryLecturer?.lecturerName}</div>
                                <div>{!targetSchedule.classLecturer.secondaryLecturer ? null : `2. ${targetSchedule.classLecturer.secondaryLecturer?.lecturerName}`}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 text-center">
                        <div className="font-bold text-gray-500">Tidak ada jadwal.</div>
                    </div>
                )}
            </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default SwapScheduleModal;