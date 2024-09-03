"use client";
import React, { useState } from "react";
import { Button, Form, Input, Space } from "antd";
import { useRouter } from "next/navigation";
import { useSession, signIn, getSession } from "next-auth/react";

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
          router.push("/dashboard-lectruer");
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
    <main className="flex bg-blue-200 min-h-screen">
      <Form
        className="justify-center items-center p-8 m-auto bg-white"
        form={form}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
        onFinish={handleSubmission} // Pass handleSubmission correctly
      >
        <Form.Item
          name="username" // Updated to match what your function expects
          label="Username"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input type="password" />
        </Form.Item>
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Submit
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </main>
  );
};

export default App;
