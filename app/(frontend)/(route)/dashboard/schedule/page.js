"use client";
import React, { useState, useEffect } from "react";
import { Button, Table, Spin, message, ConfigProvider, Select } from "antd";
import axios from "axios";

// Your API endpoints
import {
  API_SCHEDULE_SESSION,
  API_SCHEDULE_DAY,
  API_SCHEDULE,
  API_SCHEDULE_BY_SCHEDULE_DAY,
  API_DEPARTMENT_BY_FACULTY,
  API_FACULTY,
  API_SCHEDULE_BY_SCHEDULE_DAY_BY_DEPARTMENT,
  API_ROOM_BY_DEPARTMENT, // Add this endpoint
} from "@/app/(backend)/lib/endpoint"; // Adjust this path as per your project structure

const ScheduleMatrix = () => {
  const [rooms, setRooms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [days, setDays] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dep, setDep] = useState(null);
  const [department, setDepartment] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [facultyLoading, setFacultyLoading] = useState(false);

  // Fetch sessions and schedule days (no need to fetch rooms initially)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [sessionRes, dayRes] = await Promise.all([
          axios.get(API_SCHEDULE_SESSION),
          axios.get(API_SCHEDULE_DAY),
        ]);

        setSessions(sessionRes.data);
        setDays(dayRes.data);
        setLoading(false);
      } catch (error) {
        message.error("Error fetching data");
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch departments based on selected faculty
  const fetchDepartments = async (facultyId) => {
    setDepLoading(true);
    try {
      const response = await axios.get(API_DEPARTMENT_BY_FACULTY(facultyId));
      const departments = response.data.map((dept) => ({
        value: dept.id,
        label: dept.departmentName,
      }));
      setDep(departments);
      setDepLoading(false);
    } catch (error) {
      message.error("Failed to load departments data!");
      setDepLoading(false);
    }
  };

  // Fetch faculties
  const fetchFaculty = async () => {
    setFacultyLoading(true);
    try {
      const response = await axios.get(API_FACULTY);
      const faculties = response.data.map((fac) => ({
        value: fac.id,
        label: fac.facultyName,
      }));
      setFaculties(faculties);
      setFacultyLoading(false);
    } catch (error) {
      message.error("Failed to load faculties data!");
      setFacultyLoading(false);
    }
  };

  // Fetch rooms based on selected department
  const fetchRoomsByDepartment = async (departmentId) => {
    setLoading(true);
    try {
      const roomRes = await axios.get(API_ROOM_BY_DEPARTMENT(departmentId));
      setRooms(roomRes.data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching rooms");
      setLoading(false);
    }
  };

  // Fetch the schedule for a selected day
  const fetchSchedule = async (dayId) => {
    setLoading(true);
    try {
      const scheduleRes = await axios.get(
        API_SCHEDULE_BY_SCHEDULE_DAY_BY_DEPARTMENT(dayId, department)
      );
      setSchedule(scheduleRes.data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching schedule");
      setLoading(false);
    }
  };

  // Handle department selection and fetch rooms
  const handleDepartmentSelect = (departmentId) => {
    setDepartment(departmentId);
    setSelectedDay(null); // Reset selected day when department changes
    fetchRoomsByDepartment(departmentId); // Fetch rooms for the selected department
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
      width: 150, // Ensure fixed width for the "Waktu/Sesi" column
      render: (_, record) => {
        return <div className="text-center">{record.time} WIB</div>; // Display session number
      },
    },
    ...rooms.map((room) => ({
      title: room.roomName,
      dataIndex: room.id, // Ensure this corresponds to room id
      key: room.id,
      width: 200, // Fixed width for room columns
      render: (_, record) => {
        const scheduleData = record.schedules.find(
          (sch) => sch.idRoom === room.id
        );
        return scheduleData ? (
          <div className="h-40 text-center">
            <div className="text-lg font-bold">
              {scheduleData.classLecturer.class.subSubject.subject.subjectName}{" "}
              {scheduleData.classLecturer.class.subSubject.subjectType.typeName}{" "}
              {scheduleData.classLecturer.class.className}
            </div>
            <div className="text-gray-500">
              Dosen Pengampu:
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
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mb-4 flex">
            <div className="bg-blue-500 px-1 mr-2">&nbsp;</div>Kelola Jadwal
          </h1>
        </div>

        <div className="mb-12 flex">
          <div className="text-lg font-semibold mr-4 border-b-4 border-blue-200">
            Fakultas :{" "}
          </div>
          <Select
            className="justify-end mr-12 shadow-lg"
            showSearch
            placeholder="Pilih salah satu"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={faculties}
            loading={facultyLoading}
            onDropdownVisibleChange={(open) => {
              if (open && faculties.length === 0) {
                fetchFaculty(); // Fetch faculties when the dropdown is opened for the first time
              }
            }}
            onSelect={(value) => {
              setFaculty(value); // Set the selected faculty
              setDepartment(null); // Reset the department value when faculty changes
              setSelectedDay(null); // Reset the selected day when faculty changes
              fetchDepartments(value); // Fetch departments based on the selected faculty ID
            }}
            notFoundContent={facultyLoading ? <Spin size="small" /> : null}
          />

          <div className="text-lg font-semibold mr-4 border-b-4 border-blue-200">
            Jurusan :{" "}
          </div>
          <Select
            showSearch
            className="shadow-lg"
            disabled={!faculty}
            placeholder={
              !faculty ? "Pilih fakultas terlebih dahulu" : "Pilih salah satu"
            }
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={dep}
            value={department} // Set the selected department value
            notFoundContent={
              depLoading ? <Spin size="small" /> : "Tidak ada data!"
            }
            onSelect={(value) => {
              setSelectedDay(null); // Clear selected day when department is changed
              handleDepartmentSelect(value); // Set department and fetch rooms
            }}
          />
        </div>

        {loading ? (
          <Spin />
        ) : (
          <>
            {/* Day buttons */}
            {department && (
              <>
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
                      scroll={{ x: "max-content", y: 350 }} // Horizontal scroll enabled
                    />
                  </>
                )}
              </>
            )}

            {!department && (
              <>
                <h2 className="text-xl text-gray-500 font-semibold mb-2">
                  Pilih Jurusan Terlebih Dahulu!
                </h2>
              </>
            )}
          </>
        )}
      </div>
    </ConfigProvider>
  );
};

export default ScheduleMatrix;
