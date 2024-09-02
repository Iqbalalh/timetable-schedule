"use client";
import React, { useEffect, useState } from "react";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, Dropdown, Space, theme } from "antd";
import Link from "next/link";
import { useRouter } from 'nextjs-toploader/app';

const { Header, Content, Footer, Sider } = Layout;

const DashboardLayout = ({ children }) => {
 
  const router = useRouter();
  const [keySelected, setKeySelected] = useState(window.location.pathname)
  const items = [
    {
      key: "/dashboard",
      icon: <UserOutlined />,
      label: <div onClick={() => {
        router.push("/dashboard")
        setKeySelected("/dashboard")
      }}>Beranda</div>,
    },
    {
      key: "/dashboard/schedule",
      icon: <UserOutlined />,
      label: <div onClick={() => {
        router.push("/dashboard/schedule")
        setKeySelected("/dashboard/schedule")
      }}>Jadwal</div>,
    },
    {
      key: "/dashboard/user",
      icon: <UserOutlined />,
      label: <div onClick={() => {
        router.push("/dashboard/user")
        setKeySelected("/dashboard/user")
      }}>Pengguna</div>,
    },
  ];
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const dropdownMenu = (
    <Menu
      items={[
        {
          key: 1,
          label: <div onClick={() => router.push("/")}>Logout</div>,
        },
      ]}
    />
  );

  return (
    <Layout hasSider className="min-h-screen">
      <Sider
        breakpoint="lg"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          scrollbarWidth: "thin",
          scrollbarColor: "unset",
        }}
      >
        <div className="text-white border-b border-gray-600 h-16 flex">
          <div className="flex items-center justify-center w-full font-bold">
            PENJADWALAN
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={keySelected}
          items={items}
        />
      </Sider>
      <Layout className="lg:ml-[200px] ml-20">
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
          }}
          className="border-b border-gray-200"
        >
          <div className="ml-auto">
            <Space direction="vertical">
              <Space wrap>
                <Dropdown
                  overlay={dropdownMenu}
                  placement="bottomLeft"
                  trigger={["click"]}
                >
                  <Button>
                    Hi, Iqbal Al Hafidzu <DownOutlined />
                  </Button>
                </Dropdown>
              </Space>
            </Space>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Penjadwalan Unila ©{new Date().getFullYear()} Created by Iqbal Al
          Hafidzu Rahman
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
