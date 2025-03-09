"use client";
import React, { useState } from "react";
import { Button, Modal, Form, message, Select } from "antd";
import axios from "axios";
import { API_SCHEDULE_SWAPDATA } from "@/app/(backend)/lib/endpoint";

const SwapModal = ({
  isSwapOpen,
  setIsSwapOpen,
  children,
  title = "Modal",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const { scheduleId1, scheduleId2 } = values; // Extract form values
  
      if (!scheduleId1 || !scheduleId2) {
        message.error("Pilih dua jadwal untuk ditukar!");
        setIsLoading(false);
        return;
      }
  
      await axios.patch(API_SCHEDULE_SWAPDATA, {
        scheduleId1,
        scheduleId2,
      });
  
      message.success("Jadwal berhasil ditukar!");
      form.resetFields();
      setIsSwapOpen(false);
    } catch (error) {
      message.error(error.response?.data?.error || "Gagal menukar jadwal!");
    } finally {
      setIsLoading(false);
    }
  };  

  const handleCancel = () => {
    setIsSwapOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title={title}
      open={isSwapOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit} form={form}>
        {children}
        <div className="flex justify-end mt-4">
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Kirim
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default SwapModal;
