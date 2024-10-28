"use client"
import React, { useState, useEffect } from "react";
import { Button, Modal, Form, message } from "antd";
import { useForm } from "antd/es/form/Form";

const PatchModal = ({
  isEditOpen,
  setIsEditOpen,
  patchPayload,
  children,
  title = "Modal",
  initValue
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = useForm();
  const [msg, setMsg] = useState("");

  // Use effect to reset form values when initValue changes
  useEffect(() => {
    if (initValue) {
      form.setFieldsValue(initValue); // Reset form values to new initValue
    }
  }, [initValue, form]);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await patchPayload(values);
      message.success("Data berhasil ditambahkan!");
      setIsEditOpen(false);
    } catch (error) {
      message.error(error.message || "Gagal!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditOpen(false);
  };

  return (
    <Modal
      title={title}
      open={isEditOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit} initialValues={initValue} form={form}>
        <div className="mt-8">{children}</div>

        <div className="flex justify-end mt-4">
          <Button
            type="primary"
            className="mt-4"
            htmlType="submit"
            loading={isLoading}
          >
            Kirim
          </Button>
        </div>
      </Form>
      {msg && <p className="mt-2 text-red-500">{msg}</p>}
    </Modal>
  );
};

export default PatchModal;
