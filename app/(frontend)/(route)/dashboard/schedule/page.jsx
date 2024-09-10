"use client";
import React, { useState, useEffect } from "react";
import { Button, Table, Spin, message, ConfigProvider, Select } from "antd";
import axios from "axios";

// Your API endpoints
import {
  API_SCHEDULE_SESSION,
  API_SCHEDULE_DAY,
  API_DEPARTMENT_BY_FACULTY,
  API_FACULTY,
  API_ROOM_BY_DEPARTMENT,
  API_ACADEMIC_PERIOD,
  API_SCHEDULE_BY_SCHEDULE_DAY_BY_DEPARTMENT_BY_PERIOD,
} from "@/app/(backend)/lib/endpoint";
import PostSchedule from "@/app/(frontend)/(component)/PostSchedule";

const ScheduleMatrix = () => {

  const [roomOptions, setRoomOptions] = useState([]);
  const [sessionOptions, setSessionOptions] = useState([]);
  const [dayOptions, setDayOptions] = useState([]);
  const [academicPeriodOptions, setAcademicPeriodOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [isDepartmentLoading, setIsDepartmentLoading] = useState(false);
  const [isFacultyLoading, setIsFacultyLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDayId, setCurrentDayId] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [currentPeriodId, setCurrentPeriodId] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [sessionResponse, dayResponse, periodResponse] = await Promise.all([
          axios.get(API_SCHEDULE_SESSION),
          axios.get(API_SCHEDULE_DAY),
          axios.get(API_ACADEMIC_PERIOD),
        ]);
        setAcademicPeriodOptions(periodResponse.data);
        setSessionOptions(sessionResponse.data);
        setDayOptions(dayResponse.data);
        setIsLoading(false);
      } catch (error) {
        message.error("Error fetching data");
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleAddButtonClick = (dayId, sessionId, roomId) => {
    setCurrentDayId(dayId);
    setCurrentSessionId(sessionId);
    setCurrentRoomId(roomId);
    setIsModalOpen(true); // Show modal when button is clicked
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Fetch departments based on selected faculty
  const loadDepartmentsByFaculty = async (facultyId) => {
    setIsDepartmentLoading(true);
    try {
      const response = await axios.get(API_DEPARTMENT_BY_FACULTY(facultyId));
      const departments = response.data.map((dept) => ({
        value: dept.id,
        label: dept.departmentName,
      }));
      setDepartmentOptions(departments);
      setIsDepartmentLoading(false);
    } catch (error) {
      message.error("Failed to load departments data!");
      setIsDepartmentLoading(false);
    }
  };

  // Fetch faculties
  const loadFaculties = async () => {
    setIsFacultyLoading(true);
    try {
      const response = await axios.get(API_FACULTY);
      const faculties = response.data.map((fac) => ({
        value: fac.id,
        label: fac.facultyName,
      }));
      setFacultyOptions(faculties);
      setIsFacultyLoading(false);
    } catch (error) {
      message.error("Failed to load faculties data!");
      setIsFacultyLoading(false);
    }
  };

  // Fetch rooms based on selected department
  const loadRoomsByDepartment = async (departmentId) => {
    setIsLoading(true);
    try {
      const roomResponse = await axios.get(API_ROOM_BY_DEPARTMENT(departmentId));
      setRoomOptions(roomResponse.data);
      setIsLoading(false);
    } catch (error) {
      message.error("Error fetching rooms");
      setIsLoading(false);
    }
  };

  // Fetch the schedule for a selected day
  const loadScheduleByDay = async (dayId) => {
    setIsLoading(true);
    try {
      const scheduleResponse = await axios.get(
        API_SCHEDULE_BY_SCHEDULE_DAY_BY_DEPARTMENT_BY_PERIOD(dayId, selectedDepartment, currentPeriodId)
      );
      setScheduleData(scheduleResponse.data);
      setIsLoading(false);
    } catch (error) {
      message.error("Error fetching schedule");
      setIsLoading(false);
    }
  };

  // Handle department selection and fetch rooms
  const handleDepartmentChange = (departmentId) => {
    setSelectedDepartment(departmentId);
    setSelectedDay(null); // Reset selected day when department changes
    loadRoomsByDepartment(departmentId); // Fetch rooms for the selected department
  };

  // Handle day selection and fetch schedule
  const handleDaySelection = (day) => {
    setSelectedDay(day);
    loadScheduleByDay(day.id); // Fetch the schedule for the selected day
  };

  // Generate table columns dynamically based on rooms
  const columns = [
    {
      title: <div className="text-center">Waktu/Sesi</div>,
      dataIndex: "sessionNumber",
      width: 150,
      key: "sessionNumber",
      fixed: "left",
      render: (_, record) => <div className="text-center">{record.time}</div>,
    },
    ...roomOptions.map((room) => ({
      title: <div className="text-center">{room.roomName}</div>,
      dataIndex: room.id,
      width: 300,
      key: room.id,
      render: (_, record) => {
        const scheduleItem = record.schedules.find(
          (sch) => sch.idRoom === room.id
        );
        return scheduleItem ? (
          <div className="flex flex-col justify-center h-32 text-center items-center">
            <div className="text-lg font-bold">
              {scheduleItem.classLecturer.class.subSubject.subject.subjectName}{" "}
              {scheduleItem.classLecturer.class.subSubject.subjectType.typeName}{" "}
              {scheduleItem.classLecturer.class.className}
            </div>
            <div className="text-gray-500 text-sm">
              Dosen Pengampu:
              <div>1. {scheduleItem.classLecturer.lecturer.lecturerName}</div>
              <div>2. {scheduleItem.classLecturer.lecturer2.lecturerName}</div>
            </div>
            <Button className="mt-2" size="small" danger>
              Hapus
            </Button>
          </div>
        ) : (
          <div className="flex justify-center items-center rounded-lg h-32">
            <Button
              onClick={() =>
                handleAddButtonClick(selectedDay.id, record.sessionNumber, room.id)
              }
            >
              Tambah Data
            </Button>
          </div>
        );
      },
    })),
  ];

  // Prepare data for the table
  const dataSource = sessionOptions
    .sort((a, b) => a.sessionNumber - b.sessionNumber) // Sort by sessionNumber
    .map((session) => {
      const rowData = {
        key: session.id,
        sessionNumber: session.sessionNumber, // Add session number for indexing
        time: `${session.startTime} - ${session.endTime}`,
        schedules: scheduleData.filter(
          (sch) => sch.idScheduleSession === session.id
        ), // Filter schedules for this session
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

        <div className="mb-12 lg:flex block">
          <div className="text-lg font-semibold mr-4 lg:border-b-4 border-blue-200">
            Periode Akademik :{" "}
          </div>
          <Select
            className="lg:w-1/5 lg:mb-0 mb-2 w-full mr-8 shadow-lg"
            showSearch
            placeholder="Pilih salah satu"
            value={currentPeriodId} // Show selected period
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={academicPeriodOptions.map((period) => ({
              value: period.id,
              label: period.periodName,
            }))}
            onChange={(value) => {
              setCurrentPeriodId(value);
              setSelectedFaculty(null);
              loadFaculties();
            }}
          />

          <div className="text-lg font-semibold mr-4 lg:border-b-4 border-blue-200">
            Fakultas:{" "}
          </div>
          <Select
            className="lg:w-1/5 lg:mb-0 mb-2 w-full mr-8 shadow-lg"
            showSearch
            placeholder={
              !currentPeriodId ? "Pilih periode akademik terlebih dahulu" : "Pilih salah satu"
            }
            value={selectedFaculty}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={facultyOptions}
            onChange={(value) => {
              setSelectedFaculty(value);
              loadDepartmentsByFaculty(value);
              setSelectedDepartment(null);
              setSelectedDay(null);
            }}
            loading={isFacultyLoading}
            disabled={currentPeriodId === null} // Disable when periodId is null
          />

          <div className="text-lg font-semibold mr-4 lg:border-b-4 border-blue-200">
            Jurusan :{" "}
          </div>
          <Select
            showSearch
            className="shadow-lg lg:mb-0 mb-2 lg:w-1/5 w-full"
            disabled={!selectedFaculty}
            placeholder={
              !selectedFaculty ? "Pilih fakultas terlebih dahulu" : "Pilih salah satu"
            }
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={departmentOptions}
            value={selectedDepartment} // Set the selected department value
            notFoundContent={
              isDepartmentLoading ? <Spin size="small" /> : "Tidak ada data!"
            }
            onSelect={(value) => {
              setSelectedDay(null); // Clear selected day when department is changed
              handleDepartmentChange(value); // Set department and fetch rooms
            }}
          />
        </div>

        {isLoading ? (
          <Spin />
        ) : (
          <>
            {/* Day buttons */}
            {selectedDepartment && (
              <>
                <div className="mb-4">
                  {dayOptions.map((day) => (
                    <Button
                      key={day.id}
                      type={selectedDay?.id === day.id ? "primary" : "text"}
                      onClick={() => handleDaySelection(day)}
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
                      scroll={{ x: "max-content", y: 700 }} // Horizontal scroll enabled
                    />
                  </>
                )}
              </>
            )}

            {!selectedDepartment && (
              <>
                <h2 className="text-xl text-gray-500 font-semibold mb-2">
                  Pilih Jurusan Terlebih Dahulu!
                </h2>
              </>
            )}
          </>
        )}

        <PostSchedule
          open={isModalOpen}
          onClose={handleModalClose}
          idDay={currentDayId}
          idScheduleSession={currentSessionId}
          idRoom={currentRoomId}
          idDepartment={selectedDepartment}
          idPeriod={currentPeriodId}
          onSuccess={() => loadScheduleByDay(currentDayId)}
        />
      </div>
    </ConfigProvider>
  );
};

export default ScheduleMatrix;
