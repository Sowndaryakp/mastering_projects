import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import StudentDashboard from '../features/dashboard/StudentDashboard';
import TeacherDashboard from '../features/dashboard/TeacherDashboard';
import HODDashboard from '../features/dashboard/HODDashboard';
import PrincipalDashboard from '../features/dashboard/PrincipalDashboard';
import AdminDashboard from '../features/dashboard/AdminDashboard';
import AdminStudents from '../features/adminstudents/AdminStudents';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/Layout';
import ClassTeachers from '../features/classTeachers/ClassTeachers';
import HODs from '../features/hods/HODs';
import Principals from '../features/principals/Principals';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    {/* All dashboard/protected routes wrapped in Layout */}
    <Route element={<Layout />}>
      <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/hod" element={<ProtectedRoute role="hod"><HODDashboard /></ProtectedRoute>} />
      <Route path="/principal" element={<ProtectedRoute role="principal"><PrincipalDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute role="admin"><AdminStudents /></ProtectedRoute>} />
      <Route path="/admin/class-teachers" element={<ProtectedRoute role="admin"><ClassTeachers /></ProtectedRoute>} />
      <Route path="/admin/hods" element={<ProtectedRoute role="admin"><HODs /></ProtectedRoute>} />
      <Route path="/admin/principals" element={<ProtectedRoute role="admin"><Principals /></ProtectedRoute>} />
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes; 