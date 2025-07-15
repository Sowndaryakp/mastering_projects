import React, { useEffect, useState } from 'react';
import usePrincipalsStore from '../../store/principals';
import { Table, message, Tag, Modal, Input, Button, Tooltip } from 'antd';
import { FaEdit, FaTrash } from 'react-icons/fa';
// import './your-custom-antd.css'; // <-- Import your custom CSS here if needed
import axios from 'axios';
import useAuthStore from '../../store/login';

const Principals = () => {
  const { principals, loading, error, fetchPrincipals } = usePrincipalsStore();
  const userId = useAuthStore((state) => state.userId);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isPatch, setIsPatch] = useState(false);
  const {
    updatePrincipal,
    patchPrincipal,
    deletePrincipal,
  } = usePrincipalsStore();

  useEffect(() => {
    fetchPrincipals();
  }, [fetchPrincipals]);

  const statusColors = {
    approved: 'green',
    pending: 'red',
    rejected: 'red',
  };
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
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
          <Tooltip title="Edit Principal">
            <Button
              icon={<FaEdit />} size="small" onClick={() => handleEdit(record, false)}>
            </Button>
          </Tooltip>
          <Tooltip title="Patch Principal">
            <Button
              icon={<FaEdit />} size="small" onClick={() => handleEdit(record, true)}>
            </Button>
          </Tooltip>
          <Tooltip title="Delete Principal">
            <Button
              icon={<FaTrash />} size="small" danger onClick={() => handleDelete(record.id)}>
            </Button>
          </Tooltip>
        </span>
      ),
    },
  ];

  const handleApprove = async (principal) => {
    console.log('handleApprove called for Principal:', principal);
    try {
      const token = localStorage.getItem('token');
      const approverId = userId || localStorage.getItem('userId');
      if (!approverId) {
        message.error('Approver ID not found. Please log in again.');
        console.log('Approver ID missing. Principal:', principal);
        return;
      }
      const url = `http://localhost:8080/api/users/approve/${principal.id}?approverId=${approverId}`;
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
      fetchPrincipals();
    } catch (err) {
      message.error(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleEdit = (record, patch = false) => {
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
        await patchPrincipal(editingId, editValues);
        message.success('Principal patched successfully');
      } else {
        await updatePrincipal(editingId, editValues);
        message.success('Principal updated successfully');
      }
      setEditModalVisible(false);
      setEditingId(null);
      setEditValues({});
      fetchPrincipals();
    } catch (err) {
      message.error('Failed to update principal');
    }
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
    setEditingId(null);
    setEditValues({});
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this principal?',
      onOk: async () => {
        try {
          await deletePrincipal(id);
          message.success('Principal deleted');
          fetchPrincipals();
        } catch {
          message.error('Failed to delete principal');
        }
      },
    });
  };

  if (loading) return <div>Loading Principals...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Principals</h2>
      <Table
        columns={columns}
        dataSource={principals}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />
      <Modal
        title={isPatch ? 'Patch Principal' : 'Edit Principal'}
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

export default Principals; 