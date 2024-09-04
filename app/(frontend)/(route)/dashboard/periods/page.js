"use client";
import React, { useEffect, useState } from "react";
import { Table, message, Layout, Button, Form, Input } from "antd";
import axios from "axios";
import { API_ACADEMIC_PERIOD } from "@/app/(backend)/lib/endpoint";
import PostModal from "@/app/(frontend)/(component)/PostModal";

const { Content } = Layout;

const AcademicPeriods = () => {
  const [academicPeriods, setAcademicPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAddData = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    fetchData();
  };

  const postAcademicPeriodData = async (values) => {
    const data = { periodName: values.periodName };

    const response = await axios.post(API_ACADEMIC_PERIOD, data);
    if (response.status !== 201) {
      throw new Error("Gagal menambahkan periode!");
    }
    handleSuccess();
  };

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
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Waktu Diperbarui",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => new Date(text).toLocaleString(),
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
      render: () => {
        return (
          <div className="flex justify-end">
            <Button
              type="text"
              disabled={isDisabled}
              className="text-blue-500 font-semibold"
              onClick={() => {
                setIsDisabled(true);
              }}
            >
              Edit
            </Button>
            <Button
              type="text"
              disabled={isDisabled}
              className="text-red-600 font-semibold"
              onClick={() => {
                setIsDisabled(true);
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 flex">
            <div className="bg-blue-500 px-1 mr-2">&nbsp;</div>Periode Akademik
          </h1>
        </div>

        <Table
          columns={columns}
          dataSource={academicPeriods}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />

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
      </div>
    </>
  );
};

export default AcademicPeriods;
