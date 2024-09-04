"use client";
import React, { useEffect, useState } from "react";
import { Table, message, Layout } from "antd";
import axios from "axios";
import { API_USER } from "@/app/(backend)/lib/endpoint";

const { Content } = Layout;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_USER);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch users");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      {" "}
      <h1>Users</h1>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default Users;
