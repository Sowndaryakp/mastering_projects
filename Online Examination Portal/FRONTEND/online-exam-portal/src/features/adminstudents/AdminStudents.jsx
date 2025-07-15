import React, { useEffect, useState } from 'react';
import useAdminStudentsStore from '../../store/adminstudents';
import useAuthStore from '../../store/login';
import { Table, Tag, message, Input, Button, Modal } from 'antd';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import 'antd/dist/reset.css';

const statusColors = {
  approved: 'green',
  pending: 'red',
  rejected: 'red',
};

const approverId = 1; // Hardcoded for now

const AdminStudents = () => {
  const { students, loading, error, fetchStudents, updateStudentStatus } = useAdminStudentsStore();
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const { user } = useAuthStore();
  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleApprove = async (student) => {
    if (!userId) {
      message.error('Approver ID not found. Please log in again.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8080/api/users/approve/${student.id}?approverId=${userId}`,
        {
          method: 'POST', // Changed from PUT to POST
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          // No body needed
        }
      );
      if (!response.ok) throw new Error('Approval failed');
      const data = await response.json();
      // Update the row with the backend response
      updateStudentStatus(
        data.id,
        data.approvalStatus,
        data.approverName,
        data.message
      );
      message.success(data.message || 'User approved successfully');
      fetchStudents();
    } catch (err) {
      message.error(err.message || 'Approval failed');
      fetchStudents();
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setEditValues(record);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      // Only send the required fields
      const payload = {
        name: editValues.name,
        email: editValues.email,
        classOrDepartment: editValues.classOrDepartment,
      };
      const response = await fetch(`http://localhost:8080/api/users/students/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Update failed');
      const data = await response.json();
      updateStudentStatus(editingId, data.approvalStatus, data.approverName, data.message);
      message.success('Student updated!');
      setEditingId(null);
      setEditValues({});
      fetchStudents();
    } catch (err) {
      message.error(err.message || 'Update failed');
    }
  };

  const handleInputChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/users/students/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Delete failed');
        message.success('Student deleted!');
        fetchStudents();
      } catch (err) {
        message.error(err.message || 'Delete failed');
      }
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Name', dataIndex: 'name', key: 'name',
      render: (text, record) =>
        editingId === record.id
          ? <Input value={editValues.name} onChange={e => handleInputChange('name', e.target.value)} />
          : text
    },
    {
      title: 'Email', dataIndex: 'email', key: 'email',
      render: (text, record) =>
        editingId === record.id
          ? <Input value={editValues.email} onChange={e => handleInputChange('email', e.target.value)} />
          : text
    },
    { title: 'Role', dataIndex: 'role', key: 'role' },
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
      title: 'Class/Department', dataIndex: 'classOrDepartment', key: 'classOrDepartment',
      render: (text, record) =>
        editingId === record.id
          ? <Input value={editValues.classOrDepartment} onChange={e => handleInputChange('classOrDepartment', e.target.value)} />
          : text
    },
    {
      title: 'Approver Name', dataIndex: 'approverName', key: 'approverName',
      render: (text) => text || '-'
    },
    {
      title: 'Message', dataIndex: 'message', key: 'message',
      render: (text) => text || '-'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) =>
        editingId === record.id ? (
          <span className="flex gap-2">
            <Button
              icon={<FaCheck />}
              onClick={handleSave}
              type="primary"
              size="small"
              title="Save"
              style={{ backgroundColor: '#1677ff', borderColor: '#1677ff', color: '#fff' }}
            />
            <Button
              icon={<FaTimes />}
              onClick={handleCancel}
              type="default"
              size="small"
              title="Cancel"
            />
          </span>
        ) : (
          <span className="flex gap-2">
            <Button
              icon={<FaEdit />}
              onClick={() => handleEdit(record)}
              type="default"
              size="small"
              title="Edit"
            />
            <Button
              icon={<FaTrash />}
              type="default"
              size="small"
              danger
              title="Delete"
              onClick={() => handleDelete(record.id)}
            />
          </span>
        ),
    },
  ];

  if (loading) return <div>Loading students...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Students</h2>
      <Table
        columns={columns}
        dataSource={students}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default AdminStudents;