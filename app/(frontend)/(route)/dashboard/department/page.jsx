"use client";
import React, { useEffect, useState } from "react";
import { Table, message, Button, Form, Input, Modal, Select, Spin } from "antd";
import axios from "axios";
import {
  API_DEPARTMENT,
  API_DEPARTMENT_BY_ID,
  API_FACULTY,
} from "@/app/(backend)/lib/endpoint";
import PostModal from "@/app/(frontend)/(component)/PostModal";
import PatchModal from "@/app/(frontend)/(component)/PatchModal";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [idFaculty, setidFaculty] = useState(null);
  const [facIsLoading, setFacIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);

  // Fetch data from the API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_DEPARTMENT);
      setDepartments(response.data);
      setIsLoading(false);
      setIsDisabled(false);
    } catch (error) {
      message.error("Gagal memuat data!");
      setIsLoading(false);
    }
  };

  const fetchFaculties = async () => {
    setFacIsLoading(true);
    try {
      const response = await axios.get(API_FACULTY); // Assuming faculty data is fetched from curriculum API, adjust if needed
      const fac = response.data.map((faculty) => ({
        value: faculty.id,
        label: faculty.facultyName, // Adjust label according to actual faculty field
      }));
      setFaculties(fac);
      setIsLoading(false);
    } catch (error) {
      message.error("Gagal memuat data!");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add new department
  const postDepartmentData = async (values) => {
    const data = {
      departmentName: values.departmentName,
      idFaculty: values.idFaculty,
    };

    const response = await axios.post(API_DEPARTMENT, data);
    if (response.status !== 201) {
      throw new Error("Gagal menambahkan Jurusan!");
    }
    handleSuccess();
  };

  // Update department
  const patchDepartmentData = async (values) => {
    const data = {
      departmentName: values.departmentName,
      idFaculty: values.idFaculty,
    };

    const response = await axios.put(
      API_DEPARTMENT_BY_ID(currentDepartment.id),
      data
    );
    if (response.status !== 200) {
      throw new Error("Gagal memperbarui Jurusan!");
    }
    handleSuccess();
  };

  // Delete department
  const deleteDepartment = async (id) => {
    try {
      const response = await axios.delete(API_DEPARTMENT_BY_ID(id));
      if (response.status !== 200) {
        throw new Error("Gagal menghapus Jurusan!");
      }
      message.success("Jurusan berhasil dihapus!");
      handleSuccess();
    } catch (error) {
      message.error(error.message || "Gagal menghapus Jurusan!");
    }
  };

  // Handle add success
  const handleSuccess = () => {
    fetchData();
  };

  // Handle edit modal opening
  const handleEdit = (record) => {
    setCurrentDepartment(record);
    setIsEditOpen(true);
  };

  // Handle delete confirmation modal
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Apakah Anda yakin ingin menghapus Jurusan ini?",
      content: "Tindakan ini tidak dapat dibatalkan.",
      okText: "Ya, Hapus",
      okType: "danger",
      cancelText: "Batal",
      onOk: () => deleteDepartment(id),
    });
  };

  // Columns for table
  const columns = [
    {
      title: "No.",
      key: "index",
      width: 70,
      render: (text, record, index) => index + 1 + ".",
    },
    {
      title: "Jurusan",
      dataIndex: "departmentName",
      key: "departmentName",
    },
    {
      title: "Fakultas",
      dataIndex: "facultyName",
      key: "facultyName",
      render: (_, record) => <div>{record.faculty.facultyName}</div>, // Adjust the field names if necessary
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
            onClick={() => setIsModalOpen(true)}
          >
            Tambah Data
          </Button>
        </div>
      ),
      dataIndex: "id",
      key: "action",
      render: (text, record) => {
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
            <div className="bg-blue-500 px-1 mr-2">&nbsp;</div>Jurusan
          </h1>
        </div>

        <Table
          className="shadow-xl rounded-lg"
          columns={columns}
          dataSource={departments}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content", y: 800 }}

        />

        {/* Modal for adding department */}
        <PostModal
          postApi={API_DEPARTMENT}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          postPayload={postDepartmentData}
          title="Tambah Jurusan"
        >
          <Form.Item
            label="Jurusan"
            name="departmentName"
            rules={[{ required: true, message: "Harus diisi!" }]}
          >
            <Input placeholder="cth. Teknik Informatika" />
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
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={faculties}
              loading={facIsLoading}
              onDropdownVisibleChange={(open) => {
                if (open && faculties.length === 0) {
                  fetchFaculties();
                }
              }}
              onSelect={(value) => {
                setidFaculty(value);
              }}
              notFoundContent={facIsLoading ? <Spin size="small" /> : null}
            />
          </Form.Item>
        </PostModal>

        {/* Modal for editing department */}
        <PatchModal
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          patchPayload={patchDepartmentData}
          title="Edit Jurusan"
          initValue={currentDepartment}
        >
          <Form.Item
            label="Jurusan"
            name="departmentName"
            rules={[{ required: true, message: "Harus diisi!" }]}
          >
            <Input placeholder="cth. Teknik Informatika" />
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
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={faculties}
              loading={facIsLoading}
              onDropdownVisibleChange={(open) => {
                if (open && faculties.length === 0) {
                  fetchFaculties();
                }
              }}
              onSelect={(value) => {
                setidFaculty(value);
              }}
              notFoundContent={facIsLoading ? <Spin size="small" /> : null}
            />
          </Form.Item>
        </PatchModal>
      </div>
    </>
  );
};

export default Departments;
