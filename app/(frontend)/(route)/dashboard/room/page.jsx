"use client";
import React, { useEffect, useState } from "react";
import { Table, message, Button, Input, Form, Select, Spin, Modal } from "antd";
import axios from "axios";
import {
  API_ROOM,
  API_DEPARTMENT,
  API_ROOM_BY_ID,
} from "@/app/(backend)/lib/endpoint";
import PostModal from "@/app/(frontend)/(component)/PostModal";
import PatchModal from "@/app/(frontend)/(component)/PatchModal";

const Room = () => {
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  // Fetch rooms
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_ROOM);
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
        message.error("Gagal memuat data jurusan!");
        setIsLoading(false);
      }
      setIsLoading(false);
      setIsDisabled(false);
    } catch (error) {
      message.error("Gagal memuat data ruangan!");
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
      roomName: values.roomName,
      roomCapacity: values.roomCapacity,
      departmentId: values.departmentId,
      isTheory: values.courseType === "Teori" || values.courseType === "Hybrid",
      isPracticum:
        values.courseType === "Praktikum" || values.courseType === "Hybrid",
      isLab: false,
    };

    const response = await axios.post(API_ROOM, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 201) {
      throw new Error("Gagal menambahkan");
    }
    handleSuccess();
  };

  const patchRoomData = async (values) => {
    const data = {
      roomName: values.roomName,
      roomCapacity: values.roomCapacity,
      departmentId: values.departmentId,
      isTheory:
        values.courseType === "Teori" || values.courseType === "Hybrid"
          ? true
          : false,
      isPracticum:
        values.courseType === "Praktikum" || values.courseType === "Hybrid"
          ? true
          : false,
      isLab: false,
    };

    const response = await axios.put(API_ROOM_BY_ID(currentRoom?.id), data);
    if (response.status !== 200) {
      throw new Error("Gagal menyunting");
    }
    handleSuccess();
  };

  const handleEdit = (record) => {
    setCurrentRoom(record);
    setIsEditOpen(true);
  };

  const deleteRoomData = async (id) => {
    try {
      const response = await axios.delete(API_ROOM_BY_ID(id));
      if (response.status !== 200) {
        throw new Error("Failed to delete room data");
      }
      message.success("Data successfully deleted!");
      handleSuccess();
    } catch (error) {
      message.error(error.message || "Failed to delete room data");
    }
  };

  // Handle delete confirmation
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Apakah anda yakin?",
      content: "Tindakan ini tidak dapat dibatalkan!",
      okText: "Yes, Hapus",
      okType: "danger",
      cancelText: "Batalkan",
      onOk: () => deleteRoomData(id),
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
      title: "Ruangan",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Kapasitas",
      width: 100,
      dataIndex: "roomCapacity",
      key: "roomCapacity",
    },
    {
      title: "Jurusan",
      dataIndex: "departmentId",
      key: "departmentId",
      render: (text, record) => record?.department?.departmentName,
    },
    {
      title: "Tipe Ruangan",
      key: "courseType",
      render: (text, record) => {
        if (record.isTheory && record.isPracticum) return "Hybrid";
        if (record.isTheory) return "Teori";
        if (record.isPracticum) return "Praktikum";
        return "None";
      },
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
            <div className="bg-blue-500 px-1 mr-2">&nbsp;</div>Ruangan
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
        postApi={API_ROOM}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        postPayload={postData}
        title="Tambah Ruangan"
      >
        <Form.Item
          label="RUangan"
          className="mb-2"
          name="roomName"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input placeholder="e.g. Room 101" />
        </Form.Item>
        <Form.Item
          label="Kapasitas"
          className="mb-2"
          name="roomCapacity"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input type="number" placeholder="e.g. 30" />
        </Form.Item>
        <Form.Item
          label="Jurusan"
          className="mb-2"
          name="departmentId"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Select
            showSearch
            placeholder="Pilih salah satu!"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={departments}
          />
        </Form.Item>
        <Form.Item
          label="Tipe Ruangan"
          className="mb-2"
          name="courseType"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Select
            placeholder="Pilih salah satu!"
            options={[
              { value: "Teori", label: "Teori" },
              { value: "Praktikum", label: "Praktikum" },
              { value: "Hybrid", label: "Hybrid" },
            ]}
          />
        </Form.Item>
      </PostModal>

      <PatchModal
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        patchPayload={patchRoomData}
        title="Edit Room"
        initValue={currentRoom}
      >
        <Form.Item
          label="Ruangan"
          className="mb-2"
          name="roomName"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input placeholder="e.g. Room 101" />
        </Form.Item>
        <Form.Item
          label="Kapasitas"
          className="mb-2"
          name="roomCapacity"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input type="number" placeholder="e.g. 30" />
        </Form.Item>
        <Form.Item
          label="Jurusan"
          className="mb-2"
          name="departmentId"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={departments}
          />
        </Form.Item>
        <Form.Item
          label="Tipe Ruangan"
          className="mb-2"
          name="courseType"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Select
            placeholder="Select course type"
            options={[
              { value: "Teori", label: "Teori" },
              { value: "Praktikum", label: "Praktikum" },
              { value: "Hybrid", label: "Hybrid" },
            ]}
          />
        </Form.Item>
      </PatchModal>
    </>
  );
};

export default Room;
