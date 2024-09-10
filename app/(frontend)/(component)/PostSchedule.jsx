"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Select, message, Spin } from "antd";
import axios from "axios";
import {
  API_CLASS_LECTURER_BY_DEPARTMENT,
  API_CLASS_LECTURER_BY_DEPARTMENT_BY_PERIOD,
  API_SCHEDULE,
} from "@/app/(backend)/lib/endpoint";

const PostSchedule = ({
  open,
  onClose,
  idDay,
  idScheduleSession,
  idRoom,
  idDepartment,
  onSuccess,
  idPeriod,
}) => {
  const [classLecturers, setClassLecturers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch class lecturers only when modal is open
  useEffect(() => {
    if (open) {
      const fetchClassLecturers = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            API_CLASS_LECTURER_BY_DEPARTMENT_BY_PERIOD(idDepartment, idPeriod)
          ); // API to fetch class lecturers
          const classLecturerOptions = response.data.map((classLecturer) => ({
            value: classLecturer.id,
            label: (
              <div className="flex">
                {classLecturer.class.subSubject.subject.subjectName}{" "}
                {classLecturer.class.subSubject.subjectType.typeName}{" "}
                {classLecturer.class.className}{" "}
                {classLecturer.class.subSubject.subject.subjectCode} (
                {classLecturer.class.classCapacity} Mhs)
              </div>
            ),
          }));
          setClassLecturers(classLecturerOptions);
          setLoading(false);
        } catch (error) {
          message.error("Error fetching class lecturers!");
          setLoading(false);
        }
      };
      fetchClassLecturers();
    }
  }, [open]); // The effect will run when `open` changes

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    const payload = {
      idDay,
      idScheduleSession,
      idRoom,
      idClassLecturer: values.classLecturer,
    };

    try {
      await axios.post(API_SCHEDULE, payload); // Post schedule API call
      message.success("Schedule posted successfully!");
      onSuccess();
      onClose(); // Close modal after successful submission
    } catch (error) {
      message.error("Failed to post schedule!");
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
      )}
    </Modal>
  );
};

export default PostSchedule;
