import React from 'react';
import useAuthStore from '../store/login';
import { Link } from 'react-router-dom';
import logo from '../assets/soni.png';

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
    { label: 'Students', path: '/admin/students' },
    { label: 'Class Teachers', path: '/admin/class-teachers' },
    { label: 'HODs', path: '/admin/hods' },
    { label: 'Principals', path: '/admin/principals' },
  ],
};

const SIDEBAR_WIDTH = 224; // 56 * 4

const Sidebar = () => {
  const { role, sidebarOpen, closeSidebar } = useAuthStore();
  const items = sidebarConfig[role?.toLowerCase()] || [];

  // Sidebar for large screens (always visible)
  const desktopSidebar = (
    <aside className="hidden lg:flex fixed top-0 left-0 h-screen min-h-screen max-h-screen w-56 bg-blue-800 text-white flex-col py-8 px-4 shadow-lg z-30">
      <div className="mb-1 flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-40 h-24 mt-12" />
      </div>
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

  // Sidebar for mobile/tablet (overlay)
  const mobileSidebar = (
    <>
      {/* Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
      />
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen min-h-screen max-h-screen w-56 bg-blue-800 text-white flex flex-col py-8 px-4 shadow-lg z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: SIDEBAR_WIDTH }}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white text-2xl focus:outline-none"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        >
          &times;
        </button>
        <div className="mb-2 flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-40 h-24" />
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="block py-2 px-3 rounded hover:bg-blue-600 transition"
                  onClick={closeSidebar}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  );
};

export default Sidebar; 