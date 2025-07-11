import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../features/auth/authSlice';

const ProtectedRoute = ({ children, role }) => {
  const { user, role: userRole } = useAuthStore();
  if (!user) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute; 