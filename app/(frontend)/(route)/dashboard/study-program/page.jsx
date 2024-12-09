"use client";
import React, { useEffect, useState } from "react";
import { Table, message, Button, Input, Form, Select, Spin, Modal } from "antd";
import axios from "axios";
import {
  API_STUDY_PROGRAM,
  API_FACULTY,
  API_DEPARTMENT_BY_FACULTY,
  API_STUDY_PROGRAM_BY_ID,
  API_DEPARTMENT,
} from "@/app/(backend)/lib/endpoint";
import PostModal from "@/app/(frontend)/(component)/PostModal";
import PatchModal from "@/app/(frontend)/(component)/PatchModal";

const StudyProgram = () => {
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [dep, setDep] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [currentStudyProgram, setCurrentStudyProgram] = useState(null);

  // Fetch study programs
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_STUDY_PROGRAM);
      setDatas(response.data);
      try {
        const response = await axios.get(API_DEPARTMENT);
        setDepartments(
          response.data.map((dept) => ({
            value: dept.id,
            label: dept.departmentName,
          }))
        );
        setIsLoading(false);
      } catch (error) {
        message.error("Gagal memuat data!");
        setIsLoading(false);
      }
      setIsLoading(false);
      setIsDisabled(false);
    } catch (error) {
      message.error("Gagal memuat data!");
      setIsLoading(false);
    }
  };

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
      message.error("Gagal memuat data jurusan data!");
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
      message.error("Gagal memuat data fakultas!");
      setFacultyLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddData = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    fetchData();
  };

  const postData = async (values) => {
    const data = {
      studyProgramName: values.studyProgramName,
      idDepartment: values.idDepartment,
    };

    const response = await axios.post(API_STUDY_PROGRAM, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 201) {
      throw new Error("Failed to add study program");
    }
    handleSuccess();
  };

  const patchStudyProgramData = async (values) => {
    const data = {
      studyProgramName: values.studyProgramName,
      idDepartment: values.idDepartment,
    };

    const response = await axios.put(
      API_STUDY_PROGRAM_BY_ID(currentStudyProgram?.id),
      data
    );
    if (response.status !== 200) {
      throw new Error("Failed to update data");
    }
    handleSuccess();
  };

  const handleEdit = (record) => {
    setCurrentStudyProgram(record);
    setIsEditOpen(true);
  };

  const deleteStudyProgramData = async (id) => {
    try {
      const response = await axios.delete(API_STUDY_PROGRAM_BY_ID(id));
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
      title: "Anda yakin ingin menghapus data ini?",
      content: "Tindakan ini juga akan menghapus seluruh data terkait.",
      okText: "Ya, Hapus",
      okType: "danger",
      cancelText: "Batalkan",
      onOk: () => deleteStudyProgramData(id),
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
      title: "Program Studi",
      dataIndex: "studyProgramName",
      key: "studyProgramName",
    },
    {
      title: "Jurusan",
      dataIndex: "idDepartment",
      key: "idDepartment",
      render: (text, record) => record?.department?.departmentName,
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
            <div className="bg-blue-500 px-1 mr-2">&nbsp;</div>Program Studi
          </h1>
        </div>

        <Table
          className="shadow-xl rounded-lg"
          columns={columns}
          dataSource={datas}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content", y: 800 }}

        />
      </div>

      <PostModal
        postApi={API_STUDY_PROGRAM}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        postPayload={postData}
        title="Tambah Program Studi"
      >
        <Form.Item
          label="Program Studi"
          className="mb-2"
          name="studyProgramName"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input placeholder="cth. S1 Ilmu Komputer" />
        </Form.Item>
        <Form.Item
          label="Fakultas"
          className="mb-2"
          name="idFaculty"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Select
            showSearch
            placeholder="Pilih salah satu"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={faculties}
            loading={facultyLoading}
            onDropdownVisibleChange={(open) => {
              if (open && faculties.length === 0) {
                fetchFaculty();
              }
            }}
            onSelect={(value) => {
              setFaculty(value);
              fetchDepartments(value);
            }}
            notFoundContent={facultyLoading ? <Spin size="small" /> : null}
          />
        </Form.Item>
        <Form.Item
          label="Jurusan"
          className="mb-2"
          name="idDepartment"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Select
            showSearch
            disabled={!faculty}
            placeholder={
              !faculty ? "Pilih fakultas terlebih dahulu" : "Pilih salah satu"
            }
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={dep}
            notFoundContent={depLoading ? <Spin size="small" /> : null}
          />
        </Form.Item>
      </PostModal>

      <PatchModal
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        patchPayload={patchStudyProgramData}
        title="Edit Data"
        initValue={currentStudyProgram}
      >
        <Form.Item
          label="Program Studi"
          className="mb-2"
          name="studyProgramName"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input placeholder="cth. S1 Ilmu Komputer" />
        </Form.Item>
        <Form.Item
          label="Jurusan"
          className="mb-2"
          name="idDepartment"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={departments}
            notFoundContent={
              depLoading ? <Spin size="small" /> : "Tidak ada data!"
            }
          />
        </Form.Item>
      </PatchModal>
    </>
  );
};

export default StudyProgram;
