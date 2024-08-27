"use client";
import React from "react";
import { Button, Form, Input, Space } from "antd";
import Link from "next/link";

const SubmitButton = ({ form, children }) => {
  const [submittable, setSubmittable] = React.useState(false);
  const values = Form.useWatch([], form);
  React.useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);
  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}>
      {children}
    </Button>
  );
};

const App = () => {
  const [form] = Form.useForm();
  return (
    <main className="flex bg-blue-200 min-h-screen">
      <Form
        className="justify-center items-center p-8 m-auto bg-white"
        form={form}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="age"
          label="Age"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Space>
            {/* <SubmitButton form={form}>Submit</SubmitButton> */}
            <Button type="primary">
              <Link href="/user">Menuju Ke Tabel User</Link>
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </main>
  );
};

export default App;
