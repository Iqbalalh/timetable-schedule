"use client";
import React, { useEffect, useState } from "react";
import { Table, message, Button, Input, Form, Select, Spin, Modal } from "antd";
import axios from "axios";
import {
  API_STUDY_PROGRAM,
  API_SUBJECT,
  API_CURRICULUM,
  API_SUBJECT_BY_ID,
} from "@/app/(backend)/lib/endpoint";
import PostModal from "@/app/(frontend)/(component)/PostModal";
import PatchModal from "@/app/(frontend)/(component)/PatchModal";

const Subject = () => {
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [studyPrograms, setStudyPrograms] = useState(null);
  const [curriculums, setCurriculums] = useState(null);
  const [studyProgramLoading, setStudyProgramLoading] = useState(false);
  const [curriculumLoading, setCurriculumLoading] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);

  // Fetch subjects
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_SUBJECT);
      setDatas(response.data);
      setIsLoading(false);
      setIsDisabled(false);
    } catch (error) {
      message.error("Gagal memuat data!");
      setIsLoading(false);
    }
  };

  // Fetch study programs
  const fetchStudyPrograms = async () => {
    setStudyProgramLoading(true);
    try {
      const response = await axios.get(API_STUDY_PROGRAM);
      const studyPrograms = response.data.map((prog) => ({
        value: prog.id,
        label: prog.studyProgramName,
      }));
      setStudyPrograms(studyPrograms);
      setStudyProgramLoading(false);
    } catch (error) {
      message.error("Gagal memuat data prodi!");
      setStudyProgramLoading(false);
    }
  };

  // Fetch curriculums
  const fetchCurriculums = async () => {
    setCurriculumLoading(true);
    try {
      const response = await axios.get(API_CURRICULUM);
      const curriculums = response.data.map((cur) => ({
        value: cur.id,
        label: cur.curriculumName,
      }));
      setCurriculums(curriculums);
      setCurriculumLoading(false);
    } catch (error) {
      message.error("Gagal memuat data kurikulum!");
      setCurriculumLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddData = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    fetchData();
  };

  const postData = async (values) => {
    const data = {
      subjectCode: values.subjectCode,
      subjectName: values.subjectName,
      subjectSKS: values.subjectSKS,
      curriculumId: values.curriculumId,
      studyProgramId: values.studyProgramId,
    };

    const response = await axios.post(API_SUBJECT, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 201) {
      throw new Error("Failed to add subject");
    }
    handleSuccess();
  };

  const patchSubjectData = async (values) => {
    const data = {
      subjectCode: values.subjectCode,
      subjectName: values.subjectName,
      subjectSKS: values.subjectSKS,
      curriculumId: values.curriculumId,
      studyProgramId: values.studyProgramId,
    };

    const response = await axios.put(
      API_SUBJECT_BY_ID(currentSubject?.id),
      data
    );
    if (response.status !== 200) {
      throw new Error("Failed to update data");
    }
    handleSuccess();
  };

  const handleEdit = (record) => {
    setCurrentSubject(record);
    console.log(record);
    setIsEditOpen(true);
  };

  const deleteSubjectData = async (id) => {
    try {
      const response = await axios.delete(API_SUBJECT_BY_ID(id));
      if (response.status !== 200) {
        throw new Error("Failed to delete data");
      }
      message.success("Data successfully deleted!");
      handleSuccess();
    } catch (error) {
      message.error(error.message || "Failed to delete data");
    }
  };

  // Handle delete confirmation
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Anda yakin ingin menghapus data ini?",
      content: "Tindakan ini juga akan menghapus seluruh data terkait.",
      okText: "Ya, Hapus",
      okType: "danger",
      cancelText: "Batalkan",
      onOk: () => deleteSubjectData(id),
    });
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 70,
      render: (text, record, index) => index + 1 + ".",
    },
    {
      title: "Kode Matkul",
      dataIndex: "subjectCode",
      key: "subjectCode",
    },
    {
      title: "Mata Kuliah",
      dataIndex: "subjectName",
      key: "subjectName",
    },
    {
      title: "SKS",
      dataIndex: "subjectSKS",
      key: "subjectSKS",
      width: 100,
    },
    {
      title: "Program Studi",
      dataIndex: "studyProgramId",
      key: "studyProgramId",
      render: (text, record) => record?.studyProgram?.studyProgramName,
    },
    {
      title: "Kurikulum",
      dataIndex: "curriculumId",
      key: "curriculumId",
      width: 100,
      render: (text, record) => record?.curriculum?.curriculumName,
    },
    {
      title: "Waktu Dibuat",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString("id-ID"),
    },
    {
      title: "Waktu Diperbarui",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => new Date(text).toLocaleString("id-ID"),
    },
    {
      title: (
        <div className="flex justify-end">
          <Button
            type="primary"
            disabled={isDisabled}
            shape="round"
            className="font-semibold py-4 bg-blue-500 text-white"
            onClick={handleAddData}
          >
            Tambah Data
          </Button>
        </div>
      ),
      dataIndex: "id",
      key: "action",
      render: (_, record) => {
        return (
          <div className="flex justify-end">
            <Button
              type="text"
              disabled={isDisabled}
              className="text-blue-500 font-semibold"
              onClick={() => {
                handleEdit(record);
              }}
            >
              Edit
            </Button>
            <Button
              type="text"
              disabled={isDisabled}
              className="text-red-600 font-semibold"
              onClick={() => handleDelete(record.id)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 flex">
            <div className="bg-blue-500 px-1 mr-2">&nbsp;</div>Mata Kuliah
          </h1>
        </div>

        <Table
          className="shadow-xl rounded-lg"
          columns={columns}
          dataSource={datas}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content", y: 800 }}
        />
      </div>

      <PostModal
        postApi={API_SUBJECT}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        postPayload={postData}
        title="Tambah Data"
      >
        <Form.Item
          label="Kode Matkul"
          className="mb-2"
          name="subjectCode"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input placeholder="e.g. IF123" />
        </Form.Item>
        <Form.Item
          label="Subject Name"
          className="mb-2"
          name="subjectName"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input placeholder="e.g. Introduction to Computer Science" />
        </Form.Item>
        <Form.Item
          label="SKS"
          className="mb-2"
          name="subjectSKS"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Input type="number" placeholder="e.g. 3" />
        </Form.Item>
        <Form.Item
          label="Kurikulum"
          className="mb-2"
          name="curriculumId"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Select
            notFoundContent={
              curriculumLoading ? <Spin size="small" /> : "Tidak ada data!"
            }
            placeholder="Pilih salah satu"
            loading={curriculumLoading}
            onDropdownVisibleChange={fetchCurriculums}
            options={curriculums}
          />
        </Form.Item>
        <Form.Item
          label="Program Studi"
          className="mb-2"
          name="studyProgramId"
          rules={[{ required: true, message: "Harus diisi!" }]}
        >
          <Select
            notFoundContent={
              studyProgramLoading ? <Spin size="small" /> : "Tidak ada data!"
            }
            placeholder="Pilih salah satu"
            loading={studyProgramLoading}
            onDropdownVisibleChange={fetchStudyPrograms}
            options={studyPrograms}
          />
        </Form.Item>
      </PostModal>

      {currentSubject && (
        <PatchModal
          patchApi={API_SUBJECT}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          patchPayload={patchSubjectData}
          title="Sunting Matkul"
          currentData={currentSubject}
        >
          <Form.Item
            label="Kode Matkul"
            className="mb-2"
            name="subjectCode"
            rules={[{ required: true, message: "Harus diisi!" }]}
          >
            <Input defaultValue={currentSubject?.subjectCode} />
          </Form.Item>
          <Form.Item
            label="Mata Kuliah"
            className="mb-2"
            name="subjectName"
            rules={[{ required: true, message: "Harus diisi!" }]}
          >
            <Input defaultValue={currentSubject?.subjectName} />
          </Form.Item>
          <Form.Item
            label="SKS"
            className="mb-2"
            name="subjectSKS"
            rules={[{ required: true, message: "Harus diisi!" }]}
          >
            <Input
              type="number"
              defaultValue={currentSubject?.subjectSKS}
              placeholder="e.g. 3"
            />
          </Form.Item>
          <Form.Item
            label="Kurikulum"
            className="mb-2"
            name="curriculumId"
            rules={[{ required: true, message: "Harus diisi!" }]}
          >
            <Select
              defaultValue={currentSubject?.curriculumId}
              placeholder="Pilih salah satu"
              loading={curriculumLoading}
              onDropdownVisibleChange={fetchCurriculums}
              options={curriculums}
            />
          </Form.Item>
          <Form.Item
            label="Program Studi"
            className="mb-2"
            name="studyProgramId"
            rules={[{ required: true, message: "Harus diisi!" }]}
          >
            <Select
              defaultValue={currentSubject?.studyProgramId}
              placeholder="Pilih salah satu"
              loading={studyProgramLoading}
              onDropdownVisibleChange={fetchStudyPrograms}
              options={studyPrograms}
            />
          </Form.Item>
        </PatchModal>
      )}
    </>
  );
};

export default Subject;
