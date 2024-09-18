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
  const [user, setUser] = useState(null); // Default state is null
  const [keySelected, setKeySelected] = useState(pathname);
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Access localStorage only on the client side
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    setIsLoading(true);
    signOut({
      callbackUrl: "/", // Redirect to the home page or any other page after logout
    });
  };

  const items = [
    {
      key: "/dashboard",
      icon: (
        <FaHome
          onClick={() => {
            router.push("/dashboard");
            setKeySelected("/dashboard");
          }}
          size={16}
        />
      ),
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
      icon: (
        <FaBookmark
          onClick={() => {
            router.push("/dashboard/schedule");
            setKeySelected("/dashboard/schedule");
          }}
        />
      ),
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
        {
          key: "/dashboard/room",
          label: (
            <div
              onClick={() => {
                router.push("/dashboard/room");
                setKeySelected("/dashboard/room");
              }}
            >
              Ruangan
            </div>
          ),
        },  
        {
          key: "/dashboard/curriculum",
          label: (
            <div
              onClick={() => {
                router.push("/dashboard/curriculum");
                setKeySelected("/dashboard/curriculum");
              }}
            >
              Kurikulum
            </div>
          ),
        },  
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
          key: "/dashboard/study-program",
          label: (
            <div
              onClick={() => {
                router.push("/dashboard/study-program");
                setKeySelected("/dashboard/study-program");
              }}
            >
              Program Studi
            </div>
          ),
        },
        {
          key: "/dashboard/lecturer",
          label: (
            <div
              onClick={() => {
                router.push("/dashboard/lecturer");
                setKeySelected("/dashboard/lecturer");
              }}
            >
              Dosen
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
              type="text"
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
    <Layout hasSider className="min-h-screen w-full">
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
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="text-white border-b border-gray-600 h-16 flex">
          <div className="flex mx-auto gap-2">
            <img src="/logo-unila.png" className="my-3" />
            <div
              className={`items-center text-md ${
                collapsed
                  ? "lg:hidden opacity-0 translate-x-[-20px]"
                  : "lg:flex opacity-100 translate-x-0"
              } hidden justify-center w-full font-bold transition-all duration-400 ease-in-out`}
            >
              <div className="block text-lg">
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
      <Layout
        className={`${
          !collapsed ? "ml-[200px]" : "ml-20"
        } transition-all ease-in-out duration-400`}
      >
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
          className="border-b pr-4 pl-8 border-gray-200"
        >
          <div className="lg:flex hidden text-lg font-semibold">
            <div className="font-normal">Selamat Datang, &nbsp;</div>
            {user?.lecturer.lecturerName}
          </div>
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
                    loading={isLoading}
                    className="font-semibold flex items-center mt-2 justify-center"
                  >
                    <FaUserCircle size={20} />|
                    <div>{user?.userRole.toUpperCase()}</div>
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </Space>
            </Space>
          </div>
        </Header>
        <Content className="overflow-auto lg:p-8 md:p-8 p-4">{children}</Content>
        <Footer className="bg-white h-12 flex text-center items-center justify-center">
          Penjadwalan Unila ©{new Date().getFullYear()} Created by Iqbal Al
          Hafidzu Rahman
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
