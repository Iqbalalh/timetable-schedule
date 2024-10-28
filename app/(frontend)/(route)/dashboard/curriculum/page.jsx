"use client";
import React, { useEffect, useState } from "react";
import { Table, message, Button, Input, Form, Modal } from "antd";
import axios from "axios";
import { API_CURRICULUM, API_CURRICULUM_BY_ID } from "@/app/(backend)/lib/endpoint";
import PostModal from "@/app/(frontend)/(component)/PostModal";
import PatchModal from "@/app/(frontend)/(component)/PatchModal";

const Curriculums = () => {
  const [curriculums, setCurriculums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentCurriculumId, setCurrentCurriculumId] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_CURRICULUM);
      setCurriculums(response.data);
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

  const postCurriculumData = async (values) => {
    const data = { curriculumName: values.curriculumName };

    const response = await axios.post(API_CURRICULUM, data);
    if (response.status !== 201) {
      throw new Error("Gagal menambahkan data!");
    }
    handleSuccess();
  };

  const patchCurriculumData = async (values) => {
    const data = { curriculumName: values.curriculumName };

    const response = await axios.put(
      API_CURRICULUM_BY_ID(currentCurriculumId?.id),
      data
    );
    if (response.status !== 200) {
      throw new Error("Gagal memperbarui data");
    }
    handleSuccess();
  };

  const handleEdit = (record) => {
    setCurrentCurriculumId(record);
    setIsEditOpen(true);
  };

  // Delete curriculums data
  const deleteCurriculumData = async (id) => {
    try {
      const response = await axios.delete(API_CURRICULUM_BY_ID(id));
      if (response.status !== 200) {
        throw new Error("Gagal menghapus data");
      }
      message.success("Data berhasil dihapus!");
      handleSuccess();
    } catch (error) {
      message.error(error.message || "Gagal menghapus data");
    }
  };

  // Handle delete modal
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Apakah Anda yakin ingin menghapus data ini?",
      content: "Tindakan ini tidak dapat dibatalkan.",
      okText: "Ya, Hapus",
      okType: "danger",
      cancelText: "Batal",
      onOk: () => deleteCurriculumData(id),
    });
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (text, record, index) => index + 1 + ".",
    },
    {
      title: "Kurikulum",
      dataIndex: "curriculumName",
      key: "curriculumName",
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
            <div className="bg-blue-500 px-1 mr-2">&nbsp;</div>Kurikulum
          </h1>
        </div>

        <Table
          className="shadow-xl rounded-lg"
          columns={columns}
          dataSource={curriculums}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Modal for adding data */}
      <PostModal
        postApi={API_CURRICULUM}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        postPayload={postCurriculumData}
        title="Tambah Kurikulum"
      >
        <Form.Item
          label="Kurikulum"
          name="curriculumName"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input placeholder="cth. 2020" />
        </Form.Item>
      </PostModal>

      {/* Modal for editing data */}
      <PatchModal
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        patchPayload={patchCurriculumData}
        title="Edit Kurikulum"
        initValue={currentCurriculumId}
      >
        <Form.Item
          label="Nama Kurikulum"
          name="curriculumName"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input placeholder="cth. Matematika dan Ilmu Pengetahuan Alam" />
        </Form.Item>
      </PatchModal>
    </>
  );
};

export default Curriculums;
