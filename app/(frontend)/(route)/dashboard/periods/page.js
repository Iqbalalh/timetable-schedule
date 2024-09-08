"use client";
import React, { useEffect, useState } from "react";
import { Table, message, Button, Form, Input, Modal } from "antd";
import axios from "axios";
import {
  API_ACADEMIC_PERIOD,
  API_ACADEMIC_PERIOD_BY_ID,
} from "@/app/(backend)/lib/endpoint";
import PostModal from "@/app/(frontend)/(component)/PostModal";
import PatchModal from "@/app/(frontend)/(component)/PatchModal";

const AcademicPeriods = () => {
  const [academicPeriods, setAcademicPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentAcademicPeriod, setCurrentAcademicPeriod] = useState(null);

  // Fetch data from the API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_ACADEMIC_PERIOD);
      setAcademicPeriods(response.data);
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

  // Add new academic period
  const postAcademicPeriodData = async (values) => {
    const data = { periodName: values.periodName };

    const response = await axios.post(API_ACADEMIC_PERIOD, data);
    if (response.status !== 201) {
      throw new Error("Gagal menambahkan periode!");
    }
    handleSuccess();
  };

  // Update academic period
  const patchAcademicPeriodData = async (values) => {
    const data = { periodName: values.periodName };

    const response = await axios.put(
      API_ACADEMIC_PERIOD_BY_ID(currentAcademicPeriod.id),
      data
    );
    if (response.status !== 200) {
      throw new Error("Gagal memperbarui periode!");
    }
    handleSuccess();
  };

  // Delete academic period
  const deleteAcademicPeriod = async (id) => {
    try {
      const response = await axios.delete(`${API_ACADEMIC_PERIOD}${id}`);
      if (response.status !== 200) {
        throw new Error("Gagal menghapus periode!");
      }
      message.success("Periode berhasil dihapus!");
      handleSuccess();
    } catch (error) {
      message.error(error.message || "Gagal menghapus periode!");
    }
  };

  // Handle add success
  const handleSuccess = () => {
    fetchData();
  };

  // Handle edit modal opening
  const handleEdit = (record) => {
    setCurrentAcademicPeriod(record);
    setIsEditOpen(true);
  };

  // Handle delete confirmation modal
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Apakah Anda yakin ingin menghapus periode ini?",
      content: "Tindakan ini tidak dapat dibatalkan.",
      okText: "Ya, Hapus",
      okType: "danger",
      cancelText: "Batal",
      onOk: () => deleteAcademicPeriod(id),
    });
  };

  // Columns for table
  const columns = [
    {
      title: "No.",
      key: "index",
      render: (text, record, index) => index + 1 + ".",
    },
    {
      title: "Periode",
      dataIndex: "periodName",
      key: "periodName",
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
            <div className="bg-blue-500 px-1 mr-2">&nbsp;</div>Periode Akademik
          </h1>
        </div>

        <Table
          className="shadow-xl rounded-lg"
          columns={columns}
          dataSource={academicPeriods}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />

        {/* Modal for adding academic period */}
        <PostModal
          postApi={API_ACADEMIC_PERIOD}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          postPayload={postAcademicPeriodData}
          title="Tambah Periode"
        >
          <Form.Item
            label="Periode"
            name="periodName"
            rules={[{ required: true, message: "Harus diisi!" }]}
          >
            <Input placeholder="cth. 2023 Ganjil" />
          </Form.Item>
        </PostModal>

        {/* Modal for editing academic period */}
        <PatchModal
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          patchPayload={patchAcademicPeriodData}
          title="Edit Periode"
          initValue={currentAcademicPeriod}
        >
          <Form.Item
            label="Periode"
            name="periodName"
            rules={[{ required: true, message: "Harus diisi!" }]}
          >
            <Input placeholder="cth. 2023 Ganjil" />
          </Form.Item>
        </PatchModal>
      </div>
    </>
  );
};

export default AcademicPeriods;
