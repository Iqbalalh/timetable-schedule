"use client";
import React, { useState, useEffect } from "react";
import { Button, Table, Spin, message, ConfigProvider } from "antd";
import axios from "axios";

// Your API endpoints
import {
  API_ROOM,
  API_SCHEDULE_SESSION,
  API_SCHEDULE_DAY,
  API_SCHEDULE,
  API_SCHEDULE_BY_SCHEDULE_DAY,
} from "@/app/(backend)/lib/endpoint"; // Adjust this path as per your project structure

const ScheduleMatrix = () => {
  const [rooms, setRooms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [days, setDays] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch rooms, sessions, and schedule days
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [roomRes, sessionRes, dayRes] = await Promise.all([
          axios.get(API_ROOM),
          axios.get(API_SCHEDULE_SESSION),
          axios.get(API_SCHEDULE_DAY),
        ]);

        setRooms(roomRes.data);
        setSessions(sessionRes.data);
        setDays(dayRes.data);
        setLoading(false);
      } catch (error) {
        message.error("Error fetching data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch the schedule for a selected day
  const fetchSchedule = async (dayId) => {
    setLoading(true);
    try {
      const scheduleRes = await axios.get(API_SCHEDULE_BY_SCHEDULE_DAY(dayId));
      setSchedule(scheduleRes.data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching schedule");
      setLoading(false);
    }
  };

  // Handle day selection and fetch schedule
  const handleDayClick = (day) => {
    setSelectedDay(day);
    fetchSchedule(day.id); // Fetch the schedule for the selected day
  };

  // Generate table columns dynamically based on rooms
  const columns = [
    {
      title: "Waktu/Sesi",
      dataIndex: "sessionNumber", // Use sessionNumber for clarity
      key: "sessionNumber",
      fixed: "left",
      render: (_, record) => {
        return <div className="text-center">{record.time} WIB</div>; // Display session number
      },
    },
    ...rooms.map((room) => ({
      title: room.roomName,
      dataIndex: room.id, // Ensure this corresponds to room id
      key: room.id,
      render: (_, record) => {
        const scheduleData = record.schedules.find(
          (sch) => sch.idRoom === room.id
        );
        console.log(record);
        return scheduleData ? (
          <div className="h-40 text-center">
            <div className="text-lg font-bold">
              {scheduleData.classLecturer.class.subSubject.subject.subjectName}{" "}
              {scheduleData.classLecturer.class.subSubject.subjectType.typeName}{" "}
            </div>
            <div className="font-semibold mb-4">
              Kelas : {scheduleData.classLecturer.class.className}
            </div>
            <div className="text-gray-500">
              Dosen Pengampu :
              <div>1. {scheduleData.classLecturer.lecturer.lecturerName}</div>
              <div>2. {scheduleData.classLecturer.lecturer2.lecturerName}</div>
            </div>{" "}
          </div>
        ) : (
          <div className="flex justify-center items-center rounded-lg h-40">
            <Button>Tambah Data</Button>
          </div>
        );
      },
    })),
  ];

  // Prepare data for the table
  const dataSource = sessions
    .sort((a, b) => a.sessionNumber - b.sessionNumber) // Sort by sessionNumber
    .map((session) => {
      const rowData = {
        key: session.id,
        sessionNumber: session.sessionNumber, // Add session number for indexing
        time: `${session.startTime} - ${session.endTime}`,
        schedules: schedule.filter(
          (sch) => sch.idScheduleSession === session.id
        ), // filter schedules for this session
      };

      return rowData;
    });

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#1677ff",
            headerColor: "#fff",
            borderColor: "#bfbfbf",
          },
        },
      }}
    >
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 flex">
            <div className="bg-blue-500 px-1 mr-2 mb-8">&nbsp;</div>Kelola
            Jadwal
          </h1>
        </div>

        {loading ? (
          <Spin />
        ) : (
          <>
            {/* Day buttons */}
            <div className="mb-4">
              {days.map((day) => (
                <Button
                  key={day.id}
                  type={selectedDay?.id === day.id ? "primary" : "text"}
                  onClick={() => handleDayClick(day)}
                  className="mr-2 mb-2 border-b-4 border-gray-600"
                >
                  {day.day}
                </Button>
              ))}
            </div>

            {/* Show the table only when a day is selected */}
            {!selectedDay && (
              <>
                <h2 className="text-xl text-gray-500 font-semibold mb-2">
                  Pilih Hari!
                </h2>
              </>
            )}
            {selectedDay && (
              <>
                <Table
                  className="shadow-xl rounded-xl"
                  columns={columns}
                  dataSource={dataSource}
                  bordered
                  pagination={false}
                  scroll={{ x: 2 }}
                />
              </>
            )}
          </>
        )}
      </div>
    </ConfigProvider>
  );
};

export default ScheduleMatrix;
