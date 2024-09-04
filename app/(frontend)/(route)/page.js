"use client";
import React, { useState } from "react";
import { Button, Form, Input, Space } from "antd";
import { useRouter } from "next/navigation";
import { useSession, signIn, getSession } from "next-auth/react";
import { FaLock, FaUser } from "react-icons/fa";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmission = async (values) => {
    if (values.username === "" || values.password === "") {
      setErrorMsg("Credentials Provided are Invalid");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return;
    }

    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password,
    });

    if (!result.error) {
      const session = await getSession();
      if (session) {
        const { user } = session;
        localStorage.setItem("user", JSON.stringify(user));

        if (user.userRole === "admin") {
          router.push("/dashboard");
        } else if (user.userRole === "lecturer") {
          router.push("/lecturer");
        }
      }
    } else {
      setErrorMsg(result.error);
      setIsLoading(false);
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    }
  };

  const [form] = Form.useForm();
  return (
    <main
      className="flex min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('background-blue.jpg')`,
      }}
    >
      <div className="w-full lg:mx-40 lg:my-20 m-12 bg-blue-800 rounded-xl shadow-xl lg:flex block items-center justify center">
        <div
          className="lg:w-3/5 w-full h-full p-20 lg:rounded-l-xl flex lg:rounded-r-none"
          style={{
            backgroundImage: `url('rektorat-unila.jpg')`,
            backgroundSize: "120%", // or use '80%' for a custom size
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: "50%",
          }}
        >
          Download
        </div>
        <div className="lg:w-2/5 w-full h-full bg-white lg:rounded-r-xl flex lg:rounded-l-none shadow-xl items-center justify-center">
          <div className="block w-full px-20">
            <div className="text-center flex flex-col items-center">
              <img src="logo-unila.png" width={100} />
              <p className="text-xl font-medium text-gray-500 mt-4 mb-12">
                Masuk untuk kelola jadwal
              </p>
            </div>
            <Form
              className="w-full rounded-r-none"
              form={form}
              name="validateOnly"
              layout="vertical"
              autoComplete="off"
              onFinish={handleSubmission}
            >
              <Form.Item
                name="username"
                label="Username"
                labelCol={{
                  className: "text-gray-200 text-xs font-normal m-0",
                }}
                rules={[
                  {
                    required: true,
                    message: "Username tidak boleh kosong!",
                  },
                ]}
              >
                <Input prefix={<FaUser className="mr-2" />} className="shadow-lg text-gray-500 px-4 rounded-3xl" size="large" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                labelCol={{
                  className: "text-gray-200 text-xs font-normal p-0 m-0",
                }}
                rules={[
                  {
                    required: true,
                    message: "Password tidak boleh kosong!",
                  },
                  {
                    min: 8,
                    message: "Password minimal 8 karakter!",
                  },
                ]}
              >
                <Input.Password prefix={<FaLock className="mr-2" />} className="shadow-lg text-gray-500 px-4 rounded-3xl" size="large"/>
              </Form.Item>
              {errorMsg && <p className="text-red-500">{errorMsg}</p>}
              <Form.Item className="w-full">
                <Button
                  className="w-full rounded-3xl mt-8 shadow-xl"
                  size="large"
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                >
                  Masuk
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
