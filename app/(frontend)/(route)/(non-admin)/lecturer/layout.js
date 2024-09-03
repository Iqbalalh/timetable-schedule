"use client";
import React, { useEffect, useState } from "react";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, Dropdown, Space, theme } from "antd";
import { IoLogOutOutline } from "react-icons/io5";
import {
  FaUserCircle,
  FaHome,
  FaUser,
  FaBookmark,
  FaClock,
} from "react-icons/fa";
import { useRouter } from "nextjs-toploader/app";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const { Header, Content, Footer, Sider } = Layout;

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user"))
  const [keySelected, setKeySelected] = useState(pathname);

  console.log(user?.userRole)

  const handleLogout = () => {
    signOut({
      callbackUrl: "/", // Redirect to the home page or any other page after logout
    });
  };

  const items = [
    {
      key: "/dashboard",
      icon: <FaHome size={16} />,
      label: (
        <div
          onClick={() => {
            router.push("/dashboard");
            setKeySelected("/dashboard");
          }}
        >
          Beranda
        </div>
      ),
    },
    {
      key: "/dashboard/schedule",
      icon: <FaBookmark />,
      label: (
        <div
          onClick={() => {
            router.push("/dashboard/schedule");
            setKeySelected("/dashboard/schedule");
          }}
        >
          Jadwal
        </div>
      ),
    },
    {
      key: "/dashboard/user",
      icon: <FaUser />,
      label: "Kelola Data",
      children: [
        {
          key: "/dashboard/periods",
          label: (
            <div
              onClick={() => {
                router.push("/dashboard/periods");
                setKeySelected("/dashboard/periods");
              }}
            >
              Periode
            </div>
          ),
        },
        {
          key: "/dashboard/faculty",
          label: (
            <div
              onClick={() => {
                router.push("/dashboard/faculty");
                setKeySelected("/dashboard/faculty");
              }}
            >
              Fakultas
            </div>
          ),
        },
      ],
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
          label: (
            <div
              className="text-red-600 rounded-lg flex font-bold items-center"
              onClick={() => handleLogout()}
            >
              <IoLogOutOutline size={24} className="mr-1" />
              Logout
            </div>
          ),
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
          <div className="flex mx-auto gap-2">
            <img src="logo-unila.png" className="my-3" />
            <div className="items-center text-md flex lg:flex hidden justify-center w-full font-bold">
              <div className="block">
                Penjadwalan
                <div className="text-gray-400 text-xs font-normal">UNILA</div>
              </div>
            </div>
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={keySelected}
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
          <div className="lg:flex hidden text-lg font-semibold"><div className="font-normal">Selamat Datang, &nbsp;</div>{user?.lecturer.lecturerName}</div>
          <div className="ml-auto mt-2">
            <Space direction="vertical">
              <Space wrap>
                <Dropdown
                  overlay={dropdownMenu}
                  placement="bottomLeft"
                  trigger={["click"]}
                >
                  <Button
                    type="text"
                    className="font-semibold flex items-center mt-2 justify-center"
                  >
                    <FaUserCircle size={20} />|<div>{user?.userRole.toUpperCase()}</div>
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </Space>
            </Space>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
          }}
          className="overflow-x-auto"
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
