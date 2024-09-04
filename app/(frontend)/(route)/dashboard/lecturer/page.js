"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Layout,
  Button,
  Input,
  Form,
  Row,
  Col,
  Select,
} from "antd";
import axios from "axios";
import { API_LECTURER, API_DEPARTMENT } from "@/app/(backend)/lib/endpoint";
import PostModal from "@/app/(frontend)/(component)/PostModal";

const { Content } = Layout;

const Lecturer = () => {
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dep, setDep] = useState([]);
  const [depLoading, setDepLoading] = useState(false); // Separate loading state for departments

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_LECTURER);
      setDatas(response.data);
      setIsLoading(false);
      setIsDisabled(false);
    } catch (error) {
      message.error("Gagal memuat data!");
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    setDepLoading(true);
    try {
      const response = await axios.get(API_DEPARTMENT);
      const departments = response.data.map((dept) => ({
        value: dept.id,
        label: dept.departmentName,
      }));
      setDep(departments);
      setDepLoading(false);
    } catch (error) {
      message.error("Gagal memuat data jurusan!");
      setDepLoading(false);
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
      lecturerName: values.lecturerName,
      lecturerNIP: values.lecturerNIP,
      lecturerEmail: values.lecturerEmail,
      idDepartment: values.idDepartment,
    };

    const response = await axios.post(API_LECTURER, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (response.status !== 201) {
      throw new Error("Gagal menambahkan dosen");
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
      title: "Nama",
      dataIndex: "lecturerName",
      key: "lecturerName",
    },
    {
      title: "NIP",
      dataIndex: "lecturerNIP",
      key: "lecturerNIP",
    },
    {
      title: "Email",
      dataIndex: "lecturerEmail",
      key: "lecturerEmail",
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

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 flex">
            <div className="bg-blue-500 px-1 mr-2">&nbsp;</div>Dosen Pengajar
          </h1>
        </div>

        <Table
          columns={columns}
          dataSource={datas}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <PostModal
        postApi={API_LECTURER}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        postPayload={postData}
        title="Tambah Dosen"
      >
        <Form.Item
          label="Nama Lengkap"
          className="mb-2"
          name="lecturerName"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input placeholder="cth. Iqbal Alhafidzu" />
        </Form.Item>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="NIP"
              className="mb-2"
              name="lecturerNIP"
              rules={[{ required: true, message: "Harus diisi!" }]}
            >
              <Input placeholder="cth. 1231232131231" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              className="mb-2"
              name="lecturerEmail"
              rules={[{ required: true, message: "Harus diisi!" }]}
            >
              <Input placeholder="cth. iqbal@fmipa.ac.id" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Jurusan"
          className="mb-2"
          name="idDepartment"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Select
            loading={depLoading}
            showSearch
            placeholder="Pilih salah satu"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={dep}
            onDropdownVisibleChange={(open) => {
              if (open && dep.length === 0) {
                fetchDepartments();
              }
            }}
          />
        </Form.Item>
      </PostModal>
    </>
  );
};

export default Lecturer;
