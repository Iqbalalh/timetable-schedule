"use client";
import React, { useEffect, useState } from "react";
import { Table, message, Button, Input, Form, Spin, Modal } from "antd";
import axios from "axios";
import {
  API_SCHEDULE_SESSION,
  API_SCHEDULE_SESSION_BY_ID,
} from "@/app/(backend)/lib/endpoint";
import PostModal from "@/app/(frontend)/(component)/PostModal";
import PatchModal from "@/app/(frontend)/(component)/PatchModal";

const ScheduleSession = () => {
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentScheduleSession, setCurrentScheduleSession] = useState(null);

  // Fetch schedule sessions
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_SCHEDULE_SESSION);
      setDatas(response.data);
      setIsLoading(false);
      setIsDisabled(false);
    } catch (error) {
      message.error("Failed to load data!");
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

  const postData = async (values) => {
    const data = {
      startTime: values.startTime,
      endTime: values.endTime,
      sessionNumber: values.sessionNumber,
    };

    const response = await axios.post(API_SCHEDULE_SESSION, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 201) {
      throw new Error("Failed to add schedule session");
    }
    handleSuccess();
  };

  const patchScheduleSessionData = async (values) => {
    const data = {
      startTime: values.startTime,
      endTime: values.endTime,
      sessionNumber: values.sessionNumber,
    };

    const response = await axios.put(
      API_SCHEDULE_SESSION_BY_ID(currentScheduleSession?.id),
      data
    );
    if (response.status !== 200) {
      throw new Error("Failed to update data");
    }
    handleSuccess();
  };

  const handleEdit = (record) => {
    setCurrentScheduleSession(record);
    setIsEditOpen(true);
  };

  const deleteScheduleSessionData = async (id) => {
    try {
      const response = await axios.delete(API_SCHEDULE_SESSION_BY_ID(id));
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
      onOk: () => deleteScheduleSessionData(id),
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
      title: "Waktu Mulai",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "Waktu Selesai",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Sesi",
      dataIndex: "sessionNumber",
      key: "sessionNumber",
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
            <div className="bg-blue-500 px-1 mr-2">&nbsp;</div>Waktu/Sesi
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
        postApi={API_SCHEDULE_SESSION}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        postPayload={postData}
        title="Tambah Data"
      >
        <Form.Item
          label="Waktu Mulai"
          className="mb-2"
          name="startTime"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input placeholder="e.g. 08:00" />
        </Form.Item>
        <Form.Item
          label="Waktu Selesai"
          className="mb-2"
          name="endTime"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input placeholder="e.g. 10:00" />
        </Form.Item>
        <Form.Item
          label="Sesi"
          className="mb-2"
          name="sessionNumber"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input type="number" placeholder="e.g. 1" />
        </Form.Item>
      </PostModal>

      {currentScheduleSession && (
        <PatchModal
          patchApi={API_SCHEDULE_SESSION}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          patchPayload={patchScheduleSessionData}
          title="Sunting Waktu/Sesi"
          currentData={currentScheduleSession}
        >
          <Form.Item
            label="Waktu Mulai"
            className="mb-2"
            name="startTime"
            rules={[{ required: true, message: "Harus diisi!" }]}
          >
            <Input defaultValue={currentScheduleSession?.startTime} />
          </Form.Item>
          <Form.Item
            label="Waktu Selesai"
            className="mb-2"
            name="endTime"
            rules={[{ required: true, message: "Harus diisi!" }]}
          >
            <Input defaultValue={currentScheduleSession?.endTime} />
          </Form.Item>
          <Form.Item
            label="Sesi"
            className="mb-2"
            name="sessionNumber"
            rules={[{ required: true, message: "Harus diisi!" }]}
          >
            <Input
              type="number"
              defaultValue={currentScheduleSession?.sessionNumber}
              placeholder="e.g. 1"
            />
          </Form.Item>
        </PatchModal>
      )}
    </>
  );
};

export default ScheduleSession;
