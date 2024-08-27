"use client"
import React, { useEffect, useState } from 'react';
import { Table, message, Layout } from 'antd';
import axios from 'axios';

const { Content } = Layout;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/user');
      setUsers(response.data);
      setLoading(false);
      console.log(users)
    } catch (error) {
      message.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout style={{ padding: '24px' }}>
      <Content>
        <h1>Users</h1>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Content>
    </Layout>
  );
};

export default Users;
