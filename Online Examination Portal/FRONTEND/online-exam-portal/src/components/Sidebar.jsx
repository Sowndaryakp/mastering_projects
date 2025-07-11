import React from 'react';
import useAuthStore from '../features/auth/authSlice';
import { Link } from 'react-router-dom';

const sidebarConfig = {
  student: [
    { label: 'Dashboard', path: '/student' },
    { label: 'My Exams', path: '/student/exams' },
    { label: 'Results', path: '/student/results' },
  ],
  teacher: [
    { label: 'Dashboard', path: '/teacher' },
    { label: 'Manage Exams', path: '/teacher/exams' },
    { label: 'Students', path: '/teacher/students' },
  ],
  hod: [
    { label: 'Dashboard', path: '/hod' },
    { label: 'Teachers', path: '/hod/teachers' },
    { label: 'Reports', path: '/hod/reports' },
  ],
  principal: [
    { label: 'Dashboard', path: '/principal' },
    { label: 'Departments', path: '/principal/departments' },
    { label: 'Overview', path: '/principal/overview' },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin' },
    { label: 'User Management', path: '/admin/users' },
    { label: 'Settings', path: '/admin/settings' },
  ],
};

const Sidebar = () => {
  const { role } = useAuthStore();
  const items = sidebarConfig[role] || [];

  return (
    <aside className="h-screen w-56 bg-blue-800 text-white flex flex-col py-8 px-4 shadow-lg">
      <div className="mb-8 text-2xl font-bold text-center tracking-wide">Portal</div>
      <nav className="flex-1">
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="block py-2 px-3 rounded hover:bg-blue-600 transition"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 