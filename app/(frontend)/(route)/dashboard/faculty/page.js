"use client";
import React, { useEffect, useState } from "react";
import { Table, message, Layout, Button, Input, Form, Modal } from "antd";
import axios from "axios";
import { API_FACULTY, API_FACULTY_BY_ID } from "@/app/(backend)/lib/endpoint";
import PostModal from "@/app/(frontend)/(component)/PostModal";
import PatchModal from "@/app/(frontend)/(component)/PatchModal";

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_FACULTY);
      setFaculty(response.data);
      setIsLoading(false);
      setIsDisabled(false);
    } catch (error) {
      message.error("Gagal memuat data!");
      setIsLoading(false);
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

  const postFacultyData = async (values) => {
    const data = { facultyName: values.facultyName };

    const response = await axios.post(API_FACULTY, data);
    if (response.status !== 201) {
      throw new Error("Gagal menambahkan fakultas");
    }
    handleSuccess();
  };

  const patchFacultyData = async (values) => {
    const data = { facultyName: values.facultyName };

    const response = await axios.put(
      API_FACULTY_BY_ID(currentFaculty?.id),
      data
    );
    if (response.status !== 200) {
      throw new Error("Gagal memperbarui fakultas");
    }
    handleSuccess();
  };

  const handleEdit = (record) => {
    setCurrentFaculty(record);
    setIsEditOpen(true);
  };

  // Delete faculty data
  const deleteFacultyData = async (id) => {
    try {
      const response = await axios.delete(API_FACULTY_BY_ID(id));
      if (response.status !== 200) {
        throw new Error("Gagal menghapus fakultas");
      }
      message.success("Fakultas berhasil dihapus!");
      handleSuccess();
    } catch (error) {
      message.error(error.message || "Gagal menghapus fakultas");
    }
  };

  // Handle delete modal
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Apakah Anda yakin ingin menghapus fakultas ini?",
      content: "Tindakan ini tidak dapat dibatalkan.",
      okText: "Ya, Hapus",
      okType: "danger",
      cancelText: "Batal",
      onOk: () => deleteFacultyData(id),
    });
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (text, record, index) => index + 1 + ".",
    },
    {
      title: "Fakultas",
      dataIndex: "facultyName",
      key: "facultyName",
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
            <div className="bg-blue-500 px-1 mr-2">&nbsp;</div>Fakultas
          </h1>
        </div>

        <Table
          className="shadow-xl rounded-lg"
          columns={columns}
          dataSource={faculty}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Modal for adding data */}
      <PostModal
        postApi={API_FACULTY}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        postPayload={postFacultyData}
        title="Tambah Fakultas"
      >
        <Form.Item
          label="Nama Fakultas"
          name="facultyName"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input placeholder="cth. Matematika dan Ilmu Pengetahuan Alam" />
        </Form.Item>
      </PostModal>

      {/* Modal for editing data */}
      <PatchModal
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        patchPayload={patchFacultyData}
        title="Edit Fakultas"
        initValue={currentFaculty}
      >
        <Form.Item
          label="Nama Fakultas"
          name="facultyName"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input placeholder="cth. Matematika dan Ilmu Pengetahuan Alam" />
        </Form.Item>
      </PatchModal>
    </>
  );
};

export default Faculty;
