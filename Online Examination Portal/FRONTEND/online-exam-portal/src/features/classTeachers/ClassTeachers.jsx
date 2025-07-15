import React, { useEffect, useState } from 'react';
import useClassTeachersStore from '../../store/classTeachers';
import useAuthStore from '../../store/login'; // or wherever your auth store is
import { Table, message, Tag, Modal, Input, Button, Tooltip } from 'antd';
// import './your-custom-antd.css'; // <-- Import your custom CSS here if needed
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const ClassTeachers = () => {
  const {
    classTeachers,
    loading,
    error,
    fetchClassTeachers,
    updateClassTeacher,
    patchClassTeacher,
    deleteClassTeacher,
    getClassTeacherById,
  } = useClassTeachersStore();

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isPatch, setIsPatch] = useState(false);
  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    fetchClassTeachers();
  }, [fetchClassTeachers]);

  const statusColors = {
    approved: 'green',
    pending: 'red',
    rejected: 'red',
  };

  const handleEdit = async (record, patch = false) => {
    setIsPatch(patch);
    setEditingId(record.id);
    setEditValues(record);
    setEditModalVisible(true);
  };

  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    try {
      if (isPatch) {
        await patchClassTeacher(editingId, editValues);
        message.success('Class teacher patched successfully');
      } else {
        await updateClassTeacher(editingId, editValues);
        message.success('Class teacher updated successfully');
      }
      setEditModalVisible(false);
      setEditingId(null);
      setEditValues({});
      fetchClassTeachers();
    } catch (err) {
      message.error('Failed to update class teacher');
    }
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
    setEditingId(null);
    setEditValues({});
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this class teacher?',
      onOk: async () => {
        try {
          await deleteClassTeacher(id);
          message.success('Class teacher deleted');
          fetchClassTeachers();
        } catch {
          message.error('Failed to delete class teacher');
        }
      },
    });
  };

  const handleApprove = async (teacher) => {
    console.log('handleApprove called for teacher:', teacher);
    try {
      const token = localStorage.getItem('token');
      // Prefer Zustand store, fallback to localStorage
      const approverId = userId || localStorage.getItem('userId');
      if (!approverId) {
        message.error('Approver ID not found. Please log in again.');
        console.log('Approver ID missing. teacher:', teacher);
        return;
      }
      const url = `http://localhost:8080/api/users/approve/${teacher.id}?approverId=${approverId}`;
      const payload = {};
      console.log('APPROVE URL:', url);
      console.log('PAYLOAD:', payload);
      const response = await axios.post(
        url,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success(response.data.message || 'User approved successfully');
      fetchClassTeachers();
    } catch (err) {
      message.error(err.response?.data?.message || 'Approval failed');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Department', dataIndex: 'classOrDepartment', key: 'classOrDepartment' },
    {
      title: 'Approval Status',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      render: (status, record) => {
        const color = statusColors[status?.toLowerCase()] || 'default';
        if (status?.toLowerCase() === 'pending') {
          return (
            <Tag
              color={color}
              style={{ cursor: 'pointer' }}
              onClick={() => handleApprove(record)}
            >
              {status}
            </Tag>
          );
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span className="flex gap-2">
          <Tooltip title="Edit Class Teacher">
            <Button
              icon={<FaEdit />} size="small" onClick={() => handleEdit(record, false)}>
            </Button>
          </Tooltip>
          <Tooltip title="Patch Class Teacher">
            <Button
              icon={<FaEdit />} size="small" onClick={() => handleEdit(record, true)}>
            </Button>
          </Tooltip>
          <Tooltip title="Delete Class Teacher">
            <Button
              icon={<FaTrash />} size="small" danger onClick={() => handleDelete(record.id)}>
            </Button>
          </Tooltip>
        </span>
      ),
    },
  ];

  if (loading) return <div>Loading class teachers...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Class Teachers</h2>
      <Table
        columns={columns}
        dataSource={classTeachers}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />
      <Modal
        title={isPatch ? 'Patch Class Teacher' : 'Edit Class Teacher'}
        open={editModalVisible}
        onOk={handleEditSave}
        onCancel={handleEditCancel}
        okText="Save"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            value={editValues.name}
            onChange={e => handleEditChange('name', e.target.value)}
            placeholder="Name"
          />
          <Input
            value={editValues.email}
            onChange={e => handleEditChange('email', e.target.value)}
            placeholder="Email"
          />
          <Input
            value={editValues.classOrDepartment}
            onChange={e => handleEditChange('classOrDepartment', e.target.value)}
            placeholder="Class/Department"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ClassTeachers; 