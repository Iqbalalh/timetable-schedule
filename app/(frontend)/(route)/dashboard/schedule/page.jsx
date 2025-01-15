"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Spin,
  message,
  ConfigProvider,
  Select,
  Popconfirm,
} from "antd";
import axios from "axios";

// Your API endpoints
import {
  API_SCHEDULE_SESSION,
  API_SCHEDULE_DAY,
  API_FACULTY,
  API_ACADEMIC_PERIOD_BY_CURRICULUM,
  API_DEPARTMENT_BY_FACULTY,
  API_ROOM_BY_DEPARTMENT,
  API_SCHEDULE_BY_SCHEDULE_DAY_BY_DEPARTMENT_BY_PERIOD,
  API_CURRICULUM,
  API_SCHEDULE_BY_ID,
  API_SEMESTER_TYPE,
  AUTO_GENERATE_SERVICE,
} from "@/app/(backend)/lib/endpoint";
import PostSchedule from "@/app/(frontend)/(component)/PostSchedule";

const ScheduleMatrix = () => {
  const [roomOptions, setRoomOptions] = useState([]);
  const [sessionOptions, setSessionOptions] = useState([]);
  const [dayOptions, setDayOptions] = useState([]);
  const [academicPeriodOptions, setAcademicPeriodOptions] = useState([]);
  const [semesterTypeOptions, setSemesterTypeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState(null);
  const [curriculumOptions, setCurriculumOptions] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [isDepartmentLoading, setIsDepartmentLoading] = useState(false);
  const [isFacultyLoading, setIsFacultyLoading] = useState(false);
  const [isPeriodLoading, setIsPeriodLoading] = useState(false);
  const [isSemesterLoading, setIsCurrentSemesterLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDayId, setCurrentDayId] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [currentRoomName, setCurrentRoomName] = useState(null);
  const [currentSemesterId, setCurrentSemesterId] = useState(null);
  const [currentRoomCapacity, setCurrentRoomCapacity] = useState(null);
  const [currentPeriodId, setCurrentPeriodId] = useState(null);
  const [currentCurriculumId, setCurrentCurriculumId] = useState(null);
  const [isTheory, setIsTheory] = useState(null);
  const [isPracticum, setIsPracticum] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [sessionResponse, dayResponse, curriculumResponse] =
          await Promise.all([
            axios.get(API_SCHEDULE_SESSION),
            axios.get(API_SCHEDULE_DAY),
            axios.get(API_CURRICULUM),
          ]);
        setSessionOptions(sessionResponse.data);
        setDayOptions(dayResponse.data);
        setCurriculumOptions(curriculumResponse.data);
        setIsLoading(false);
        setIsCurrentSemesterLoading(false);
      } catch (error) {
        message.error("Error fetching data");
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleAddButtonClick = (
    dayId,
    sessionId,
    roomId,
    isTheory,
    isPracticum,
    roomName,
    roomCapacity
  ) => {
    setCurrentDayId(dayId);
    setCurrentSessionId(sessionId);
    setCurrentRoomId(roomId);
    setIsTheory(isTheory);
    setIsPracticum(isPracticum);
    setCurrentRoomName(roomName);
    setCurrentRoomCapacity(roomCapacity);
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
      message.error("Gagal memuat data jurusan data!");
      setIsDepartmentLoading(false);
    }
  };

  // Fetch period
  const loadPeriod = async (curriculumId) => {
    setIsPeriodLoading(true);
    try {
      const response = await axios.get(
        API_ACADEMIC_PERIOD_BY_CURRICULUM(curriculumId)
      );
      const periods = response.data.map((per) => ({
        value: per.id,
        label: per.academicYear,
      }));
      setAcademicPeriodOptions(periods);
      setIsPeriodLoading(false);
    } catch (error) {
      message.error("Gagal memuat data fakultas!");
      setIsPeriodLoading(false);
    }
  };

  const fetchSemesterTypes = async () => {
    setIsCurrentSemesterLoading(true);
    try {
      const response = await axios.get(API_SEMESTER_TYPE);
      const semester = response.data.map((per) => ({
        value: per.id,
        label: per.typeName,
      }));
      setSemesterTypeOptions(semester);
      setIsCurrentSemesterLoading(false);
    } catch (error) {
      message.error("Gagal memuat data semester!");
      setIsCurrentSemesterLoading(false);
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
      message.error("Gagal memuat data fakultas!");
      setIsFacultyLoading(false);
    }
  };

  // Fetch rooms based on selected department
  const loadRoomsByDepartment = async (departmentId) => {
    setIsLoading(true);
    try {
      const roomResponse = await axios.get(
        API_ROOM_BY_DEPARTMENT(departmentId)
      );
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
        API_SCHEDULE_BY_SCHEDULE_DAY_BY_DEPARTMENT_BY_PERIOD(
          dayId,
          selectedDepartment,
          currentPeriodId
        )
      );
      setScheduleData(scheduleResponse.data);
      setIsLoading(false);
    } catch (error) {
      message.error("Error fetching schedule");
      setIsLoading(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const response = await axios.delete(API_SCHEDULE_BY_ID(scheduleId));
      message.success("Schedule deleted successfully!");
      loadScheduleByDay(currentDayId); // Reload the schedule data
    } catch (error) {
      message.error("Failed to delete schedule.");
    }
  };

  const handlePostSchedule = async (
    departmentId,
    curriculumId,
    semesterTypeId,
    academicPeriodId
  ) => {
    setIsLoading(true);
    try {
      const postSchedule = await axios.get(
        AUTO_GENERATE_SERVICE(
          departmentId,
          curriculumId,
          semesterTypeId,
          academicPeriodId
        )
      );
      setIsLoading(false);
      message.success("Jadwal berhasil di generate!");
    } catch (error) {
      setIsLoading(false);
      message.error("Jadwal gagal di generate!");
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
          (sch) => sch.roomId === room.id
        );
        return scheduleItem ? (
          <div className="flex flex-col justify-center h-32 text-center items-center">
            <div className="text-lg font-bold">
              {scheduleItem.classLecturer.class.subSubject.subject?.subjectName}{" "}
              {scheduleItem.classLecturer.class.subSubject.subjectType?.typeName}{" "}
              {scheduleItem.classLecturer.class.studyProgramClass?.className}
            </div>
            <div className="text-gray-500 text-sm">
              Dosen Pengampu:
              <div>
                1. {scheduleItem.classLecturer.primaryLecturer?.lecturerName}
              </div>
              <div>
                 {!scheduleItem.classLecturer.secondaryLecturer ? null : `2. ${scheduleItem.classLecturer.secondaryLecturer?.lecturerName}`}
              </div>
            </div>
            <Popconfirm
              title="Apakah anda yakin?"
              onConfirm={() => handleDeleteSchedule(scheduleItem.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button className="mt-2" size="small" danger>
                Hapus
              </Button>
            </Popconfirm>
          </div>
        ) : (
          <div className="flex justify-center items-center rounded-lg h-32">
            {/* <Button
              onClick={() =>
                handleAddButtonClick(
                  selectedDay.id,
                  record.sessionNumber,
                  room.id,
                  room.isTheory,
                  room.isPracticum,
                  room.roomName,
                  room.roomCapacity
                )
              }
            >
              Tambah Data
            </Button> */}
            <Button>Kosong</Button>
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
          (sch) => sch.scheduleSessionId === session.id
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
          <h1 className="text-2xl font-bold mb-8 flex">
            <div className="bg-blue-500 px-1 mr-2">&nbsp;</div>Kelola Jadwal
          </h1>
        </div>

        <div className="mb-8 lg:flex gap-8">
          <Select
            className="mb-2 w-full shadow-lg border-b-4 border-blue-500"
            showSearch
            placeholder="Kurikulum"
            value={currentCurriculumId}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={curriculumOptions.map((curr) => ({
              value: curr.id,
              label: curr.curriculumName,
            }))}
            notFoundContent={
              isLoading ? <Spin size="small" /> : "Tidak ada data!"
            }
            onChange={(value) => {
              setCurrentCurriculumId(value);
              setCurrentPeriodId(null);
              setSelectedFaculty(null);
              setSelectedDepartment(null);
              setSelectedDay(null);
              loadPeriod(value);
            }}
          />
          <Select
            className="mb-2 w-full shadow-lg border-b-4 border-blue-500"
            showSearch
            placeholder={"Tahun Akademik"}
            value={currentPeriodId} // Show selected period
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={academicPeriodOptions}
            onChange={(value) => {
              setCurrentPeriodId(value);
              setSelectedFaculty(null);
              setSelectedDepartment(null);
              setSelectedDay(null);
              fetchSemesterTypes();
              loadFaculties();
            }}
            notFoundContent={
              isPeriodLoading ? <Spin size="small" /> : "Tidak ada data!"
            }
            loading={isPeriodLoading}
            disabled={currentCurriculumId === null}
          />
          <Select
            className="mb-2 w-full shadow-lg border-b-4 border-blue-500"
            showSearch
            placeholder={"Semester"}
            value={currentSemesterId} // Show selected period
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={semesterTypeOptions}
            onChange={(value) => {
              setCurrentSemesterId(value);
            }}
            notFoundContent={
              isSemesterLoading ? <Spin size="small" /> : "Tidak ada data!"
            }
            loading={isSemesterLoading}
            disabled={currentPeriodId === null}
          />
          <Select
            notFoundContent={
              isFacultyLoading ? <Spin size="small" /> : "Tidak ada data!"
            }
            className="mb-2 w-full shadow-lg border-b-4 border-blue-500"
            showSearch
            placeholder={"Fakultas"}
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
          <Select
            showSearch
            className="mb-2 w-full shadow-lg border-b-4 border-blue-500"
            disabled={!selectedFaculty}
            placeholder={"Jurusan"}
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
                <div className="mb-4 justify-between flex">
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
                  <Button
                    onClick={() =>
                      handlePostSchedule(
                        selectedDepartment,
                        currentCurriculumId,
                        currentSemesterId,
                        currentPeriodId
                      )
                    }
                    className="mr-2 mb-2 border-b-4 border-gray-600"
                    type="primary"
                    disabled={!scheduleData || scheduleData?.length > 1 || !selectedDay}
                  >
                    Buat Jadwal Otomatis
                  </Button>
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
                      scroll={{ x: "max-content", y: 500 }} // Horizontal scroll enabled
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
          scheduleDayId={currentDayId}
          scheduleSessionId={currentSessionId}
          roomId={currentRoomId}
          departmentId={selectedDepartment}
          curriculumId={currentCurriculumId}
          isTheory={isTheory}
          isPracticum={isPracticum}
          roomName={currentRoomName}
          roomCapacity={currentRoomCapacity}
          scheduleData={scheduleData}
          onSuccess={() => loadScheduleByDay(currentDayId)}
        />
      </div>
    </ConfigProvider>
  );
};

export default ScheduleMatrix;
