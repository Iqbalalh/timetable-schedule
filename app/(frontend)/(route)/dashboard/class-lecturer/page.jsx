"use client";
import React, { useEffect, useState } from "react";
import { Table, message, Button, Input, Form, Spin, Modal, Select } from "antd";
import axios from "axios";
import {
  API_CLASS_LECTURER,
  API_CLASS,
  API_CLASS_LECTURER_BY_ID,
  API_SUBJECT,
  API_ACADEMIC_PERIOD,
  API_LECTURER,
} from "@/app/(backend)/lib/endpoint";
import PostModal from "@/app/(frontend)/(component)/PostModal";
import PatchModal from "@/app/(frontend)/(component)/PatchModal";

const ClassLecturerPage = () => {
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentClassLecturer, setCurrentClassLecturer] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [academicPeriods, setAcademicPeriods] = useState([]);
  const [lecturers, setLecturers] = useState([]);

  // Fetch Kelas Perkuliahan
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_CLASS_LECTURER);
      setDatas(response.data);
      setIsLoading(false);
      setIsDisabled(false);
    } catch (error) {
      message.error("Failed to load data!");
      setIsLoading(false);
    }
  };

  // Fetch subjects, Periode Akademiks, and lecturers
  const fetchOptions = async () => {
    try {
      const [subjectRes, academicPeriodRes, lecturerRes] = await Promise.all([
        axios.get(API_SUBJECT),
        axios.get(API_ACADEMIC_PERIOD),
        axios.get(API_LECTURER),
      ]);

      setSubjects(subjectRes.data);
      setAcademicPeriods(academicPeriodRes.data);
      setLecturers(lecturerRes.data);
    } catch (error) {
      message.error("Failed to load options!");
    }
  };

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, []);

  const handleAddData = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    fetchData();
  };

  const postData = async (values) => {
    const data = {
      className: values.className,
      classCapacity: values.classCapacity,
      idSubject: values.idSubject,
      idAcademicPeriod: values.idAcademicPeriod,
      idLecturer: values.idLecturer,
      idLecturer2: values.idLecturer2,
    };

    const response = await axios.post(API_CLASS, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 201) {
      throw new Error("Failed to add class lecturer");
    }
    handleSuccess();
  };

  const patchClassLecturerData = async (values) => {
    const data = {
      idLecturer: values.idLecturer,
      idLecturer2: values.idLecturer2,
    };

    const response = await axios.put(
      API_CLASS_LECTURER_BY_ID(currentClassLecturer?.id),
      data
    );
    if (response.status !== 200) {
      throw new Error("Failed to update data");
    }
    handleSuccess();
  };

  const handleEdit = (record) => {
    setCurrentClassLecturer({
      ...record,
      lecturer: record.lecturer || { id: null },
      lecturer2: record.lecturer2 || { id: null },
    });
    setIsEditOpen(true);
  };

  const deleteClassLecturerData = async (id) => {
    try {
      const response = await axios.delete(API_CLASS_LECTURER_BY_ID(id));
      if (response.status !== 200) {
        throw new Error("Failed to delete data");
      }
      message.success("Data successfully deleted!");
      handleSuccess();
    } catch (error) {
      message.error(error.message || "Failed to delete data");
    }
  };

  // Handle delete confirmation
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this data?",
      content: "This action will remove all related data as well.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deleteClassLecturerData(id),
    });
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 70,
      render: (text, record, index) => index + 1 + ".",
    },
    {
      title: "Mata Kuliah",
      dataIndex: ["subject", "subjectName"],
      key: "idSubject",
      render: (_, record) => record.class.subSubject.subject.subjectName,
    },
    {
      title: "Jenis",
      dataIndex: ["subject", "subjectName"],
      key: "idSubject",
      render: (_, record) => record.class.subSubject.subjectType.typeName,
    },
    {
      title: "Prodi",
      dataIndex: ["subject", "subjectName"],
      key: "idSubject",
      render: (_, record) => record.class.subSubject.subject.studyProgram.studyProgramName,
    },
    {
      title: "Dosen Pengampu",
      dataIndex: ["lecturer", "name"],
      key: "lecturer1",
      render: (_, record) => record.lecturer.lecturerName,
    },
    {
      title: "Dosen Pengampu",
      dataIndex: ["lecturer2", "name"],
      key: "lecturer2",
      render: (_, record) => record.lecturer2.lecturerName,
    },
    {
      title: "Kelas",
      dataIndex: ["class", "className"],
      key: "class",
      width: 100,
    },
    {
      title: "Waktu Dibuat",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString("id-ID"),
    },
    {
      title: "Waktu Diperbarui",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => new Date(text).toLocaleString("id-ID"),
    },
    {
      title: (
        <div className="flex justify-end">
          <Button
            type="primary"
            disabled={isDisabled}
            shape="round"
            className="font-semibold py-4 bg-blue-500 text-white"
            onClick={handleAddData}
          >
            Tambah Data
          </Button>
        </div>
      ),
      dataIndex: "id",
      key: "action",
      render: (_, record) => {
        return (
          <div className="flex justify-end">
            <Button
              type="text"
              disabled={isDisabled}
              className="text-blue-500 font-semibold"
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
            <Button
              type="text"
              disabled={isDisabled}
              className="text-red-600 font-semibold"
              onClick={() => handleDelete(record.id)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 flex">
            <div className="bg-blue-500 px-1 mr-2">&nbsp;</div>Kelas Perkuliahan
          </h1>
        </div>

        <Table
          className="shadow-xl rounded-lg"
          columns={columns}
          dataSource={datas}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: "max-content", y: 800 }}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <PostModal
        postApi={API_CLASS}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        postPayload={postData}
        title="Tambah Data"
      >
        <Form.Item
          label="Nama Kelas"
          className="mb-2"
          name="className"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input placeholder="Nama Kelas" />
        </Form.Item>
        <Form.Item
          label="Jumlah Mahasiswa"
          className="mb-2"
          name="classCapacity"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input type="number" placeholder="Capacity" />
        </Form.Item>
        <Form.Item
          label="Mata Kuliah"
          className="mb-2"
          name="idSubject"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Select placeholder="Pilih salah satu">
            {subjects.map((subject) => (
              <Select.Option key={subject.id} value={subject.id}>
                {subject.subjectName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Periode Akademik"
          className="mb-2"
          name="idAcademicPeriod"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Select placeholder="Pilih salah satu">
            {academicPeriods.map((period) => (
              <Select.Option key={period.id} value={period.id}>
                {period.periodName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Dosen Pengampu 1"
          className="mb-2"
          name="idLecturer"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Select placeholder="Pilih salah satu">
            {lecturers.map((lecturer) => (
              <Select.Option key={lecturer.id} value={lecturer.id}>
                {lecturer.lecturerName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Dosen Pengampu 2"
          className="mb-2"
          name="idLecturer2"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Select placeholder="Pilih salah satu">
            {lecturers.map((lecturer) => (
              <Select.Option key={lecturer.id} value={lecturer.id}>
                {lecturer.lecturerName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </PostModal>

      {currentClassLecturer && (
        <PatchModal
          patchApi={API_CLASS_LECTURER}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          patchPayload={patchClassLecturerData}
          title="Sunting"
          currentData={currentClassLecturer}
        >
          <Form
            initialValues={{
              idLecturer: currentClassLecturer?.lecturer?.id,
              idLecturer2: currentClassLecturer?.lecturer2?.id,
            }}
            onFinish={patchClassLecturerData}
          >
            <Form.Item
              label="Dosen Pengampu"
              className="mb-2"
              name="idLecturer"
              rules={[{ required: true, message: "Harus diisi!" }]}
            >
              <Select>
                {lecturers.map((lecturer) => (
                  <Select.Option key={lecturer.id} value={lecturer.id}>
                    {lecturer.lecturerName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Dosen Pengampu 2"
              className="mb-2"
              name="idLecturer2"
            >
              <Select>
                {lecturers.map((lecturer) => (
                  <Select.Option key={lecturer.id} value={lecturer.id}>
                    {lecturer.lecturerName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </PatchModal>
      )}
    </>
  );
};

export default ClassLecturerPage;
