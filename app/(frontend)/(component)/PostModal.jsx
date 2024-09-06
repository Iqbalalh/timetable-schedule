import React, { useState } from 'react';
import { Button, Modal, Form, message } from 'antd';

const PostModal = ({ isOpen, setIsOpen, postPayload, children, title = "Modal" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await postPayload(values);
      message.success("Data berhasil ditambahkan!");
      setIsOpen(false);
    } catch (error) {
      message.error(error.message || "Gagal!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit}>
        <div className='mt-8'>{children}</div>
        
        <div className="flex justify-end mt-4">
          <Button
            type="primary"
            className='mt-4'
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

export default PostModal;
