import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/login';

const ProtectedRoute = ({ children, role }) => {
  const { userId, role: userRole } = useAuthStore();
  if (!userId) return <Navigate to="/login" />;
  if (role && userRole?.toUpperCase() !== role.toUpperCase()) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute; 