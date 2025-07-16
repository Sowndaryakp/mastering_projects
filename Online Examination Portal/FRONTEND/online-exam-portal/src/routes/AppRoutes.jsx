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
      <Route path="/student" element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/teacher" element={<ProtectedRoute role="CLASS_TEACHER"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/hod" element={<ProtectedRoute role="HOD"><HODDashboard /></ProtectedRoute>} />
      <Route path="/principal" element={<ProtectedRoute role="PRINCIPAL"><PrincipalDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute role="admin"><AdminStudents /></ProtectedRoute>} />
      <Route path="/admin/class-teachers" element={<ProtectedRoute role="admin"><ClassTeachers /></ProtectedRoute>} />
      <Route path="/admin/hods" element={<ProtectedRoute role="admin"><HODs /></ProtectedRoute>} />
      <Route path="/admin/principals" element={<ProtectedRoute role="admin"><Principals /></ProtectedRoute>} />

      <Route path="/principal/students" element={<ProtectedRoute role="PRINCIPAL"><AdminStudents /></ProtectedRoute>} />
      <Route path="/principal/class-teachers" element={<ProtectedRoute role="PRINCIPAL"><ClassTeachers /></ProtectedRoute>} />
      <Route path="/principal/hods" element={<ProtectedRoute role="PRINCIPAL"><HODs /></ProtectedRoute>} />

      <Route path="/hod/students" element={<ProtectedRoute role="HOD"><AdminStudents /></ProtectedRoute>} />
      <Route path="/hod/class-teachers" element={<ProtectedRoute role="HOD"><ClassTeachers /></ProtectedRoute>} />
      
      <Route path="/class_teacher/students" element={<ProtectedRoute role="class_teacher"><AdminStudents /></ProtectedRoute>} />

    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes; 