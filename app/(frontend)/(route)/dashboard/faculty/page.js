"use client";
import React, { useEffect, useState } from "react";
import { Table, message, Layout, Button } from "antd";
import axios from "axios";
import { API_FACULTY } from "@/app/(backend)/lib/endpoint";

const { Content } = Layout;

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_FACULTY);
      setFaculty(response.data);
      setIsLoading(false);
      setIsDisabled(false);
    } catch (error) {
      message.error("Failed to fetch faculties");
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Fakultas",
      dataIndex: "facultyName",
      key: "facultyName",
    },
    {
      title: "Dibuat Pada",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "",
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
    <Layout style={{ padding: "24px" }}>
      <Content>
        <div className="mb-16">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-4 flex">
              <div className="bg-blue-500 px-1 mr-2">&nbsp;</div>Fakultas
            </h1>
            <div className="flex">
              <Button
                type="primary"
                disabled={isDisabled}
                shape="round"
                className="font-semibold py-4 bg-blue-500 text-white"
                onClick={() => {
                  setIsDisabled(true);
                }}
              >
                + Data
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={faculty}
            rowKey="id"
            loading={isLoading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default Faculty;
