"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Select, message, Spin } from "antd";
import axios from "axios";
import {
  API_CLASS_LECTURER_BY_DEPARTMENT_BY_CURRICULUM,
  API_SCHEDULE,
} from "@/app/(backend)/lib/endpoint";

const PostSchedule = ({
  open,
  onClose,
  scheduleDayId,
  scheduleSessionId,
  roomId,
  departmentId,
  onSuccess,
  curriculumId,
  isTheory,
  isPracticum,
  roomName,
  roomCapacity,
  scheduleData,
}) => {
  const [classLecturers, setClassLecturers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchClassLecturers = async () => {
        setLoading(true);
        try {
          // Fetch class lecturers based on department, curriculum, theory, and practicum flags
          const response = await axios.get(
            API_CLASS_LECTURER_BY_DEPARTMENT_BY_CURRICULUM(
              departmentId,
              curriculumId,
              isTheory,
              isPracticum
            )
          );

          console.log("Fetched class lecturers data:", response.data);

          const filteredClassLecturers = response.data.filter((classLecturer) => {
            const lecturerId = classLecturer.primaryLecturerId;
            const secondaryLecturerId = classLecturer.secondaryLecturerId;
            const isPracticumClass =
              classLecturer.class.subSubject.subjectTypeId === 2;

            // If it's a practicum class, include it regardless of conflicts
            if (isPracticumClass) {
              return true;
            }

            // Check for clashes with existing schedules if it's not a practicum class
            const hasClash = scheduleData.some((schedule) => {
              const isTheoryClass =
                schedule.classLecturer.class.subSubject.subjectTypeId === 1;

              const sameDayAndSession =
                schedule.scheduleDayId === scheduleDayId &&
                schedule.scheduleSessionId === scheduleSessionId;

              const lecturerClash =
                schedule.classLecturer.primaryLecturerId === lecturerId ||
                schedule.classLecturer.secondaryLecturerId === lecturerId;

              const secondaryLecturerClash =
                schedule.classLecturer.primaryLecturerId === secondaryLecturerId ||
                schedule.classLecturer.secondaryLecturerId === secondaryLecturerId;

              return (
                sameDayAndSession &&
                isTheoryClass &&
                (lecturerClash || secondaryLecturerClash)
              );
            });

            // Check if it's a special lecturer that should be included regardless of clash
            const isSpecialLecturer =
              classLecturer.lecturer.lecturerName === "-" &&
              classLecturer.lecturer.lecturerNIP === "-";

            return !hasClash || isSpecialLecturer;
          });

          const classLecturerOptions = filteredClassLecturers.map((classLecturer) => ({
            value: classLecturer.id,
            label: (
              <div className="flex">
                {classLecturer.class.subSubject.subject.subjectName}{" "}
                {classLecturer.class.className}{" "}
                {classLecturer.class.subSubject.subjectType?.typeName || ""} (
                {classLecturer.class.classCapacity} Mhs){" "}
                <div className="font-bold ml-2">
                  {classLecturer.class.subSubject.subject.subjectCode}
                </div>
              </div>
            ),
          }));

          setClassLecturers(classLecturerOptions);
        } catch (error) {
          console.error("Error fetching class lecturers:", error);
          message.error("Error fetching class lecturers!");
        } finally {
          setLoading(false);
        }
      };

      fetchClassLecturers();
    }
  }, [
    open,
    departmentId,
    curriculumId,
    isTheory,
    isPracticum,
    scheduleDayId,
    scheduleSessionId,
    scheduleData,
  ]);

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    const payload = {
      scheduleDayId,
      scheduleSessionId,
      roomId,
      classIdLecturer: values.classLecturer,
    };

    try {
      await axios.post(API_SCHEDULE, payload);
      message.success("Schedule posted successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal menambahkan jadwal:", error);
      message.error("Gagal menambahkan jadwal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tambah Jadwal"
      open={open}
      onCancel={() => {
        onClose();
        onSuccess();
      }}
      footer={null}
      destroyOnClose
    >
      {loading && open ? (
        <Spin />
      ) : (
        <>
          <div className="mb-4 mt-8">Ruangan : {roomName}</div>
          <div className="mb-4">Kapasitas : {roomCapacity} Mahasiswa</div>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Mata Kuliah"
              name="classLecturer"
              rules={[
                { required: true, message: "Pilih matkul terlebih dahulu!" },
              ]}
            >
              <Select
                placeholder="Pilih Matakuliah"
                options={classLecturers}
                loading={loading}
              />
            </Form.Item>

            <Form.Item className="flex justify-end mt-4">
              <Button type="primary" htmlType="submit" loading={loading}>
                Simpan Jadwal
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default PostSchedule;
